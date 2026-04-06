import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  providerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Provider', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  startTime: { 
    type: String, 
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  endTime: { 
    type: String, 
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  isRecurring: { 
    type: Boolean, 
    default: false 
  },
  recurringDays: [{ 
    type: Number, 
    min: 0, 
    max: 6 
  }],
  recurringEndDate: { 
    type: Date 
  },
  isBooked: { 
    type: Boolean, 
    default: false 
  },
  appointmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment' 
  },
  maxBookings: { 
    type: Number, 
    default: 1,
    min: 1,
    max: 100
  },
  currentBookings: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update timestamp on save
availabilitySchema.pre('save', function() {
  this.updatedAt = new Date();
});

// Indexes for performance
availabilitySchema.index({ providerId: 1, date: 1, startTime: 1 });
availabilitySchema.index({ providerId: 1, date: 1 });
availabilitySchema.index({ date: 1 });
availabilitySchema.index({ providerId: 1, isRecurring: 1 });
availabilitySchema.index({ isBooked: 1, date: 1 });

// Prevent duplicate slots (unique constraint)
availabilitySchema.index(
  { providerId: 1, date: 1, startTime: 1 },
  { unique: true }
);

export default mongoose.model('Availability', availabilitySchema);
