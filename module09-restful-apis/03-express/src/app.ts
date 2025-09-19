import express from 'express';
import '#db';
import { duckRouter } from '#routers';

const app = express();
const port = 3000;

app.use(express.json()); //Middleware

app.use('/ducks', duckRouter);

// app.use('/users', userRouter)

app.listen(port, () =>
  console.log('Server is running on http://localhost:3000')
);
