const express = require('express');
const fetchUser = require('../middleware/fetchuser');
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get All Notes using: GET "/api/notes/fetchallnotes". Login required 
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internel Server Error!");
    }
});

//ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required 
router.post('/addnote', fetchUser, [
    body('title', 'Description must be atleast 5 characters').isLength({ min: 5 }),
    body('description', 'Description must be atleast 10 characters').isLength({ min: 10 }),

], async (req, res) => {
    try {
        // If there are errors, return Bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Destructuring from Body
        const { title, description, tag } = req.body;
        // Create a New Note
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internel Server Error!");
    }
});

//ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote/:id". Login required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    // Destructuring from Body
    const { title, description, tag } = req.body;
    try {
        //  Create a newNote object
        const newNote = {};
        if (title) {
            newNote.title = title
        };
        if (description) {
            newNote.description = description
        };
        if (tag) {
            newNote.tag = tag
        };

        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Note Not Found");
        };

        // Allow update only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not Allowed");
        };

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internel Server Error!");
    }
});

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote/:id", Login Required
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Note Not Found");
        };
        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not Allowed");
        };

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internel Server Error!");
    }
});
module.exports = router;