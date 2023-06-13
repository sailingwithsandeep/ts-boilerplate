import { getIp, Mongo, RedisClient } from './app/utils/index.js';

await new Mongo().initialize();
const server = new (await import('./app/routers/server.js')).default();
await new RedisClient().initialize();
await getIp();
log.debug(`Server IP: ${process.env.HOST}`);

process.once('uncaughtException', ex => {
    log.error(`we have uncaughtException, ${ex.message}, ${ex.stack}`);
    process.exit(1);
});

export default server.app;
