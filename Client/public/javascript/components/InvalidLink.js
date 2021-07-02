// Import dependencies.
import { Apology } from "../widgets/Apology.js";
/**
 *  The definition of the InvalidLink class component that simply tells a user
 *  that they used an invalid link.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class InvalidLink extends Apology {
  /**
   *  Class constructor.
   *  @param    {Element}   parent      Container to which this component will
   *                                    be added.
   */
  constructor(parent) {
    // Call the base class constructor first.
    super(parent, {
      title: "This link is invalid.",
      text: "Note that login links always expire in one hour.",
      link: {
        text: 'Get a new link',
        location: '/login/link'
      }
    });
  }

} // Export the InvalidLink class so it can be imported elsewhere.


export { InvalidLink };