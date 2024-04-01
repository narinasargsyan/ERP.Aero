import { NextFunction, Request, Response } from "express";
import { UsersRepository } from "../../repositories";
import { CommonReqAuth, ControllerResponse } from "../../types";
import { models } from "../../db";
import { hashPassword, verifyHashPassword } from "../../helpers";
import { AuthService } from "../../services";

interface CustomRequest extends Request {
    accessToken?: string;
}

export class UsersController {
    private usersRepository: UsersRepository;
    private authService: AuthService;

    constructor(usersRepository: UsersRepository, authService: AuthService) {
        this.usersRepository = usersRepository;
        this.authService = authService;
    }

    public signUp = async (req: Request, res: Response, next: NextFunction): ControllerResponse => {
        try {
            const { email, firstName, lastName, password, username } = req.body;
            const emailLowered = email ? email.toLowerCase() : undefined;

            const isUserExists = await this.usersRepository.isUserExistsWithSameEmail(emailLowered);
            if (isUserExists) {
                return res.status(400).send("User with the same email already exists");
            }

            const isUsernameExists = await this.usersRepository.getByUsername(username);
            if (isUsernameExists) {
                return res.status(400).send("User with the same username already exists");
            }

            const hashedPassword = hashPassword(password.trim());

            const userData = {
                email: emailLowered,
                password: hashedPassword,
                firstName,
                lastName,
                username,
            };

            await this.usersRepository.create(userData);
            return res.status(200).send("Your registration is successful");
        } catch (error) {
            console.error(`Error in signUp: ${error.message}`);
            return next(error);
        }
    };

    public signIn = async (req: Request, res: Response, next: NextFunction): ControllerResponse => {
        try {
            const { email, password } = req.body;
            const user = await this.usersRepository.getUserByEmail(email);

            if (!user) {
                return res.status(400).send("User not found");
            }

            const isValidPassword = verifyHashPassword(password, user.password);
            if (!isValidPassword) {
                return res.status(400).send("Invalid password");
            }

            const auth = {
                userId: user.id,
                email,
            };

            const accessToken = await this.authService.signAccessToken(auth);
            const refreshToken = await this.authService.signRefreshToken(auth);

            const response = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user?.username,
                accessToken,
                refreshToken,
            };
            return res.status(200).send(response);
        } catch (error) {
            console.log(`END FAIL Request signIn: ${error.message}`);
            next(error);
        }
    };

    public refreshAccessToken = async (req: Request, res: Response, next: NextFunction): ControllerResponse => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).send("Refresh token is required");
            }

            const decodedRefreshToken = await this.authService.verifyRefreshToken(refreshToken);
            if (!decodedRefreshToken) {
                return res.status(401).send("Invalid refresh token");
            }

            const user = await this.usersRepository.getUserById(decodedRefreshToken.userId);
            if (!user) {
                return res.status(404).send("User not found");
            }

            const auth = {
                userId: user.id,
                email: user.email,
            };
            const newAccessToken = await this.authService.signAccessToken(auth);

            const response = {
                accessToken: newAccessToken,
            };
            return res.status(200).send(response);
        } catch (error) {
            console.error(`Error in refreshAccessToken: ${error.message}`);
            next(error);
        }
    };

    public info = async (req: CommonReqAuth<number>, res: Response, next: NextFunction): ControllerResponse => {
        try {
            const { userId } = req.payload;
            const user = await this.usersRepository.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const result = { id: user.id };
            res.status(200).json(result);
        } catch (error) {
            console.error(`Error in info: ${error.message}`);
            next(error);
        }
    };

    public logout = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { accessToken } = req;

            await this.authService.removeTokenFromRedis(
                `accessToken:${accessToken.trim()}`
            );
            res.status(200).send("Successfully logged out");
        } catch (error) {
            console.error(`Error in logout: ${error.message}`);
            next(error);
        }
    };

}

const usersRepository = new UsersRepository(models.Users);
const authService = new AuthService();

export const userController = new UsersController(usersRepository, authService);
