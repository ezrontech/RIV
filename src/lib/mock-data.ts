
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


// --- New Series Data ---
export const MOCK_SERIES: Series[] = [
    {
        id: 's1',
        title: 'Cooking with Sister Irie',
        host: 'Sister Irie',
        description: 'Learn the secrets of authentic Ital cooking, from farm to table. No salt, pure vibes.',
        thumbnail: '/images/riv-food-768x576.jpeg', // Vertical crop usually preferred but this works
        cover: '/images/Food-Spread-1024x768.jpeg',
        episodes: ['v2', 'v9'],
        category: 'Cooking'
    },
    {
        id: 's2',
        title: 'Reasonings by the River',
        host: 'Elder Bongo',
        description: 'Deep conversations about life, history, and spirituality, filmed on the banks of the river.',
        thumbnail: '/images/River-768x424.jpg',
        cover: '/images/DJI_0073-retreats-768x519.jpeg',
        episodes: ['v3', 'v11'],
        category: 'Reasoning'
    },
    {
        id: 's3',
        title: 'Farming 101: The Natural Way',
        host: 'RIV News Network',
        description: 'Sustainable farming techniques for the modern age. Grow your own food, heal the nation.',
        thumbnail: '/images/Bagoodie-Bananas-1-768x1024.jpg',
        cover: '/images/Bagoodie-Bananas-1-768x1024.jpg',
        episodes: ['v6', 'v12'],
        category: 'Farming'
    },
    {
        id: 's4',
        title: 'Village News Weekly',
        host: 'RIV News Network', // Using a channel name as host
        description: 'Updates from the community, upcoming events, and stories from the people.',
        thumbnail: '/images/IMG_9656-9646aeb-1-1024x768.jpg',
        cover: '/images/IMG_9647-1-1152x1536.jpg',
        episodes: ['v5', 'v8'],
        category: 'News'
    },
    {
        id: 's5',
        title: 'Rhythms of Life',
        host: 'Ras Tafari Youth',
        description: 'Explorations into the heartbeat of the drum and the chants of the ancients.',
        thumbnail: '/images/firstman-768x1024.webp',
        cover: '/images/Firstman-_-Nereri-BW-1-768x576.jpg',
        episodes: ['v4', 'v7'],
        category: 'Music'
    }
];


