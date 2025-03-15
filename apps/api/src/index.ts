import { createServer } from './server';

const port = process.env.PORT || 5000;
const server = createServer();

server.listen(port);
