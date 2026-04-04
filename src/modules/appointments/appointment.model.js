import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending' 
  },
  notes: { type: String, maxlength: 500 },
  cancelledAt: { type: Date },
  cancellationReason: { type: String },
  confirmedAt: { type: Date },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
appointmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes
appointmentSchema.index({ userId: 1, date: -1 });
appointmentSchema.index({ providerId: 1, date: 1, startTime: 1 });
appointmentSchema.index({ status: 1, date: 1 });
appointmentSchema.index({ date: 1 });

// Prevent double-booking (exclude cancelled appointments)
appointmentSchema.index(
  { providerId: 1, date: 1, startTime: 1 },
  { unique: true, partialFilterExpression: { status: { $nin: ['cancelled', 'completed'] } } }
);

export default mongoose.model('Appointment', appointmentSchema);