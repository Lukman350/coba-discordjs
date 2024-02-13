const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    nim: {
      type: String,
      required: true,
      unique: true,
    },
    jurusan: {
      type: String,
      required: true,
    },
    discordId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);
// User.ensureIndexes();

module.exports = User;
