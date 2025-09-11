-- Enable Row Level Security (RLS)
-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE poll_status AS ENUM ('active', 'closed', 'draft');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vote_type AS ENUM ('single', 'multiple');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create polls table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status poll_status DEFAULT 'active',
    vote_type vote_type DEFAULT 'single',
    allow_multiple_votes BOOLEAN DEFAULT false,
    max_votes_per_user INTEGER DEFAULT 1,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll_options table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS poll_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    text VARCHAR(500) NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(poll_id, option_id, user_id)
);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_polls_created_by ON polls(created_by);
CREATE INDEX IF NOT EXISTS idx_polls_status ON polls(status);
CREATE INDEX IF NOT EXISTS idx_polls_expires_at ON polls(expires_at);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_option_id ON votes(option_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for polls table (only if it doesn't exist)
DO $$ BEGIN
    CREATE TRIGGER update_polls_updated_at 
        BEFORE UPDATE ON polls 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enable Row Level Security
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Polls are viewable by everyone" ON polls;
DROP POLICY IF EXISTS "Users can create polls" ON polls;
DROP POLICY IF EXISTS "Users can update their own polls" ON polls;
DROP POLICY IF EXISTS "Users can delete their own polls" ON polls;

DROP POLICY IF EXISTS "Poll options are viewable by everyone" ON poll_options;
DROP POLICY IF EXISTS "Poll creators can manage options" ON poll_options;

DROP POLICY IF EXISTS "Votes are viewable by everyone" ON votes;
DROP POLICY IF EXISTS "Users can vote on active polls" ON votes;
DROP POLICY IF EXISTS "Users can update their own votes" ON votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;

-- Create RLS policies for polls
CREATE POLICY "Polls are viewable by everyone" ON polls
    FOR SELECT USING (true);

CREATE POLICY "Users can create polls" ON polls
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own polls" ON polls
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own polls" ON polls
    FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for poll_options
CREATE POLICY "Poll options are viewable by everyone" ON poll_options
    FOR SELECT USING (true);

CREATE POLICY "Poll creators can manage options" ON poll_options
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = poll_options.poll_id 
            AND polls.created_by = auth.uid()
        )
    );

-- Create RLS policies for votes
CREATE POLICY "Votes are viewable by everyone" ON votes
    FOR SELECT USING (true);

CREATE POLICY "Users can vote on active polls" ON votes
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = votes.poll_id 
            AND polls.status = 'active'
            AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
        )
    );

CREATE POLICY "Users can update their own votes" ON votes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON votes
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to check vote limits
CREATE OR REPLACE FUNCTION check_vote_limits()
RETURNS TRIGGER AS $$
DECLARE
    poll_record polls%ROWTYPE;
    current_vote_count INTEGER;
BEGIN
    -- Get poll information
    SELECT * INTO poll_record FROM polls WHERE id = NEW.poll_id;
    
    -- Check if poll is active
    IF poll_record.status != 'active' THEN
        RAISE EXCEPTION 'Cannot vote on inactive poll';
    END IF;
    
    -- Check if poll has expired
    IF poll_record.expires_at IS NOT NULL AND poll_record.expires_at <= NOW() THEN
        RAISE EXCEPTION 'Poll has expired';
    END IF;
    
    -- Count current votes for this user on this poll
    SELECT COUNT(*) INTO current_vote_count 
    FROM votes 
    WHERE poll_id = NEW.poll_id AND user_id = NEW.user_id;
    
    -- Check vote limits
    IF poll_record.allow_multiple_votes = false AND current_vote_count > 0 THEN
        RAISE EXCEPTION 'Multiple votes not allowed on this poll';
    END IF;
    
    IF poll_record.max_votes_per_user IS NOT NULL AND current_vote_count >= poll_record.max_votes_per_user THEN
        RAISE EXCEPTION 'Maximum votes per user reached';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote limits (only if it doesn't exist)
DO $$ BEGIN
    CREATE TRIGGER check_vote_limits_trigger
        BEFORE INSERT ON votes
        FOR EACH ROW
        EXECUTE FUNCTION check_vote_limits();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing view if it exists
DROP VIEW IF EXISTS poll_results;

-- Create view for poll results
CREATE VIEW poll_results AS
SELECT 
    p.id as poll_id,
    p.title,
    p.description,
    p.status,
    p.vote_type,
    p.allow_multiple_votes,
    p.max_votes_per_user,
    p.expires_at,
    po.id as option_id,
    po.text as option_text,
    po.order_index,
    COUNT(v.id) as vote_count,
    ROUND(
        (COUNT(v.id) * 100.0 / NULLIF((
            SELECT COUNT(*) 
            FROM votes v2 
            WHERE v2.poll_id = p.id
        ), 0)), 2
    ) as percentage
FROM polls p
LEFT JOIN poll_options po ON p.id = po.poll_id
LEFT JOIN votes v ON po.id = v.option_id
GROUP BY p.id, p.title, p.description, p.status, p.vote_type, p.allow_multiple_votes, p.max_votes_per_user, p.expires_at, po.id, po.text, po.order_index
ORDER BY p.created_at DESC, po.order_index;

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant permissions to anon users (for viewing polls)
GRANT SELECT ON polls TO anon;
GRANT SELECT ON poll_options TO anon;
GRANT SELECT ON votes TO anon;
GRANT SELECT ON poll_results TO anon;
