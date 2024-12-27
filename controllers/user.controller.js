const User = require("../schemas/User");
const { errorHandler } = require("../helpers/error_handler");
const { userValidation } = require("../validations/user.validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const userJwt = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");
const mailService = require("../services/mail.service");
const uuid = require("uuid");

const login = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;
    const user = await User.findOne({ user_email });
    if (!user) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }
    const validPassword = bcrypt.compareSync(user_password, user.user_password);
    if (!validPassword) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }
    const payload = {
      id: user._id,
      email: user.user_email,
      is_active: user.user_is_active,
    };

    const tokens = userJwt.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_token_ms"),
    });

    res.status(200).send({
      message: "Xush kelibsiz!",
      tokens,
    });
  } catch (err) {
    errorHandler(err, res);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Token topilmadi" });
    }
    const user = await User.findOneAndUpdate(
      { refresh_token: refreshToken },
      { refresh_token: "" },
      { new: true }
    );
    if (!user) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli user mavjud emas" });
    }
    res.clearCookie("refreshToken");
    res.send({ refreshToken: user.refresh_token });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshUserToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Token topilmadi" });
    }
    const [error, tokenFromCookie] = await to(
      userJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(401).send({ error: error.message });
    }
    const user = await User.findOne({ refresh_token: refreshToken });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const payload = {
      id: user._id,
      email: user.user_email,
      is_active: user.user_is_active,
    };

    const tokens = userJwt.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-user_password");
    res.status(200).send({ message: "Success", users });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-user_password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "Success", user });
  } catch (err) {
    errorHandler(err, res);
  }
};

const createUser = async (req, res) => {
  try {
    const activation_link = uuid.v4();
    const { error, value } = userValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const existingUser = await User.findOne({
      $or: [{ user_email: value.user_email }, { user_name: value.user_name }],
    });

    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User with this email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(value.user_password, 10);
    value.user_password = hashedPassword;
    value.user_activation_link = activation_link;
    console.log(value);

    const user = await User.create(value);
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.user_password;
    delete userWithoutPassword.user_activation_link;

    await mailService.sendMailActivationCode(
      value.user_email,
      `${config.get("api_url")}/api/users/activate/${activation_link}`
    );

    res.status(201).send({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateUser = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    if (value.user_password) {
      value.user_password = await bcrypt.hash(value.user_password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, value, {
      new: true,
    }).select("-user_password");

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User updated successfully", user });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    errorHandler(err, res);
  }
};

const findUsers = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).send({ message: "Search term is required" });
    }

    const users = await User.find({
      $or: [
        { user_name: { $regex: search, $options: "i" } },
        { user_email: { $regex: search, $options: "i" } },
        { user_info: { $regex: search, $options: "i" } },
      ],
    }).select("-user_password");

    res.status(200).send({ message: "Success", users });
  } catch (err) {
    errorHandler(err, res);
  }
};

const userActivate = async (req, res) => {
  try {
    const link = req.params.link;
    const user = await User.findOne({ user_activation_link: link });
    if (!user) {
      return res.status(400).send({ message: "Bunday user topilmadi" });
    }
    if (user.user_is_active) {
      return res.status(400).send({ message: "User avval faollashtirilgan" });
    }
    user.user_is_active = true;
    await user.save();
    res.send({
      message: "User faollashtirildi",
      is_active: user.user_is_active,
    });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  findUsers,
  login,
  logoutUser,
  refreshUserToken,
  userActivate,
};
