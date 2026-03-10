const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid identifier or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                age: user.age,
                gender: user.gender,
                height: user.height,
                weight: user.weight,
                bodyFatPercentage: user.bodyFatPercentage,
                activityLevel: user.activityLevel,
                fitnessGoal: user.fitnessGoal,
                workoutTiming: user.workoutTiming,
                healthConditions: user.healthConditions,
                dietaryPreference: user.dietaryPreference,
                foodAllergies: user.foodAllergies,
                countryRegion: user.countryRegion
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Not authorized, no user ID' });
        }
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = req.body.password;
            }
            
            // Profile fields
            user.age = req.body.age || user.age;
            user.gender = req.body.gender || user.gender;
            user.height = req.body.height || user.height;
            user.weight = req.body.weight || user.weight;
            user.bodyFatPercentage = req.body.bodyFatPercentage !== undefined ? req.body.bodyFatPercentage : user.bodyFatPercentage;
            user.activityLevel = req.body.activityLevel || user.activityLevel;
            user.fitnessGoal = req.body.fitnessGoal || user.fitnessGoal;
            user.workoutTiming = req.body.workoutTiming || user.workoutTiming;
            user.healthConditions = req.body.healthConditions || user.healthConditions;
            user.dietaryPreference = req.body.dietaryPreference || user.dietaryPreference;
            user.foodAllergies = req.body.foodAllergies || user.foodAllergies;
            user.countryRegion = req.body.countryRegion || user.countryRegion;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id),
                age: updatedUser.age,
                gender: updatedUser.gender,
                height: updatedUser.height,
                weight: updatedUser.weight,
                bodyFatPercentage: updatedUser.bodyFatPercentage,
                activityLevel: updatedUser.activityLevel,
                fitnessGoal: updatedUser.fitnessGoal,
                workoutTiming: updatedUser.workoutTiming,
                healthConditions: updatedUser.healthConditions,
                dietaryPreference: updatedUser.dietaryPreference,
                foodAllergies: updatedUser.foodAllergies,
                countryRegion: updatedUser.countryRegion
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
