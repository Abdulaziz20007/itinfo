const { Schema, model } = require("mongoose");

const social = new Schema({
    social_name: {
        type: String,
        trim: true,
        required: true
    },
    social_icon_file: {
        type: String,
        trim: true,
        required: true
    },
})

module.exports = model("Social", social);