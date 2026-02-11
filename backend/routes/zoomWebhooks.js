import express from 'express';
import crypto from 'crypto';
import LiveClass from '../models/LiveClass.js';
import { verifyWebhookSignature } from '../utils/zoomAuth.js';

const router = express.Router();

/**
 * POST /api/webhooks/zoom
 * Receive webhook events from Zoom
 */
router.post('/', async (req, res) => {

  try {
    // Verify webhook signature
    const signature = req.headers['x-zm-signature'];
    const rawBody = req.body.toString();
    
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody);

    // Handle URL validation (Zoom sends this to verify endpoint)
    if (event.event === 'endpoint.url_validation') {
      const hashForValidate = crypto
        .createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN)
        .update(event.payload.plainToken)
        .digest('hex');

      return res.json({
        plainToken: event.payload.plainToken,
        encryptedToken: hashForValidate
      });
    }

    // Handle different meeting events
    const { event: eventType, payload } = event;

    console.log('Received Zoom webhook:', eventType);

    const meetingId = payload.object.id.toString();

    switch (eventType) {
      case 'meeting.started':
        await LiveClass.updateOne({ meetingId }, { status: 'live' });
        console.log('Meeting started:', meetingId);
        break;

      case 'meeting.ended':
        await LiveClass.updateOne({ meetingId }, { status: 'completed' });
        console.log('Meeting ended:', meetingId);
        break;

      case 'meeting.deleted':
        await LiveClass.deleteOne({ meetingId });
        console.log('Meeting deleted from Zoom:', meetingId);
        break;

      case 'meeting.created':
        try {
          // Check if already exists to prevent duplicates
          const exists = await LiveClass.findOne({ meetingId });
          if (exists) {
            console.log('Meeting already exists (skipped sync):', meetingId);
            break;
          }

          const { topic, start_time, duration, join_url, password, host_email } = payload.object;
          
          await LiveClass.create({
            title: topic || 'New Zoom Meeting',
            description: 'Imported from Zoom App',
            platform: 'Zoom',
            link: join_url,
            // If instant meeting (no start_time), use current time
            scheduledAt: start_time ? new Date(start_time) : new Date(),
            duration: duration || 60,
            instructor: host_email || 'Zoom Host',
            status: 'scheduled',
            meetingId: meetingId,
            password: password || '',
            source: 'automated',
            zoomData: payload.object
          });
          console.log('✨ Meeting auto-synced from Zoom:', meetingId);
        } catch (err) {
          console.error('Error syncing created meeting:', err);
        }
        break;

      default:
        console.log('Unhandled event type:', eventType);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
