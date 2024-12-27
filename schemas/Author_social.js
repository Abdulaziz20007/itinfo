const { Schema, model } = require("mongoose");

const authorSocialSchema = new Schema({
  author_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
  social_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Social",
  },
  social_link: {
    type: String,
    trim: true,
    required: true,
  },
});

module.exports = model("AuthorSocial", authorSocialSchema)