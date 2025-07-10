import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  adventureId: { type: String, required: true },
  notes: { type: String },
  photos: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Log || mongoose.model('Log', LogSchema);