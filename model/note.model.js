const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is require for add post"],
    },

    description: {
      type: String,
      required: [true, "Description is require"],
      trim: true,
    },

    title: {
      type: String,
      required: [true, "Title is require"],
      trim: true,
    },

    color: {
      type: String,
      default: "white",
    },
    pin: {
      type: Boolean,
      required: [true, "Description is require"],
      default: false,
    },

    image: {
      id: String,
      url: String,
    },

    priority: {
      type: String,
      enum: ["low", "high", "medium"],
      default: "low",
    },

    status: {
      type: String,
      enum: ["active", "archive", "trashed"],
      default: "active",
    },

    label: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
