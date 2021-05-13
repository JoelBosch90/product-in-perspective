/**
 *  Main file for the augmented reality admin interface. This is the master file
 *  that arranges routing for the login and the different form pages.
 */
// Import dependencies.
import { View } from "/javascript/widgets/View.js";
import { Login } from "/javascript/components/Login.js";
import { Registration } from "/javascript/components/Registration.js";
import { PasswordForm } from "/javascript/components/PasswordForm.js";
import { AppForm } from "/javascript/components/AppForm.js";
import { ModelForm } from "/javascript/components/ModelForm.js";
import { ProductForm } from "/javascript/components/ProductForm.js";
import { AppList } from "/javascript/components/AppList.js";
/**
 *  This is the container for the entire application. Because we want to use the
 *  full page, we can simply use the document's body element.
 *  @var      {Element}
 */

const container = document.body; // Test form components.
// new Login(container);
// const registration = new Registration(container);
// registration.on("navigate", console.log);
// new PasswordForm(container);
// const appCreator = new AppCreator(container);
// appCreator.on("navigate", console.log);
// const modelForm = new ModelForm(container);
// modelForm.on("navigate", console.log);
// const productForm = new ProductForm(container);
// productForm.on("navigate", console.log);
// Test overview components.
// new AppList(container);

const view = new View(container);
view.install(AppForm);
view.install(AppList);
view.on("navigate", console.log);