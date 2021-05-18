// Import dependencies
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { goTo } from "/javascript/tools/goTo.js";

/**
 *  The definition of the Menu class that can be used to add a menu on top of
 *  another element.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class Menu extends BaseElement {

  /**
   *  We want to keep track of the pages on which we should display this menu.
   *  @var      {array}
   */
  _pages = null;

  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element to which the select
   *                                  will be added.
   *  @param    {object}    options   Optional parameters for the select that
   *                                  is added to the form.
   *    @property   {array}   pages       These are strings that indicate the
   *                                      start of the paths of all pages that
   *                                      display this menu.
   *    @property   {Map}     navigation  These are the navigation anchors that
   *                                      will be added to the menu.
   *    @property   {Map}     shortcuts   These are the shortcut anchors that
   *                                      will be added underneath the menu.
   */
  constructor(parent, options = {}) {

    // Construct the BaseElement first.
    super();

    // Create the container element.
    this._container = document.createElement("div");
    this._container.classList.add("menu");

    // Create a container for the fixed menu.
    const navigation = document.createElement("nav");
    navigation.classList.add("navigation");

    // Create a container for the shortcut menu.
    const shortcuts = document.createElement("div");
    shortcuts.classList.add("shortcuts");

    // Store the pages.
    this._pages = options.pages;

    // Add the menu anchors to the right parts of the menu.
    this._addAnchor(navigation, options.navigation);
    this._addAnchor(shortcuts, options.shortcuts);

    // Start listening for URL changes.
    window.addEventListener('popstate', this._processPathChange);

    // Process the initital path.
    this._processPathChange();

    // App both menu components to the container.
    this._container.appendChild(navigation);
    this._container.appendChild(shortcuts);

    // Add both containers to the top of the parent element.
    parent.prepend(this._container);
  }

  /**
   *  Method to process changes to the URL to reconsider if this menu should be
   *  shown or not.
   *  @param    {Event}     event       The default event object.
   *  @returns  {Menu}
   */
  _processPathChange = event => {

    // Get the current path name.
    const currentPath = window.location.pathname;

    // Loop through all stored pages.
    for (const page of this._pages) {

      // If the route starts with this page, we should show the menu.
      if (currentPath.startsWith(page)) return this.show();
    }

    // If not, we should hide.
    return this.hide();
  }

  /**
   *  Private method to add anchors to a container.
   *  @param  {Element}     parent      Container to which to add the anchors.
   *  @param  {Map}         entries     Map of anchor text, to navigation
   *                                    location for the anchors to add.
   */
  _addAnchor = (parent, entries) => {

    // Loop through the navigation anchors.
    for (const [text, location] of entries) {

      // Create the anchor.
      const anchor = document.createElement("a");

      // Make the anchor tag look like a button.
      anchor.classList.add("button");

      // Add the text.
      anchor.textContent = text;

      // Navigate to the right page when this anchor is clicked.
      anchor.addEventListener("click", () => void goTo(location));

      // Add the anchor to the navigation menu.
      parent.append(anchor);
    }
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Stop listening for URL changes.
    window.removeEventListener('popstate', this._processPathChange);

    // Call the BaseElement remove method that will remove the container.
    super.remove();
  }
}

// Export the Menu class so it can be imported elsewhere.
export { Menu };
