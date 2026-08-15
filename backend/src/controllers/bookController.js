const bookModel = require('../models/bookModel');
const UserModel = require('../models/UserModal');
const { generateBookSummary } = require('../services/GeminiService');

const getUserId = (req) => req.user?.id || req.user?._id || null;

const normalizeIsbn = (isbn) => {
  if (typeof isbn !== 'string') return '';
  return isbn.replace(/[^0-9Xx]/g, '').toUpperCase();
};

const buildCoverUrl = (isbn, fallback = '') => {
  const cleanedIsbn = normalizeIsbn(isbn);
  if (!cleanedIsbn) return fallback;
  return `https://covers.openlibrary.org/b/isbn/${cleanedIsbn}-L.jpg`;
};

const isSameId = (a, b) => String(a) === String(b);

const flattenBookForUser = (book, userId) => {
  if (!book) return book;
  const bookObj = typeof book.toObject === 'function' ? book.toObject() : { ...book };

  if (bookObj.userId && isSameId(bookObj.userId, userId)) {
    return bookObj;
  }

  const member = Array.isArray(bookObj.members)
    ? bookObj.members.find((m) => isSameId(m.userId, userId))
    : null;

  if (member) {
    return {
      ...bookObj,
      userId,
      status: member.status,
      rating: member.rating,
      review: member.review,
      _memberId: member._id,
      memberAddedAt: member.addedAt,
    };
  }

  return bookObj;
};

