const Response = require('../classes/Response');
const { evaluate } = require('../utils/async');
const logger = require('../utils/logger');

module.exports = (app, db) => {
  app.get('/categories', async (req, res) => {
    const [err, categories] = await evaluate(db.Category.findAll());

    if (err) {
      logger.error('Failed to fetch categories', err);
      const response = new Response(500, err.message);
      return response.send(res);
    }

    const response = new Response(200, categories);
    return response.send(res);
  });

  app.get('/categories/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;
    const [err, category] = await evaluate(db.Category.findOne({
      where: {
        id: categoryId,
      },
      include: ['subCategories'],
    }));

    if (err) {
      logger.error(`Failed to fetch category with id: ${categoryId}`, err);
      const response = new Response(500, err.message);
      return response.send(res);
    }

    let response;
    if (!category) {
      response = new Response(404);
    } else {
      response = new Response(200, category);
    }
    return response.send(res);
  });

  app.post('/categories', async (req, res) => {
    const [err, category] = await evaluate(db.Category.create(req.body));

    if (err) {
      logger.error('Failed to create category', err, req.body);
      const response = new Response(500, err.message);
      return response.send(res);
    }

    const response = new Response(201, category);
    return response.send(res);
  });

  app.put('/categories/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;
    const [err, result] = await evaluate(db.Category.update(req.body, {
      where: {
        id: categoryId,
      },
      returning: true,
      plain: true,
    }));

    if (err) {
      logger.error('Failed to update category', err, req.body);
      const response = new Response(500, err.message);
      return response.send(res);
    }

    const response = new Response(201, result[1]);
    return response.send(res);
  });

  app.delete('/categories/:categoryId', async (req, res) => {
    const categoryId = parseInt(req.params.categoryId, 10);
    const [err] = await evaluate(db.Category.destroy({
      where: {
        id: categoryId,
      },
    }));

    if (err) {
      logger.error(`Failed to delete category with id: ${categoryId}`, err);
      const response = new Response(500, err.message);
      return response.send(res);
    }

    const response = new Response(204);
    return response.send(res);
  });
};
