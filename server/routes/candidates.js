const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const verifyToken = require('../middleware/authMiddleware');

// Protect all routes
router.use(verifyToken);

// GET all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new candidate
router.post('/', async (req, res) => {
  const candidate = new Candidate(req.body);
  try {
    const newCandidate = await candidate.save();
    res.status(201).json(newCandidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update candidate
router.put('/:id', async (req, res) => {
  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCandidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(updatedCandidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE candidate
router.delete('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
