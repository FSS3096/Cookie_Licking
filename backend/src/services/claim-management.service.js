const cron = require('node-cron');
const Claim = require('../models/claim.model');

// Run checks every hour
const initializeClaimManagement = () => {
  // Check for stale claims and send nudges
  cron.schedule('0 * * * *', async () => {
    try {
      const activeClaims = await Claim.find({ status: 'active' })
        .populate('claimedBy', 'email name');

      for (const claim of activeClaims) {
        // Check if claim needs a nudge
        if (claim.needsNudge()) {
          // Update nudge information
          claim.nudgeCount += 1;
          claim.lastNudgeDate = new Date();
          await claim.save();

          // Here you would implement sending email notifications
          console.log(`Sending nudge for claim ${claim._id} to ${claim.claimedBy.email}`);
        }

        // Check if claim is stale and should be auto-released
        if (claim.isStale()) {
          claim.status = 'released';
          claim.releaseDate = new Date();
          claim.notes = 'Automatically released due to inactivity';
          await claim.save();

          // Here you would implement sending email notifications
          console.log(`Auto-releasing stale claim ${claim._id}`);
        }
      }
    } catch (error) {
      console.error('Error in claim management cron job:', error);
    }
  });
};

module.exports = {
  initializeClaimManagement
};