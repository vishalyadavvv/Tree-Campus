import LiveClass from '../models/LiveClass.js';
import { zoomApiRequest, generateSDKSignature } from '../utils/zoomAuth.js';

const MAX_CONCURRENT_MEETINGS = 5;

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
    const { title, description, platform, scheduledAt, duration, instructor, autoGenerateZoom, isRecurring, recurrenceEndDate } = req.body;

    // Helper to create a single class instance
    const createSingleClass = async (date) => {
      // Check concurrent meetings limit
      if (platform === 'Zoom' && autoGenerateZoom) {
        const liveMeetingsCount = await LiveClass.countDocuments({ status: 'live' });
        if (liveMeetingsCount >= MAX_CONCURRENT_MEETINGS) {
          throw new Error(`Cannot create meeting. Maximum of ${MAX_CONCURRENT_MEETINGS} concurrent live meetings reached.`);
        }
      }

      let zoomMeetingData = {};
      let meetingLink = req.body.link;

      if (platform === 'Zoom' && (autoGenerateZoom === true || autoGenerateZoom === 'true')) {
        const zoomMeeting = await zoomApiRequest('/users/me/meetings', 'POST', {
          topic: title,
          type: 2,
          start_time: new Date(date).toISOString(),
          duration: parseInt(duration) || 60,
          password: Math.random().toString(36).substring(2, 8),
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: true,
            mute_upon_entry: false
          }
        });

        if (!zoomMeeting || !zoomMeeting.join_url) {
          throw new Error('Failed to generate Zoom meeting: No join URL returned from Zoom API');
        }

        meetingLink = zoomMeeting.join_url;
        zoomMeetingData = {
          meetingId: zoomMeeting.id.toString(),
          password: zoomMeeting.password,
          hostEmail: zoomMeeting.host_email,
          hostName: zoomMeeting.topic,
          zoomData: zoomMeeting,
          source: 'automated'
        };
      }

      return await LiveClass.create({
        ...req.body,
        scheduledAt: date,
        link: meetingLink,
        ...zoomMeetingData
      });
    };

    const createdClasses = [];

    if (isRecurring && recurrenceEndDate) {
      const startDate = new Date(scheduledAt);
      const endDate = new Date(recurrenceEndDate);
      
      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
         return res.status(400).json({ success: false, message: 'Invalid start or end date' });
      }

      if (endDate < startDate) {
        return res.status(400).json({ success: false, message: 'End date must be after start date' });
      }

      // Loop through dates
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        // Create class for this date
        // Note: Creating classes sequentially to avoid rate limits or race conditions
        const newClass = await createSingleClass(new Date(d));
        createdClasses.push(newClass);
      }
    } else {
      // Single class creation
      const newClass = await createSingleClass(scheduledAt);
      createdClasses.push(newClass);
    }

    res.status(201).json({
      success: true,
      count: createdClasses.length,
      data: isRecurring ? createdClasses : createdClasses[0]
    });

  } catch (error) {
    console.error('Error creating live class:', error);
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

    // Delete from Zoom if automated
    if (liveClass.source === 'automated' && liveClass.meetingId) {
      try {
        await zoomApiRequest(`/meetings/${liveClass.meetingId}`, 'DELETE');
      } catch (error) {
        console.error('Error deleting from Zoom:', error.message);
      }
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

// @desc    Get Zoom SDK Signature
// @route   POST /api/live-classes/:id/signature
// @access  Private
export const getMeetingSignature = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass || !liveClass.meetingId) {
      return res.status(404).json({
        success: false,
        message: 'Live class or Zoom meeting not found'
      });
    }

    const { role = 0 } = req.body; // 0 for participant, 1 for host (admin)
    const signature = generateSDKSignature(liveClass.meetingId, role);

    res.status(200).json({
      success: true,
      data: {
        signature,
        meetingNumber: liveClass.meetingId,
        password: liveClass.password,
        sdkKey: process.env.ZOOM_SDK_KEY,
        userName: req.user ? req.user.name : 'Student'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Background task to update meeting statuses based on scheduled time
 */
async function updateMeetingStatuses() {
  try {
    const now = new Date();
    // Classes that are scheduled but should be live
    await LiveClass.updateMany(
      { 
        status: 'scheduled', 
        scheduledAt: { $lte: now } 
      },
      { status: 'live' }
    );

    // Classes that are live but should be completed
    const meetings = await LiveClass.find({ status: 'live' });
    for (const mc of meetings) {
      if (mc.scheduledAt) {
        const endTime = new Date(mc.scheduledAt.getTime() + (mc.duration || 60) * 60000);
        if (now > endTime) {
          mc.status = 'completed';
          await mc.save();
        }
      }
    }
  } catch (error) {
    console.error('Error updating meeting statuses:', error.message);
  }
}

// Run status update every minute
setInterval(updateMeetingStatuses, 60000);
