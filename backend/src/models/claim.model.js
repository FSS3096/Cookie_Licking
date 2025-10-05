const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  repository: {
    owner: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    url: String
  },
  issue: {
    number: {
      type: Number,
      required: true
    },
    title: String,
    url: {
      type: String,
      required: true
    }
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned', 'released'],
    default: 'active'
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  nudgeCount: {
    type: Number,
    default: 0
  },
  lastNudgeDate: Date,
  releaseDate: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for querying claims by repository and issue
claimSchema.index({ 'repository.owner': 1, 'repository.name': 1, 'issue.number': 1 });

// Index for finding inactive claims
claimSchema.index({ status: 1, lastActivityDate: 1 });

// Method to check if claim is stale
claimSchema.methods.isStale = function() {
  const daysInactive = Math.floor((Date.now() - this.lastActivityDate) / (1000 * 60 * 60 * 24));
  return daysInactive >= parseInt(process.env.CLAIM_EXPIRY_DAYS);
};

// Method to check if claim needs nudging
claimSchema.methods.needsNudge = function() {
  if (this.status !== 'active') return false;
  
  const lastNudge = this.lastNudgeDate || this.createdAt;
  const daysSinceNudge = Math.floor((Date.now() - lastNudge) / (1000 * 60 * 60 * 24));
  return daysSinceNudge >= parseInt(process.env.NUDGE_INTERVAL_DAYS);
};

const Claim = mongoose.model('Claim', claimSchema);

module.exports = Claim;