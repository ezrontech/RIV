-- ============================================================
-- Migration: Post Likes + Reshare System
-- Run this in the Supabase SQL Editor AFTER comments_migration.sql
-- ============================================================

-- ── 1. Post Likes table ──────────────────────────────────────────────────────
-- Tracks exactly which user liked which post (prevents double-likes)
CREATE TABLE IF NOT EXISTS post_likes (
    post_id    TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS post_likes_post_id_idx  ON post_likes (post_id);
CREATE INDEX IF NOT EXISTS post_likes_user_id_idx  ON post_likes (user_id);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read likes"       ON post_likes FOR SELECT USING (true);
CREATE POLICY "Auth users can insert likes" ON post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own likes"  ON post_likes FOR DELETE USING (auth.uid()::text = user_id);

-- Function: increment posts.likes when a like is inserted
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

-- Function: decrement posts.likes when a like is removed
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

-- ── 2. Add reshare columns to posts ──────────────────────────────────────────
-- reshare_of_id: points to the original post being reshared
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reshare_of_id TEXT REFERENCES posts(id) ON DELETE SET NULL;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reshare_count INT NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS posts_reshare_of_id_idx ON posts (reshare_of_id);

-- Function: increment original post's reshare_count when reshared
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

-- Function: decrement original post's reshare_count when reshare is deleted
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

-- ── 3. RLS: allow authenticated users to insert reshares ─────────────────────
-- The existing "Users can insert own posts." policy already covers this
-- since reshares are just posts with type = 'reshare'.
-- No additional policy needed.
