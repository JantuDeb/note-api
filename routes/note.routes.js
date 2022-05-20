const express = require("express");
const {
  addNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  updateStatus,
} = require("../controller/note.controller");

const isAuthenticated = require("../middleware/isAuthenticated");
const router = express.Router();

router
  .route("/notes")
  .post(isAuthenticated, addNote)
  .get(isAuthenticated, getNotes);

router
  .route("/note/:noteId")
  .get(isAuthenticated, getNote)
  .put(isAuthenticated, updateNote)
  .patch(isAuthenticated, updateStatus)
  .delete(isAuthenticated, deleteNote);

module.exports = router;
