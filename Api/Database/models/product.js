/**
 *  This file configures the database schema for the Product entity.
 */

// Import dependencies.
const mongoose = require('mongoose');

// Create a new schema for the Product entity.
const productSchema = new mongoose.Schema({

    // Users recognize their products by their name. These names should be
    // unique per model, but does not need to be unique across all products.
    name: {
      type:     String,
      required: [true, "Every product requires a name."],
    },

    // Every product should be identified by a single barcode. It should be
    // unique per model, but does not need to be unique across all products.
    barcode: {
      type:     Number,
      ref:      'Model',
      min:      [0, "This barcode is invalid."],
      required: [true, "Every product requires a barcode."],
    },

    // Every product should be connected to a single app.
    app: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'App',
      required: [true, "Every product requires an app."],
    },

    // Every product should be connected to a one or more models.
    models: [{
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Model',
      required: [true, "Every product requires a model."],
    }],

    // Every product should also be connected to a single user.
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, "Every product requires a user."],
    },
  },

  // Keep timestamps for when each product is created and modified.
  { timestamps: true },
);

// Product names should be unique per user.
productSchema.index({ name: 1, user: 1 }, {
  unique: [true, "A product with this name already exists."]
});

// Product barcodes should be unique per app.
productSchema.index({ barcode: 1, app: 1 }, { unique: [true,
  "This app already has a product with this barcode."]
});

// Use the new schema for the product entity.
const Product = mongoose.model('Product', productSchema);

// Make the new entity available in the database.
module.exports = Product;
