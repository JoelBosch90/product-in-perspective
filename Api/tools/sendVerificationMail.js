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
module.exports = sendVerificationMail = async user => {

  // Use a concise and descriptive title to communicate this email's goal.
  const title = "Verify your email address";

  // Set the email's body text.
  const body = `Visit this link to verify your email address and log in to ${process.env.DOMAIN} within the next hour.`

  // Get the login link.
  const link = loginLink(user);

  // Button text for the HTML version.
  const button = "Log in";

  // Construct an HTML template with similar texts and the same link.
  const html = await htmlTemplate({
    title, body, button, link
  });

  // Send the email with the new token.
  return sendMail({

    // Send from the common email domain.
    from:     `noreply@${process.env.DOMAIN}`,

    // Send to the user's email address.
    to:       user.email,

    // We can use the title as the subject line as well.
    subject:  title,

    // Supply users with the link to login immediately.
    text:     `${title}\n\n${body}\n${link}`,

    // Make use to include the HTML template.
    html,
  });
}