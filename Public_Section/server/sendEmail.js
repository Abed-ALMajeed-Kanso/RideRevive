require("dotenv").config();
const nodemailer = require('nodemailer');

async function sendEmail(to, subject, htmlContent) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
      user: process.env.Email, 
      pass: process.env.Secret_key, 
    },
  });

  let info = await transporter.sendMail({
    from: 'You <' + process.env.Email + '>', 
    to: to, 
    subject: subject, 
    html: htmlContent, 
  });

  console.log(`Message sent: ${info.messageId}`);
}

module.exports = sendEmail;
