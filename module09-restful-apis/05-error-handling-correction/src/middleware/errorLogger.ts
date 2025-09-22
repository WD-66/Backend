import { type ErrorRequestHandler } from 'express';
import { mkdir, appendFile } from 'fs/promises';
import { join } from 'path';

const errorLogger: ErrorRequestHandler = async (err, req, res, next) => {
  try {
    // console.log(process.cwd());

    const logDir = join(process.cwd(), 'log');
    await mkdir(logDir, { recursive: true });

    const now = new Date();

    const timestamp = now.toISOString();
    const dateString = timestamp.split('T')[0];
    // console.log(dateString);

    const logFilePath = join(logDir, `${dateString}-error.log`);

    const logEntry = `[${timestamp}] - Error: ${err.message} - Stack: ${err.stack}\n`;

    await appendFile(logFilePath, logEntry, 'utf8');
  } catch (logError: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      if (logError instanceof Error) {
        console.error(`\x1b[31m${err.stack}\x1b[0m`);
      } else {
        console.error(`\x1b[31m${err}\x1b[0m`);
      }
    }
  } finally {
    if (err instanceof Error) {
      if (err.cause) {
        const cause = err.cause as { status: number };
        res.status(cause.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default errorLogger;
