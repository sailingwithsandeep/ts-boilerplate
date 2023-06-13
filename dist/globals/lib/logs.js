import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;
const myFormat = printf(({ level, message, timestamp }) => `${timestamp} ${message}`);
const logger = createLogger({
    level: process.env.LOG_LEVEL ?? 'silly',
    format: combine(format.colorize({ all: true }), format.simple(), timestamp({ format: 'DD-MM-YY HH:mm:ss:SSS' }), myFormat),
});
const console_transport = new transports.Console();
// adding transports
logger.add(console_transport);
export default logger;
