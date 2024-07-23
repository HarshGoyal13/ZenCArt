const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/Nodemailer');

// Contact Us endpoint
router.post('/contact', async (req, res) => {
  const { email, subject, message } = req.body;

  // Validate input
  if (!email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Send email
    await sendEmail(
      process.env.CONTACT_EMAIL, // The email address where the contact form submissions should be sent
      subject,
      `Subject: ${subject}\nEmail: ${email}\n\nMessage:\n${message}`,
      `<p><strong>Subject:</strong> ${subject}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`
    );
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

module.exports = router;
