import mongoose, { Schema, models, model } from 'mongoose';

const itineraryItemSchema = new Schema({
  adventureId: {
    type: Schema.Types.ObjectId,
    ref: 'Adventure',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  notes: {
    type: String
  }
});

const itinerarySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  items: [itineraryItemSchema],
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default models.Itinerary || model('Itinerary', itinerarySchema);