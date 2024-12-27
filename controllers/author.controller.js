const Author = require("../schemas/Author");
const { errorHandler } = require("../helpers/error_handler");
const { authorValidation } = require("../validations/author.validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const authorJwt = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");

const uuid = require("uuid");
const mailService = require("../services/mail.service");

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(201).send({ message: "Done", authors });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAuthorById = async (req, res) => {
  try {
    res.status(201).send({ message: "Done", author });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAuthorByNickName = async (req, res) => {
  try {
    const author = await Author.findOne({
      author_nick_name: req.body.nick_name,
    });
    res.status(201).send({ message: "Done", author });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAuthorByPhone = async (req, res) => {
  try {
    const author = await Author.findOne({ author_phone: req.body.phone });
    res.status(201).send({ message: "Done", author });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAuthorByEmail = async (req, res) => {
  try {
    const author = await Author.findOne({ author_email: req.body.email });
    res.status(201).send({ message: "Done", author });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAuthorsByPosition = async (req, res) => {
  try {
    const authors = await Author.find({ author_position: req.body.position });
    res.status(201).send({ message: "Done", authors });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAuthorsByName = async (req, res) => {
  try {
    const { first_name, last_name } = req.body;
    if (!first_name && !last_name) {
      return res.status(400).send({ error: "Please provide a name to search" });
    }

    const query = {};
    if (first_name) {
      query.author_first_name = { $regex: `.*${first_name}.*`, $options: "i" };
    }
    if (last_name) {
      query.author_last_name = { $regex: `.*${last_name}.*`, $options: "i" };
    }

    const authors = await Author.find(query);
    res.status(201).send({ message: "Done", authors });
  } catch (err) {
    errorHandler(err, res);
  }
};

const login = async (req, res) => {
  try {
    
    const { author_email, author_password } = req.body;
    console.log(author_email, author_password);
    
    const author = await Author.findOne({ author_email });
    console.log(author);
    
    if (!author) {
      console.log(req.body);
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }
    const validPassword = bcrypt.compareSync(
      author_password,
      author.author_password
    );
    if (!validPassword) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }
    const payload = {
      id: author._id,
      email: author.author_email,
      is_active: author.author_is_active,
    };

    // const token = jwt.sign(payload, config.get("tokenKey"), {
    //   expiresIn: config.get("tokenTime"),
    // });

    const tokens = authorJwt.generateTokens(payload);
    author.refresh_token = tokens.refreshToken;
    await author.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_token_ms"),
    });

    res.status(200).send({
      message: "Xush kelibsiz!",
      author_id: author._id,
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    errorHandler(err, res);
  }
};

const createAuthor = async (req, res) => {
  try {
    const activation_link = uuid.v4();
    const { error, value } = authorValidation(req.body);
    const author_password = bcrypt.hashSync(value.author_password, 7);
    if (error) return res.status(400).send({ message: error.message });
    const author = await Author.create({
      ...value,
      author_password,
      activation_link,
    });
    await mailService.sendMailActivationCode(
      value.author_email,
      `${config.get("api_url")}/api/author/activate/${activation_link}`
    );
    res.status(201).send({ message: "Done", author });
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.body.id, req.body);
    res.status(201).send({ message: "Done", author });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.body.id);
    res.status(201).send({ message: "Done", author });
  } catch (err) {
    errorHandler(err, res);
  }
};

const findAuthors = async (req, res) => {
  try {
    const searchTerm = req.body.search;

    const authors = await Author.find({
      $or: [
        { author_first_name: { $regex: searchTerm, $options: "i" } },
        { author_last_name: { $regex: searchTerm, $options: "i" } },
        { author_nick_name: { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.status(200).send({ message: "Done", authors });
  } catch (err) {
    errorHandler(err, res);
  }
};

const logoutAuthor = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    if (!refreshToken) {
      return res.status(400).send({ message: "Token topilmadi" });
    }
    const author = await Author.findOneAndUpdate(
      { refresh_token: refreshToken },
      { refresh_token: "" },
      { new: true }
    );
    if (!author) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli author mavjud emas" });
    }
    res.clearCookie("refreshToken");
    res.send({ refreshToken: author.refresh_token });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshAuthorToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Token topilmadi" });
    }
    const [error, tokenFromCookie] = await to(
      authorJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(401).send({ error: error.message });
    }
    const author = await Author.findOne({ refresh_token: refreshToken });
    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }

    const payload = {
      id: author._id,
      email: author.author_email,
      is_active: author.author_is_active,
    };

    const tokens = authorJwt.generateTokens(payload);
    author.refresh_token = tokens.refreshToken;
    await author.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_token_ms"),
    });

    res.status(200).send({
      message: "Xush kelibsiz!",
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    errorHandler(err, res);
  }
};

const activateAuthor = async (req, res) => {
  try {
    const link = req.params.link;
    const author = await Author.findOne({ activation_link: link });
    if (!author) {
      return res.status(400).send({ message: "Bunday avtor topilmadi" });
    }
    if (author.author_is_active) {
      return res.status(400).send({ message: "Avtor avval faollashtirilgan" });
    }
    author.author_is_active = true;
    await author.save();
    res.send({
      message: "Avtor faollashtirildi",
      is_active: author.author_is_active,
    });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  getAllAuthors,
  getAuthorById,
  getAuthorByNickName,
  getAuthorByPhone,
  getAuthorByEmail,
  getAuthorsByName,
  getAuthorsByPosition,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  findAuthors,
  login,
  logoutAuthor,
  refreshAuthorToken,
  activateAuthor,
};
