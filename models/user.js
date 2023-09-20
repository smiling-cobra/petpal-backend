const mongoose = require('./mongoose');

// Define a user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

// Create a user model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;