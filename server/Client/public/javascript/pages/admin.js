/**
 *  Main file for the augmented reality admin interface. This is the master file
 *  that arranges routing for the login and the different form pages.
 */
// Import dependencies.
import { Login } from "/javascript/components/Login.js";
import { Registration } from "/javascript/components/Registration.js";
import { PasswordChanger } from "/javascript/components/PasswordChanger.js";
import { AppCreator } from "/javascript/components/AppCreator.js";
import { ModelCreator } from "/javascript/components/ModelCreator.js";
import { ProductCreator } from "/javascript/components/ProductCreator.js";
import { AppOverview } from "/javascript/components/AppOverview.js";
/**
 *  This is the container for the entire application. Because we want to use the
 *  full page, we can simply use the document's body element.
 *  @var      {Element}
 */

const container = document.body; // Test form components.
// new Login(container);
// const registration = new Registration(container);
// registration.on("navigate", console.log);
// new PasswordChanger(container);

const appCreator = new AppCreator(container);
appCreator.on("navigate", console.log); // const modelCreator = new ModelCreator(container);
// modelCreator.on("navigate", console.log);
// const productCreator = new ProductCreator(container);
// productCreator.on("navigate", console.log);
// Test overview components.

new AppOverview(container);