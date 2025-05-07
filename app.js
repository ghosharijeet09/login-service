/*
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const users = []; // In-memory store

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/signup', (req, res) => {
  const { name, password } = req.body;
  if (users.find(u => u.name === name)) return res.send('User already exists.');
  users.push({ name, password });
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { name, password } = req.body;
  const user = users.find(u => u.name === name && u.password === password);
  if (user) return res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  res.send('Invalid credentials');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

*/

//mongodb+srv://ghosharijeet09:h4IfqvSEKwc5W7t1@login.rnm5xaw.mongodb.net/?retryWrites=true&w=majority&appName=login
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// MongoDB Atlas Connection
const MONGO_URI = 'mongodb+srv://ghosharijeet09:h4IfqvSEKwc5W7t1@login.rnm5xaw.mongodb.net/?retryWrites=true&w=majority&appName=login';

mongoose.connect(MONGO_URI, { connectTimeoutMS: 30000 })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Debug MongoDB Connection Events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB Atlas');
});
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', async (req, res) => {
  console.log('Signup Request Body:', req.body); // Debug request body

  const { name, password } = req.body;

  try {
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      console.log('User already exists:', name);
      return res.status(400).send('User already exists.');
    }

    const newUser = new User({ name, password });
    await newUser.save();
    console.log('New user saved:', newUser);
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).send('Error signing up.');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  console.log('Login Request Body:', req.body); // Debug request body

  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name, password });
    if (user) {
      console.log('User logged in:', user.name);
      return res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    }

    console.log('Invalid login attempt for user:', name);
    res.status(400).send('Invalid credentials');
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Error logging in.');
  }
});

// Start Server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