const seedSampleBooks = async () => {
  const ensureBookCover = (book) => ({
    ...book,
    coverUrl: book.coverUrl || buildCoverUrl(book.isbn, ''),
  });

  const sampleBooks = [
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Classic Romance",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
      status: "reading",
      rating: 0,
      review: "Witty commentary on social class and romance.",
      userId: null,
      isbn: "9780141439518",
      publisher: "Penguin Classics",
      publicationDate: new Date("1813-01-28"),
      language: "English",
      pageCount: 432,
      stockQuantity: 3,
      shelfLocation: "B-1",
      availabilityStatus: "active",
      description: "Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language."
    },
    {
      title: "Persuasion",
      author: "Jane Austen",
      genre: "Classic Romance",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141439686-L.jpg",
      status: "want",
      rating: 0,
      review: "A tender, elegant love story about second chances and emotional maturity.",
      userId: null,
      isbn: "9780141439686",
      publisher: "Penguin Classics",
      publicationDate: new Date("1817-01-01"),
      language: "English",
      pageCount: 256,
      stockQuantity: 5,
      shelfLocation: "B-2",
      availabilityStatus: "active",
      description: "Anne Elliot must navigate regret, class expectations, and a second chance at love in this beloved Austen classic."
    },
    {
      title: "Sense and Sensibility",
      author: "Jane Austen",
      genre: "Classic Romance",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141439662-L.jpg",
      status: "reading",
      rating: 0,
      review: "A graceful exploration of love, reason, and the emotional cost of social pressure.",
      userId: null,
      isbn: "9780141439662",
      publisher: "Penguin Classics",
      publicationDate: new Date("1811-01-01"),
      language: "English",
      pageCount: 384,
      stockQuantity: 6,
      shelfLocation: "B-3",
      availabilityStatus: "active",
      description: "Two sisters navigate romance, inheritance, and societal expectations in this remarkable Austen novel."
    },
    {
      title: "Emma",
      author: "Jane Austen",
      genre: "Classic Romance",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141439587-L.jpg",
      status: "want",
      rating: 0,
      review: "A sparkling story of wit, social mistakes, and unexpected romance.",
      userId: null,
      isbn: "9780141439587",
      publisher: "Penguin Classics",
      publicationDate: new Date("1815-12-20"),
      language: "English",
      pageCount: 432,
      stockQuantity: 5,
      shelfLocation: "B-4",
      availabilityStatus: "active",
      description: "Emma Woodhouse's meddling in other people's romances leads to both comedy and heart."
    },
    {
      title: "Jane Eyre",
      author: "Charlotte Brontë",
      genre: "Classic Romance",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780141441146-L.jpg",
      status: "finished",
      rating: 5,
      review: "An enduring romantic classic filled with passion, strength, and moral conviction.",
      userId: null,
      isbn: "9780141441146",
      publisher: "Penguin Classics",
      publicationDate: new Date("1847-10-16"),
      language: "English",
      pageCount: 480,
      stockQuantity: 4,
      shelfLocation: "B-5",
      availabilityStatus: "active",
      description: "A governess's journey through love, hardship, and personal independence remains one of literature's most beloved romances."
    },
    {
      title: "The Hobbit",
      author: "J. R. R. Tolkien",
      genre: "Epic Fantasy",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg",
      status: "finished",
      rating: 5,
      review: "A timeless masterpiece of adventure, courage, and world-building.",
      userId: null,
      isbn: "9780547928227",
      publisher: "Houghton Mifflin",
      publicationDate: new Date("1937-09-21"),
      language: "English",
      pageCount: 300,
      stockQuantity: 4,
      shelfLocation: "C-1",
      availabilityStatus: "active",
      description: "A great modern classic and the prelude to The Lord of the Rings."
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      genre: "Adventure / Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg",
      status: "want",
      rating: 0,
      review: "An inspiring journey of self-discovery and following your dreams.",
      userId: null,
      isbn: "9780061122415",
      publisher: "HarperOne",
      publicationDate: new Date("1988-01-01"),
      language: "English",
      pageCount: 197,
      stockQuantity: 5,
      shelfLocation: "C-2",
      availabilityStatus: "active",
      description: "Combining magic, mysticism, wisdom and wonder into an inspiring tale of self-discovery."
    },
    {
      title: "Around the World in Eighty Days",
      author: "Jules Verne",
      genre: "Adventure / Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780140449112-L.jpg",
      status: "reading",
      rating: 0,
      review: "A classic globe-trotting adventure full of wit, suspense, and timing.",
      userId: null,
      isbn: "9780140449112",
      publisher: "Penguin Classics",
      publicationDate: new Date("1873-01-01"),
      language: "English",
      pageCount: 224,
      stockQuantity: 4,
      shelfLocation: "C-2A",
      availabilityStatus: "active",
      description: "Phileas Fogg sets out to prove a daring wager while racing around the world with his loyal servant."
    },
    {
      title: "Life of Pi",
      author: "Yann Martel",
      genre: "Adventure / Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780156027328-L.jpg",
      status: "finished",
      rating: 5,
      review: "A vivid survival story that balances wonder, peril, and spirituality.",
      userId: null,
      isbn: "9780156027328",
      publisher: "Houghton Mifflin Harcourt",
      publicationDate: new Date("2001-09-11"),
      language: "English",
      pageCount: 326,
      stockQuantity: 5,
      shelfLocation: "C-2B",
      availabilityStatus: "active",
      description: "After a shipwreck, a boy and a tiger survive together in a small lifeboat across the ocean."
    },
    {
      title: "The Count of Monte Cristo",
      author: "Alexandre Dumas",
      genre: "Adventure / Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780451528813-L.jpg",
      status: "want",
      rating: 0,
      review: "A sweeping revenge epic with brilliant pacing and unforgettable drama.",
      userId: null,
      isbn: "9780451528813",
      publisher: "Signet",
      publicationDate: new Date("1844-01-01"),
      language: "English",
      pageCount: 1276,
      stockQuantity: 3,
      shelfLocation: "C-2C",
      availabilityStatus: "active",
      description: "A man wrongfully imprisoned emerges with a fortune and exacts a complex revenge on his enemies."
    },
    {
      title: "The House of Mirth",
      author: "Edith Wharton",
      genre: "Classic Romance",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780142437343-L.jpg",
      status: "reading",
      rating: 0,
      review: "A classic social novel of beauty, status, and emotional risk.",
      userId: null,
      isbn: "9780142437343",
      publisher: "Penguin Classics",
      publicationDate: new Date("1905-01-01"),
      language: "English",
      pageCount: 320,
      stockQuantity: 4,
      shelfLocation: "B-5A",
      availabilityStatus: "active",
      description: "Lily Bart navigates the rules of wealth, desire, and survival in a glittering social world."
    },
    {
      title: "The Midnight Library",
      author: "Matt Haig",
      genre: "Fantasy / Contemporary",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg",
      status: "want",
      rating: 0,
      review: "A thoughtful, imaginative novel about second chances and possibility.",
      userId: null,
      isbn: "9780525559474",
      publisher: "Viking",
      publicationDate: new Date("2020-08-27"),
      language: "English",
      pageCount: 304,
      stockQuantity: 5,
      shelfLocation: "K-1",
      availabilityStatus: "active",
      description: "A woman stranded between life and death explores an endless library of alternate realities."
    },
    {
      title: "The Odyssey",
      author: "Homer",
      genre: "Adventure / Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780140268867-L.jpg",
      status: "reading",
      rating: 0,
      review: "An enduring epic of wandering, endurance, and homecoming.",
      userId: null,
      isbn: "9780140268867",
      publisher: "Penguin Classics",
      publicationDate: new Date("-800-01-01"),
      language: "English",
      pageCount: 560,
      stockQuantity: 4,
      shelfLocation: "C-2D",
      availabilityStatus: "active",
      description: "Odysseus navigates storms, monsters, and temptation on a legendary journey home."
    },
    {
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
      genre: "Epic Fantasy",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780756404741-L.jpg",
      status: "reading",
      rating: 0,
      review: "A lyrical, immersive fantasy with a truly unforgettable voice.",
      userId: null,
      isbn: "9780756404741",
      publisher: "DAW",
      publicationDate: new Date("2007-03-27"),
      language: "English",
      pageCount: 662,
      stockQuantity: 4,
      shelfLocation: "C-3",
      availabilityStatus: "active",
      description: "A gifted young musician and magician narrates the story of his extraordinary life."
    },
    {
      title: "Mistborn",
      author: "Brandon Sanderson",
      genre: "Epic Fantasy",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780765311788-L.jpg",
      status: "want",
      rating: 0,
      review: "A bold fantasy with sharp magic systems and memorable characters.",
      userId: null,
      isbn: "9780765311788",
      publisher: "Tor",
      publicationDate: new Date("2006-07-17"),
      language: "English",
      pageCount: 576,
      stockQuantity: 5,
      shelfLocation: "C-4",
      availabilityStatus: "active",
      description: "A forgotten empire, a violent rebellion, and an all-powerful metal magic system drive this explosive fantasy."
    },
    {
      title: "The Priory of the Orange Tree",
      author: "S. A. Chakraborty",
      genre: "Epic Fantasy",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780756411336-L.jpg",
      status: "finished",
      rating: 5,
      review: "A rich, immersive fantasy full of dragons, politics, and destiny.",
      userId: null,
      isbn: "9780756411336",
      publisher: "Bloomsbury",
      publicationDate: new Date("2019-02-26"),
      language: "English",
      pageCount: 848,
      stockQuantity: 3,
      shelfLocation: "C-5",
      availabilityStatus: "active",
      description: "A sweeping fantasy where dragons, queens, and prophecies collide across a fractured kingdom."
    },
    {
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
      status: "reading",
      rating: 0,
      review: "A chilling warning about totalitarianism and surveillance.",
      userId: null,
      isbn: "9780451524935",
      publisher: "Signet Classic",
      publicationDate: new Date("1949-06-08"),
      language: "English",
      pageCount: 328,
      stockQuantity: 8,
      shelfLocation: "D-1",
      availabilityStatus: "active",
      description: "Among the seminal texts of the 20th century, Nineteen Eighty-Four grows more haunting as reality changes."
    },
    {
      title: "The Left Hand of Darkness",
      author: "Ursula K. Le Guin",
      genre: "Dystopian Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780441478125-L.jpg",
      status: "want",
      rating: 0,
      review: "A thoughtful speculative novel about identity, politics, and humanity.",
      userId: null,
      isbn: "9780441478125",
      publisher: "Ace",
      publicationDate: new Date("1969-03-01"),
      language: "English",
      pageCount: 304,
      stockQuantity: 5,
      shelfLocation: "D-2",
      availabilityStatus: "active",
      description: "On a frozen planet, an envoy must navigate politics, diplomacy, and cultural difference."
    },
    {
      title: "Neuromancer",
      author: "William Gibson",
      genre: "Dystopian Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780441569595-L.jpg",
      status: "want",
      rating: 0,
      review: "A neon-lit cyberpunk classic that shaped modern sci-fi.",
      userId: null,
      isbn: "9780441569595",
      publisher: "Ace",
      publicationDate: new Date("1984-09-01"),
      language: "English",
      pageCount: 288,
      stockQuantity: 6,
      shelfLocation: "D-3",
      availabilityStatus: "active",
      description: "A washed-up cowboy hacker is drawn into a conspiracy spanning the world of cyberspace."
    },
    {
      title: "The Handmaid's Tale",
      author: "Margaret Atwood",
      genre: "Dystopian Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780385490818-L.jpg",
      status: "finished",
      rating: 5,
      review: "A powerful and unsettling portrait of control, fear, and survival.",
      userId: null,
      isbn: "9780385490818",
      publisher: "Anchor",
      publicationDate: new Date("1985-06-01"),
      language: "English",
      pageCount: 311,
      stockQuantity: 7,
      shelfLocation: "D-4",
      availabilityStatus: "active",
      description: "In a theocratic future, women are stripped of freedom and identity."
    },
    {
      title: "Brave New World",
      author: "Aldous Huxley",
      genre: "Dystopian Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg",
      status: "reading",
      rating: 0,
      review: "A visionary and unsettling look at engineered comfort and social control.",
      userId: null,
      isbn: "9780060850524",
      publisher: "Harper Perennial",
      publicationDate: new Date("1932-01-01"),
      language: "English",
      pageCount: 288,
      stockQuantity: 5,
      shelfLocation: "D-5",
      availabilityStatus: "active",
      description: "A society built on pleasure, stability, and control becomes the subject of a powerful critique."
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-Help / Productivity",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
      status: "want",
      rating: 0,
      review: "Practical framework for building good habits and breaking bad ones.",
      userId: null,
      isbn: "9780735211292",
      publisher: "Avery",
      publicationDate: new Date("2018-10-16"),
      language: "English",
      pageCount: 320,
      stockQuantity: 12,
      shelfLocation: "E-1",
      availabilityStatus: "active",
      description: "No matter your goals, Atomic Habits offers a proven framework for improving every day."
    },
    {
      title: "Deep Work",
      author: "Cal Newport",
      genre: "Self-Help / Productivity",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg",
      status: "reading",
      rating: 0,
      review: "A clear, practical guide to producing meaningful work in distracted times.",
      userId: null,
      isbn: "9781455586691",
      publisher: "Grand Central Publishing",
      publicationDate: new Date("2016-01-05"),
      language: "English",
      pageCount: 296,
      stockQuantity: 7,
      shelfLocation: "E-2",
      availabilityStatus: "active",
      description: "A fast-moving guide to focus, concentration, and high-value work in an attention-poor world."
    },
    {
      title: "The Power of Habit",
      author: "Charles Duhigg",
      genre: "Self-Help / Productivity",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780812981605-L.jpg",
      status: "finished",
      rating: 5,
      review: "A compelling look at how habits shape personal and professional life.",
      userId: null,
      isbn: "9780812981605",
      publisher: "Random House",
      publicationDate: new Date("2012-02-28"),
      language: "English",
      pageCount: 371,
      stockQuantity: 5,
      shelfLocation: "E-3",
      availabilityStatus: "active",
      description: "An engaging and practical exploration of how habits operate in our brains and lives."
    },
    {
      title: "Tiny Habits",
      author: "BJ Fogg",
      genre: "Self-Help / Productivity",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780358003329-L.jpg",
      status: "want",
      rating: 0,
      review: "A practical method for starting habits that are easy to maintain.",
      userId: null,
      isbn: "9780358003329",
      publisher: "Houghton Mifflin Harcourt",
      publicationDate: new Date("2020-02-25"),
      language: "English",
      pageCount: 272,
      stockQuantity: 4,
      shelfLocation: "E-4",
      availabilityStatus: "active",
      description: "An easy-to-apply model for building sustainable habits that become part of everyday life."
    },
    {
      title: "The 5 AM Club",
      author: "Robin Sharma",
      genre: "Self-Help / Productivity",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781443456624-L.jpg",
      status: "reading",
      rating: 0,
      review: "An energetic, motivational guide built around disciplined early mornings.",
      userId: null,
      isbn: "9781443456624",
      publisher: "HarperCollins",
      publicationDate: new Date("2018-12-04"),
      language: "English",
      pageCount: 336,
      stockQuantity: 6,
      shelfLocation: "E-5",
      availabilityStatus: "active",
      description: "A story-based guide to personal productivity, discipline, and living with purpose."
    },
    {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      genre: "Thriller / Mystery",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg",
      status: "want",
      rating: 0,
      review: "A psychological thriller full of suspense and shocking revelations.",
      userId: null,
      isbn: "9781250301697",
      publisher: "Celadon Books",
      publicationDate: new Date("2019-02-05"),
      language: "English",
      pageCount: 336,
      stockQuantity: 7,
      shelfLocation: "F-1",
      availabilityStatus: "active",
      description: "A psychotherapist becomes obsessed with a patient who refuses to speak after a brutal crime."
    },
    {
      title: "Gone Girl",
      author: "Gillian Flynn",
      genre: "Thriller / Mystery",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780307588364-L.jpg",
      status: "reading",
      rating: 0,
      review: "A sharp, dark, and highly addictive mystery about marriage and deception.",
      userId: null,
      isbn: "9780307588364",
      publisher: "Crown",
      publicationDate: new Date("2012-06-05"),
      language: "English",
      pageCount: 432,
      stockQuantity: 6,
      shelfLocation: "F-2",
      availabilityStatus: "active",
      description: "A husband becomes the prime suspect when his wife disappears on their fifth wedding anniversary."
    },
    {
      title: "The Girl with the Dragon Tattoo",
      author: "Stieg Larsson",
      genre: "Thriller / Mystery",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780307454546-L.jpg",
      status: "finished",
      rating: 5,
      review: "An intricate and intense mystery with outstanding character work.",
      userId: null,
      isbn: "9780307454546",
      publisher: "Vintage",
      publicationDate: new Date("2005-08-01"),
      language: "English",
      pageCount: 644,
      stockQuantity: 5,
      shelfLocation: "F-3",
      availabilityStatus: "active",
      description: "A disgraced journalist and a brilliant hacker investigate a decades-old disappearance."
    },
    {
      title: "Big Little Lies",
      author: "Liane Moriarty",
      genre: "Thriller / Mystery",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780698196288-L.jpg",
      status: "want",
      rating: 0,
      review: "A clever and suspenseful story about secrets, status, and danger.",
      userId: null,
      isbn: "9780698196288",
      publisher: "Berkley",
      publicationDate: new Date("2014-07-29"),
      language: "English",
      pageCount: 460,
      stockQuantity: 4,
      shelfLocation: "F-4",
      availabilityStatus: "active",
      description: "In a luxurious Australian suburb, a murder mystery unearths hidden tensions and betrayals."
    },
    {
      title: "The Woman in the Window",
      author: "A. J. Finn",
      genre: "Thriller / Mystery",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780062678428-L.jpg",
      status: "reading",
      rating: 0,
      review: "A suspenseful and fast-moving psychological thriller with a sharp twist.",
      userId: null,
      isbn: "9780062678428",
      publisher: "Harper",
      publicationDate: new Date("2018-03-06"),
      language: "English",
      pageCount: 448,
      stockQuantity: 4,
      shelfLocation: "F-5",
      availabilityStatus: "active",
      description: "An agoraphobic woman becomes entangled in a dangerous mystery she may or may not be imagining."
    },
    {
      title: "The Book Thief",
      author: "Markus Zusak",
      genre: "Historical Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg",
      status: "finished",
      rating: 5,
      review: "A beautifully written story of courage, friendship, and survival in wartime.",
      userId: null,
      isbn: "9780375842207",
      publisher: "Knopf Books for Young Readers",
      publicationDate: new Date("2005-09-01"),
      language: "English",
      pageCount: 552,
      stockQuantity: 6,
      shelfLocation: "G-1",
      availabilityStatus: "active",
      description: "Set in Nazi Germany, this novel narrates the life of a young girl who finds comfort in stealing books."
    },
    {
      title: "All the Light We Cannot See",
      author: "Anthony Doerr",
      genre: "Historical Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781476746586-L.jpg",
      status: "reading",
      rating: 0,
      review: "A luminous and moving story of survival, connection, and hope.",
      userId: null,
      isbn: "9781476746586",
      publisher: "Scribner",
      publicationDate: new Date("2014-05-06"),
      language: "English",
      pageCount: 531,
      stockQuantity: 5,
      shelfLocation: "G-2",
      availabilityStatus: "active",
      description: "A blind French girl and a German boy cross paths during World War II in a breathtaking novel."
    },
    {
      title: "The Night Circus",
      author: "Erin Morgenstern",
      genre: "Historical Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780385534635-L.jpg",
      status: "want",
      rating: 0,
      review: "A poetic and enchanting story set inside a magical circus.",
      userId: null,
      isbn: "9780385534635",
      publisher: "Doubleday",
      publicationDate: new Date("2011-09-13"),
      language: "English",
      pageCount: 512,
      stockQuantity: 4,
      shelfLocation: "G-3",
      availabilityStatus: "active",
      description: "A mysterious circus appears without warning, and two illusionists are pulled into a magical rivalry."
    },
    {
      title: "The Guernsey Literary and Potato Peel Pie Society",
      author: "Mary Ann Shaffer and Annie Barrows",
      genre: "Historical Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780307353137-L.jpg",
      status: "finished",
      rating: 5,
      review: "Warm, witty, and full of heart in a post-war epistolary novel.",
      userId: null,
      isbn: "9780307353137",
      publisher: "Dial Press",
      publicationDate: new Date("2008-04-29"),
      language: "English",
      pageCount: 289,
      stockQuantity: 5,
      shelfLocation: "G-4",
      availabilityStatus: "active",
      description: "A writer in post-war England discovers a community of characters shaped by resilience and letters."
    },
    {
      title: "The Paris Wife",
      author: "Paula McLain",
      genre: "Historical Fiction",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780307268190-L.jpg",
      status: "reading",
      rating: 0,
      review: "A lush, intimate portrait of love, art, and ambition in Paris.",
      userId: null,
      isbn: "9780307268190",
      publisher: "Ballantine",
      publicationDate: new Date("2011-02-22"),
      language: "English",
      pageCount: 352,
      stockQuantity: 4,
      shelfLocation: "G-5",
      availabilityStatus: "active",
      description: "A fictionalized account of Ernest Hemingway's first wife, Hadley Richardson, in 1920s Paris."
    },
    {
      title: "Educated",
      author: "Tara Westover",
      genre: "Memoir / Biography",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg",
      status: "reading",
      rating: 0,
      review: "A powerful memoir about resilience, education, and self-discovery.",
      userId: null,
      isbn: "9780399590504",
      publisher: "Random House",
      publicationDate: new Date("2018-02-20"),
      language: "English",
      pageCount: 352,
      stockQuantity: 5,
      shelfLocation: "H-1",
      availabilityStatus: "active",
      description: "An unforgettable memoir that chronicles a young woman who leaves her isolated upbringing to pursue education."
    },
    {
      title: "Becoming",
      author: "Michelle Obama",
      genre: "Memoir / Biography",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg",
      status: "want",
      rating: 0,
      review: "Open, warm, and deeply personal—an inspiring memoir by a remarkable public figure.",
      userId: null,
      isbn: "9781524763138",
      publisher: "Crown",
      publicationDate: new Date("2018-11-13"),
      language: "English",
      pageCount: 448,
      stockQuantity: 6,
      shelfLocation: "H-2",
      availabilityStatus: "active",
      description: "A candid and moving memoir about Michelle Obama's journey from Chicago to the White House."
    },
    {
      title: "I Am Malala",
      author: "Malala Yousafzai",
      genre: "Memoir / Biography",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780316322409-L.jpg",
      status: "finished",
      rating: 5,
      review: "A courageous memoir about education, activism, and resilience.",
      userId: null,
      isbn: "9780316322409",
      publisher: "Little, Brown and Company",
      publicationDate: new Date("2013-10-08"),
      language: "English",
      pageCount: 320,
      stockQuantity: 4,
      shelfLocation: "H-3",
      availabilityStatus: "active",
      description: "Malala Yousafzai's memoir tells the story of her fight for girls' education."
    },
    {
      title: "The Diary of a Young Girl",
      author: "Anne Frank",
      genre: "Memoir / Biography",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780553577125-L.jpg",
      status: "reading",
      rating: 0,
      review: "A deeply human and affecting diary of hope, fear, and endurance.",
      userId: null,
      isbn: "9780553577125",
      publisher: "Bantam",
      publicationDate: new Date("1993-06-01"),
      language: "English",
      pageCount: 288,
      stockQuantity: 5,
      shelfLocation: "H-4",
      availabilityStatus: "active",
      description: "Anne Frank's diary remains one of the most important first-person accounts of wartime life."
    },
    {
      title: "The Glass Castle",
      author: "Jeannette Walls",
      genre: "Memoir / Biography",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9780743247542-L.jpg",
      status: "want",
      rating: 0,
      review: "A vivid, memorable memoir full of hardship, resilience, and honesty.",
      userId: null,
      isbn: "9780743247542",
      publisher: "Scribner",
      publicationDate: new Date("2005-03-01"),
      language: "English",
      pageCount: 288,
      stockQuantity: 3,
      shelfLocation: "H-5",
      availabilityStatus: "active",
      description: "A memoir tracing a family's fractured life and a daughter's determination to build a better one."
    }
  ];

  const normalizedBooks = sampleBooks.map(ensureBookCover);

  for (const sample of normalizedBooks) {
    try {
      const safeCoverUrl = sample.coverUrl || buildCoverUrl(sample.isbn, '');
      await bookModel.updateMany(
        { title: sample.title },
        { $set: { coverUrl: safeCoverUrl } }
      );

      await bookModel.findOneAndUpdate(
        { title: sample.title, author: sample.author, userId: sample.userId },
        { $set: { ...sample, coverUrl: safeCoverUrl } },
        { upsert: true, collation: { locale: 'en', strength: 2 } }
      );
    } catch (err) {
      console.error('Error ensuring sample book:', sample.title, err.message);
    }
  }
};

