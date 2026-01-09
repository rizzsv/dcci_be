import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { accessLoggerMiddleware } from "./core/logger/access.midleware";
import { appLogger } from "./core/logger/app.logger";
import publicRoutes from "./routes/api.public";
import privateRoutes from "./routes/api.private";
import { authenticate } from "./middlewares/auth.middleware";
import { success } from "zod";

const app = express();

// Global Middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(accessLoggerMiddleware)
app.use(morgan('dev'))


app.use('/api/public', publicRoutes);


app.use('/api/private', authenticate, privateRoutes);


app.use((err: any, req: any, res: any, next: any) => {
    appLogger.error({
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
    })

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    })
})

export default app
