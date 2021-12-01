const mongoose = require("mongoose");
const Course = require("./Courses");
const Schema = mongoose.Schema;

const wishlistSchema = new mongoose.Schema({
  name: String,
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
