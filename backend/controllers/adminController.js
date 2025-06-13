import User from '../Model/userModel.js';

// Get all users (excluding admins)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'buyer' }).select('-password -conformPassword');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get all sellers
export const getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' })
      .select('-password -conformPassword')
      .populate('products', 'name price');
    res.json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ message: 'Error fetching sellers' });
  }
};

// Toggle user block status
export const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow blocking admins
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot block admin users' });
    }

    user.isBlocked = isBlocked;
    await user.save();

    res.json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    console.error('Error toggling user block status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
}; 