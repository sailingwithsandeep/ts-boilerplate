import { createClient } from 'redis';
class RedisClient {
    redisClientOptions;
    client;
    constructor() {
        this.redisClientOptions = {
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            legacyMode: false,
        };
    }
    async initialize() {
        try {
            this.client = createClient(this.redisClientOptions);
            await this.client.connect();
            this.client.on('error', log.error);
            log.debug('Redis initialized ⚡');
        }
        catch (error) {
            log.error(`Error Occurred on redis initialize. reason :${error.message}`);
        }
    }
}
export default RedisClient;
