const router = require('express').Router();
const { User, Thought } = require('../models');

// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('thoughts friends');
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single user by its _id and populated thought and friend data
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('thoughts friends');
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new user
router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT to update a user by its _id
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE to remove user by its _id
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    // BONUS: Remove a user's associated thoughts when deleted
    await Thought.deleteMany({ username: user.username });
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to add a new friend to a user's friend list
router.post('/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { $addToSet: { friends: friendId } }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE to remove a friend from a user's friend list
router.delete('/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
