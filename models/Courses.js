const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  platform: {
    type: String,
  },
  price: {
    type: String,
  },
  university: {
    type: String,
  },
  level: {
    type: String,
  },
  pace: {
    type: String,
  },
  rating: {
    type: Number,
  },
  link: {
    type: String,
  },
});

module.exports = mongoose.model("Course", courseSchema);
