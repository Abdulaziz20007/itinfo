const logger = require("../services/logger.service");

const errorHandler = (err, res) => {
  logger.error(err);
  return res.status(400).send({ error: err.message });
};

module.exports = { errorHandler };
