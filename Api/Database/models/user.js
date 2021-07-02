/**
 *  This file configures the database schema for the User entity.
 */

// Import dependencies.
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

// Create a new schema for the User entity.
const userSchema = new mongoose.Schema({

    // Users are identified by their email address. Thus every user needs one
    // and it should unique across all users.
    email: {
      type:       String,
      unique:     true,
      lowercase:  [true, "Your email address cannot contain upper case characters."],
      required:   [true, "An email address is required."],
    },

    // Users should be able to authenticate with their password. Thus every user
    // needs a password.
    password: {
      type:       String,
      required:   [true, "A password is required."],
    },

    // We need to remember when a user was last verified.
    verified: {
      type:       Date,
    }
  },

  // Keep timestamps for when each User is created and modified.
  { timestamps: true },
);

/**
 *  Install an extra method for checking the user password.
 *  @param    {string}    password    The raw password to be checked.
 *  @returns  {Promise}
 */
userSchema.methods.checkPassword = function(password) {
  return new Promise((resolve, reject) => {

    // Check if the provided password matches the hash that is stored in the
    // database.
    bcrypt.compare(password, this.password, (error, isMatch) => {

      // On error, reject the promise.
      if (error) return reject(error);

      // Otherwise, resolve into whether or not the password matches.
      resolve(isMatch);
    });
  });
}

/**
 *  Helper function to check for a valid password. Returns an error, or false to
 *  indicate success.
 *  @param    {Object}    user    The user to check the password for.
 *  @returns  {Promise}
 */
passwordFlawed = user => {
  return new Promise((resolve, reject) => {

    // If the password wasn't modified, we don't need to check anything.
    if (!user.isModified("password")) return resolve(false);

    // Check password length.
    if (user.password.length < 8) return reject(new Error("The password should be at least 8 characters."));

    // The higher the number of salt rounds, the harder it will be to brute
    // force a password, but a higher number of salt rounds also require more
    // computation for the hashing function, so we don't want a number that is
    // too high or too low. 10 is the default for bcryptjs.
    const saltRounds = 10;

    // First generate the salt.
    return bcrypt.genSalt(saltRounds, (saltError, salt) => {

      // Return the error if creating the salt failed.
      if (saltError) return reject(saltError);

      // Generate the hash using the salt and the password.
      bcrypt.hash(user.password, salt, (hashError, hash) => {

        // Return the error if creating the hash failed.
        if (hashError) return reject(hashError);

        // Otherwise, store the hashed password instead.
        user.password = hash;

        // Proceed to the next step.
        return resolve(false);
      });
    });
  });
}

// We want to do some preprocessing before saving a new user in the database.
userSchema.pre('save', async function(next) {

  // Get access to the user.
  const user = this;

  // Check the password.
  const passwordError = await passwordFlawed(user);

  // If we had a password error, we should propagate it.
  if (passwordError) return next(passwordError);

  // If we got here, not errors occurred and we can proceed.
  return next();
});

// We want to make sure that when a user is removed, all related entities are
// also removed.
userSchema.pre('remove', function(next) {

  // Remove all app entities this user created.
  this.model('App').deleteMany({ user: this._id }, next);
})

// Use the new schema for the user entity.
const User = mongoose.model('User', userSchema);

// Make the new entity available in the database.
module.exports = User;
