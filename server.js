const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const required = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_FROM_NUMBER',
  'EMERGENCY_PHONE_NUMBER'
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error('Missing environment variables:', missing.join(', '));
  process.exit(1);
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'LifeLink SMS backend is running.' });
});

app.post('/send-alert', async (req, res) => {
  try {
    const { victimName, bloodGroup, lifeLinkId, location } = req.body || {};

    if (!victimName) {
      return res.status(400).json({ success: false, message: 'victimName is required.' });
    }

    const body = [
      'LIFELINK EMERGENCY ALERT',
      '',
      'Possible accident detected.',
      `Victim: ${victimName}`,
      `Blood Group: ${bloodGroup || 'Not available'}`,
      `LifeLink ID: ${lifeLinkId || 'Not available'}`,
      `Location: ${location || 'Not available'}`,
      '',
      'Please check immediately.'
    ].join('\n');

    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_FROM_NUMBER,
      to: process.env.EMERGENCY_PHONE_NUMBER
    });

    console.log(`LifeLink SMS queued. SID: ${message.sid}, status: ${message.status}`);

    res.json({
      success: true,
      message: 'Emergency SMS submitted to Twilio.',
      sid: message.sid,
      status: message.status
    });
  } catch (error) {
    console.error('SMS error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send emergency SMS.',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`LifeLink SMS backend running at http://localhost:${PORT}`);
});
