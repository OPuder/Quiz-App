const cron = require('node-cron');
const User = require('../models/userModel');

function startUnbanCronjob() {
  cron.schedule('*/15 * * * *', async () => {
    console.log('Cron: Unban check gestartet');

    const now = new Date();
    const result = await User.updateMany(
      { 'banned.isBanned': true, 'banned.until': { $lte: now } },
      { $set: { 'banned.isBanned': false, 'banned.reason': '', 'banned.until': null } }
    );

    console.log(`✅ ${result.modifiedCount} User automatisch entbannt`);
  });
}

module.exports = startUnbanCronjob;