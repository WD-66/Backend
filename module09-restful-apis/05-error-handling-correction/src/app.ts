import express from 'express';
import '#db';
import { userRouter, postRouter } from '#routers';
import { errorLogger } from '#middleware';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use('/users', userRouter);
app.use('/posts', postRouter);

app.use('*splat', (req, res, next) => {
  throw new Error('Not Found', { cause: 404 });
});

app.use(errorLogger);

app.listen(port, () => console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`));
