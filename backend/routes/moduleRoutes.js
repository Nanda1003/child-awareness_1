const express = require('express');
const router = express.Router();
const Module = require('../models/moduleModel');

// NEW: This route gets ALL modules from the database
// @route   GET /api/modules
router.get('/', async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// This route gets a SINGLE module by its ID
// @route   GET /api/modules/:id
router.get('/:id', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ msg: 'Module not found' });
    }
    res.json(module);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
         return res.status(404).json({ msg: 'Module not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;