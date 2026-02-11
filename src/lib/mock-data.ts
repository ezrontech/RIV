
export interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    role: 'elder' | 'member' | 'visitor';
}

export interface PollOption {
    id: string;
    label: string;
    votes: number;
}

export interface Post {
    id: string;
    user: User;
    content: string;
    type?: 'standard' | 'poll' | 'carousel' | 'video_share' | 'article_share' | 'product_share' | 'event_share';
    // Standard/Carousel
    image?: string;
    images?: string[];
    // Poll
    pollOptions?: PollOption[];
    pollTotalWrites?: number;
    // Shared Content
    referenceId?: string;
    sharedData?: any; // Simplified for mock

    likes: number;
    replies: number;
    timestamp: string;
}

export interface Series {
    id: string;
    title: string;
    host: string;
    description: string;
    thumbnail: string; // Vertical poster
    cover: string; // Horizontal hero
    episodes: string[]; // Video IDs
    category: string;
}






// --- User Data ---
export const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Elder Baaba', username: 'baaba', avatar: '/images/users/baaba.webp', role: 'elder' },
    { id: 'u2', name: 'Firstman', username: 'firstman', avatar: '/images/users/firstman.webp', role: 'elder' },
    { id: 'u3', name: 'King Toto', username: 'king_toto', avatar: '/images/users/king toto.webp', role: 'member' },
    { id: 'u4', name: 'QueenEye', username: 'queen_eye', avatar: '/images/users/queen-767x1024.webp', role: 'elder' },
    { id: 'u5', name: 'Steve DeAngelo', username: 'steve_d', avatar: '/images/users/Steve DeAngelo.jpeg', role: 'visitor' },
    { id: 'u6', name: 'Sister Arlene', username: 'arlene_roots', avatar: '/images/users/arlene.webp', role: 'member' },
    { id: 'u7', name: 'King Tebah', username: 'king_tebah', avatar: '/images/users/king.webp', role: 'member' },
    { id: 'u8', name: 'Ras Sugah', username: 'sugah_vibes', avatar: '/images/users/sugah.webp', role: 'member' },
    { id: 'u9', name: 'Dr. Mark', username: 'drmark', avatar: '/images/users/Dr. Mark.jpeg', role: 'visitor' },
    { id: 'u10', name: 'Sister Cardolisa', username: 'cardolisa', avatar: '/images/users/cardolisa.webp', role: 'member' },
];

// --- New Series Data ---
export const MOCK_SERIES: Series[] = [
    {
        id: 's1',
        title: 'Cooking with Sister Arlene',
        host: MOCK_USERS[5].name,
        description: 'Learn the secrets of authentic Ital cooking, from farm to table. No salt, pure vibes.',
        thumbnail: '/images/riv-food-768x576.jpeg', // Vertical crop usually preferred but this works
        cover: '/images/Food-Spread-1024x768.jpeg',
        episodes: ['v2', 'v9', 'v12', 'v11'],
        category: 'Cooking'
    },
    {
        id: 's2',
        title: 'Reasonings by the River',
        host: MOCK_USERS[0].name,
        description: 'Deep conversations about life, history, and spirituality, filmed on the banks of the river.',
        thumbnail: '/images/River-768x424.jpg',
        cover: '/images/DJI_0073-retreats-768x519.jpeg',
        episodes: ['v3', 'v11', 'v8', 'v5'],
        category: 'Reasoning'
    },
    {
        id: 's3',
        title: 'Farming 101: The Natural Way',
        host: 'RIV News Network',
        description: 'Sustainable farming techniques for the modern age. Grow your own food, heal the nation.',
        thumbnail: '/images/Bagoodie-Bananas-1-768x1024.jpg',
        cover: '/images/Bagoodie-Bananas-1-768x1024.jpg',
        episodes: ['v6', 'v12', 'v2', 'v9'],
        category: 'Farming'
    },
    {
        id: 's4',
        title: 'Village News Weekly',
        host: 'RIV News Network', // Using a channel name as host
        description: 'Updates from the community, upcoming events, and stories from the people.',
        thumbnail: '/images/IMG_9656-9646aeb-1-1024x768.jpg',
        cover: '/images/IMG_9647-1-1152x1536.jpg',
        episodes: ['v5', 'v8', 'v1', 'v10'],
        category: 'News'
    },
    {
        id: 's5',
        title: 'Rhythms of Life',
        host: MOCK_USERS[1].name,
        description: 'Explorations into the heartbeat of the drum and the chants of the ancients.',
        thumbnail: '/images/firstman-768x1024.webp',
        cover: '/images/Firstman-_-Nereri-BW-1-768x576.jpg',
        episodes: ['v4', 'v7', 'v11', 'v3'],
        category: 'Music'
    }
];


