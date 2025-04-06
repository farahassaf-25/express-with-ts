import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan';
import { config } from 'dotenv'

config();

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() : void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    private initializeRoutes() : void {
        this.app.get('/', (req: Request, res: Response) => {
            res.status(200).json({
                message: 'Welcome to the API',
                status: true,
            })
        });

        this.app.get('/health', (req: Request, res: Response) => {
            res.status(200).json({
                message: 'UP',
                status: true,
                timeStamp: new Date().toISOString(),
            })
        });
    }

    private initializeErrorHandling() : void {
        //404 handler 
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.status(404).json({
                message: 'Not Found',
                status: false,
            });
        });


        //error handler
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack);
            res.status(500).json({
                message: 'Internal Server Error',
                status: false,
                error: process.env.NODE_ENV === 'development' ? err.message : undefined,
            });
        });
    }
}

export default new App().app;