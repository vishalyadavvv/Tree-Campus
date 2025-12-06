import LiveClass from '../models/LiveClass.js';

// @desc    Get all live classes
// @route   GET /api/live-classes
// @access  Public
export const getLiveClasses = async (req, res) => {
  try {
    const liveClasses = await LiveClass.find()
      .populate('courseId', 'title thumbnail')
      .sort('scheduledAt');

    res.status(200).json({
      success: true,
      count: liveClasses.length,
      data: liveClasses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single live class
// @route   GET /api/live-classes/:id
// @access  Public
export const getLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id)
      .populate('courseId', 'title thumbnail');

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: liveClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create live class
// @route   POST /api/live-classes
// @access  Private/Admin
export const createLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.create(req.body);

    res.status(201).json({
      success: true,
      data: liveClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update live class
// @route   PUT /api/live-classes/:id
// @access  Private/Admin
export const updateLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: liveClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete live class
// @route   DELETE /api/live-classes/:id
// @access  Private/Admin
export const deleteLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Live class not found'
      });
    }

    await liveClass.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Live class deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