// --- Modules Data ---

export const MOCK_CHANNELS = [
    { id: 'c1', name: 'Village Builders', avatar: '/images/users/king.webp', subscribers: '1.2K' },
    { id: 'c2', name: 'Sister Arlene Kitchen', avatar: '/images/users/arlene.webp', subscribers: '4.5K' },
    { id: 'c3', name: 'Wisdom Keepers', avatar: '/images/users/baaba.webp', subscribers: '8.9K' },
    { id: 'c4', name: 'Rhythms of Life', avatar: '/images/users/firstman.webp', subscribers: '3.1K' },
    { id: 'c5', name: 'RIV News Network', avatar: '/images/users/cardolisa.webp', subscribers: '5.6K' },
    { id: 'c6', name: 'Natural Farming', avatar: '/images/users/sugah.webp', subscribers: '2.8K' }
];

export const MOCK_VIDEOS = [
    { id: 'v1', title: 'Building a Traditional Tabernacle - Day 1', channel: MOCK_CHANNELS[0], views: '1.2K views', time: '2 days ago', duration: '14:20', category: 'Construction', thumbnail: '/images/RED-CABIN-1536x864.jpg' },
    { id: 'v2', title: 'Authentic Ackee cooked in Coconut Milk', channel: MOCK_CHANNELS[1], views: '3.4K views', time: '1 week ago', duration: '22:15', category: 'Cooking', thumbnail: '/images/riv-food-768x576.jpeg' },
    { id: 'v3', title: 'Sunday Reasoning with Elder Bongo', channel: MOCK_CHANNELS[2], views: '850 views', time: '3 days ago', duration: '45:00', category: 'Reasoning', thumbnail: '/images/Firstman-_-Nereri-BW-1-768x576.jpg' },
    { id: 'v4', title: 'Morning Nyabinghi Drumming Session', channel: MOCK_CHANNELS[3], views: '5.1K views', time: '2 weeks ago', duration: '08:45', category: 'Music', thumbnail: '/images/Ceremonial-1f35b70-1-768x1024.jpg' },
    { id: 'v5', title: 'Full Moon Ceremony Highlights', channel: MOCK_CHANNELS[4], views: '10K views', time: '1 month ago', duration: '12:30', category: 'News', thumbnail: '/images/DJI_0067_ceremony-1-768x564.jpeg' },
    { id: 'v6', title: 'How to Plant Cassava: A Guide', channel: MOCK_CHANNELS[5], views: '2.3K views', time: '4 days ago', duration: '18:10', category: 'Farming', thumbnail: '/images/Bagoodie-Bananas-1-768x1024.jpg' },
    { id: 'v7', title: 'Chanting Down Babylon: Music Video', channel: MOCK_CHANNELS[3], views: '15K views', time: '3 weeks ago', duration: '04:20', category: 'Music', thumbnail: '/images/firstman-768x1024.webp' },
    { id: 'v8', title: 'Community Clean Up Day 2026', channel: MOCK_CHANNELS[4], views: '900 views', time: '5 days ago', duration: '06:50', category: 'News', thumbnail: '/images/River-768x424.jpg' },
    { id: 'v9', title: 'Herbal Tea Benefits: Cerasee', channel: MOCK_CHANNELS[1], views: '4.1K views', time: '2 months ago', duration: '10:05', category: 'Cooking', thumbnail: '/images/riv-calabash-768x576.jpeg' },
    { id: 'v10', title: 'Thatching the Roof: Traditional Techniques', channel: MOCK_CHANNELS[0], views: '1.8K views', time: '3 weeks ago', duration: '25:00', category: 'Construction', thumbnail: '/images/RIV-2-768x432.jpeg' },
    { id: 'v11', title: 'The History of the Maroons', channel: MOCK_CHANNELS[2], views: '7.2K views', time: '1 year ago', duration: '55:00', category: 'Reasoning', thumbnail: '/images/IMG_9920-1-768x1024.jpg' },
    { id: 'v12', title: 'Harvesting Scotch Bonnet Peppers', channel: MOCK_CHANNELS[5], views: '3.5K views', time: '1 week ago', duration: '09:30', category: 'Farming', thumbnail: '/images/IMG_9598-1152x1536.jpg' }
];

