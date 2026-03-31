import winston from "winston";

export const accessLogger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "logs/access.log" })
    ]
})