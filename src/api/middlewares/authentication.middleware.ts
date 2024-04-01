import { AuthService } from "../../services";
import { JwtPayload } from "jsonwebtoken";
import { UsersRepository } from "../../repositories";
import { models } from "../../db";

const usersRepository = new UsersRepository(models.Users);

class AuthenticationMiddleware {
  private authService: AuthService;
  private usersRepository: UsersRepository;

  constructor() {
    this.authService = new AuthService();
    this.usersRepository = usersRepository;
    this.authenticate = this.authenticate.bind(this);
  }
  async authenticate(req, res, next) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        res.status(401).send("ACCESS_TOKEN_ERROR");
      }
      const token = authorization.split("Bearer ")[1].trim();

      if (!token) {
        res.status(401).send("ACCESS_TOKEN_ERROR");
      }
      const isTokenExistOnRedis = await this.authService.getTokenFromRedis(`accessToken:${token}`);

      if (!isTokenExistOnRedis) {
        res.status(401).send("ACCESS_TOKEN_ERROR");
      }
      const isAccessTokenVerified = (await this.authService.verifyAccessToken(token)) as JwtPayload;

      if (!isAccessTokenVerified) {
        res.status(401).send("ACCESS_TOKEN_ERROR");
      }

      const isUserExists = await this.usersRepository.findOne({ id: isAccessTokenVerified.userId });

      if (!isUserExists) {
        res.status(404).send("USER_NOT_FOUND");
      }

      await this.authService.setTokenToRedis(`accessToken:${token}`, isAccessTokenVerified, 3600 * 24);
      req.payload = isAccessTokenVerified;
      req.accessToken = token;
      return next();
    } catch (error) {
      return next(error);
    }
  }
}

export = new AuthenticationMiddleware();
