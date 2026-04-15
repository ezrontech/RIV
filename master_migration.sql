-- ============================================================
-- MASTER MIGRATION — Run this ONCE in Supabase SQL Editor
-- Covers: profile columns, follows, comments, post_likes, reshares
-- ============================================================

-- ── 1. Profile Columns ───────────────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- ── 2. Fix role constraint (allow 'creator') ─────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check') THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_role_check;
    END IF;
END $$;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('creator', 'member', 'visitor'));
UPDATE profiles SET role = 'creator' WHERE role = 'elder';

-- ── 3. Follows ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS follows (
    follower_id  TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    following_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (follower_id, following_id)
);
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public follows are viewable by everyone." ON follows;
CREATE POLICY "Public follows are viewable by everyone." ON follows FOR SELECT USING (true);
DROP POLICY IF EXISTS "authenticated users can follow/unfollow" ON follows;
CREATE POLICY "authenticated users can follow/unfollow" ON follows FOR ALL USING (auth.uid()::text = follower_id);

-- ── 4. Reshare columns on posts ──────────────────────────────────────────────
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reshare_of_id TEXT REFERENCES posts(id) ON DELETE SET NULL;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reshare_count INT NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS posts_reshare_of_id_idx ON posts (reshare_of_id);

-- Reshare count triggers
CREATE OR REPLACE FUNCTION increment_reshare_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'reshare' AND NEW.reshare_of_id IS NOT NULL THEN
        UPDATE posts SET reshare_count = reshare_count + 1 WHERE id = NEW.reshare_of_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_increment_reshare_count ON posts;
CREATE TRIGGER trg_increment_reshare_count
    AFTER INSERT ON posts
    FOR EACH ROW EXECUTE FUNCTION increment_reshare_count();

CREATE OR REPLACE FUNCTION decrement_reshare_count()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.type = 'reshare' AND OLD.reshare_of_id IS NOT NULL THEN
        UPDATE posts SET reshare_count = GREATEST(0, reshare_count - 1) WHERE id = OLD.reshare_of_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_decrement_reshare_count ON posts;
CREATE TRIGGER trg_decrement_reshare_count
    AFTER DELETE ON posts
    FOR EACH ROW EXECUTE FUNCTION decrement_reshare_count();

-- ── 5. Post Likes ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS post_likes (
    post_id    TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (post_id, user_id)
);
CREATE INDEX IF NOT EXISTS post_likes_post_id_idx ON post_likes (post_id);
CREATE INDEX IF NOT EXISTS post_likes_user_id_idx ON post_likes (user_id);
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read likes" ON post_likes;
CREATE POLICY "Anyone can read likes"       ON post_likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth users can insert likes" ON post_likes;
CREATE POLICY "Auth users can insert likes" ON post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
DROP POLICY IF EXISTS "Users can delete own likes" ON post_likes;
CREATE POLICY "Users can delete own likes"  ON post_likes FOR DELETE USING (auth.uid()::text = user_id);

-- Like count triggers
CREATE OR REPLACE FUNCTION increment_post_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts SET likes = likes + 1 WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_increment_post_likes ON post_likes;
CREATE TRIGGER trg_increment_post_likes
    AFTER INSERT ON post_likes
    FOR EACH ROW EXECUTE FUNCTION increment_post_likes();

CREATE OR REPLACE FUNCTION decrement_post_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts SET likes = GREATEST(0, likes - 1) WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_decrement_post_likes ON post_likes;
CREATE TRIGGER trg_decrement_post_likes
    AFTER DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION decrement_post_likes();

-- ── 6. Comments ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
    id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    post_id    TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id  TEXT REFERENCES comments(id) ON DELETE CASCADE,
    content    TEXT NOT NULL,
    likes      INT  NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS comments_post_id_idx   ON comments (post_id);
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON comments (parent_id);
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read comments" ON comments;
CREATE POLICY "Anyone can read comments"       ON comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth users can insert comments" ON comments;
CREATE POLICY "Auth users can insert comments" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
CREATE POLICY "Users can update own comments"  ON comments FOR UPDATE USING (auth.uid()::text = user_id);
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments"  ON comments FOR DELETE USING (auth.uid()::text = user_id);

-- Comment reply count triggers
CREATE OR REPLACE FUNCTION increment_post_replies()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_id IS NULL THEN
        UPDATE posts SET replies = replies + 1 WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_increment_post_replies ON comments;
CREATE TRIGGER trg_increment_post_replies
    AFTER INSERT ON comments
    FOR EACH ROW EXECUTE FUNCTION increment_post_replies();

CREATE OR REPLACE FUNCTION decrement_post_replies()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.parent_id IS NULL THEN
        UPDATE posts SET replies = GREATEST(0, replies - 1) WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_decrement_post_replies ON comments;
CREATE TRIGGER trg_decrement_post_replies
    AFTER DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION decrement_post_replies();

-- ── 7. Fix posts INSERT policy to allow reshares ─────────────────────────────
-- Reshares use user_id  = auth.uid() which the existing policy already covers.
-- The existing "Users can insert own posts." policy is sufficient.

-- ── 8. Creator role management ───────────────────────────────────────────────
DROP POLICY IF EXISTS "creators manage roles" ON profiles;
CREATE POLICY "creators manage roles" ON profiles FOR UPDATE
USING ((SELECT role FROM profiles WHERE id = auth.uid()::text) = 'creator')
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()::text) = 'creator');

-- ── Done ─────────────────────────────────────────────────────────────────────
-- After running this, refresh your app. All features should work correctly.
