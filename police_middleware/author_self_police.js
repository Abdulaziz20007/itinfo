const authorJwt = require("../services/jwt_service");

module.exports = async function (req, res, next) {
  try {
    const id = req.params.id;
    if (id !== req.author.id) {
      return res.status(403).send({ message: "Taqiqlangan" });
    }
    next()
  } catch (err) {
    errorHandler(err, res);
  }
};
