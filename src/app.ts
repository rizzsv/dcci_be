import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { accessLoggerMiddleware } from "./core/logger/access.midleware";
import { appLogger } from "./core/logger/app.logger";
// import routes from "./routes";

const app = express();

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use(accessLoggerMiddleware)

app.use(morgan('dev'))

