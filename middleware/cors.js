const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 204,
  };

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;