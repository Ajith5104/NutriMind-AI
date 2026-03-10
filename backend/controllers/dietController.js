const DietPlan = require('../models/DietPlan');
const User = require('../models/User');
const { OpenAI } = require('openai');

const isOpenRouter = process.env.OPENAI_API_KEY?.startsWith('sk-or-');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: isOpenRouter ? "https://openrouter.ai/api/v1" : undefined,
    defaultHeaders: isOpenRouter ? {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "NutriMind AI",
    } : undefined
});

// @desc    Generate a new diet plan
// @route   POST /api/diet/generate
// @access  Private
const generateDietPlan = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const missingFields = [];
        const requiredFields = ['age', 'gender', 'height', 'weight', 'activityLevel', 'fitnessGoal', 'dietaryPreference'];
        
        requiredFields.forEach(field => {
            if (!user[field]) {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: 'Profile incomplete. Please fill required fields.', 
                missingFields 
            });
        }

        const prompt = `
            Act as a Professional Gym Nutritionist and Diet Planner.
            Create a highly structured, practical, and specialized 7-day diet plan for an active individual who exercises daily.
            
            User Details:
            - Age: ${user.age}
            - Gender: ${user.gender}
            - Height: ${user.height} cm
            - Weight: ${user.weight} kg
            - Body Fat %: ${user.bodyFatPercentage || 'Not provided'}
            - Activity Level: ${user.activityLevel}
            - Fitness Goal: ${user.fitnessGoal}
            - Workout Timing: ${user.workoutTiming || 'Not specified'}
            - Medical Conditions: ${user.healthConditions?.join(', ') || 'None'}
            - Food Preference: ${user.dietaryPreference}
            - Allergies: ${user.foodAllergies?.join(', ') || 'None'}
            - Country/Region: ${user.countryRegion || 'International'}

            CRITICAL REQUIREMENTS:
            1. Every single day MUST contain exactly these 7 meal slots with these exact timings:
               - Morning Pre-Workout (5:30 AM) (Key: preWorkoutMeal)
               - Morning Post-Workout (7:30 AM) (Key: postWorkoutMeal)
               - Breakfast (8:00 AM) (Key: breakfast)
               - Mid-Morning Snack (11:00 AM) (Key: midMorningSnack)
               - Lunch (1:30 PM) (Key: lunch)
               - Evening Snack (4:30 PM) (Key: eveningSnack)
               - Dinner (8:00 PM) (Key: dinner)
            2. Diversity: Every day should feature different food combinations. Avoid repetition.
            3. Purpose: The diet should support energy levels, muscle recovery, strength, and overall health.
            4. Balance: Optimize protein, carbohydrates, healthy fats, and fiber for the user's goals.
            5. Practicality: Meals should be simple, affordable, and easy to prepare at home using whole foods (eggs, fruits, lean protein, etc.).
            6. Calculate specific calories and macros (P, C, F) for every single meal.

            IMPORTANT: Return ONLY a valid JSON object. No markdown.
            Structure:
            {
                "durationDays": 7,
                "macroDistribution": { "protein": "String", "carbs": "String", "fats": "String" },
                "weeklyTips": ["Sports-specific tips for variation and recovery"],
                "plan": [
                    {
                        "day": "Day 1",
                        "totalCalories": Number,
                        "hydrationAdvice": "String",
                        "preWorkoutMeal": { "suggestion": "String", "timing": "HH:MM AM/PM", "portionSize": "String", "calories": Number, "protein": "String", "carbs": "String", "fats": "String", "alternatives": ["String"] },
                        "postWorkoutMeal": { "suggestion": "String", "timing": "HH:MM AM/PM", "portionSize": "String", "calories": Number, "protein": "String", "carbs": "String", "fats": "String", "alternatives": ["String"] },
                        "breakfast": { "suggestion": "String", "timing": "HH:MM AM/PM", "portionSize": "String", "calories": Number, "protein": "String", "carbs": "String", "fats": "String", "alternatives": ["String"] },
                        "midMorningSnack": { "suggestion": "String", "timing": "HH:MM AM/PM", "portionSize": "String", "calories": Number, "protein": "String", "carbs": "String", "fats": "String", "alternatives": ["String"] },
                        "lunch": { "suggestion": "String", "timing": "HH:MM AM/PM", "portionSize": "String", "calories": Number, "protein": "String", "carbs": "String", "fats": "String", "alternatives": ["String"] },
                        "eveningSnack": { "suggestion": "String", "timing": "HH:MM AM/PM", "portionSize": "String", "calories": Number, "protein": "String", "carbs": "String", "fats": "String", "alternatives": ["String"] },
                        "dinner": { "suggestion": "String", "timing": "HH:MM AM/PM", "portionSize": "String", "calories": Number, "protein": "String", "carbs": "String", "fats": "String", "alternatives": ["String"] }
                    }
                ]
            }
        `;

        console.log(`Generating diet plan for user: ${user.email}`);

        const response = await openai.chat.completions.create({
            model: isOpenRouter ? "openai/gpt-4o-mini" : "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        let generatedDataString = response.choices[0].message.content.trim();
        console.log("AI Response received.");
        
        // Strip out markdown code blocks if present
        if (generatedDataString.startsWith('```json')) {
            generatedDataString = generatedDataString.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        } else if (generatedDataString.startsWith('```')) {
            generatedDataString = generatedDataString.replace(/^```\n?/, '').replace(/\n?```$/, '');
        }

        let generatedPlan;
        try {
            generatedPlan = JSON.parse(generatedDataString);
        } catch(parseError) {
             console.error("AI Response Parsing Error:", parseError);
             return res.status(500).json({ message: 'AI failed to generate a valid plan format.' });
        }

        console.log("Saving diet plan to database...");
        const newDietPlan = await DietPlan.create({
            user: user._id,
            goal: user.fitnessGoal,
            durationDays: generatedPlan.durationDays || 7,
            macroDistribution: generatedPlan.macroDistribution,
            weeklyTips: generatedPlan.weeklyTips,
            plan: generatedPlan.plan
        });

        console.log(`Diet plan saved successfully! ID: ${newDietPlan._id}`);
        res.status(201).json(newDietPlan);
        
    } catch (error) {
        console.error("!!! Diet Generation Error !!!");
        console.error(error);
        
        let errorMessage = 'Server Error in Generation';
        let statusCode = 500;

        if (error.status === 401) {
            statusCode = 401;
            errorMessage = 'Invalid API Key or OpenRouter Account issue (401 User Not Found). Please check your API key.';
        } else if (error.status === 429) {
            statusCode = 429;
            errorMessage = 'API Quota Exceeded. Please check your credits.';
        }

        res.status(statusCode).json({ 
            message: errorMessage, 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// @desc    Get user's diet plan history
// @route   GET /api/diet/history
// @access  Private
const getDietPlans = async (req, res) => {
    try {
        const plans = await DietPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(plans);
    } catch (error) {
        console.error('Diet Controller Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a specific diet plan
// @route   GET /api/diet/:id
// @access  Private
const getDietPlanById = async (req, res) => {
    try {
        const plan = await DietPlan.findById(req.params.id);
        
        if (plan && plan.user.toString() === req.user._id.toString()) {
            res.json(plan);
        } else {
            res.status(404).json({ message: 'Diet plan not found' });
        }
    } catch (error) {
        console.error('Diet Controller Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { generateDietPlan, getDietPlans, getDietPlanById };