const getUsersOverview = async (req, res) => {
  try {
    await seedSampleBooks(getUserId(req));
    const users = await UserModel.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    const books = await bookModel.find().sort({ createdAt: -1 });

    const usersData = users.map((u) => {
      const userBooks = books.filter((b) => {
        if (b.userId && isSameId(b.userId, u._id)) return true;
        return Array.isArray(b.members) && b.members.some((m) => isSameId(m.userId, u._id));
      });

      const wantCount = userBooks.filter((b) => {
        if (b.userId && isSameId(b.userId, u._id)) return b.status === 'want';
        const member = b.members.find((m) => isSameId(m.userId, u._id));
        return member?.status === 'want';
      }).length;
      const readingCount = userBooks.filter((b) => {
        if (b.userId && isSameId(b.userId, u._id)) return b.status === 'reading';
        const member = b.members.find((m) => isSameId(m.userId, u._id));
        return member?.status === 'reading';
      }).length;
      const finishedCount = userBooks.filter((b) => {
        if (b.userId && isSameId(b.userId, u._id)) return b.status === 'finished';
        const member = b.members.find((m) => isSameId(m.userId, u._id));
        return member?.status === 'finished';
      }).length;

      return {
        id: u._id,
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        role: u.role,
        status: u.status || 'offline',
        createdAt: u.createdAt,
        totalBooks: userBooks.length,
        wantCount,
        readingCount,
        finishedCount,
        books: userBooks,
      };
    });

    const totalBooksInSystem = await bookModel.countDocuments({});

    res.status(200).json({
      totalUsers: users.length,
      totalBooksInSystem,
      users: usersData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users overview', error: error.message });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    await seedSampleBooks();

    let filter;
    if (req.user?.role === 'admin') {
      filter = req.query.all === 'true' ? {} : { userId: null };
      if (req.query.status) {
        filter.status = req.query.status;
      }
    } else {
      if (req.query.status) {
        filter = {
          $or: [
            { userId, status: req.query.status },
            { members: { $elemMatch: { userId, status: req.query.status } } },
          ],
        };
      } else {
        filter = {
          $or: [
            { userId },
            { 'members.userId': userId },
          ],
        };
      }
    }

    const books = await bookModel.find(filter).sort({ createdAt: -1 });
    const result = req.user?.role === 'admin' ? books : books.map((book) => flattenBookForUser(book, userId));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books', error: error.message });
  }
};

const getLibraryBooks = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    await seedSampleBooks();
    const filter = { userId: null };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const books = await bookModel.find(filter).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving library books', error: error.message });
  }
};

