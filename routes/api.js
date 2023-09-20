const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
    res.send('Hello, petpal users!');
});

router.get('/home', (req, res) => {
    res.send('Hello, you are ath Home page now!');
});

module.exports = router;