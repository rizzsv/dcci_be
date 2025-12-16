import app from "./app";
import { appLogger } from "./core/logger/app.logger";

const PORT = process.env.PORT || 3000;

export const server = app.listen(PORT, () => {
    appLogger.info(`Server is running on port ${PORT}`);
})

const shutdown = (signal: string) => {
  appLogger.warn(`⚠️ Received ${signal}. Shutting down...`)

  server.close(() => {
    appLogger.info('✅ Server closed gracefully')
    process.exit(0)
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)