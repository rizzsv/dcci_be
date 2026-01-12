import winston from "winston";

export const appLogger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.File({
            filename: "logs/app.log"
        })
    ]
})