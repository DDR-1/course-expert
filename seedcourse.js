const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Course = require("./models/Courses");

mongoose
  .connect("mongodb://localhost:27017/loginDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo database connected");
  })
  .catch((err) => {
    console.log("Mongo connection error");
    console.log(err);
  });

Course.insertMany([
  {
    name: "Getting Started with Python",
    platform: "Coursera",
    price: "FREE",
    university: "University of Michigan",
    level: "Beginner",
    pace: "Self Paced",
    rating: 3,
    link: "https://www.coursera.org/learn/python",
  },
  {
    name: "Machine Learning Engineer for Microsoft",
    platform: "Udacity",
    price: "PAID",
    university: "Microsoft",
    level: "Intermediate",
    pace: "Self Paced",
    rating: 4,
    link: "https://www.udacity.com/course/machine-learning-engineer-for-microsoft-azure-nanodegree--nd00333",
  },
  {
    name: "Getting Started with AI using IBM Watson",
    platform: "Udacity",
    price: "PAID",
    university: "IBM",
    level: "Beginner",
    pace: "Self Paced",
    rating: 4,
    link: "https://www.coursera.org/learn/ai-with-ibm-watson?specialization=applied-artifical-intelligence-ibm-watson-ai",
  },
]).then((data) => {
  console.log("worked");
});
