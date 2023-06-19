const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userService = require('./services/user.service')
const auth = require('./middlewear/jwt.middlewear')
const validateEmail = require('./middlewear/dublicate.email');
const app = express();
const port = 3000;

// Connect to MongoDB 
//using mongo atlas cloud 
//change this password with atlas cloud password
mongoose.connect('mongodb+srv://ahsan:<password>@cluster0.ppiq3kv.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Middleware to parse JSON
app.use(express.json());

// Login api
app.post('/login', async (req, res) => {
const { email, password } = req.body;

try {
// Find the user by username
const token = await userService.createToken(email, password)
res.json({ token });
} catch (error) {
console.error('Error:', error);
res.status(500).json({ error: 'Internal Server Error' });
}

});

// get all users 
app.get('/user',auth.verifyToken, async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await userService.getAllUsers();
        res.json(users);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

//create user and validate dublicate email
app.post('/user',validateEmail.checkDublicateEmail,async (req, res) => {
    try {
        const { name, email, password, age } = req.body;
        const savedUser = await userService.createUser({ name, email, password, age });
        res.json(savedUser);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  });

// delete user api
app.delete('/user/:id', auth.verifyToken,async (req, res) => {
    const id = req.params.id;
    await userService.deleteUser(id, res);
    res.send('User deleted');
});

// patch/update user api
app.patch('/user/:id', auth.verifyToken, async (req, res) => {
    const userId = req.params.id;
    const updatedFields = req.body;
    const updatedUser= await userService.patchUser(userId, updatedFields, res);
    res.send(updatedUser);
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});