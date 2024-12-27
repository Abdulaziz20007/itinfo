const { Schema, model } = require("mongoose");

const synonimSchema = new Schema({
  dict_id: { type: Schema.Types.ObjectId, ref: "Dictionary", required: true },
  desc_id: { type: Schema.Types.ObjectId, ref: "Description", required: true },
});

module.exports = model("Synonim", synonimSchema);
