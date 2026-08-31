import fastify from 'fastify';

const server = fastify();

server.get('/', async (_request, _reply) => {
  return 'Hello, world!';
});

server.get('/ping', async (_request, _reply) => {
  return 'pong';
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
