-- ============================================================
-- Migration: Comments System
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Comments table (supports threaded replies via parent_id)
CREATE TABLE IF NOT EXISTS comments (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    post_id     TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id     TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id   TEXT REFERENCES comments(id) ON DELETE CASCADE, -- NULL = top-level, set = reply
    content     TEXT NOT NULL,
    likes       INT  NOT NULL DEFAULT 0,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Index for fast lookup by post
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments (post_id);
-- Index for fast lookup of replies
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON comments (parent_id);

-- Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"      ON comments FOR SELECT USING (true);
CREATE POLICY "Auth users can insert comments" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own comments"  ON comments FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own comments"  ON comments FOR DELETE USING (auth.uid()::text = user_id);

-- Function to auto-increment post reply count when a TOP-LEVEL comment is inserted
CREATE OR REPLACE FUNCTION increment_post_replies()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_id IS NULL THEN
        UPDATE posts SET replies = replies + 1 WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS trg_increment_post_replies ON comments;
CREATE TRIGGER trg_increment_post_replies
    AFTER INSERT ON comments
    FOR EACH ROW EXECUTE FUNCTION increment_post_replies();

-- Function to auto-decrement post reply count when a TOP-LEVEL comment is deleted
CREATE OR REPLACE FUNCTION decrement_post_replies()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.parent_id IS NULL THEN
        UPDATE posts SET replies = GREATEST(0, replies - 1) WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS trg_decrement_post_replies ON comments;
CREATE TRIGGER trg_decrement_post_replies
    AFTER DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION decrement_post_replies();
