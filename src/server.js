require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Birthday surprise backend listening on http://localhost:${PORT}`);
});
