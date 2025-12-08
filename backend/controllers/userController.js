  import User from '../models/User.js';

  /**
   * @desc    Get current user profile
   * @route   GET /api/users/profile
   * @access  Private
   */
  const getProfile = async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id)
        .populate('enrolledCourses', 'title thumbnail category');

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Update user profile
   * @route   PUT /api/users/profile
   * @access  Private
   */

  // @desc    Update user profile
  // @route   PUT /api/users/profile
  // @access  Private
  const updateProfile = async (req, res) => {
  try {
    console.log('Update profile request received:', req.body);
    console.log('User ID:', req.user.id);

    const { name, email, phone, preferredLanguage } = req.body;

    // Check if email already exists for other users
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user.id }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Check if phone already exists for other users
    if (phone && phone !== req.user.phone) {
      const existingUser = await User.findOne({
        phone,
        _id: { $ne: req.user.id }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already exists'
        });
      }
    }

    // Build update object - REMOVE updatedAt: new Date()
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (preferredLanguage) updateFields.preferredLanguage = preferredLanguage;

    console.log('Update fields:', updateFields);

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { 
        new: true, 
        runValidators: true,
        timestamps: true  // ← ADD THIS to ensure timestamps are handled properly
      }
    ).select('-password');

    console.log('Updated user from DB:', updatedUser);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

  /**
   * @desc    Change password
   * @route   PUT /api/users/change-password
   * @access  Private
   */
  const changePassword = async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id).select('+password');

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get all users (Admin only)
   * @route   GET /api/users
   * @access  Private (Admin)
   */
  const getAllUsers = async (req, res, next) => {
    try {
      const { role, page = 1, limit = 10, search } = req.query;

      const query = {};

      if (role) query.role = role;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const users = await User.find(query)
        .select('-password')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get user by ID (Admin only)
   * @route   GET /api/users/:id
   * @access  Private (Admin)
   */
  const getUserById = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id)
        .select('-password')
        .populate('enrolledCourses', 'title thumbnail');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Update user role (Admin only)
   * @route   PUT /api/users/:id/role
   * @access  Private (Admin)
   */
  const updateUserRole = async (req, res, next) => {
    try {
      const { role } = req.body;

      if (!['student', 'instructor', 'admin'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role',
        });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Delete user (Admin only)
   * @route   DELETE /api/users/:id
   * @access  Private (Admin)
   */
  const deleteUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Prevent deleting yourself
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'You cannot delete your own account',
        });
      }

      await user.deleteOne();

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  export {
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
  };
