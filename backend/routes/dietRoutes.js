const express = require('express');
const router = express.Router();
const { generateDietPlan, getDietPlans, getDietPlanById } = require('../controllers/dietController');

router.post('/generate', generateDietPlan);
router.get('/history', getDietPlans);
router.get('/:id', getDietPlanById);

module.exports = router;
