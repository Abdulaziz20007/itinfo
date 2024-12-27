const DescTopic = require("../schemas/DescTopic");
const { errorHandler } = require("../helpers/error_handler");
const { descTopicValidation } = require("../validations/desc_topic.validation");

const getAllDescTopics = async (req, res) => {
  try {
    const descTopics = await DescTopic.find()
      .populate('desc_id')
      .populate('topic_id');
    res.status(200).send({ message: "Done", descTopics });
  } catch (err) {
    errorHandler(err, res);
  }
};

const createDescTopic = async (req, res) => {
  try {
    const { error, value } = descTopicValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const newDescTopic = await DescTopic.create(value);
    res.status(201).send({ message: "Done", descTopic: newDescTopic });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteDescTopic = async (req, res) => {
  try {
    await DescTopic.findByIdAndDelete(req.body.id);
    res.status(200).send({ message: "Done" });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  getAllDescTopics,
  createDescTopic,
  deleteDescTopic
}; 