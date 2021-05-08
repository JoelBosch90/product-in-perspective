// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Overview } from "/javascript/widgets/Overview.js";

/**
 *  The definition of the AppOverview class component that can be used to load
 *  overview of created apps.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class AppOverview extends BaseElement {

  /**
   *  Private variable that stores a reference to the container element in the
   *  DOM.
   *  @var      {Element}
   */
  _container = null;

  /**
   *  Private variable that stores a reference to the Overview element.
   *  @var      {Overview}
   */
  _overview = null;

  /**
   *  Class constructor.
   *  @param    {Element}   parent      Container to which this component will
   *                                    be added.
   *  @param    {array}     options
   */
  constructor(parent, options = {}) {

    // Call the base class constructor first.
    super();

    // Create a container for this component.
    this._container = document.createElement("div");

    // Create a app overview.
    this._overview = new Overview(this._container, {
      title: "Overview",
      center: true,
      cards: [
        {
          id:           1,
          title:        "AppName1",
          description:  "AppDescription1",
          removable:    true,
          editable:     true,
          viewable:     true,
        },
        {
          id:           2,
          title:        "AppName2",
          description:  "AppDescription2",
          removable:    true,
          editable:     true,
          viewable:     true,
        },
        {
          id:           3,
          title:        "AppName3",
          description:  "AppDescription3",
          removable:    true,
          editable:     true,
          viewable:     true,
        },
        {
          id:           4,
          title:        "AppName4",
          description:  "AppDescription4",
          removable:    true,
          editable:     true,
          viewable:     true,
        },
        {
          id:           5,
          title:        "AppName5",
          description:  "AppDescription5",
          removable:    true,
          editable:     true,
          viewable:     true,
        },
        {
          id:           6,
          title:        "AppName6",
          description:  "AppDescription6",
          removable:    true,
          editable:     true,
          viewable:     true,
        },
        {
          id:           7,
          title:        "AppName7",
          description:  "AppDescription7",
          removable:    true,
          editable:     true,
          viewable:     true,
        },
      ],
    });

    this._overview.on('remove', console.log);
    this._overview.on('edit', console.log);
    this._overview.on('view', console.log);

    // Add the new element to the parent container.
    parent.appendChild(this._container);
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Remove the Overview element.
    this._overview.remove();

    // Call the BaseElement's remove function.
    super.remove();
  }
}

// Export the AppOverview class so it can be imported elsewhere.
export { AppOverview };
