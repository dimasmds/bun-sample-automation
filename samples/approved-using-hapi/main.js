// 1234567

/*
    1234567
 */

const Hapi = require('@hapi/hapi');

(async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: () => '<h1>1234567</h1>'
  });

  await server.start();
})();
