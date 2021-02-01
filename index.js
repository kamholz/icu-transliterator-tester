const RBT = require('icu-transliterator').RBT;

const fastify = require('fastify')({
  // logger: true
});
fastify.register(require('fastify-static'), {
  root: `${__dirname}/static`
});
fastify.register(require('fastify-formbody'));

fastify.post('/transliterate', (req, reply) => {
  const body = req.body;
  if (!(body && 'rules' in body && 'input' in body && 'forward' in body)) {
    return reply.code(400);
  }

  try {
    const dir = body.forward === '0' ? RBT.REVERSE : RBT.FORWARD;
    const transliterator = RBT.fromRules(body.rules, dir);
    const output = transliterator.transliterate(body.input);
    reply.send({
      success: true,
      message: output,
    });
  } catch (e) {
    reply.send({
      success: false,
      message: e.message,
    });
  }
});

fastify.listen(process.env.PORT || 3000, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
