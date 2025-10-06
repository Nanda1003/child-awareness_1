const Quiz = require('../models/quizModel');

const getQuizByModuleId = async (req, res) => {
  console.log(`✅ --- Request received for quiz with moduleId: ${req.params.moduleId} at ${new Date().toLocaleTimeString()} --- ✅`);

  try {
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