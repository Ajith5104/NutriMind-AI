const express = require('express');
const router = express.Router();
const { getUsers, getAllDietPlans } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/users').get(protect, admin, getUsers);
router.route('/diets').get(protect, admin, getAllDietPlans);

module.exports = router;
