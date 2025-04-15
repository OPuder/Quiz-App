const User = require('../models/userModel');

async function banUserTemporarily(userId, reason, durationMinutes = 10) {
  const until = new Date(Date.now() + durationMinutes * 60 * 1000);
  await User.findByIdAndUpdate(userId, {
    banned: {
      isBanned: true,
      reason,
      until
    }
  });
}

module.exports = { banUserTemporarily };