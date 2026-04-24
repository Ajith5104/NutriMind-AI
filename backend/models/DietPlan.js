const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    suggestion: String,
    calories: Number,
    protein: String,
    carbs: String,
    fats: String,
    timing: String,
    portionSize: String,
    alternatives: [String]
});

const dailyPlanSchema = new mongoose.Schema({
    day: String,
    breakfast: mealSchema,
    midMorningSnack: mealSchema,
    lunch: mealSchema,
    eveningSnack: mealSchema,
    dinner: mealSchema,
    preWorkoutMeal: mealSchema,
    postWorkoutMeal: mealSchema,
    totalCalories: Number,
    hydrationAdvice: String
});

const dietPlanSchema = new mongoose.Schema({
    goal: {
        type: String,
        required: true
    },
    macroDistribution: {
        protein: String,
        carbs: String,
        fats: String
    },
    durationDays: {
        type: Number,
        default: 7
    },
    weeklyTips: [String],
    plan: [dailyPlanSchema]
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
