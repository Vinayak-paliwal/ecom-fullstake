import User from "../Model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.secretKey;

export const signUp = async (req, res) => {
  try {
    const { name, email, password, conformPassword, role } = req.body;

    if (!(name && email && password && conformPassword)) {
      return res.status(404).json({ message: "All field are require" });
    }

    if (password != conformPassword) {
      return res.status(404).json({ message: "Incoreect Password" });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    console.log("<<<<<role>>>>>", role);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const data = {
      name,
      email,
      password: hash,
      role,
    };

    user = new User(data);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email not found! Please signup" });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
    }
    const dbPassword = user.password;

    const matchData = await bcrypt.compare(password, dbPassword);

    console.log("<<<<<match>>>>>", matchData);
    if (!matchData) {
      return res.status(400).json({ message: "invalid password" });
    }

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "10d" });

    console.log("<<<<<token>>>>>>", token);

    return res.status(200).json({ token, message: "user login successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    console.log('Fetching all users...');
    const users = await User.find({})
      .select('-password -conformPassword')
      .lean();
    
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ 
      message: 'Error fetching users',
      error: error.message 
    });
  }
};

// Block/Unblock user
export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    console.log(`Attempting to ${isBlocked ? 'block' : 'unblock'} user ${userId}`);

    const user = await User.findById(userId);
    if (!user) {
      console.log(`User not found: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow blocking admins
    if (user.role === 'admin') {
      console.log(`Attempted to block admin user: ${userId}`);
      return res.status(403).json({ message: 'Cannot block admin users' });
    }

    user.isBlocked = isBlocked;
    await user.save();

    console.log(`Successfully ${isBlocked ? 'blocked' : 'unblocked'} user ${userId}`);
    res.json({ 
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked
      }
    });
  } catch (error) {
    console.error('Error in blockUser:', error);
    res.status(500).json({ 
      message: 'Error updating user status',
      error: error.message 
    });
  }
};


