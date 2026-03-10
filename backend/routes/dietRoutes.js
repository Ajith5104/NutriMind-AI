const express = require('express');
const router = express.Router();
const { generateDietPlan, getDietPlans, getDietPlanById } = require('../controllers/dietController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateDietPlan);
router.get('/history', protect, getDietPlans);
router.get('/:id', protect, getDietPlanById);

module.exports = router;
