const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

/**
 * sendMail
 * @param {Object} params
 * @param {string} params.to - recipient email
 * @param {string} params.studentName - student name
 * @param {string} params.studentSchool - student school
 * @param {string} params.text - plain text message
 * @param {string} [params.html] - optional HTML message
 */
const sendMail = async ({ to, studentName, studentSchool, text, html }) => {
  try {
    const subject = `Alert: ${studentName} from ${studentSchool} requires attention`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent successfully to', to);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

module.exports = sendMail;
