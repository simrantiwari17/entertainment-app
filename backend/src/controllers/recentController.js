import RecentlyViewed from '../models/RecentlyViewed.js';

export const addRecent = async (req, res, next) => {
  try {
    const { tmdbId, title, poster, type } = req.body;

    if (!tmdbId || !title || !type) {
      return res.status(400).json({
        success: false,
        message: 'tmdbId, title and type are required'
      });
    }

    if (!['movie', 'tv'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'type must be movie or tv'
      });
    }

    await RecentlyViewed.findOneAndUpdate(
      { userId: req.user.userId, tmdbId, type },
      {
        $set: {
          title,
          poster: poster || null,
          viewedAt: new Date()
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Keep only latest 5 for each user (as per UI requirement)
    const recent = await RecentlyViewed.find({ userId: req.user.userId })
      .sort({ viewedAt: -1 })
      .select('_id');
    if (recent.length > 5) {
      const idsToDelete = recent.slice(5).map((item) => item._id);
      await RecentlyViewed.deleteMany({ _id: { $in: idsToDelete } });
    }

    return res.status(200).json({
      success: true,
      message: 'Recent item tracked successfully'
    });
  } catch (error) {
    return next(error);
  }
};

export const getRecent = async (req, res, next) => {
  try {
    const items = await RecentlyViewed.find({ userId: req.user.userId })
      .sort({ viewedAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    return next(error);
  }
};
