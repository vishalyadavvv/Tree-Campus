import Volunteer from '../models/Volunteer';
import { sendAdminNotification, sendConfirmationEmail } from '../services/emailService';
import { validateVolunteerData } from '../utils/validation';

export class VolunteerController {
  /**
   * Submit a new volunteer application
   */
  static async submitApplication(req, res) {
    try {
      const { name, email, phone, address, motivation } = req.body;

      // Validate input data
      const validation = validateVolunteerData(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      // Check for existing application
      const existingApplication = await Volunteer.findOne({ email });
      if (existingApplication) {
        return res.status(409).json({
          success: false,
          message: 'An application with this email already exists',
          code: 'DUPLICATE_EMAIL'
        });
      }

      // Create new volunteer application
      const volunteerData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        address: address.trim(),
        motivation: motivation.trim(),
        status: 'pending',
        applicationDate: new Date()
      };

      const volunteer = new Volunteer(volunteerData);
      await volunteer.save();

      // Send emails asynchronously (don't await to speed up response)
      Promise.all([
        sendAdminNotification(volunteer),
        sendConfirmationEmail(volunteer)
      ]).catch(error => {
        console.error('Email sending error:', error);
        // Don't fail the request if email fails
      });

      res.status(201).json({
        success: true,
        message: 'Volunteer application submitted successfully',
        data: {
          id: volunteer._id,
          name: volunteer.name,
          email: volunteer.email,
          status: volunteer.status
        }
      });

    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      });
    }
  }

  /**
   * Get all volunteer applications (for admin)
   */
  static async getApplications(req, res) {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const skip = (page - 1) * limit;

      // Build filter object
      const filter = {};
      if (status) filter.status = status;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }

      const volunteers = await Volunteer.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v');

      const total = await Volunteer.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: volunteers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });

    } catch (error) {
      console.error('Error fetching volunteer applications:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get single volunteer application by ID
   */
  static async getApplicationById(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid application ID'
        });
      }

      const volunteer = await Volunteer.findById(id);
      if (!volunteer) {
        return res.status(404).json({
          success: false,
          message: 'Volunteer application not found'
        });
      }

      res.json({
        success: true,
        data: volunteer
      });

    } catch (error) {
      console.error('Error fetching volunteer application:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update volunteer application status (for admin)
   */
  static async updateApplicationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const validStatuses = ['pending', 'approved', 'rejected', 'active', 'inactive'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }

      const volunteer = await Volunteer.findByIdAndUpdate(
        id,
        { 
          status,
          ...(notes && { notes }),
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!volunteer) {
        return res.status(404).json({
          success: false,
          message: 'Volunteer application not found'
        });
      }

      res.json({
        success: true,
        message: 'Application status updated successfully',
        data: volunteer
      });

    } catch (error) {
      console.error('Error updating volunteer application:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get application statistics (for admin dashboard)
   */
  static async getStatistics(req, res) {
    try {
      const stats = await Volunteer.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const total = await Volunteer.countDocuments();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const applicationsToday = await Volunteer.countDocuments({
        createdAt: { $gte: today }
      });

      const statistics = {
        total,
        applicationsToday,
        byStatus: stats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      };

      res.json({
        success: true,
        data: statistics
      });

    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Delete volunteer application (for admin)
   */
  static async deleteApplication(req, res) {
    try {
      const { id } = req.params;

      const volunteer = await Volunteer.findByIdAndDelete(id);
      if (!volunteer) {
        return res.status(404).json({
          success: false,
          message: 'Volunteer application not found'
        });
      }

      res.json({
        success: true,
        message: 'Volunteer application deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting volunteer application:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export default VolunteerController;