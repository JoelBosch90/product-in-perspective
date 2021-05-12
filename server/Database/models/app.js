/**
 *  This file configures the database schema for the App entity.
 */

// Import dependencies.
const mongoose = require('mongoose');

// Create a new schema for the App entity.
const appSchema = new mongoose.Schema({

    // Users recognize their apps by their name. These names should be unique
    // per user, but do not need to be unique across all apps.
    name: { type:  String, required: true, },

    // The user can optionally describe the app. This is currently only visible
    // for the user.
    description: { type: String, required: false, },

    // The slug determines the location of where this app will be hosted.
    slug: { type: String, required: true, },

    // The user can determine the texts of the title, description and button
    // while the user is scanning a product.
    "scanning-title": { type: String, required: true, },
    "scanning-description": { type: String, required: false, },
    "scanning-button": { type: String, required: true, },

    // The user can determine the texts of the title, description and button
    // while the user is trying to find a flat surface to place the 3D model.
    "placing-title": { type: String, required: true, },
    "placing-description": { type: String, required: false, },
    "placing-button": { type: String, required: true, },

    // The user can determine the texts of the title, description and button
    // while the user is viewing the 3D model.
    "viewing-title": { type: String, required: true, },
    "viewing-description": { type: String, required: false, },
    "viewing-button": { type: String, required: true, },

    // Every app should be connected to a single user.
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    }
  },

  // Keep timestamps for when each App is created and modified.
  { timestamps: true },
);

// We want to make sure that when an app is removed, all related entities are
// also removed.
appSchema.pre('remove', next => {

  // Remove all model entities the user created for this app.
  this.model('Model').deleteMany({ app: this._id }, next);
})

// Use the new schema for the app entity.
const App = mongoose.model('App', appSchema);

// Make the new entity available in the database.
module.exports = App;
