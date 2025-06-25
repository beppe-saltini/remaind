const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const personRoutes = require('./routes/personRoutes');
const documentRoutes = require('./controllers/documentController');
const queryRoutes = require('./controllers/queryController');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/persons', personRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/query', queryRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});