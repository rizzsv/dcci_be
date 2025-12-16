import dotenv from "dotenv";
import app from "./app";
import {logger} from "./config/logger.config"

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen