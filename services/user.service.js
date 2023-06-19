const mongoose = require('mongoose');
const userSchema = require('../schema/user.schema');
const User = mongoose.model('User', userSchema);
const jwt = require('jsonwebtoken');

async function createToken(email, password){
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Validate the password
    if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Create the JWT token
    return await jwt.sign({ email: user.email }, 'your-secret-key', { expiresIn: '1h' });

}

async function createUser(user){
    // Create a new user
    const newUser = new User(user);
    const saveuser = await newUser.save();
    if(saveuser){
        const {id, name, email, age} = saveuser;
        return {id, name, email,age}
    }
}

async function getAllUsers(){
    try {
        // Fetch all users from the database
        const users = await User.find();
        return users;
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
async function patchUser(userId, updatedFields, res){
    try {    
        // Find the user by ID and update the fields
        const user = await User.findByIdAndUpdate(userId, updatedFields, { new: true });
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        res.json(user);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

async function deleteUser(userId, res){
    try {
    
        // Find the user by ID and remove it
        const user = await User.findByIdAndRemove(userId);
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        res.json({ message: 'User deleted successfully' });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

module.exports = {
    createUser,
    patchUser,
    deleteUser,
    createToken,
    getAllUsers
}
