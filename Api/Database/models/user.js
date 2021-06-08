/**
 *  This file configures the database schema for the User entity.
 */

// Import dependencies.
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Create a new schema for the User entity.
const userSchema = new mongoose.Schema({

    // Users are identified by their email address. Thus every user needs one
    // and it should unique across all users.
    email: {
      type:       String,
      unique:     [true, "An account for this email address already exists"],
      lowercase:  [true, "Your email address cannot contain upper case characters"],
      required:   [true, "Every user requires an email address."],
    },

    // Users should be able to authenticate with their password. Thus every user
    // needs a password.
    password: {
      type:       String,
      required:   [true, "Every user requires a password."],
    }
  },

  // Keep timestamps for when each User is created and modified.
  { timestamps: true },
);

// Install an extra method for checking the user password.
userSchema.methods.checkPassword = function(password, callback) {

  // Check if the provided password matches the hash that is stored in the
  // database.
  bcrypt.compare(password, this.password, (error, isMatch) => {

    // On error, pass the error into the callback.
    if (error) return callback(error);

    // Otherwise, pass no error and provide whether or not the password matches.
    callback(null, isMatch);
  });
}

// Install an extra method for creating a JSON web token.
userSchema.methods.createToken = function() {

  // Create a new JWT for authentication.
  return jwt.sign({ id: this._id }, process.env.DATABASE_TOKEN_SECRET, {

    // Let each token expire in 24 hours.
    expiresIn: 86400,
  });
}

// We want to do some preprocessing before saving a new user in the database.
userSchema.pre('save', function(next) {

  // Get access to the user.
  const user = this;

  // Every time a password is being saved, we want to make sure that it is
  // properly hashed.
  if (!this.isModified("password")) return next();

  // The higher the number of salt rounds, the harder it will be to brute
  // force a password, but a higher number of salt rounds also require more
  // computation for the hashing function, so we don't want a number that is
  // too high or too low. 10 is the default for bcryptjs.
  const saltRounds = 10;

  // First generate the salt.
  bcrypt.genSalt(saltRounds, (saltError, salt) => {

    // Return the error if creating the salt failed.
    if (saltError) return next(saltError);

    // Generate the hash using the salt and the password.
    bcrypt.hash(user.password, salt, (hashError, hash) => {

      // Return the error if creating the hash failed.
      if (hashError) return next(hashError);

      // Otherwise, store the hashed password instead.
      user.password = hash;

      // Proceed to the next step.
      return next();
    })
  });
});

// We want to make sure that when a user is removed, all related entities are
// also removed.
userSchema.pre('remove', function(next) {

  // Remove all app entities this user created.
  this.model('App').deleteMany({ user: this._id }, next);
})

// User the new schema for the user entity.
const User = mongoose.model('User', userSchema);

// Make the new entity available in the database.
module.exports = User;
