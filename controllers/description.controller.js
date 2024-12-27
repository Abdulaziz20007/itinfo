const Description = require("../schemas/Description");
const { errorHandler } = require("../helpers/error_handler");
const {descriptionValidation} = require("../validations/description.validation");

const getAllDescriptions = async (req, res) => {
  try {
    const descriptions = await Description.find({}).populate("category_id");
    res.status(201).send({ message: "Done", descriptions });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getDescriptionByCategoryId = async (req, res) => {
  try {
    const description = await Description.findOne({
      category_id: req.body.category_id,
    }).populate("category_id");
    res.status(201).send({ message: "Done", description });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getDescriptionById = async (req, res) => {
  try {
    const description = await Description.findById(req.body.id).populate(
      "category_id"
    );
    res.status(201).send({ message: "Done", description });
  } catch (err) {
    errorHandler(err, res);
  }
};

const findDescriptions = async (req, res) => {
  try {
    const descriptions = await Description.find({
      description: { $regex: req.body.search, $options: "i" },
    });
    res.status(201).send({ message: "Done", descriptions });
  } catch (err) {
    errorHandler(err, res);
  }
};

const addDescription = async (req, res) => {
  try {
    const { error, value } = descriptionValidation(req.body);
    if (error) return res.status(400).send({ message: error.message });
    const { category_id, description } = value;
    const newDescription = await Description.create({
      category_id,
      description,
    });
    res.status(201).send({ message: "Done", newDescription });
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateDescription = async (req, res) => {
  try {
    const { id, description, category_id } = req.body;
    const updatedDescription = await Description.findByIdAndUpdate(
      id,
      { description, category_id },
      { new: true }
    );
    res.status(200).send({ message: "Done", updatedDescription });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteDescription = async (req, res) => {
  try {
    await Description.findByIdAndDelete(req.body.id);
    res.status(200).send({ message: "Done" });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  getAllDescriptions,
  getDescriptionByCategoryId,
  getDescriptionById,
  addDescription,
  findDescriptions,
  updateDescription,
  deleteDescription,
};
