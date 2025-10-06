const Quiz = require('../models/quizModel');

/**
 * @desc    Get a quiz by its associated module ID
 * @route   GET /api/quizzes/:moduleId
 * @access  Public (or Private if you add auth middleware)
 */
const getQuizByModuleId = async (req, res) => {
  try {
    console.log(`Searching for quiz with moduleId: ${req.params.moduleId}`); // Helpful for debugging
    const quiz = await Quiz.findOne({ moduleId: req.params.moduleId });

    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: 'Quiz not found for this module' });
    }
  } catch (error) {
    console.error(`Error fetching quiz: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getQuizByModuleId };