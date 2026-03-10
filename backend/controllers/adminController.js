const User = require('../models/User');
const DietPlan = require('../models/DietPlan');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Admin Controller Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all diet plans
// @route   GET /api/admin/diets
// @access  Private/Admin
const getAllDietPlans = async (req, res) => {
    try {
        const plans = await DietPlan.find({}).populate('user', 'id name email');
        res.json(plans);
    } catch (error) {
        console.error('Admin Controller Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getUsers, getAllDietPlans };