export const MOCK_ARTICLES = [
    { id: 'a1', title: 'The Significance of the Solstice', excerpt: 'As the seasons change, we reflect on the balance of light and dark within our community rituals.', author: MOCK_USERS[0].name, date: 'Feb 4, 2026', image: '/images/Z62_5332-768x511.jpg' },
    { id: 'a2', title: 'New Harvest: Scotch Bonnet Peppers', excerpt: 'Our latest crop is ready. Learn how we cultivate the finest peppers using traditional methods.', author: MOCK_USERS[5].name, date: 'Feb 1, 2026', image: '/images/Food-Spread-1024x768.jpeg' },
    { id: 'a3', title: 'Voices of the Elders: A Conversation', excerpt: 'A transcription of last night\'s reasoning session at the Tabernacle.', author: MOCK_USERS[2].name, date: 'Jan 28, 2026', image: '/images/Quen-Tebah-Nereri-1-768x576.jpg' },
    { id: 'a4', title: 'The Art of Calabash Carving', excerpt: 'Discover the ancient techniques passed down through generations for creating sacred vessels.', author: MOCK_USERS[3].name, date: 'Jan 20, 2026', image: '/images/riv-calabash-768x576.jpeg' },
    { id: 'a5', title: 'Sustainable Living: River Valley Style', excerpt: 'How the RIV community integrates modern sustainability with ancient wisdom.', author: MOCK_USERS[1].name, date: 'Jan 15, 2026', image: '/images/Z62_5323-768x511.jpg' }
];

export const MOCK_PRODUCTS = [
    { id: 'prod1', name: 'Handcrafted Coconut Soap', price: '$8.00', artisan: MOCK_USERS[5].name, image: '/images/shop/coconut%20soap.jpg' },
    { id: 'prod2', name: 'Red, Gold & Green Necklace', price: '$25.00', artisan: MOCK_USERS[7].name, image: '/images/shop/red%20gold%20and%20green%20necklace.jpg' },
    { id: 'prod3', name: 'Authentic Nyabinghi Drum', price: '$450.00', artisan: MOCK_USERS[2].name, image: '/images/Ceremonial-1f35b70-1-768x1024.jpg' },
    { id: 'prod4', name: 'Carved Calabash Bowl', price: '$35.00', artisan: MOCK_USERS[3].name, image: '/images/riv-calabash-768x576.jpeg' },
    { id: 'prod5', name: 'Village Roots Tonic', price: '$20.00', artisan: MOCK_USERS[7].name, image: '/images/shop/roots%20tonic.jpg' },
    { id: 'prod6', name: 'Healing Herbs Bundle', price: '$15.00', artisan: MOCK_USERS[3].name, image: '/images/shop/healing%20herbs%20bundle.jpg' },
    { id: 'prod7', name: 'Hand-Woven Rasta Beanie', price: '$30.00', artisan: MOCK_USERS[5].name, image: '/images/shop/hand%20woven%20rasta%20beanie.jpg' },
    { id: 'prod8', name: 'Organic Coconut Oil', price: '$12.00', artisan: MOCK_USERS[4].name, image: '/images/shop/organic%20coconut%20oil.jpg' }
];

