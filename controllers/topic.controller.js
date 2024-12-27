const Topic = require("../schemas/Topic");
const { errorHandler } = require("../helpers/error_handler");
const { topicValidation } = require("../validations/topic.validation");

const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find()
      .populate("author_id")
      .populate("expert_id");
    res.status(200).send({ message: "Done", topics });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.body.id)
      .populate("author_id")
      .populate("expert_id");
    res.status(200).send({ message: "Done", topic });
  } catch (err) {
    errorHandler(err, res);
  }
};

const createTopic = async (req, res) => {
  try {
    const data = { ...req.body, author_id: req.author.id };
    const { error, value } = topicValidation(data);
    if (error) return res.status(400).send({ message: error.message });
    const newTopic = await Topic.create(value);
    res.status(201).send({ message: "Done", topic: newTopic });
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });
    res.status(200).send({ message: "Done", topic });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteTopic = async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.body.id);
    res.status(200).send({ message: "Done" });
  } catch (err) {
    errorHandler(err, res);
  }
};

const findTopics = async (req, res) => {
  try {
    const searchTerm = req.body.search;

    const topics = await Topic.find({
      $or: [
        { topic_title: { $regex: searchTerm, $options: "i" } },
        { topic_text: { $regex: searchTerm, $options: "i" } },
      ],
    })
      .populate("author_id")
      .populate("expert_id");

    res.status(200).send({ message: "Done", topics });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  findTopics,
};
