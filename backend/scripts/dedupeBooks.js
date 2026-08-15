const mongoose = require('mongoose');
const Book = require('../src/models/bookModel');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookshelves';

async function dedupe() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB for dedupe');

  // Group by title+author+userId (case-insensitive) and keep newest, remove others
  const pipeline = [
    {
      $group: {
        _id: { title: { $toLower: '$title' }, author: { $toLower: '$author' }, userId: '$userId' },
        ids: { $push: '$_id' },
        count: { $sum: 1 },
        latest: { $first: '$_id' },
      },
    },
    { $match: { count: { $gt: 1 } } },
  ];

  const duplicates = await Book.aggregate(pipeline).allowDiskUse(true);
  console.log('Found duplicate groups:', duplicates.length);

  let removed = 0;
  for (const group of duplicates) {
    // keep the first id, remove others
    const [keep, ...others] = group.ids;
    const res = await Book.deleteMany({ _id: { $in: others } });
    removed += res.deletedCount || 0;
    console.log(`Removed ${res.deletedCount || 0} duplicates for group ${JSON.stringify(group._id)}`);
  }

  console.log('Dedupe complete. Total removed:', removed);
  await mongoose.disconnect();
}

if (require.main === module) {
  dedupe().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
