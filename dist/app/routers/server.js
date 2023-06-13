import express from 'express';
import http from 'http';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import { userRouter, adminRouter } from './index.js';
class Server {
    app;
    httpServer;
    corsOptions;
    constructor() {
        this.corsOptions = {
            origin: '*',
            methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization', 'authorization', 'verification'],
            exposedHeaders: ['authorization', 'verification', 'Authorization'],
        };
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.setupMiddleware();
        this.setupServer();
    }
    setupMiddleware() {
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                    'img-src': ["'self'", 's3.amazonaws.com'],
                },
            },
        }));
        this.app.use(compression());
        this.app.use(express.json({ limit: '100kb' }));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors(this.corsOptions));
        this.app.use(this.routeConfig);
        this.app.get('/', (req, res) => res.send('ok'));
        this.app.get('/health', (req, res) => {
            res.send('info');
            log.info('health: info');
        });
        this.app.use(morgan('dev', { skip: req => req.path === '/health' || req.path === '/favicon.ico' }));
        this.registeredRouters();
        this.app.use('*', this.routeHandler);
        this.app.use(this.logErrors);
        this.app.use(this.errorHandler);
    }
    registeredRouters() {
        this.app.use('/api/v1/user', userRouter);
        this.app.use('/api/v1/admin', adminRouter);
    }
    setupServer() {
        this.httpServer.timeout = 10000;
        this.httpServer.listen(process.env.PORT, () => log.debug(`Love you ${process.env.PORT} 🌱 `));
    }
    routeConfig(req, res, next) {
        if (req.path === '/ping')
            return res.status(200).send({});
        res.reply = ({ code, message }, data = {}, header = undefined) => res.status(code).header(header).jsonp({ message, data });
        return next();
    }
    routeHandler(req, res) {
        res.status(404);
        return res.send({ message: 'My friend you got yourself in infinite void there!' });
    }
    logErrors(err, req, res, next) {
        log.error(`${req.method} ${req.url}`);
        log.error(`body ->  ${_.stringify(req.body)}`);
        log.error(err.stack);
        return next(err);
    }
    errorHandler(err, req, res) {
        return res.status(500).send({ message: err });
    }
}
export default Server;
