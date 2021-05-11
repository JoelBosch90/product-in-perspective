/**
 *  This file configures the database schema for the Product entity.
 */

// Import dependencies.
const mongoose = require('mongoose');

// Create a new schema for the Product entity.
const modelSchema = new mongoose.Schema({

    // Users recognize their products by their name. These names should be
    // unique per model, but do not need to be unique across all products.
    name: {
      type:     String,
      required: true,
    },

    // Every product should be connected to a single model.
    model: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Model',
    }
  },

  // Keep timestamps for when each product is created and modified.
  { timestamps: true },
);

// Use the new schema for the product entity.
const Product = mongoose.model('Product', modelSchema);

// Make the new entity available in the database.
module.exports = Product;
