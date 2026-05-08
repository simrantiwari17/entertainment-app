import mongoose from 'mongoose';

const recentlyViewedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    tmdbId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    poster: {
      type: String,
      default: null
    },
    type: {
      type: String,
      enum: ['movie', 'tv'],
      required: true
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

recentlyViewedSchema.index({ userId: 1, tmdbId: 1, type: 1 }, { unique: true });
recentlyViewedSchema.index({ userId: 1, viewedAt: -1 });

const RecentlyViewed = mongoose.model('RecentlyViewed', recentlyViewedSchema);

export default RecentlyViewed;
