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

exports.loginUser = async (req, res) => {
    try {
        const { password, email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateToken(user);
        res.status(200).json({ message: 'Logged in successfully', token });
    } catch (e) {
        console.error('Error log in user:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
}