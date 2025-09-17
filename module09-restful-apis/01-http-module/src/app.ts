import http, { type RequestListener, type ServerResponse } from 'node:http';

const createResponse = (
  res: ServerResponse,
  statusCode: number,
  message: unknown
) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');

  typeof message === 'string'
    ? res.end(message)
    : res.end(JSON.stringify(message));
};

const requestHandler: RequestListener = (req, res) => {
  const { url, method } = req;

  if (url === '/posts') {
    if (method === 'GET') {
      return createResponse(res, 200, 'GET request on /posts');
    } else if (method === 'PUT') {
      return createResponse(res, 200, 'PUT request on /posts');
    } else if (method === 'POST') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const parsedBody = JSON.parse(body);
        return createResponse(res, 200, parsedBody);
      });

      return;
    }
    return createResponse(res, 405, 'Method not allowed');
  } else if (url === '/home') {
    return createResponse(res, 200, ['item1', 'item2']);
  }

  return createResponse(res, 404, 'Page not found');
};

const server = http.createServer(requestHandler);

server.listen(3000, () =>
  console.log('Server is running on http://localhost:3000')
);
