-- ============================================================
-- Migration: Comment Likes System
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Comment Likes table
CREATE TABLE IF NOT EXISTS comment_likes (
    comment_id TEXT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (comment_id, user_id)
);

-- Indexing
CREATE INDEX IF NOT EXISTS comment_likes_comment_id_idx ON comment_likes (comment_id);
CREATE INDEX IF NOT EXISTS comment_likes_user_id_idx ON comment_likes (user_id);

-- RLS
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read comment likes" ON comment_likes;
CREATE POLICY "Anyone can read comment likes"       ON comment_likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth users can insert comment likes" ON comment_likes;
CREATE POLICY "Auth users can insert comment likes" ON comment_likes FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
DROP POLICY IF EXISTS "Users can delete own comment likes" ON comment_likes;
CREATE POLICY "Users can delete own comment likes"  ON comment_likes FOR DELETE USING (auth.uid()::text = user_id);

-- Like count triggers
CREATE OR REPLACE FUNCTION increment_comment_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE comments SET likes = likes + 1 WHERE id = NEW.comment_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_increment_comment_likes ON comment_likes;
CREATE TRIGGER trg_increment_comment_likes
    AFTER INSERT ON comment_likes
    FOR EACH ROW EXECUTE FUNCTION increment_comment_likes();

CREATE OR REPLACE FUNCTION decrement_comment_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE comments SET likes = GREATEST(0, likes - 1) WHERE id = OLD.comment_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_decrement_comment_likes ON comment_likes;
CREATE TRIGGER trg_decrement_comment_likes
    AFTER DELETE ON comment_likes
    FOR EACH ROW EXECUTE FUNCTION decrement_comment_likes();
