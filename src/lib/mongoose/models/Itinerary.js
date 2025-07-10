import mongoose from 'mongoose';

const ItinerarySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{ type: Object }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Itinerary || mongoose.model('Itinerary', ItinerarySchema);