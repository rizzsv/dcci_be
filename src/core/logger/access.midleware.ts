import { Request, Response, NextFunction } from "express";
import { accessLogger } from "./access.logger";

export const accessLoggerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start

            accessLogger.info({
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        userId: (req as any).user?.id || null,
        duration: `${duration}ms`,
        timeStamp: new Date().toISOString()
     })
    })

    next()
}