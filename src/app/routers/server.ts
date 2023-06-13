import express, { Express, Request, Response, NextFunction } from 'express';
import http, { Server as HttpServer } from 'http';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors, { CorsOptions } from 'cors';
import type { IMetaData } from '../../types/global.js';
import { userRouter, adminRouter } from './index.js';
class Server {
    app: Express;

    httpServer: HttpServer;

    private corsOptions: CorsOptions;

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

    private setupMiddleware() {
        this.app.use(
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                        'img-src': ["'self'", 's3.amazonaws.com'],
                    },
                },
            })
        );
        this.app.use(compression());
        this.app.use(express.json({ limit: '100kb' }));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors(this.corsOptions));
        this.app.use(this.routeConfig);
        this.app.get('/', (req: Request, res: Response) => res.send('ok'));
        this.app.get('/health', (req: Request, res: Response) => {
            res.send('info');
            log.info('health: info');
        });
        this.app.use(morgan('dev', { skip: req => req.path === '/health' || req.path === '/favicon.ico' }));
        this.registeredRouters();
        this.app.use('*', this.routeHandler);
        this.app.use(this.logErrors);
        this.app.use(this.errorHandler);
    }

    private registeredRouters() {
        this.app.use('/api/v1/user', userRouter);
        this.app.use('/api/v1/admin', adminRouter);
    }

    private setupServer() {
        this.httpServer.timeout = 10000;
        this.httpServer.listen(process.env.PORT, () => log.debug(`Love you ${process.env.PORT} 🌱 `));
    }

    private routeConfig(req: Request, res: Response, next: NextFunction) {
        if (req.path === '/ping') return res.status(200).send({});
        res.reply = ({ code, message }: IMetaData, data = {}, header = undefined) => res.status(code).header(header).jsonp({ message, data });
        return next();
    }

    private routeHandler(req: Request, res: Response) {
        res.status(404);
        return res.send({ message: 'My friend you got yourself in infinite void there!' });
    }

    private logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
        log.error(`${req.method} ${req.url}`);
        log.error(`body ->  ${_.stringify(req.body)}`);
        log.error(err.stack);
        return next(err);
    }

    private errorHandler(err: Error, req: Request, res: Response) {
        return res.status(500).send({ message: err });
    }
}

export default Server;
