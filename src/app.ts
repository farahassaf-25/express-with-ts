import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan';
import { config } from 'dotenv'
import httpStatus from 'http-status';
import userRoutes from './routes/userRoutes';
import ApiError from './utils/ApiError';

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

        this.app.get('/api/v1/users', userRoutes);
    }

    private initializeErrorHandling(): void {
      // Handle 404
      this.app.use((req: Request, res: Response, next: NextFunction) => {
        next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
      });
    
      // Convert error to ApiError if needed
      this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        if (!(err instanceof ApiError)) {
          const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
          const message = err.message || httpStatus[statusCode as keyof typeof httpStatus] || 'Internal Server Error';
          if(!(err instanceof ApiError)) {
            err = new ApiError(statusCode, message, false, err);
          }
        }
        next(err);
      });
    
      // Handle errors
      this.app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
        const { statusCode, message, isOperational, details } = err;
    
        const response = {
          code: statusCode,
          message,
          ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
          ...(isOperational && { details }),
        };
    
        if (process.env.NODE_ENV === 'development') {
          console.error(err);
        }
    
        res.status(statusCode).json(response);
      });
    }
}

export default new App().app;