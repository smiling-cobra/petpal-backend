const mongoose = require('./mongoose');
const bcrypt = require('bcrypt');

// User schema
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    const user = this;
    return bcrypt.compare(candidatePassword, user.password);
}
 
// Create a user model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;