export const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Elder Bongo', username: 'bongoriv', avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=200', role: 'elder' },
    { id: 'u2', name: 'Sister Irie', username: 'irie_vibes', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200', role: 'member' },
    { id: 'u3', name: 'Ras Tafari Youth', username: 'young_lion', avatar: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?auto=format&fit=crop&q=80&w=200', role: 'member' },
    { id: 'u4', name: 'Mama Africa', username: 'roots_daughter', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200', role: 'elder' },
    { id: 'u5', name: 'Kingston Link', username: 'city_youth', avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=200', role: 'visitor' }
];

// --- Modules Data ---

export const MOCK_CHANNELS = [
    { id: 'c1', name: 'Village Builders', avatar: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&q=80&w=200', subscribers: '1.2K' },
    { id: 'c2', name: 'Sister Irie Kitchen', avatar: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=200', subscribers: '4.5K' },
    { id: 'c3', name: 'Wisdom Keepers', avatar: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=200', subscribers: '8.9K' },
    { id: 'c4', name: 'Rhythms of Life', avatar: 'https://images.unsplash.com/photo-1519730722595-a5ff788dea4d?auto=format&fit=crop&q=80&w=200', subscribers: '3.1K' },
    { id: 'c5', name: 'RIV News Network', avatar: 'https://images.unsplash.com/photo-1495020686667-45e86d4e610d?auto=format&fit=crop&q=80&w=200', subscribers: '5.6K' },
    { id: 'c6', name: 'Natural Farming', avatar: 'https://images.unsplash.com/photo-1628191011993-4350f2f3d650?auto=format&fit=crop&q=80&w=200', subscribers: '2.8K' }
];

export const MOCK_VIDEOS = [
    { id: 'v1', title: 'Building a Traditional Tabernacle - Day 1', channel: MOCK_CHANNELS[0], views: '1.2K views', time: '2 days ago', duration: '14:20', category: 'Construction', thumbnail: '/images/RED-CABIN-1536x864.jpg' },
    { id: 'v2', title: 'Authentic Ital Pumpkin Stew Recipe', channel: MOCK_CHANNELS[1], views: '3.4K views', time: '1 week ago', duration: '22:15', category: 'Cooking', thumbnail: '/images/riv-food-768x576.jpeg' },
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
    { id: 'a1', title: 'The Significance of the Solstice', excerpt: 'As the seasons change, we reflect on the balance of light and dark within our community rituals.', author: 'Elder Bongo', date: 'Feb 4, 2026', image: '/images/Z62_5332-768x511.jpg' },
    { id: 'a2', title: 'New Harvest: Scotch Bonnet Peppers', excerpt: 'Our latest crop is ready. Learn how we cultivate the finest peppers using traditional methods.', author: 'Sister Irie', date: 'Feb 1, 2026', image: '/images/Food-Spread-1024x768.jpeg' },
    { id: 'a3', title: 'Voices of the Elders: A Conversation', excerpt: 'A transcription of last night\'s reasoning session at the Tabernacle.', author: 'Young Lion', date: 'Jan 28, 2026', image: '/images/Quen-Tebah-Nereri-1-768x576.jpg' }
];

export const MOCK_PRODUCTS = [
    { id: 'prod1', name: 'Handcrafted Coconut Soap', price: '$8.00', artisan: 'Sister Irie', image: '/images/riv-calabash-768x576.jpeg' },
    { id: 'prod2', name: 'Red Gold Green Beaded Necklace', price: '$25.00', artisan: 'Ras Tafari Youth', image: '/images/IMG_6472-768x576.jpg' },
    { id: 'prod3', name: 'Organic Scotch Bonnet Spice', price: '$12.00', artisan: 'Elder Bongo', image: '/images/riv-food-768x576.jpeg' },
    { id: 'prod4', name: 'Hand Carved Calabash Bowl', price: '$35.00', artisan: 'Elder Bongo', image: '/images/riv-calabash-768x576.jpeg' },
    { id: 'prod5', name: 'Organic Green Bananas (Bunch)', price: '$5.00', artisan: 'RIV News Network', image: '/images/Bagoodie-Bananas-1-768x1024.jpg' },
    { id: 'prod6', name: 'Handcrafted Repeater Drum', price: '$250.00', artisan: 'Ras Tafari Youth', image: '/images/Z62_5334-768x511.jpg' },
    { id: 'prod7', name: 'Dried Cerasee Bush (Pack)', price: '$15.00', artisan: 'Mama Africa', image: '/images/IMG_9211-768x1024.jpg' },
    { id: 'prod8', name: 'Roots Tonic Selection', price: '$20.00', artisan: 'Sister Irie', image: '/images/IMG_6582-768x1024.jpg' }
];

export const MOCK_RETREATS = [
    { id: 'r1', title: 'Roots & Culture Immersion', category: 'Village Retreats', date: 'March 12-15', duration: '4 Days', price: 'From $450', spots: '3 spots left', rating: 5.0, reviews: 124, badge: 'Likely to Sell Out', image: '/images/Z62_5733-retreats-1024x681.jpeg', description: 'Live within the village. Participate in morning glory, farming, cooking, and nightly reasoning by the fire.' },
    { id: 'r2', title: 'Spiritual Cleansing Weekend', category: 'Village Retreats', date: 'April 4-6', duration: '3 Days', price: 'From $300', spots: '8 spots left', rating: 4.8, reviews: 89, badge: 'Top Rated', image: '/images/River-768x424.jpg', description: 'Reconnect with your inner self through meditation, river baths, and guidance from the Elders.' },
    { id: 'c1', title: 'Earthstrong Celebration: Bob Marley Day', category: 'Ceremonies', date: 'Feb 6', duration: 'All Day', price: 'Donation', spots: 'Open', rating: 4.9, reviews: 312, badge: 'Special Event', image: '/images/Ceremonial-1f35b70-1-768x1024.jpg', description: 'Join us for drumming, chanting, and reasoning as we celebrate the life of the Gong.' }
];

export const MOCK_WORKSHOPS = [
    { id: 'w1', title: 'Mastering the Repeater Drum', instructor: 'Ras Tafari Youth', level: 'Intermediate', duration: '4 Weeks', students: 24, image: '/images/Z62_5334-768x511.jpg', description: 'Learn the intricate rhythms of Nyabinghi drumming on the repeater.', price: 'Free' },
    { id: 'w2', title: 'Ital Cooking Fundamentals', instructor: 'Sister Irie', level: 'Beginner', duration: '2 Weeks', students: 56, image: '/images/riv-food-768x576.jpeg', description: 'Discover the healing power of food. Learn to cook without salt using natural herbs.', price: '$25' },
    { id: 'w3', title: 'Herbal Medicine Identification', instructor: 'Mama Africa', level: 'Advanced', duration: '6 Weeks', students: 12, image: '/images/IMG_9211-768x1024.jpg', description: 'A deep dive into the flora of the river valley. Identify, harvest, and prepare natural remedies.', price: '$50' }
];

export const MOCK_PODCASTS = [
    { id: 'pod1', title: 'Reasoning by the River', episode: 'Ep 14: The Power of Words', duration: '45:20', host: 'Elder Bongo', image: '/images/River-768x424.jpg' },
    { id: 'pod2', title: 'Village News Weekly', episode: 'Updates on the Community Center', duration: '15:00', host: 'Sister Irie', image: '/images/IMG_9656-9646aeb-1-1024x768.jpg' },
    { id: 'pod3', title: 'Rhythms of Life', episode: 'Exploring Nyabinghi Drumming Patterns', duration: '60:00', host: 'Ras Tafari Youth', image: '/images/DJI_0067_ceremony-1-768x564.jpeg' }
];


// --- Posts (Feed) ---

export const MOCK_POSTS: Post[] = [
    // 1. Standard Post (Pinned/Important)
    {
        id: 'p1',
        user: MOCK_USERS[0],
        content: 'Greetings to the village. Today we are planting the new scotch bonnet peppers. The soil is blessed. Come lend a hand directly after sunrise.',
        type: 'standard',
        likes: 42,
        replies: 5,
        timestamp: '2h ago'
    },
    // 2. Video Share (Pumpkin Stew) - Reference Video 2
    {
        id: 'p_share_video',
        user: MOCK_USERS[4],
        content: 'Have you all seen this new tutorial from Sister Irie? I tried it last night and the stew was magnificent! 🔥',
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
        content: 'Family, for the next movie night at the center, what format should we choose?',
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
        user: MOCK_USERS[1],
        content: 'Scenes from the river deep in the valley. Purification and meditation. 🌊🌿',
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
        user: MOCK_USERS[3],
        content: 'My new batch of necklaces is finally ready. Red, Gold, and Green representing the life force. Available in the shop now.',
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
        content: 'We are gathering for the Earthstrong celebration soon. Please mark your calendars and prepare your white garments.',
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
        content: 'A powerful reflection on the seasons. Worth a read before the harvest.',
        type: 'article_share',
        sharedData: MOCK_ARTICLES[0],
        likes: 34,
        replies: 2,
        timestamp: '1d ago'
    },
    // 8. Standard Image Post
    {
        id: 'p3',
        user: MOCK_USERS[2],
        content: 'Building the new reasoning hut. We need more bamboo. Anyone travelling from the hills?',
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
        content: 'Reasoning tonight at the tabernacle. Wisdom is free for those who listen.',
        type: 'standard',
        likes: 89,
        replies: 24,
        timestamp: '2d ago'
    },
    // 10. Carousel (Farming)
    {
        id: 'p_carousel_2',
        user: MOCK_USERS[3],
        content: 'Harvest time is here! From the bananas to the preparation table, the blessings of the earth are abundant. 🍌🥘',
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
        content: 'Full joy in the village today. Family, friends, and good vibes. ❤️💛💚',
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
