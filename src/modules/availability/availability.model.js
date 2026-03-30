import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Add compound index for query performance
availabilitySchema.index({ providerId: 1, date: 1, startTime: 1 });

// Prevent duplicate availability slots
availabilitySchema.index(
  { providerId: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

export default mongoose.model('Availability', availabilitySchema);