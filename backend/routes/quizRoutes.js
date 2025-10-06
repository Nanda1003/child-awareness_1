const express = require('express');
const router = express.Router();
const { getQuizByModuleId } = require('../controllers/quizController');


router.get('/:moduleId', getQuizByModuleId);

module.exports = router;
