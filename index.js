const express = require('express');
const routes = require('./routes/router')

const app = express();

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;