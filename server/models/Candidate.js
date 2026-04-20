const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String
    },
    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Hired', 'Rejected'],
      default: 'Applied'
    },
    role: {
      type: String
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Candidate', candidateSchema);
