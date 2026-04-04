import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ['pending','confirmed','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Index for user appointment queries
appointmentSchema.index({ userId: 1, date: -1 });

// Index for provider schedule queries
appointmentSchema.index({ providerId: 1, date: 1, startTime: 1 });

// Prevent double-booking (exclude cancelled appointments)
appointmentSchema.index(
  { providerId: 1, date: 1, startTime: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'cancelled' } } }
);

export default mongoose.model('Appointment', appointmentSchema);