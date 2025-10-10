import express from 'express';
import cors from 'cors';
import '#db';
import { completionsRouter } from '#routes';
import { errorHandler, notFoundHandler } from '#middlewares';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || '5050';

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL, // for use with credentials, origin(s) need to be specified
    credentials: true, // sends and receives secure cookies
    exposedHeaders: ['WWW-Authenticate'] // needed to send the 'refresh trigger''
  })
);

app.use(express.json(), cookieParser());

app.use('/ai', completionsRouter);
app.use('*splat', notFoundHandler);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`\x1b[35mExample app listening at http://localhost:${port}\x1b[0m`)
);
