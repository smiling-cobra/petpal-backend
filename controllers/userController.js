const User = require('../models/user');
const bcrypt = require('bcrypt');
const generateToken = require('../services/tokenService');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;

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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: NODEMAILER_EMAIL, // Your email address
        pass: NODEMAILER_PASSWORD, // Your password
    },
});

const sendPasswordResetEmail = recipientEmail => {
    const mailOptions = {
        from: NODEMAILER_EMAIL,
        to: recipientEmail,
        subject: 'Password Reset',
        text: 'You are receiving this because yuo (or someone else) have requested the reset of the password for your PetPal account'
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error)
        } else {
            console.log('Email sent:', + info.response);
        }
    })
};

exports.sendPasswordResetEmail = sendPasswordResetEmail;

exports.initiatePasswordReset = async (req, res) => {
    const TOKEN_EXPIRATION_TIME = 3600000; // 1 hour

    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + TOKEN_EXPIRATION_TIME;
        await user.save();

        sendPasswordResetEmail(email, resetToken);
    } catch (e) {
        console.error('Error log in user:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.handlePasswordReset = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(401).json({ error: 'Password reset toekn is invalid or expired' });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordToken = undefined;
        await user.save();
    } catch (e) {
        console.error('Handle password reset error:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
};