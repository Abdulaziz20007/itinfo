const Category = require("../schemas/Category");
const { errorHandler } = require("../helpers/error_handler");
const Joi = require("joi");
const { categoryValidation } = require("../validations/category.validation");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).populate("parent_category_id");
    res.status(201).send({ message: "Done", categories });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.body.id).populate(
      "parent_category_id"
    );
    res.status(201).send({ message: "Done", category });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getCategoriesByParentId = async (req, res) => {
  try {
    const categories = await Category.find({
      parent_category_id: req.body.id,
    });
    res.status(201).send({ message: "Done", categories });
  } catch (err) {
    errorHandler(err, res);
  }
};

const findCategoryByName = async (req, res) => {
  try {
    const category = await Category.find({
      name: { $regex: req.body.name, $options: "i" },
    });
    res.status(201).send({ message: "Done", category });
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.body.id, req.body);
    res.status(201).send({ message: "Done", category });
  } catch (err) {
    errorHandler(err, res);
  }
};

const addCategory = async (req, res) => {
  try {
    
    const { error, value } = categoryValidation(req.body);
    console.log(error);
    console.log(value);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const { name, parent_category_id } = value;
    const newCategory = await Category.create({ name, parent_category_id });
    res.status(201).send({ message: "Done", newCategory });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.body.id);
    res.status(201).send({ message: "Done" });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoriesByParentId,
  findCategoryByName,
  updateCategory,
  addCategory,
  deleteCategory,
};
