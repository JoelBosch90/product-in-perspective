// Import dependecies.
const mailer = require('nodemailer');
require('dotenv').config();

/**
 *  Helper function that sends an email.
 *  @returns  {Promise}
 */
module.exports = sendMail = async message => {

  // Create the transport object.
  const transport = mailer.createTransport({

    // Temporarily using mailtrap.io for testing.
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Send the email and return the promise.
  return transport.sendMail(message);
}