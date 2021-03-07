const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    parent: Array,
    createdate: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", CategorySchema);
