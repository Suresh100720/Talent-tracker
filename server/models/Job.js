const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    department: { 
      type: String 
    },
    location: { 
      type: String 
    },
    status: { 
      type: String, 
      enum: ['Open', 'Closed', 'On Hold'], 
      default: 'Open' 
    },
    openings: { 
      type: Number, 
      default: 1 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
