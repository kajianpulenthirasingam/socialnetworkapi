const router = require('express').Router();
const { Thought, User } = require('../models');

// GET all thoughts
router.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().populate('reactions');
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single thought by its _id
router.get('/thoughts/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id).populate('reactions');
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to create a new thought
router.post('/thoughts', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    await User.findByIdAndUpdate(thought.username, { $push: { thoughts: thought._id } });
    res.json(thought);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT to update a thought by its _id
router.put('/thoughts/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(thought);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE to remove a thought by its _id
router.delete('/thoughts/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(thought.username, { $pull: { thoughts: thought._id } });
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to create a reaction stored in a single thought's reactions array field
router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $push: { reactions: req.body } },
      { new: true }
    );
    res.json(thought);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const { thoughtId, reactionId } = req.params;
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: { reactionId } } },
      { new: true }
    );
    res.json(thought);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
