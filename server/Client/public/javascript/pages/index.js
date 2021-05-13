/**
 *  Main file for the augmented reality admin interface. This is the master file
 *  that arranges routing for the login and the different form pages.
 */
// Import dependencies.
import { Router } from "/javascript/tools/Router.js";
import { View } from "/javascript/widgets/View.js";
import { Apology } from "/javascript/widgets/Apology.js";
import { Login } from "/javascript/components/Login.js";
import { Registration } from "/javascript/components/Registration.js";
import { PasswordForm } from "/javascript/components/PasswordForm.js";
import { AppForm } from "/javascript/components/AppForm.js";
import { ModelForm } from "/javascript/components/ModelForm.js";
import { ProductForm } from "/javascript/components/ProductForm.js";
import { AppList } from "/javascript/components/AppList.js";
import { goTo } from "/javascript/tools/goTo.js";
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

/**
 *  Create a new View instance. The View will automatically clean up previously
 *  installed components if we install a new one so that we always have one
 *  active.
 *  @var      {View}
 */

const view = new View(container);
/**
 *  Create a new Router instance. The Router will listen for any changes to the
 *  URL, whether manually by the user, or programmatically with the goTo()
 *  function. It will communicate those changes via the "navigate" event.
 *  @var      {Router}
 */

const router = new Router(new Map([// This route will serve all apps.
['/app/:appPath', AppForm], // These pages serve the admin interface.
['/admin', Login], ['/admin/new', Registration], ['/admin/profile', PasswordForm], ['/admin/app', AppList], ['/admin/app/new', AppForm], ['/admin/app/:appId', AppForm], ['/admin/model', ModelForm], ['/admin/model/new', ModelForm], ['/admin/model/:modelId', ModelForm], ['/admin/product', ProductForm], ['/admin/product/new', ProductForm], ['/admin/product/:productId', ProductForm]])) // Make sure that we pass on any navigation requests to the View widget.
// .on("navigate", page => void view.install(page.widget, page.options))
.on("navigate", page => {
  console.log(page);
  view.install(page.widget, page.options);
}) // Show an apology if the route could not be found.
.on("not-found", () => void view.install(Apology, "This page could not be found.")) // Make sure we initially honor the current URL request.
.navigateToCurrent();