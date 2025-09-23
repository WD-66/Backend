import { type ErrorRequestHandler } from 'express';

const errorLogger: ErrorRequestHandler = async (err, req, res, next) => {
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
};

export default errorLogger;
