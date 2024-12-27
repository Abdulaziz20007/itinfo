const { errorHandler } = require("../helpers/error_handler");
const Dictionary = require("../schemas/Dictionary");

const addTerm = async (req, res) => {
  try {
    const { term } = req.body;
    const oldTerm = await Dictionary.findOne({ term });
    if (oldTerm) {
      return res.status(400).send({ message: "This term already exists" });
    }
    const newTerm = await Dictionary.create({
      term,
      letter: term[0].toUpperCase(),
    });
    res.status(201).send({ message: "New term added", newTerm });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAllTerms = async (req, res) => {
  try {
    const terms = await Dictionary.find({});
    res.status(201).send({ message: "Done", terms });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getTermsByLetter = async (req, res) => {
  try {
    const terms = await Dictionary.find({
      letter: req.params.letter.toUpperCase(),
    });
    res.status(201).send({ message: "Done", terms });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getTermById = async (req, res) => {
  try {
    const { id } = req.body;
    const terms = await Dictionary.findById(id);
    res.status(201).send({ message: "Done", terms });
  } catch (err) {
    errorHandler(err, res);
  }
};

const findTerms = async (req, res) => {
  try {
    const { term } = req.body;
    if (!term) {
      return res.status(400).send({ error: "Please provide a term" });
    }
    const terms = await Dictionary.find({
      term: {
        $regex: `.*${term}.*`,
        $options: "i",
      },
    });
    return res.status(201).send({ message: "Done", terms });
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateTerm = async (req, res) => {
  try {
    const { id, term, letter } = req.body;
    const updatedTerm = await Dictionary.findByIdAndUpdate(id, {
      term,
      letter,
    });
    res.status(201).send({ message: "Done", updatedTerm });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteTerm = async (req, res) => {
  try {
    await Dictionary.findByIdAndDelete(req.params.id);
    res.status(201).send({ message: "Done" });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  addTerm,
  getAllTerms,
  getTermsByLetter,
  findTerms,
  getTermById,
  updateTerm,
  deleteTerm,
};
