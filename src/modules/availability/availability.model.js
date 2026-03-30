import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Availability', availabilitySchema);