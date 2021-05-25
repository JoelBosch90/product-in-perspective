/**
 *  This file configures the database schema for the App entity.
 */

// Import dependencies.
const mongoose = require('mongoose');

// Create a new schema for the App entity.
const appSchema = new mongoose.Schema({

    // Users recognize their apps by their name. These names should be unique
    // per user, but do not need to be unique across all apps.
    name: {
      type: String,
      required: [true, "Every app requires a name."],
    },

    // The user can optionally describe the app. This is currently only visible
    // for the user.
    description: {
      type: String,
      required: false,
    },

    // The path determines the location of where this app will be hosted. It is
    // important that this is unique across the all apps.
    path: {
      type: String,
      required: [true, "Every app requires a path."],
      unique: [true, "An app with this path already exists."],
    },

    // For the augmented reality part, each app will feature an exit button.
    // This allows a user to change the text for this button.
    "exit-button": {
      type: String,
      required: [true, "Every app requires text for the exit button."],
      unique: false,
    },

    // The user can determine the texts of the title, description and button
    // while the user is scanning a product.
    "scanning-title": {
      type: String,
      required: false,
    },
    "scanning-description": {
      type: String,
      required: false,
    },
    "scanning-button": {
      type: String,
      required: [true, "Every app requires a button for scanning mode."],
    },

    // The user can determine the texts of the title, description and button
    // while the user is trying to find a flat surface to place the 3D model.
    "placing-title": {
      type: String,
      required: false,
    },
    "placing-description": {
      type: String,
      required: false,
    },
    "placing-button": {
      type: String,
      required: [true, "Every app requires a button for placing mode."],
    },

    // Every app should be connected to a single user.
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, "Every app requires a user."],
    }
  },

  // Keep timestamps for when each App is created and modified.
  { timestamps: true },
);

// App names should be unique per user.
appSchema.index({ name: 1, user: 1 }, {
  unique: [true, "An app with this name already exists."]
});

// We want to make sure that when an app is removed, all related products are
// also removed.
appSchema.pre('remove', next => {

  // Remove all model entities the user created for this app.
  this.model('Model').deleteMany({ app: this._id }, next);
});

// We also might want to find an app by it's path.
appSchema.statics.findByIdOrPath = async function(id) {

  // We're trying to find an app here.
  let app = null;

  // The first part could fail, since Mongoose might fail to cast the ID to an
  // ObjectId and fail if it is a path.
  try {

    // First, try to find the app by ID.
    app = await this.findOne({ _id: id });
  } finally {

    // If that doesn't work, try to find the app by path.
    if (!app) app = await this.findOne({ path: id });

    // Return the app that we managed to retrieve.
    return app;
  }
}

// Use the new schema for the app entity.
const App = mongoose.model('App', appSchema);

// Make the new entity available in the database.
module.exports = App;
