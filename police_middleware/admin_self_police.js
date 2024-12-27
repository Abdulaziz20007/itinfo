const { errorHandler } = require("../helpers/error_handler");

module.exports = async function (req, res, next) {
  try {
    const id = req.params.id;
    if (id !== req.admin.id) {
      return res.status(403).send({ message: "Sizga bu ma'lumotlarni o'zgartirish uchun ruxsat yo'q" });
    }
    next();
  } catch (err) {
    errorHandler(err, res);
  }
}; 