const getMyBooks = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const books = await bookModel.find({
      $or: [
        { userId },
        { 'members.userId': userId },
      ],
    }).sort({ createdAt: -1 });

    const result = books.map((book) => flattenBookForUser(book, userId));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving your books', error: error.message });
  }
};

const addLibraryBookToShelf = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const libraryBook = await bookModel.findOne({ _id: req.params.id, userId: null });
    if (!libraryBook) {
      return res.status(404).json({ message: 'Library book not found' });
    }

    const alreadyAdded = Array.isArray(libraryBook.members)
      && libraryBook.members.some((m) => isSameId(m.userId, userId));

    if (alreadyAdded) {
      return res.status(409).json({ message: 'You already added this book to your shelf' });
    }

    libraryBook.members.push({
      userId,
      status: 'want',
      rating: 0,
      review: '',
    });

    await libraryBook.save();
    res.status(200).json(flattenBookForUser(libraryBook, userId));
  } catch (error) {
    res.status(500).json({ message: 'Error adding book to shelf', error: error.message });
  }
};

const getCounts = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user?.role === 'admin') {
      const agg = await bookModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);
      const counts = { want: 0, reading: 0, finished: 0 };
      agg.forEach((g) => {
        if (g._id) counts[g._id] = g.count;
      });
      return res.status(200).json(counts);
    }

    const books = await bookModel.find({
      $or: [
        { userId },
        { 'members.userId': userId },
      ],
    }).sort({ createdAt: -1 });

    const flattened = books.map((book) => flattenBookForUser(book, userId));
    const counts = { want: 0, reading: 0, finished: 0 };
    flattened.forEach((book) => {
      if (book.status && counts[book.status] !== undefined) {
        counts[book.status] += 1;
      }
    });

    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving counts', error: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const filter = req.user?.role === 'admin'
      ? { _id: req.params.id }
      : {
        _id: req.params.id,
        $or: [
          { userId },
          { userId: null },
        ],
      };

    const book = await bookModel.findOne(filter);
    if (book) {
      const response = req.user?.role === 'admin' ? book : flattenBookForUser(book, userId);
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving book', error: error.message });
  }
};

