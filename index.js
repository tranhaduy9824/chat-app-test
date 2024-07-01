const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Sử dụng cổng từ biến môi trường hoặc cổng 5000 nếu không có biến môi trường
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connection established');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
