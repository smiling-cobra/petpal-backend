const User = require('../models/user');
const bcrypt = require('bcrypt');
const generateToken = require('../services/tokenService');
const mongoose = require('mongoose');


const ObjectId = mongoose.Types.ObjectId;

exports.registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            _id: new ObjectId(),
            username,
            password: hashedPassword,
            email,
        });

        await newUser.save();
        const token = generateToken(newUser);

        res.status(201).json({ user: newUser, token });
    } catch (e) {
        console.error('Error creating user:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
}