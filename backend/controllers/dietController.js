const DietPlan = require('../models/DietPlan');
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
// @access  Public
const generateDietPlan = async (req, res) => {
    try {
        const userData = req.body;
        
        const missingFields = [];
        const requiredFields = ['age', 'gender', 'height', 'weight', 'activityLevel', 'fitnessGoal', 'dietaryPreference'];
        
        requiredFields.forEach(field => {
            if (!userData[field]) {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: 'Missing required metrics. Please fill all fields.', 
                missingFields 
            });
        }

        const prompt = `
            Act as a Senior Clinical Dietitian and Performance Nutritionist.
            Create a high-precision, 7-day personalized nutritional protocol based on scientific principles (using Mifflin-St Jeor for BMR and TDEE calculations).

            USER BIOMETRICS & TARGETS:
            - Age: ${userData.age}
            - Gender: ${userData.gender}
            - Height: ${userData.height} cm
            - Weight: ${userData.weight} kg
            - Body Fat %: ${userData.bodyFatPercentage || 'Estimate based on BMI'}
            - Activity Level: ${userData.activityLevel} (Sedentary/Moderate/Very Active)
            - Goal: ${userData.fitnessGoal}
            - Preferences: ${userData.dietaryPreference}
            - Region/Cuisine: ${userData.countryRegion || 'Global'}
            - Medical/Allergies: ${userData.healthConditions?.join(', ') || 'None'} / ${userData.foodAllergies?.join(', ') || 'None'}

            STRICT GENERATION RULES:
            1. **Accuracy**: Total daily calories must be within +/- 50kcal of the target for the user's specific goal.
            2. **Macro Precision**: Calculate Protein (4kcal/g), Carbs (4kcal/g), and Fats (9kcal/g) to match the goal:
               - Muscle Gain: High Protein (1.8-2.2g/kg), Moderate Carb.
               - Fat Loss: High Protein, Caloric Deficit (-500kcal), controlled Carbs.
            3. **Structure**: Each day MUST have:
               - Pre-Workout (Energy focused)
               - Post-Workout (Recovery focused: Protein + Fast Carbs)
               - Breakfast, Mid-Morning Snack, Lunch, Evening Snack, Dinner.
            4. **Diversity**: Zero repetition of major meals across the 7 days.
            5. **Portions**: Use specific measurements (grams, ml, cups, pieces).
            6. **Timing**: Align meals with the individual's activity levels.

            JSON OUTPUT FORMAT (No Markdown):
            {
                "durationDays": 7,
                "macroDistribution": { "protein": "Xg", "carbs": "Xg", "fats": "Xg" },
                "weeklyTips": ["Science-based advice for recovery and hydration"],
                "plan": [
                    {
                        "day": "Day 1",
                        "totalCalories": 0,
                        "hydrationAdvice": "X Liters/day",
                        "preWorkoutMeal": { "suggestion": "String", "timing": "5:30 AM", "portionSize": "String", "calories": 0, "protein": "Xg", "carbs": "Xg", "fats": "Xg", "alternatives": ["Alt 1"] },
                        "postWorkoutMeal": { "suggestion": "String", "timing": "7:30 AM", "portionSize": "String", "calories": 0, "protein": "Xg", "carbs": "Xg", "fats": "Xg", "alternatives": ["Alt 1"] },
                        "breakfast": { "suggestion": "String", "timing": "8:30 AM", "portionSize": "String", "calories": 0, "protein": "Xg", "carbs": "Xg", "fats": "Xg", "alternatives": ["Alt 1"] },
                        "midMorningSnack": { "suggestion": "String", "timing": "11:00 AM", "portionSize": "String", "calories": 0, "protein": "Xg", "carbs": "Xg", "fats": "Xg", "alternatives": ["Alt 1"] },
                        "lunch": { "suggestion": "String", "timing": "1:30 PM", "portionSize": "String", "calories": 0, "protein": "Xg", "carbs": "Xg", "fats": "Xg", "alternatives": ["Alt 1"] },
                        "eveningSnack": { "suggestion": "String", "timing": "4:30 PM", "portionSize": "String", "calories": 0, "protein": "Xg", "carbs": "Xg", "fats": "Xg", "alternatives": ["Alt 1"] },
                        "dinner": { "suggestion": "String", "timing": "8:30 PM", "portionSize": "String", "calories": 0, "protein": "Xg", "carbs": "Xg", "fats": "Xg", "alternatives": ["Alt 1"] }
                    }
                ]
            }
        `;

        console.log(`Generating diet plan for guest...`);

        const response = await openai.chat.completions.create({
            model: isOpenRouter ? "openai/gpt-4o-mini" : "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        let generatedDataString = response.choices[0].message.content.trim();
        
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

        // We can still save to DB without a user ID for global history or just skip it
        const newDietPlan = await DietPlan.create({
            goal: userData.fitnessGoal,
            durationDays: generatedPlan.durationDays || 7,
            macroDistribution: generatedPlan.macroDistribution,
            weeklyTips: generatedPlan.weeklyTips,
            plan: generatedPlan.plan
        });

        res.status(201).json(newDietPlan);
        
    } catch (error) {
        console.error("!!! Diet Generation Error !!!", error.message);
        res.status(500).json({ message: 'Server Error in Generation', error: error.message });
    }
};

// @desc    Get all diet plans (public history)
// @route   GET /api/diet/history
// @access  Public
const getDietPlans = async (req, res) => {
    try {
        const plans = await DietPlan.find().sort({ createdAt: -1 }).limit(10);
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a specific diet plan
// @route   GET /api/diet/:id
// @access  Public
const getDietPlanById = async (req, res) => {
    try {
        const plan = await DietPlan.findById(req.params.id);
        if (plan) {
            res.json(plan);
        } else {
            res.status(404).json({ message: 'Diet plan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { generateDietPlan, getDietPlans, getDietPlanById };
