import Update from '../models/Update.js';

// @desc    Create a new update
// @route   POST /api/updates
// @access  Private
export const createUpdate = async (req, res) => {
  const { text, tags, mood } = req.body;

  try {
    const update = new Update({
      text,
      tags: tags || [],
      mood,
      user: req.user._id,
    });

    const createdUpdate = await update.save();
    res.status(201).json(createdUpdate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all updates for a user
// @route   GET /api/updates
// @access  Private
export const getUpdates = async (req, res) => {
  try {
    const updates = await Update.find({ user: req.user._id }).sort({ date: -1 });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get update by ID
// @route   GET /api/updates/:id
// @access  Private
export const getUpdateById = async (req, res) => {
  try {
    const update = await Update.findById(req.params.id);

    if (update && update.user.toString() === req.user._id.toString()) {
      res.json(update);
    } else {
      res.status(404).json({ message: 'Update not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an update
// @route   PUT /api/updates/:id
// @access  Private
export const updateUpdate = async (req, res) => {
  const { text, tags, mood } = req.body;

  try {
    const update = await Update.findById(req.params.id);

    if (update && update.user.toString() === req.user._id.toString()) {
      update.text = text;
      update.tags = tags || [];
      update.mood = mood;

      const updatedUpdate = await update.save();
      res.json(updatedUpdate);
    } else {
      res.status(404).json({ message: 'Update not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an update
// @route   DELETE /api/updates/:id
// @access  Private
export const deleteUpdate = async (req, res) => {
  try {
    const update = await Update.findById(req.params.id);

    if (update && update.user.toString() === req.user._id.toString()) {
      await Update.deleteOne({ _id: req.params.id });
      res.json({ message: 'Update removed' });
    } else {
      res.status(404).json({ message: 'Update not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get updates by date range
// @route   GET /api/updates/range
// @access  Private
export const getUpdatesByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const updates = await Update.find({
      user: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: 1 });

    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};