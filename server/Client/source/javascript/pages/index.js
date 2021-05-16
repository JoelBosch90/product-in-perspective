/**
 *  Main file for the augmented reality admin interface. This is the master file
 *  that arranges routing for the login and the different form pages.
 */

// Import dependencies.
import { Router } from "/javascript/tools/Router.js";
import { View } from "/javascript/widgets/View.js";
import { Apology } from "/javascript/widgets/Apology.js";

// Import components.
import { Login } from "/javascript/components/Login.js";
import { Registration } from "/javascript/components/Registration.js";
import { PasswordForm } from "/javascript/components/PasswordForm.js";
import { App } from "/javascript/components/App.js";
import { AppList } from "/javascript/components/AppList.js";
import { AppForm } from "/javascript/components/AppForm.js";
import { ModelList } from "/javascript/components/ModelList.js";
import { ModelForm } from "/javascript/components/ModelForm.js";
import { ProductList } from "/javascript/components/ProductList.js";
import { ProductForm } from "/javascript/components/ProductForm.js";

/**
 *  This is the container for the entire application. Because we want to use the
 *  full page, we can simply use the document's body element.
 *  @var      {Element}
 */
const container = document.body;

/**
 *  Create a new View instance. The View will automatically clean up previously
 *  installed components if we install a new one so that we always have one
 *  active.
 *  @var      {View}
 */
const view = new View(container, {
  cacheSize:  1,
  Widget:     Apology,
  params:     ["Loading..."],

// Listen for any unrecoverable errors and show the message to the user.
}).on("error", error => void view.install(Apology, error));

/**
 *  Create a new Router instance. The Router will listen for any changes to the
 *  URL, whether manually by the user, or programmatically with the goTo()
 *  function. It will communicate those changes via the "navigate" event.
 *  @var      {Router}
 */
const router = new Router(new Map([

  // This route will serve all apps.
  ['/app/:appPath', App],

  // These routes will serve the admin interface.
  ['/login', Login],
  ['/register', Registration],
  ['/admin/profile', PasswordForm],
  ['/admin/app', AppList],
  ['/admin/app/new', AppForm],
  ['/admin/app/:appId', AppForm],
  ['/admin/model', ModelList],
  ['/admin/model/new', ModelForm],
  ['/admin/model/:modelId', ModelForm],
  ['/admin/product', ProductList],
  ['/admin/product/new', ProductForm],
  ['/admin/product/:productId', ProductForm],
]), {

  // Protect the admin routes.
  protected: ['/admin'],
})

  // Make sure that we pass on any navigation requests to the View widget.
  .on("navigate", page => void view.install(page.component, page.options))

  // Show an apology if the route could not be found.
  .on("not-found", () => void view.install(Apology, "This page could not be found."))

  // Show an apology if the user is trying to access a protected route they are
  // not allowed to access.
  .on("not-allowed", () => void view.install(Apology, "You are not allowed to view this page."))

  // Make sure we initially honor the current URL request.
  .navigateToCurrent();
