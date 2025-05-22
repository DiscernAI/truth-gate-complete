const express = require('express');
const app = express();
const path = require('path');
const routeGPT = require('./api/routeGPT');
const investigateRoute = require('./api/investigateTopic');
const { getAdminSummary } = require('./api/adminDashboard');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mount core routes
app.use('/api/routeGPT', routeGPT);
app.use('/api/investigateTopic', investigateRoute);

// Admin view (optional)
app.get('/api/adminSummary', (req, res) => {
  res.json(getAdminSummary());
});

// Serve frontend root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Add this catch-all to handle client-side routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🧠 Voice Beneath the Noise listening on port ${PORT}`);
});