export const MOCK_RETREATS = [
    { id: 'r1', title: 'Roots & Culture Immersion', category: 'Village Retreats', date: 'March 12-15', duration: '4 Days', price: 'From $450', spots: '3 spots left', rating: 5.0, reviews: 124, badge: 'Likely to Sell Out', image: '/images/Z62_5733-retreats-1024x681.jpeg', description: 'Live within the village. Participate in morning glory, farming, cooking, and nightly reasoning by the fire.' },
    { id: 'r2', title: 'Spiritual Cleansing Weekend', category: 'Village Retreats', date: 'April 4-6', duration: '3 Days', price: 'From $300', spots: '8 spots left', rating: 4.8, reviews: 89, badge: 'Top Rated', image: '/images/River-768x424.jpg', description: 'Reconnect with your inner self through meditation, river baths, and guidance from the Elders.' },
    { id: 'r3', title: 'Living Water Detox', category: 'Village Retreats', date: 'May 10-14', duration: '5 Days', price: 'From $550', spots: '5 spots left', rating: 4.9, reviews: 45, badge: 'Healing', image: '/images/Z62_5385-768x511.jpg', description: 'A holistic detox program using the healing waters of the river and natural herbal remedies.' },
    { id: 'r4', title: 'Mountain Hike & Reasoning', category: 'Village Retreats', date: 'June 20-22', duration: '3 Days', price: 'From $250', spots: '10 spots left', rating: 4.7, reviews: 67, badge: 'Adventure', image: '/images/DJI_0073-retreats-768x519.jpeg', description: 'Journey to the peaks for breathtaking views and deep reasoning sessions with the community.' },
    { id: 'c1', title: 'Earthstrong Celebration: Bob Marley Day', category: 'Ceremonies', date: 'Feb 6', duration: 'All Day', price: 'Donation', spots: 'Open', rating: 4.9, reviews: 312, badge: 'Special Event', image: '/images/Ceremonial-1f35b70-1-768x1024.jpg', description: 'Join us for drumming, chanting, and reasoning as we celebrate the life of the Gong.' },
    { id: 'c2', title: 'Full Moon Nyabinghi', category: 'Ceremonies', date: 'March 3', duration: 'Night', price: 'Free', spots: 'Open', rating: 5.0, reviews: 156, badge: 'Sacred', image: '/images/DJI_0067_ceremony-1-768x564.jpeg', description: 'Gather under the moonlight for a traditional Nyabinghi drumming and chanting session. All are welcome.' },
    { id: 'c3', title: 'Solstice Gathering', category: 'Ceremonies', date: 'June 21', duration: 'All Day', price: 'Donation', spots: 'Open', rating: 4.8, reviews: 98, badge: 'Community', image: '/images/IMG_6582-768x1024.jpg', description: 'Celebrate the longest day of the year with community feasting, reasoning, and gratitude.' },
    { id: 't1', title: 'River Valley Hike', category: 'Day Tours', date: 'Daily', duration: '4 Hours', price: '$45', spots: 'Daily', rating: 4.9, reviews: 210, badge: 'Nature', image: '/images/Z62_5332-768x511.jpg', description: 'Explore the lush valley, hidden trails, and vibrant flora of the Rastafari Indigenous Village.' },
    { id: 't2', title: 'Organic Farm Tour', category: 'Day Tours', date: 'Tue, Thu, Sat', duration: '3 Hours', price: '$35', spots: '12 spots', rating: 4.8, reviews: 145, badge: 'Eco', image: '/images/Bagoodie-Bananas-1-768x1024.jpg', description: 'Learn about sustainable farming and harvest your own fruits from our organic gardens.' },
    { id: 't3', title: 'Hidden Waterfalls Adventure', category: 'Day Tours', date: 'Mod, Fri', duration: '5 Hours', price: '$60', spots: '8 spots', rating: 5.0, reviews: 320, badge: 'Adventure', image: '/images/IMG_9426-9e7d2f6-1152x1536.jpg', description: 'Trek to the secluded waterfalls for a refreshing dip and a natural massage.' },
    { id: 't4', title: 'Village Architecture Walk', category: 'Day Tours', date: 'Wed, Sun', duration: '2 Hours', price: '$25', spots: 'Daily', rating: 4.7, reviews: 88, badge: 'Culture', image: '/images/RIV-2-768x432.jpeg', description: 'Discover the traditional building techniques and sustainable structures of the village.' },
    { id: 't5', title: 'Herbal Medicine Walk', category: 'Day Tours', date: 'Thu, Sun', duration: '3 Hours', price: '$40', spots: '10 spots', rating: 4.9, reviews: 190, badge: 'Wellness', image: '/images/Z62_5323-768x511.jpg', description: 'Identify local healing herbs and learn about their traditional uses with our village healer.' },
    { id: 't6', title: 'Meditation by the Stream', category: 'Day Tours', date: 'Daily', duration: '1 Hour', price: '$20', spots: 'Unlimited', rating: 4.8, reviews: 112, badge: 'Relax', image: '/images/Z62_5739-retreats-768x511.jpeg', description: 'Find inner peace with a guided meditation session alongside the gentle sounds of the river.' },
    { id: 't7', title: 'Community Cooking Experience', category: 'Day Tours', date: 'Fri, Sat', duration: '4 Hours', price: '$55', spots: '15 spots', rating: 4.9, reviews: 256, badge: 'Food', image: '/images/Z62_5961-retreats-768x511.jpeg', description: 'Cook an Ital feast with the community using fresh ingredients from the farm.' },
    { id: 't8', title: 'Sunset Reasoning & Bonfire', category: 'Day Tours', date: 'Nightly', duration: '3 Hours', price: '$30', spots: 'Open', rating: 5.0, reviews: 400, badge: 'Social', image: '/images/itility-2-1536x864.jpeg', description: 'End the day with deep reasoning, drumming, and warmth around the community fire.' }
];

