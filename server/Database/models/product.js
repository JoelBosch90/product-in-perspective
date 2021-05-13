/**
 *  This file configures the database schema for the Product entity.
 */

// Import dependencies.
const mongoose = require('mongoose');

// Create a new schema for the Product entity.
const modelSchema = new mongoose.Schema({

    // Users recognize their products by their name. These names should be
    // unique per model, but does not need to be unique across all products.
    name: {
      type:     String,
      required: true,
    },

    // Every product should be identified by a single barcode. It should be
    // unique per model, but does not need to be unique across all products.
    barcode: {
      type:     Number,
      ref:      'Model',
      required: true,
    },

    // Every product should be connected to a single model.
    model: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Model',
      required: true,
    },

    // Every product should also be connected to a single user.
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
  },

  // Keep timestamps for when each product is created and modified.
  { timestamps: true },
);

// Use the new schema for the product entity.
const Product = mongoose.model('Product', modelSchema);

// Make the new entity available in the database.
module.exports = Product;