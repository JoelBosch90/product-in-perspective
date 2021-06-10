/**
 *  Main file for the augmented reality admin interface. This is the master file
 *  that arranges routing for the login and the different form pages.
 */
// Import dependencies.
import { Menu } from "/javascript/widgets/Menu.js";
import { View } from "/javascript/widgets/View.js";
import { Router } from "/javascript/tools/Router.js";
import { Apology } from "/javascript/widgets/Apology.js"; // Import components.

import { Login } from "/javascript/components/Login.js";
import { Logout } from "/javascript/components/Logout.js";
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
 *  Create a new menu to help admin users navigate.
 *  @var    {Menu}
 */

const menu = new Menu(container, {
  // Show the menu only on the admin pages.
  pages: ['/admin'],
  // Wen want to help the user easily navigate to all overviews, and to the
  // profile page to edit his account information.
  navigation: new Map([['Apps', '/admin/apps'], ['Products', '/admin/products'], ['Models', '/admin/models'], ['Profile', '/admin/profile'], ['Log out', '/logout']]),
  // Add quick shortcuts to allow the users to quickly create new objects.
  shortcuts: new Map([['Add app', '/admin/app/new'], ['Add product', '/admin/product/new'], ['Add model', '/admin/model/new']])
});
/**
 *  Create a new View instance to show components. The View will automatically
 *  clean up previously installed components if we install a new one so that we
 *  always have one active.
 *  @var      {View}
 */

const view = new View(container, {
  // We want to limit the amount of components we cache to limit memory usage,
  // but we do want to cache some components to limit the number of requests
  // that are made and the amount of Javascript computation that needs to be
  // done.
  cacheSize: 15,
  // By default, we want to install an apology that indicates that we're loading
  // the next component through the router.
  Widget: Apology,
  params: ["Loading..."] // Listen for any unrecoverable errors and show the message to the user.

}).on("error", error => void view.install(Apology, error));
/**
 *  Create a new Router instance. The Router will listen for any changes to the
 *  URL, whether manually by the user, or programmatically with the goTo()
 *  function. It will communicate those changes via the "navigate" event.
 *  @var      {Router}
 */

const router = new Router(new Map([// This route will serve all apps.
['/app/:appPath', App], // These routes will serve the admin interface.
['/', Login], ['/login', Login], ['/logout', Logout], ['/register', Registration], ['/admin', AppList], ['/admin/apps', AppList], ['/admin/app/new', AppForm], ['/admin/app/:appId', AppForm], ['/admin/models', ModelList], ['/admin/model/new', ModelForm], ['/admin/model/:modelId', ModelForm], ['/admin/products', ProductList], ['/admin/product/new', ProductForm], ['/admin/product/:productId', ProductForm], ['/admin/profile', PasswordForm]]), {
  // Protect the admin routes.
  protected: ['/admin']
}) // Make sure that we pass on any navigation requests to the View widget.
.on("navigate", page => void view.install(page.component, page.options)) // Show an apology if the route could not be found.
.on("not-found", () => void view.install(Apology, "This page could not be found.")) // Show an apology if the user is trying to access a protected route they are
// not allowed to access.
.on("not-allowed", () => void view.install(Apology, "You are not allowed to view this page.")) // Make sure we initially honor the current URL request.
.navigateToCurrent();