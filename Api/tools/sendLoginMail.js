// Import dependencies.
const sendMail = require('./sendMail');
const loginLink = require('./loginLink');
require('dotenv').config();

/**
 *  Helper function that sends an email with a link to verify a user's email
 *  address and login immediately.
 *  @param    {Object}          user      The user to authorize.
 *  @returns  {Promise}
 */
module.exports = sendLoginMail = async user => {

  // Send the email with the new token.
  return sendMail({

    // Send from the common email domain.
    from:     `vertification@${process.env.EMAIL_DOMAIN}`,

    // Send to the user's email address.
    to:       user.email,

    // Use a concise and descriptive subject to communicate this email's goal.
    subject:  "Verify your email address",

    // Supply users with the link to login immediately.
    text:     `Visit this link to log in: ${loginLink(user)}`,
  });
}