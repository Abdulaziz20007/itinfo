const { Schema, model } = require("mongoose");

const descTopicSchema = new Schema({
  desc_id: { type: Schema.Types.ObjectId, ref: "Description", required: true },
  topic_id: { type: Schema.Types.ObjectId, ref: "Topic", required: true }
});

module.exports = model("DescTopic", descTopicSchema); 