const mongoose = require('mongoose');
const User = require('./models/User');
const DietPlan = require('./models/DietPlan');
const dotenv = require('dotenv');
dotenv.config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB for verification.");

        const userCount = await User.countDocuments();
        console.log(`Total Users: ${userCount}`);

        const lastUser = await User.findOne().sort({ createdAt: -1 });
        if (lastUser) {
            console.log(`Last User Registered: ${lastUser.email}`);
            console.log(`Profile Data:`, {
                age: lastUser.age,
                bodyFat: lastUser.bodyFatPercentage,
                goal: lastUser.fitnessGoal
            });
        }

        const planCount = await DietPlan.countDocuments();
        console.log(`Total Diet Plans: ${planCount}`);

        const lastPlan = await DietPlan.findOne().sort({ createdAt: -1 });
        if (lastPlan) {
            console.log(`Last Diet Plan for User ID: ${lastPlan.user}`);
            console.log(`Plan Created At: ${lastPlan.createdAt}`);
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error("Verification failed:", error);
    }
};

verify();
