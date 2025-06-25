const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routeGPT = require('./routeGPT');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, '../public')));

// ✅ Root route serves HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ✅ Properly mount router for /api/routeGPT
app.use('/api/routeGPT', routeGPT);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🧠 Truth Gate listening on port ${PORT}`);
});
