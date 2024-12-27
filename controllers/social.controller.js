const { errorHandler } = require("../helpers/error_handler");
const Social = require("../schemas/Social");
const { isValidObjectId } = require("mongoose");
const { socialValidation } = require("../validations/social.validation");

const getAllSocials = async (req, res) => {
  try {
    const socials = await Social.find({});
    res.status(201).send({ message: "Done", socials });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getSocialById = async (req, res) => {
  try {
    if (!req.body.id) {
      res.status(400).send({ message: "Id is required" });
      return;
    } else if (!isValidObjectId(req.body.id)) {
      res.status(400).send({ message: "Wrong id" });
      return;
    }
    const social = await Social.findById(req.body.id);
    res.status(201).send({ message: "Done", social });
  } catch (err) {
    errorHandler(err, res);
  }
};

const findSocialByName = async (req, res) => {
  try {
    const socials = await Social.find({
      social_name: { $regex: req.body.name, $options: "i" },
    });
    res.status(201).send({ message: "Done", socials });
  } catch (err) {
    errorHandler(err, res);
  }
};

const createSocial = async (req, res) => {
  try {
    const { error, value } = socialValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const newSocial = await Social.create(value);
    res.status(201).send({ message: "Done", social: newSocial });
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateSocial = async (req, res) => {
  try {
    const { error, value } = socialValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const updatedSocial = await Social.findByIdAndUpdate(req.body.id, value, {
      new: true,
    });
    res.status(200).send({ message: "Done", social: updatedSocial });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteSocial = async (req, res) => {
  try {
    if (!req.body.id || !isValidObjectId(req.body.id)) {
      return res.status(400).send({ message: "Invalid ID" });
    }
    await Social.findByIdAndDelete(req.body.id);
    res.status(200).send({ message: "Done" });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  getAllSocials,
  getSocialById,
  findSocialByName,
  createSocial,
  updateSocial,
  deleteSocial,
};
