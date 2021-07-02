// Import dependencies.
const fs = require('fs').promises;

/**
 *  Helper function that constructs an HTML template with the given variables.
 *  @param    {Object}          variables       An object mapping variables that
 *                                              are passed to the HTML template.
 *  @returns  {Promise}
 */
module.exports = htmlTemplate = async variables => {

  // Use the content variable as a default for the preheader.
  const templateVariables = {...{ preheader: variables['body'] }, ...variables};

  // Get the transactional HTML template.
  let template = await fs.readFile("/api/templates/transactional.html", "utf8");

  // Loop through all variables we need to replace.
  for (const [key, value] of Object.entries(templateVariables)) {

    // Replace the placeholders with their new text.
    template = template.replaceAll(new RegExp(`{{${key}}}`, 'gi'), value);
  }

  // Return the filled in template.
  return template;
}