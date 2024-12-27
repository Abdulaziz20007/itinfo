const Synonim = require("../schemas/Synonim");
const { errorHandler } = require("../helpers/error_handler");
const {sinonymValidation} = require("../validations/sinonym.validation");

const addSynonim = async (req, res) => {
  try {
    const { error, value } = sinonymValidation(req.body);
    if (error) return res.status(400).send({ message: error.message });
    const newSynonim = await Synonim.create({ value });
    res.status(201).send({ message: "Done", newSynonim });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAllSynonims = async (req, res) => {
  try {
    const synonims = await Synonim.find({})
      .populate("dict_id")
      .populate("desc_id");
    res.status(201).send({ message: "Done", synonims });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getSynonimById = async (req, res) => {
  try {
    const synonim = await Synonim.findById(req.body.id)
      .populate("dict_id")
      .populate("desc_id");
    res.status(201).send({ message: "Done", synonim });
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateSynonim = async (req, res) => {
  try {
    const synonim = await Synonim.findByIdAndUpdate(req.body.id, req.body);
    res.status(201).send({ message: "Done", synonim });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteSynonim = async (req, res) => {
  try {
    await Synonim.findByIdAndDelete(req.body.id);
    res.status(201).send({ message: "Done" });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  addSynonim,
  getAllSynonims,
  getSynonimById,
  updateSynonim,
  deleteSynonim,
};
