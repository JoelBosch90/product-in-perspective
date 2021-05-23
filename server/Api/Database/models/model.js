/**
 *  This file configures the database schema for the Model entity.
 */

// Import dependencies.
const mongoose = require('mongoose');

// Create a new schema for the Model entity.
const modelSchema = new mongoose.Schema({

    // Users recognize their models by their name. These names should be unique
    // per user, but do not need to be unique across all models.
    name: {
      type: String,
      required: [true, "Every model requires a name."],
    },

    // Every model should be connected to a single user.
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, "Every model requires a user."],
    },
  },

  // Keep timestamps for when each Model is created and modified.
  { timestamps: true },
);

// Model names should be unique per user.
modelSchema.index({ name: 1, user: 1 }, {
  unique: [true, "A model with this name already exists."]
});

// When the model is removed from the database, we should also remove the file
// from object storage.
modelSchema.pre('remove', next => {

  // If we have a new file to store, remove the previous one from object
  // storage.
  storage.delete(this._id);

  // Continue removing the model.
  next();
});

// Use the new schema for the model entity.
const Model = mongoose.model('Model', modelSchema);

// Make the new entity available in the database.
module.exports = Model;
