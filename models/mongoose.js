const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://cluster22137.0deohmn.mongodb.net', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error'));

// When the MongoDB connection is successfully opened, the callback function is executed
db.once('open', () => {
    console.log('Connected to MongoDB Atlas')
});

module.exports = mongoose;