export const MOCK_WORKSHOPS = [
    { id: 'w1', title: 'Traditional Nyabinghi Drumming', instructor: MOCK_USERS[2].name, level: 'Intermediate', duration: '4 Weeks', students: 24, image: '/images/Ceremonial-1f35b70-1-768x1024.jpg', description: 'Learn the intricate rhythms of Nyabinghi drumming on the repeater.', price: 'Free' },
    { id: 'w2', title: 'Ital Cooking Fundamentals', instructor: MOCK_USERS[5].name, level: 'Beginner', duration: '2 Weeks', students: 56, image: '/images/riv-food-768x576.jpeg', description: 'Discover the healing power of food. Learn to cook without salt using natural herbs.', price: '$25' },
    { id: 'w3', title: 'Herbal Medicine Identification', instructor: MOCK_USERS[3].name, level: 'Advanced', duration: '6 Weeks', students: 12, image: '/images/IMG_9211-768x1024.jpg', description: 'A deep dive into the flora of the river valley. Identify, harvest, and prepare natural remedies.', price: '$50' }
];

export const MOCK_PODCASTS = [
    { id: 'pod1', title: 'Reasoning by the River', episode: 'Ep 14: The Power of Words', duration: '45:20', host: MOCK_USERS[0].name, image: '/images/River-768x424.jpg' },
    { id: 'pod2', title: 'Village News Weekly', episode: 'Updates on the Community Center', duration: '15:00', host: MOCK_USERS[9].name, image: '/images/IMG_9656-9646aeb-1-1024x768.jpg' },
    { id: 'pod3', title: 'Rhythms of Life', episode: 'Exploring Nyabinghi Drumming Patterns', duration: '60:00', host: MOCK_USERS[1].name, image: '/images/DJI_0067_ceremony-1-768x564.jpeg' },
    { id: 'pod4', title: 'Roots & Culture', episode: 'The Significance of the Ankh', duration: '32:15', host: MOCK_USERS[3].name, image: '/images/Ceremonial-1f35b70-1-768x1024.jpg' },
    { id: 'pod5', title: 'Healing Streams', episode: 'Herbal Remedies for Modern Ailments', duration: '40:00', host: MOCK_USERS[7].name, image: '/images/Z62_5323-768x511.jpg' }
];


// --- Posts (Feed) ---

