const mongoose = require('mongoose');
require('dotenv').config();

const dbUsername = process.env.DATABASE_USERNAME;
const dbPassword = process.env.DATABASE_PASSWORD;

mongoose.connect('mongodb+srv://cluster22137.0deohmn.mongodb.net/petpaldb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: {
        username: dbUsername,
        password: dbPassword,
      },
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error'));

// When the MongoDB connection is successfully opened, the callback function is executed
db.once('open', () => {
    console.log('Connected to MongoDB Atlas')
});

module.exports = mongoose;