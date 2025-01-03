const nodemailer = require('nodemailer');

/*

1. Create a transporter - service 
2. Define the email options
3. Actually send the email

*/

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Sathiya Priyan <noreply@yourcompany.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    console.log('Sending email...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (err) {
    console.log('Email sending failed:', err);
    throw new Error('There was an error sending the email. Try again later.');
  }
};

module.exports = sendEmail;

/*

const sendEmail = async (options) => {
  // Create a transporter - service

  const transporter = nodemailer.createTransport({
    // You can use any service SendGrid and Mail-gun , Gmail - Activate in gmail "less secure app" option
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define the email options

  const mailOptions = {
    from: 'Sathiya Priyan <noreply@yourcompany.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send the mail

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

*/
