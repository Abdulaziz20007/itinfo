const Author_social = require("../schemas/Author_social");
const { errorHandler } = require("../helpers/error_handler");
const { authorSocialValidation } = require("../validations/author_social.validation");
const { isValidObjectId } = require("mongoose");


const getAllAuthorSocials = async (req, res) => {
  try {
    const author_socials = await Author_social.find({});
    res.status(201).send({ message: "Done", author_socials });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAuthorSocialsById = async (req, res) => {
  try {
    const id = req.body.id;
    if (!isValidObjectId(id) || !id) {
      errorHandler("Wrong id", res);
    }
    const author_social = await Author_social.findById(id);
    res.status(201).send({ message: "Done", author_social });
  } catch (err) {
    errorHandler(err, res);
  }
};

const createAuthorSocial = async (req, res) => {
  try {
    const { error, value } = authorSocialValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const newAuthorSocial = await Author_social.create(value);
    res.status(201).send({ message: "Done", authorSocial: newAuthorSocial });
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateAuthorSocial = async (req, res) => {
  try {
    const { error, value } = authorSocialValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const updatedAuthorSocial = await Author_social.findByIdAndUpdate(
      req.body.id,
      value,
      { new: true }
    );
    res.status(200).send({ message: "Done", authorSocial: updatedAuthorSocial });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  getAllAuthorSocials,
  getAuthorSocialsById,
  createAuthorSocial,
  updateAuthorSocial
};
