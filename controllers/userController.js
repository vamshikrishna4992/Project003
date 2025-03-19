import User from '../Model/UserModel.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new user (Only phone number)
export const createUser = async (req, res) => {
  const { phone } = req.body;
  try {
    const newUser = new User({ phone });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Export functions using named exports (No default export needed)
