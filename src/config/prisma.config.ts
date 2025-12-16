import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import logger from "./logger.config";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
  log: [
    { level: "query", emit: "event" },
    { level: "info", emit: "event" },
    { level: "warn", emit: "event" },
    { level: "error", emit: "event" },
  ],
});

// Log Query
prisma.$on("query", (event: any) => {
  logger.info('PrismaQuery', {
    query: event.query,
    params: event.params,
    duration: `${event.duration}ms`
  });
});

// Log Info
prisma.$on("info", (event: any) => {
  logger.info('PrismaInfo', { message: event.message });
});

// Log Warning
prisma.$on("warn", (event: any) => {
  logger.warn('PrismaWarning', { message: event.message });
});

// Log Error
prisma.$on("error", (event: any) => {
  logger.error('PrismaError', { message: event.message });
});

export default prisma;
