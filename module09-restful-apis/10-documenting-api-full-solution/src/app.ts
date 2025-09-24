import '#db';
import express from 'express';
import { blogPostRouter, docsRouter } from '#routes';
import { errorHandler, notFoundHandler } from '#middlewares';

const app = express();
const port = process.env.PORT || '3000';

app.use(express.json());

app.use('/posts', blogPostRouter);
app.use('/docs', docsRouter);
app.use('*splat', notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`\x1b[35mExample app listening at http://localhost:${port}\x1b[0m`);
  console.log(`\x1b[36mOpenAPI JSON served at  http://localhost:${port}/docs/openapi.json\x1b[0m`);
  console.log(`\x1b[33mSwagger UI served at http://localhost:${port}/docs\x1b[0m`);
});
