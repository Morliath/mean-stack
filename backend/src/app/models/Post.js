const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true, default: "No title" },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Post', postSchema);
