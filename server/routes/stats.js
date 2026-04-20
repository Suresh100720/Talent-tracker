const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const totalJobs = await Job.countDocuments();

    // Aggregation for candidate status counts
    const statusCounts = await Candidate.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const byStatus = {
      Applied: 0, Interview: 0, Hired: 0, Rejected: 0
    };
    statusCounts.forEach(item => {
      if (byStatus.hasOwnProperty(item._id)) {
        byStatus[item._id] = item.count;
      }
    });

    // Aggregation for job status counts
    const jobStatusCounts = await Job.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const jobsByStatus = {
      Open: 0, Closed: 0, "On Hold": 0
    };
    jobStatusCounts.forEach(item => {
      if (jobsByStatus.hasOwnProperty(item._id)) {
        jobsByStatus[item._id] = item.count;
      }
    });

    const recentCandidates = await Candidate.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalCandidates,
      totalJobs,
      byStatus,
      jobsByStatus,
      recentCandidates
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
