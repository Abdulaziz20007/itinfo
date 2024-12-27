const Admin = require("../schemas/Admin");
const { errorHandler } = require("../helpers/error_handler");
const { adminValidation } = require("../validations/admin.validation");
const bcrypt = require("bcrypt");
const adminJwt = require("../services/jwt_service");
const config = require("config");
const { to } = require("../helpers/to_promise");

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-admin_password");
    res.status(200).send({ message: "Success", admins });
  } catch (err) {
    errorHandler(err, res);
  }
};

const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-admin_password");
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }
    res.status(200).send({ message: "Success", admin });
  } catch (err) {
    errorHandler(err, res);
  }
};

const createAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const existingAdmin = await Admin.findOne({
      $or: [
        { admin_email: value.admin_email },
        { admin_name: value.admin_name },
        { admin_phone: value.admin_phone },
      ],
    });

    if (existingAdmin) {
      return res.status(400).send({
        message: "Admin with this email, username, or phone already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(value.admin_password, 10);
    value.admin_password = hashedPassword;

    const admin = await Admin.create(value);
    const adminWithoutPassword = admin.toObject();
    delete adminWithoutPassword.admin_password;

    res.status(201).send({
      message: "Admin created successfully",
      admin: adminWithoutPassword,
    });
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    if (value.admin_password) {
      value.admin_password = await bcrypt.hash(value.admin_password, 10);
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, value, {
      new: true,
    }).select("-admin_password");

    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    res.status(200).send({ message: "Admin updated successfully", admin });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }
    res.status(200).send({ message: "Admin deleted successfully" });
  } catch (err) {
    errorHandler(err, res);
  }
};

const findAdmins = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).send({ message: "Search term is required" });
    }

    const admins = await Admin.find({
      $or: [
        { admin_name: { $regex: search, $options: "i" } },
        { admin_email: { $regex: search, $options: "i" } },
        { admin_phone: { $regex: search, $options: "i" } },
      ],
    }).select("-admin_password");

    res.status(200).send({ message: "Success", admins });
  } catch (err) {
    errorHandler(err, res);
  }
};

const login = async (req, res) => {
  try {
    const { admin_email, admin_password } = req.body;
    const admin = await Admin.findOne({ admin_email });
    if (!admin) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }
    const validPassword = bcrypt.compareSync(
      admin_password,
      admin.admin_password
    );
    if (!validPassword) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }
    const payload = {
      id: admin._id,
      email: admin.admin_email,
      is_active: admin.admin_is_active,
    };

    const tokens = adminJwt.generateTokens(payload);
    admin.refresh_token = tokens.refreshToken;
    await admin.save();
    res.cookie("adminRefreshToken", tokens.refreshToken, {
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

const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Token topilmadi" });
    }
    const admin = await Admin.findOneAndUpdate(
      { refresh_token: refreshToken },
      { refresh_token: "" },
      { new: true }
    );
    if (!admin) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli admin mavjud emas" });
    }
    res.clearCookie("adminRefreshToken");
    res.send({ refreshToken: admin.refresh_token });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshAdminToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Token topilmadi" });
    }
    const [error, tokenFromCookie] = await to(
      adminJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(401).send({ error: error.message });
    }
    const admin = await Admin.findOne({ refresh_token: refreshToken });
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    const payload = {
      id: admin._id,
      email: admin.admin_email,
      is_active: admin.admin_is_active,
    };

    const tokens = adminJwt.generateTokens(payload);
    admin.refresh_token = tokens.refreshToken;
    await admin.save();
    res.cookie("adminRefreshToken", tokens.refreshToken, {
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

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  findAdmins,
  login,
  logoutAdmin,
  refreshAdminToken,
};
