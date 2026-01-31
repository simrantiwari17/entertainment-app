/**
 * Bookmark Model
 *
 * Stores bookmarked movies/TV shows per user, with notes and watch status.
 */

import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    contentId: { type: Number, required: true },
    contentType: { type: String, required: true, enum: ['movie', 'tv'], lowercase: true },
    title: { type: String, required: true, trim: true },
    posterPath: { type: String, default: null },
    releaseDate: { type: String, default: null },
    notes: { type: String, trim: true, maxlength: 500 },
    watchStatus: {
      type: String,
      enum: ['planned', 'watching', 'completed'],
      default: 'planned',
      lowercase: true
    }
  },
  { timestamps: true }
);

bookmarkSchema.index({ user: 1, contentId: 1, contentType: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;
