const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  admin_name: {
    type: String,
    required: true,
    trim: true
  },
  admin_email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  admin_phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  admin_password: {
    type: String,
    required: true,
    trim: true
  },
  admin_is_active: {
    type: Boolean,
    default: true
  },
  admin_is_creator: {
    type: Boolean,
    default: false
  },
  refresh_token: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'created_date',
    updatedAt: 'updated_date'
  }
});

module.exports = model("Admin", adminSchema); 