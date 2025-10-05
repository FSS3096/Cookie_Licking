const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const Claim = require('../models/claim.model');

// Middleware to verify authentication
router.use(verifyToken);

// Health check
router.get('/health', (req, res) => {
  res.json({ healthy: true });
});

// Get all claims for a repository
router.get('/repo/:owner/:name', async (req, res) => {
  try {
    const { owner, name } = req.params;
    const claims = await Claim.find({
      'repository.owner': owner,
      'repository.name': name
    }).populate('claimedBy', 'name email githubUsername');

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching claims', error: error.message });
  }
});

// Get claims for authenticated user
router.get('/my-claims', async (req, res) => {
  try {
    const claims = await Claim.find({
      claimedBy: req.user._id
    }).sort('-createdAt');

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching claims', error: error.message });
  }
});

// Create new claim
router.post('/', async (req, res) => {
  try {
    const { repository, issue } = req.body;

    // Check if issue is already claimed
    const existingClaim = await Claim.findOne({
      'repository.owner': repository.owner,
      'repository.name': repository.name,
      'issue.number': issue.number,
      status: 'active'
    });

    if (existingClaim) {
      return res.status(400).json({ message: 'Issue is already claimed' });
    }

    // Create new claim
    const claim = new Claim({
      repository,
      issue,
      claimedBy: req.user._id
    });

    await claim.save();
    await claim.populate('claimedBy', 'name email githubUsername');

    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ message: 'Error creating claim', error: error.message });
  }
});

// Update claim status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const claim = await Claim.findById(id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Check if user owns the claim or is a maintainer
    if (!claim.claimedBy.equals(req.user._id) && req.user.role !== 'maintainer') {
      return res.status(403).json({ message: 'Not authorized to update this claim' });
    }

    claim.status = status;
    if (notes) claim.notes = notes;
    claim.lastActivityDate = new Date();
    
    if (status === 'released') {
      claim.releaseDate = new Date();
    }

    await claim.save();
    await claim.populate('claimedBy', 'name email githubUsername');

    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: 'Error updating claim', error: error.message });
  }
});

// Send nudge for a claim
router.post('/:id/nudge', requireRole(['maintainer']), async (req, res) => {
  try {
    const { id } = req.params;

    const claim = await Claim.findById(id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (claim.status !== 'active') {
      return res.status(400).json({ message: 'Can only nudge active claims' });
    }

    // Update nudge information
    claim.nudgeCount += 1;
    claim.lastNudgeDate = new Date();
    await claim.save();

    // Here you would typically send an email notification
    // Implementation of notification service would be needed

    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: 'Error sending nudge', error: error.message });
  }
});

module.exports = router;