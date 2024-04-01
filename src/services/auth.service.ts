import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../db/redis/client";

export class AuthService {
    public getTokenFromRedis(key: string): { [key: string]: any } {
        return redis.get(key as never);
    }

    public async setTokenToRedis(key: string, payload: { [key: string]: any } | string, expiresIn: number): Promise<void> {
        await redis.set(key as never, JSON.stringify(payload) as never, { EX: expiresIn } as never);
    }

    private async signToken(payload: { [key: string]: any } | string, secretKey: string, expiresIn: number, keyName: string): Promise<string> {
        const token = jwt.sign(payload, secretKey);
        await this.setTokenToRedis(`${keyName}:${token}`, payload, expiresIn);
        return token;
    }

    public async signAccessToken(payload: { [key: string]: any }): Promise<string> {
        return this.signToken(payload, process.env.ACCESS_TOKEN_SECRET, 3600 * 24 * 10, "accessToken");
    }

    public async signRefreshToken(payload: { [key: string]: any }): Promise<string> {
        return this.signToken(payload, process.env.REFRESH_TOKEN_SECRET, 3600 * 24 * 180, "refreshToken");
    }

    private async verifyToken(token: string, secretKey: string): Promise<JwtPayload | string> {
        return jwt.verify(token, secretKey);
    }

    public async verifyAccessToken(token: string): Promise<JwtPayload | string> {
        return this.verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    }

    public async verifyRefreshToken(token: string): Promise<any> {
        return this.verifyToken(token, process.env.REFRESH_TOKEN_SECRET);
    }

    public async removeTokenFromRedis(key: string): Promise<void> {
        await redis.del(key as never);
    }
}
