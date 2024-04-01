export type ControllerResponse = Promise<void | Record<any, any>>;

export const RedisConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
};

export type CommonReqAuth<T> =  Request &  {
    payload: {
        userId: number;
        [key: string]: any
    };
    user?: { [key: string]: any };
}
