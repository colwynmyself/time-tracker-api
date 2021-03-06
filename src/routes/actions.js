const Response = require('../classes/Response');
const { evaluate } = require('../utils/async');
const logger = require('../utils/logger');

module.exports = (app, db) => {
  app.get('/actions', async (req, res) => {
    const [err, actions] = await evaluate(db.Action.findAll());

    if (err) {
      logger.error('Failed to fetch actions', err);
      const response = new Response(500, err.message);
      return response.send(res);
    }

    const response = new Response(200, actions);
    return response.send(res);
  });

  app.post('/actions', async (req, res) => {
    const [err, action] = await evaluate(db.Action.create(req.body));

    if (err) {
      logger.error('Failed to create action', err, req.body);
      const response = new Response(500, err.message);
      return response.send(res);
    }

    const response = new Response(201, action);
    return response.send(res);
  });
};
