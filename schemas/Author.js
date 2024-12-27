const { Schema, model } = require("mongoose");

const authorSchema = new Schema(
  {
    author_first_name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 30,
    },
    author_last_name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 30,
    },
    author_nick_name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      maxLength: 30,
    },
    author_email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i,
    },
    author_phone: { type: String, trim: true, unique: true },
    author_password: { type: String, trim: true, required: true },
    author_info: { type: String, trim: true },
    author_position: { type: String, trim: true },
    author_photo: { type: String, trim: true },
    author_is_expert: { type: Boolean, default: false },
    author_is_active: { type: Boolean, default: true },
    refresh_token: String,
    activation_link: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Author", authorSchema);
