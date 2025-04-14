const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  vorname: { type: String, required: true },
  nachname: { type: String, required: true },
  spitzname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  securityQuestion: { type: String, required: true },
  securityAnswer: { type: String, required: true },
  geloescht: { type: Boolean, default: false },
  banned: {
    isBanned: { type: Boolean, default: false },
    reason: { type: String, default: '' },
    until: { type: Date, default: null }
  },
}, {
  versionKey: false,
  strict: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
