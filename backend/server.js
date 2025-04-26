const express = require('express');
const cors = require('cors');
const routes = require('./api/routes');

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});