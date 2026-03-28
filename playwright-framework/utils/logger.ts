import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

const logsDir = path.join('reports', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors } = winston.format;

const consoleFormat = printf(({ level, message, timestamp: ts, stack }) => {
  const base = `[${String(ts)}] [${level.toUpperCase()}] ${String(message)}`;
  return stack ? `${base}\n${String(stack)}` : base;
});

const fileFormat = printf(({ level, message, timestamp: ts, stack, ...meta }) => {
  const base = `[${String(ts)}] [${level.toUpperCase()}] ${String(message)}`;
  const metaStr = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
  return stack ? `${base}\n${String(stack)}${metaStr}` : `${base}${metaStr}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), consoleFormat),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'test-run.log'),
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
      tailable: true,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'errors.log'),
      level: 'error',
      format: fileFormat,
    }),
  ],
});

/**
 * Step-level logger — use inside test steps for structured output.
 */
export function logStep(step: string, data?: Record<string, unknown>): void {
  logger.info(`▶ STEP: ${step}`, data ?? {});
}

/**
 * API call logger.
 */
export function logApiCall(
  method: string,
  url: string,
  status: number,
  durationMs: number,
): void {
  logger.info(`API ${method} ${url} → ${status} (${durationMs}ms)`);
}
