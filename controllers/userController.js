const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            email,
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (e) {
        console.error('Error creating user:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
}