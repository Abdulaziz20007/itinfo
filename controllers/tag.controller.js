const Tag = require("../schemas/Tag");
const { errorHandler } = require("../helpers/error_handler");
const { tagValidation } = require("../validations/tag.validation");

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find()
      .populate('topic_id')
      .populate('category_id');
    res.status(200).send({ message: "Done", tags });
  } catch (err) {
    errorHandler(err, res);
  }
};

const createTag = async (req, res) => {
  try {
    const { error, value } = tagValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const newTag = await Tag.create(value);
    res.status(201).send({ message: "Done", tag: newTag });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteTag = async (req, res) => {
  try {
    await Tag.findByIdAndDelete(req.body.id);
    res.status(200).send({ message: "Done" });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  getAllTags,
  createTag,
  deleteTag
}; 