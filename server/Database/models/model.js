/**
 *  This file configures the database schema for the Model entity.
 */

// Import dependencies.
const mongoose = require('mongoose');

// Create a new schema for the Model entity.
const modelSchema = new mongoose.Schema({

    // Users recognize their models by their name. These names should be unique
    // per app, but do not need to be unique across all models.
    name: {
      type:     String,
      required: true,
    },

    // Every model should be connected to a single app.
    app: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'App',
    }
  },

  // Keep timestamps for when each Model is created and modified.
  { timestamps: true },
);

// We want to make sure that when a model is removed, all related entities are
// also removed.
modelSchema.pre('remove', next => {

  // Remove all product entities the user created for this model.
  this.model('Product').deleteMany({ model: this._id }, next);
})

// Use the new schema for the model entity.
const Model = mongoose.model('Model', modelSchema);

// Make the new entity available in the database.
module.exports = Model;
