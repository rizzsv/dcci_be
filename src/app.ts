import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { accessLogger } from "./core/logger/access.logger";
import { appLogger } from "./core/logger/app.logger";
// import routes from "./routes";

const app = express();

app.use(helmet())
app.use(cors())
app.use(express.json())