const summarizeBook = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const filter = req.user?.role === 'admin'
      ? { _id: req.params.id }
      : {
        _id: req.params.id,
        $or: [
          { userId },
          { userId: null },
          { 'members.userId': userId },
        ],
      };

    const book = await bookModel.findOne(filter);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const summary = await generateBookSummary(book);
    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error generating book summary:', error.message);
    res.status(500).json({ message: 'Error generating book summary', error: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    const payload = {
      title: title.trim(),
      author: author.trim(),
      genre: (req.body.genre || '').trim(),
      coverUrl: (req.body.coverUrl || '').trim(),
      status: req.body.status || 'want',
      rating: req.body.rating ?? 0,
      review: (req.body.review || '').trim(),
      userId: req.user?.role === 'admin' ? null : userId,
      isbn: (req.body.isbn || '').trim(),
      subtitle: (req.body.subtitle || '').trim(),
      publisher: (req.body.publisher || '').trim(),
      publicationDate: req.body.publicationDate ? new Date(req.body.publicationDate) : null,
      language: (req.body.language || 'English').trim(),
      pageCount: req.body.pageCount ? Number(req.body.pageCount) : null,
      description: (req.body.description || '').trim(),
      stockQuantity: req.body.stockQuantity ? Number(req.body.stockQuantity) : 0,
      shelfLocation: (req.body.shelfLocation || '').trim(),
      availabilityStatus: req.body.availabilityStatus || 'active',
      reportFlagCounter: req.body.reportFlagCounter ? Number(req.body.reportFlagCounter) : 0,
      fileUrl: (req.body.fileUrl || '').trim(),
    };

    // Prevent duplicates (case-insensitive) for the same user/library
    try {
      const existing = await bookModel.findOne({ title: payload.title, author: payload.author, userId: payload.userId })
        .collation({ locale: 'en', strength: 2 });
      if (existing) {
        return res.status(409).json({ message: 'Book already exists' });
      }

      const book = await bookModel.create(payload);
      res.status(201).json(book);
    } catch (err) {
      // If unique index violation occurs, return conflict
      if (err && err.code === 11000) {
        return res.status(409).json({ message: 'Duplicate book entry' });
      }
      throw err;
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const book = await bookModel.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (req.user?.role === 'admin') {
      const updateData = { ...req.body };
      const updatedBook = await bookModel.findOneAndUpdate(
        { _id: req.params.id },
        updateData,
        { returnDocument: 'after', new: true }
      );
      return res.json(updatedBook);
    }

    const userOwnsDoc = book.userId && isSameId(book.userId, userId);
    const member = Array.isArray(book.members)
      ? book.members.find((m) => isSameId(m.userId, userId))
      : null;

    if (userOwnsDoc) {
      const updateData = { ...req.body, userId };
      const updatedBook = await bookModel.findOneAndUpdate(
        { _id: req.params.id, userId },
        updateData,
        { returnDocument: 'after', new: true }
      );
      return res.json(updatedBook);
    }

    if (member) {
      if (req.body.status) member.status = req.body.status;
      if (req.body.rating !== undefined) member.rating = req.body.rating;
      if (req.body.review !== undefined) member.review = req.body.review;
      await book.save();
      return res.json(flattenBookForUser(book, userId));
    }

    return res.status(404).json({ error: 'Book not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user?.role === 'admin') {
      const deleted = await bookModel.findOneAndDelete({ _id: req.params.id });
      if (!deleted) {
        return res.status(404).json({ error: 'Book not found' });
      }
      return res.status(204).end();
    }

    const book = await bookModel.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const userOwnsDoc = book.userId && isSameId(book.userId, userId);
    if (userOwnsDoc) {
      const deleted = await bookModel.findOneAndDelete({ _id: req.params.id, userId });
      if (!deleted) {
        return res.status(404).json({ error: 'Book not found' });
      }
      return res.status(204).end();
    }

    const member = Array.isArray(book.members)
      ? book.members.find((m) => isSameId(m.userId, userId))
      : null;

    if (member) {
      book.members = book.members.filter((m) => !isSameId(m.userId, userId));
      await book.save();
      return res.status(204).end();
    }

    return res.status(404).json({ error: 'Book not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};


module.exports = {
  getBooks: getAllBooks,
  getAllBooks,
  getLibraryBooks,
  getMyBooks,
  addLibraryBookToShelf,
  getCounts,
  getUsersOverview,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  summarizeBook,
};