export const MOCK_POSTS: Post[] = [
    // 1. Standard Post (Pinned/Important)
    {
        id: 'p1',
        user: MOCK_USERS[0],
        content: 'Giving thanks for the blessings of the earth. We are planting the scotch bonnet peppers this morning. Join us at the farm.',
        type: 'standard',
        likes: 42,
        replies: 5,
        timestamp: '2h ago'
    },
    // 2. Video Share (Pumpkin Stew) - Reference Video 2
    {
        id: 'p_share_video',
        user: MOCK_USERS[5],
        content: 'The richness of the coconut milk bubbling with the ackee. A true taste of the yard. Full joy with every bite. 🥥🥘 #ItalIsVital',
        type: 'video_share',
        sharedData: MOCK_VIDEOS[1],
        likes: 18,
        replies: 4,
        timestamp: '3h ago'
    },
    // 3. Poll
    {
        id: 'p_poll_1',
        user: MOCK_USERS[2],
        content: 'Respect to the family. For the next reasoning and film night, which vibration should we hold?',
        type: 'poll',
        pollOptions: [
            { id: 'opt1', label: 'Documentary (Earth)', votes: 45 },
            { id: 'opt2', label: 'Reggae Concert (Live)', votes: 32 },
            { id: 'opt3', label: 'History & Culture', votes: 23 }
        ],
        pollTotalWrites: 100,
        likes: 25,
        replies: 14,
        timestamp: '6h ago'
    },
    // 4. Carousel (Images)
    {
        id: 'p_carousel_1',
        user: MOCK_USERS[3],
        content: 'The water is healing. Reflections from our morning river bath and meditation series. 🌊🌿',
        type: 'carousel',
        images: [
            '/images/River-768x424.jpg',
            '/images/IMG_9426-9e7d2f6-1152x1536.jpg',
            '/images/Z62_5729-retreat-768x511.jpeg',
            '/images/Z62_5739-retreats-768x511.jpeg',
            '/images/IMG_9598-1152x1536.jpg',
            '/images/Z62_5385-768x511.jpg'
        ],
        likes: 89,
        replies: 12,
        timestamp: '8h ago'
    },
    // 5. Product Share (Necklace) - Reference Product 2
    {
        id: 'p_share_prod',
        user: MOCK_USERS[7],
        content: 'Creativity flowing from the hands. Red, Gold, and Green creations available for the community. Support local craft. 🎨📿',
        type: 'product_share',
        sharedData: MOCK_PRODUCTS[1],
        likes: 56,
        replies: 8,
        timestamp: '12h ago'
    },
    // 6. Retreat/Event Share (Bob Marley Day) - Reference Retreat 3
    {
        id: 'p_share_event',
        user: MOCK_USERS[0],
        content: 'The drums will be beating at the river. Earthstrong celebration coming forward. Prepare your heart and mind.',
        type: 'event_share',
        sharedData: MOCK_RETREATS[2],
        likes: 112,
        replies: 45,
        timestamp: '1d ago'
    },
    // 7. Article Share (Solstice) - Article 1
    {
        id: 'p_share_article',
        user: MOCK_USERS[1],
        content: 'Meditations on the turning of the sun. A reasoning on the Solstice and its meaning for I&I.',
        type: 'article_share',
        sharedData: MOCK_ARTICLES[0],
        likes: 34,
        replies: 2,
        timestamp: '1d ago'
    },
    // 8. Standard Image Post
    {
        id: 'p3',
        user: MOCK_USERS[6],
        content: 'The Red Cabin serves as a sanctuary for those seeking solitude. A perfect place to write, think, or simply be.',
        type: 'standard',
        image: '/images/RED-CABIN-1536x864.jpg',
        likes: 15,
        replies: 3,
        timestamp: '2d ago'
    },
    // 9. Text Post
    {
        id: 'p4',
        user: MOCK_USERS[0],
        content: 'Reasoning tonight at the tabernacle. Wisdom is free for those who listen. Bring your instruments.',
        type: 'standard',
        likes: 89,
        replies: 24,
        timestamp: '2d ago'
    },
    // 10. Carousel (Farming)
    {
        id: 'p_carousel_2',
        user: MOCK_USERS[7],
        content: 'From the soil to the soul. Look at this beautiful harvest we were blessed with today. 🍌🥬',
        type: 'carousel',
        images: [
            '/images/Food-Spread-1024x768.jpeg',
            '/images/Bagoodie-Bananas-1-768x1024.jpg',
            '/images/IMG_9238-768x1024.jpg',
            '/images/riv-food-768x576.jpeg'
        ],
        likes: 67,
        replies: 9,
        timestamp: '3d ago'
    },
    // 11. New Mock Carousel
    {
        id: 'p_carousel_3',
        user: MOCK_USERS[4],
        content: 'Community is strength. Joyful moments from today\'s gathering. Rise in Love, RIV family. ❤️💛💚',
        type: 'carousel',
        images: [
            '/images/IMG_6582-768x1024.jpg',
            '/images/IMG_6924-768x1024.jpg',
            '/images/Z62_6032-1-768x511.jpg',
            '/images/Z62_5991-681x1024.jpg',
            '/images/Z62_6023-couple-768x511.jpeg'
        ],
        likes: 120,
        replies: 32,
        timestamp: '4d ago'
    }
];
