-- Database Schema Setup for Rastafari Indigenous Village (RIV)
-- Run this in the Supabase SQL Editor

-- 1. Drop existing tables if re-running
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS podcasts CASCADE;
DROP TABLE IF EXISTS workshops CASCADE;
DROP TABLE IF EXISTS retreats CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS channels CASCADE;
DROP TABLE IF EXISTS series CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;


-- 2. Profiles
CREATE TABLE profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL,
    avatar TEXT,
    banner_url TEXT,
    bio TEXT,
    website TEXT,
    email TEXT,
    role TEXT CHECK (role IN ('elder', 'member', 'visitor'))
);

-- 3. Channels
CREATE TABLE channels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    subscribers TEXT
);

-- 4. Products
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id),
    name TEXT NOT NULL,
    price TEXT,
    artisan TEXT,
    image TEXT
);

-- 5. Articles
CREATE TABLE articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT,
    author TEXT,
    date TEXT,
    image TEXT
);

-- 6. Retreats (Including Tours & Ceremonies)
CREATE TABLE retreats (
    id TEXT PRIMARY KEY,
    title TEXT,
    category TEXT,
    date TEXT,
    duration TEXT,
    price TEXT,
    spots TEXT,
    rating FLOAT,
    reviews INT,
    badge TEXT,
    image TEXT,
    description TEXT
);

-- 7. Workshops
CREATE TABLE workshops (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id),
    title TEXT,
    instructor TEXT,
    level TEXT,
    duration TEXT,
    students INT,
    image TEXT,
    description TEXT,
    price TEXT
);

-- 8. Podcasts
CREATE TABLE podcasts (
    id TEXT PRIMARY KEY,
    title TEXT,
    episode TEXT,
    duration TEXT,
    host TEXT,
    image TEXT
);

-- 9. Videos
CREATE TABLE videos (
    id TEXT PRIMARY KEY,
    title TEXT,
    channel JSONB, -- Storing channel obj for simplicity
    views TEXT,
    time TEXT,
    duration TEXT,
    category TEXT,
    thumbnail TEXT
);

-- 10. Posts
CREATE TABLE posts (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES profiles(id),
    content TEXT NOT NULL,
    type TEXT,
    image TEXT,
    images JSONB,
    "pollOptions" JSONB,
    "pollTotalWrites" INT,
    "referenceId" TEXT,
    "sharedData" JSONB,
    likes INT DEFAULT 0,
    replies INT DEFAULT 0,
    timestamp TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. Storage Bucket Registration
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

-- Add drops to prevent collision errors
drop policy if exists "Public access to media" on storage.objects;
drop policy if exists "Auth upload to media" on storage.objects;

create policy "Public access to media" on storage.objects for select using ( bucket_id = 'media' );
create policy "Auth upload to media" on storage.objects for insert to authenticated with check ( bucket_id = 'media' );

-- 12. Row Level Security Policies (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid()::text = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid()::text = id);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public posts are viewable by everyone." ON posts FOR SELECT USING (true);
CREATE POLICY "Users can insert own posts." ON posts FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own posts." ON posts FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own posts." ON posts FOR DELETE USING (auth.uid()::text = user_id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public products are viewable by everyone." ON products FOR SELECT USING (true);
CREATE POLICY "Users can insert own products." ON products FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own products." ON products FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own products." ON products FOR DELETE USING (auth.uid()::text = user_id);

ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public workshops are viewable by everyone." ON workshops FOR SELECT USING (true);
CREATE POLICY "Users can insert own workshops." ON workshops FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own workshops." ON workshops FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own workshops." ON workshops FOR DELETE USING (auth.uid()::text = user_id);
 
-- 13. Social Graph: Follows
CREATE TABLE follows (
    follower_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    following_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (follower_id, following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public follows are viewable by everyone." ON follows FOR SELECT USING (true);
CREATE POLICY "authenticated users can follow/unfollow" ON follows 
    FOR ALL USING (auth.uid()::text = follower_id);
