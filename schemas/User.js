const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    user_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    user_email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    user_password: {
      type: String,
      required: true,
      trim: true,
    },
    user_info: {
      type: String,
      trim: true,
    },
    user_photo: {
      type: String,
      trim: true,
      default: "/users/default.png",
    },
    user_is_active: {
      type: Boolean,
      default: false,
    },
    refresh_token: {
      type: String,
    },
    user_activation_link: String,
  },
  {
    timestamps: {
      createdAt: "created_date",
      updatedAt: "updated_date",
    },
  }
);

module.exports = model("User", userSchema);
