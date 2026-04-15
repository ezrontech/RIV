ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Social Graph: Follows
CREATE TABLE IF NOT EXISTS follows (
    follower_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    following_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (follower_id, following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public follows are viewable by everyone." ON follows FOR SELECT USING (true);
CREATE POLICY "authenticated users can follow/unfollow" ON follows 
    FOR ALL USING (auth.uid()::text = follower_id);
