import mongoose from 'mongoose';

const AdventureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  duration: { type: Number, required: true },
  difficulty: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

AdventureSchema.index({ location: '2dsphere' });

export default mongoose.models.Adventure || mongoose.model('Adventure', AdventureSchema);