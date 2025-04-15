const User = require('../models/User');

exports.checkUnbansOnStart = async () => {
  try {
    const users = await User.find({ 'banned.isBanned': true });

    let unbannedCount = 0;

    for (const user of users) {
      if (
        user.banned.until &&
        new Date(user.banned.until) < new Date()
      ) {
        user.banned.isBanned = false;
        user.banned.reason = '';
        user.banned.until = null;
        await user.save();
        unbannedCount++;
        console.log(`Auto-Unban beim Start: ${user._id}`);
      }
    }

    console.log(`${unbannedCount} User automatisch entbannt beim Serverstart.`);
  } catch (err) {
    console.error('Fehler beim Auto-Unban beim Start:', err);
  }
};