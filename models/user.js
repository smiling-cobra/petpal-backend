const mongoose = require('./mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minLength: [3, 'Username must be at least 3 characters long'],
        maxLength: [20, 'Username cannot be longer than 20 characters'],
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters long']
    },
    profile: {
        firstName: {
            type: String,
            trim: true,
            maxLength: [20, 'Name cannot be longer than 20 characters']
        },
        lastName: {
            type: String,
            trim: true,
            maxLength: [20, 'Last name cannot be longer than 20 characters']
        },
        bio: {
            type: String,
            maxLength: [300, 'Bio cannot be longer than 300 characters']
        },
    },
    pets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.methods.comparePassword = async function (candidatePassword) {
    const user = this;
    return bcrypt.compare(candidatePassword, user.password);
}
 
// Create a user model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;