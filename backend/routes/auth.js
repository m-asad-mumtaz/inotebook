const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchuser');

const JWT_SECRET = 'As@disgoodb0y';

//ROUTE 1: Create a User using: POST "/api/auth/createuser". Does not require Login
router.post('/createuser', [
    body('name', 'Enter a valid Name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be 8 or more characters').isLength({ min: 8 })
], async (req, res) => {
    // If there are errors, return Bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check whether the user with this email already exists or not
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }

        // Generating Salt and adding it to password hash
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        //Create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });

        // Generating JSON Web Token
        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken: authToken });

        // res.json(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internel Server Error!");
    }
});

//ROUTE 2: Authenticate a User using: POST "/api/auth/login". Does not require Login
router.post('/login', [
    body('email', 'Enter a valid Email!').isEmail(),
    body('password', 'Password Cannot be Blank!').exists(),
], async (req, res) => {
    // If there are errors, return Bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        // Check whether the user with this email already exists or not
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }
        // Comparing password
        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }

        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken: authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internel Server Error!");
    }
});

//ROUTE 3: Get Loggedin User details using: POST "/api/auth/getuser". Login required 
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internel Server Error!");
    }
});
module.exports = router;