const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The Name feild cannot be empty"],
  },
  email: {
    type: String,
    required: [true, "Email field cannot be empty"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"], //3rd party validator
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //custom validator (only works on save() and create())
      validator: function (el) {
        return el === this.password;
      },
      message: "Please enter matching passwords",
    },
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//instance method (works on all User documents across our app)
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  //create random token
  const resetToken = crypto.randomBytes(32).toString("hex");
  //encrypt the token with built-in node module (crypto)
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //expires 10 min after creation. converted to seconds(* 60) then to miliseconds(* 1000)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  //return unencrypted token
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
