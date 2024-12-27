const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
  name: { type: String, trim: true, required: true },
  parent_category_id: { type: Schema.Types.ObjectId, ref: "Category" },
});

module.exports = model("Category", categorySchema);
