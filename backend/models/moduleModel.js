const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  // UPDATED: Content is now even more flexible
  content: [
    {
      type: { 
        type: String, 
        required: true, 
        // ADDED: All the new section types
        enum: [
          'intro', 'heading', 'trait-grid', 'red-flags', 'pop-quiz', 
          'checklist', 'story-time', 'activity', 'fun-facts', 
          'affirmations', 'closing'
        ] 
      },
      mainText: { type: String },
      subText: { type: String },
      imageUrl: { type: String },
      items: [
        {
          icon: { type: String },
          title: { type: String },
          text: { type: String },
        }
      ],
    }
  ],
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  },
});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;

