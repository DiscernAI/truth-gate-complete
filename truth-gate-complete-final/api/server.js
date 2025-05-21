const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routeGPT = require('./routeGPT');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

// ✅ Serve frontend from /public
app.use(express.static(path.join(__dirname, '../public')));

// ✅ Root route → serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ✅ Route for Truth Gate backend
app.post('/api/routeGPT', routeGPT);

// Start the server
app.listen(PORT, () => {
  console.log(`🚪 Truth Gate listening on port ${PORT}`);
});
