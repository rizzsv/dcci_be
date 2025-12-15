import { Prisma, PrismaClient } from '@prisma/client';
import logger from './logger.config';

export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

// Log Query
prisma.$on('query', (event: any) => {
  logger.info(
    'PrismaQuery',
    `${event.query} | Params: ${event.params}`,
    `Duration: ${event.duration}ms`
  );
});

// Log Info
prisma.$on('info', (event: any) => {
  logger.info('PrismaInfo', event.message);
});

// Log Warning
prisma.$on('warn', (event: any) => {
  logger.warn('PrismaWarning', event.message);
});

// Log Error
prisma.$on('error', (event: any) => {
  logger.error('PrismaError', event.message);
});

export default prisma;
