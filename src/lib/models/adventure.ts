import mongoose, { Schema, models, model } from 'mongoose';

const locationSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  },
  address: {
    type: String
  }
});

const reviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const adventureSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: locationSchema,
    required: true,
    index: '2dsphere' // For geospatial queries
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  category: {
    type: [String],
    required: true
  },
  images: {
    type: [String]
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate average rating when reviews are modified
adventureSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
  }
  next();
});

export default models.Adventure || model('Adventure', adventureSchema);