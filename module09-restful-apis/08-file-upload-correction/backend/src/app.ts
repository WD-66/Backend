import express from 'express';
import cors from 'cors';
import '#db';
import { userRouter } from '#routes';
import { errorHandler, notFoundHandler } from '#middlewares';
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use('/users', userRouter);

app.use('*splat', notFoundHandler);

app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port http://localhost:${port}`));
