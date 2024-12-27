const { Schema, model } = require("mongoose");

const topicSchema = new Schema({
  author_id: { type: Schema.Types.ObjectId, ref: "Author", required: true },
  topic_title: { type: String, required: true, trim: true },
  topic_text: { type: String, required: true, trim: true },
  is_checked: { type: Boolean, default: false },
  is_approved: { type: Boolean, default: false },
  expert_id: { type: Schema.Types.ObjectId, ref: "Author" }
}, {
  timestamps: true
});

module.exports = model("Topic", topicSchema); 