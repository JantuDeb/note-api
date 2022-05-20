const cloudinary = require("cloudinary");
const Note = require("../model/note.model");
exports.addNote = async (req, res) => {
  const { description = "", label, pin, priority, title, color } = req.body;
  if (!description || !title)
    return res
      .status(400)
      .send({ success: false, message: "Please write something" });

  try {
    let imageResponse = {};

    if (req.files?.image) {
      imageResponse = await cloudinary.v2.uploader.upload(
        req.files.image.tempFilePath,
        { folder: "note/image" }
      );
    }

    const image = {
      id: imageResponse.public_id,
      url: imageResponse.secure_url,
    };

    const note = await Note.create({
      user: req.userId,
      description,
      title,
      pin,
      priority,
      color,
      label,
      image,
    });
    res.status(201).send({ success: true, note });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// get all notes  ---> /api/notes
exports.getNotes = async (req, res) => {
  try {
    // get all notes from db
    const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
    // if no videos found return 404
    if (!notes || notes.length === 0)
      return res
        .status(404)
        .send({ success: false, message: "No notes to show" });

    // return all notes
    res.status(200).send({ success: true, notes });
  } catch (error) {
    // if error return 500
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.getNote = async (req, res) => {
  const { noteId } = req.params;
  try {
    const note = await Note.findById(noteId, {}, { lean: true });
    if (!note)
      return res
        .status(404)
        .send({ success: false, message: "No note found with this id" });

    // return  a video
    res.status(200).send({ success: true, note });
  } catch (error) {
    // if error return 500
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  const { noteId } = req.params;
  try {
    const note = await Note.findByIdAndDelete({ _id: noteId });
    if (!note)
      return res
        .status(404)
        .send({ success: false, message: "No notes found with id" });

    // return  a video
    res.status(200).send({ success: true, note });
  } catch (error) {
    // if error return 500
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { description, label, pin, priority, title, color } = req.body;
  const noteObject = { description, label, pin, priority, title, color };
  for (const key in noteObject) {
    if (noteObject[key] === undefined || noteObject[key] === null)
      delete noteObject.key;
  }

  try {
    const note = await Note.findByIdAndUpdate(
      { _id: noteId },
      noteObject,
      { new: true }
    );
    if (!note)
      return res
        .status(400)
        .send({ success: false, message: "Failed to update note" });

    res.status(200).send({ success: true, note });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { noteId } = req.params;
  const { status } = req.body;
  try {
    const note = await Note.findByIdAndUpdate(
      { _id: noteId },
      { status },
      { new: true }
    );
    if (!note)
      return res
        .status(404)
        .send({ success: false, message: "Failed to update note status" });
    res.status(200).send({ success: true, note });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
