const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

if (process.env.USE_MOCK === 'true') {
  console.warn('🚀 Running in Mock In-Memory Mode (Persistence Disabled)');
  global.dbConnected = false;
} else {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostelDB')
    .then(() => {
      console.log('MongoDB Connected');
      global.dbConnected = true;
    })
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      global.dbConnected = false;
    });
}

app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/analytics', require('./routes/analytics'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
