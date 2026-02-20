-- ===========================================
-- Storyboard AI - Database Schema for Supabase
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- ENUMS
-- ===========================================

CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');
CREATE TYPE project_status AS ENUM ('draft', 'processing', 'completed', 'failed');
CREATE TYPE scene_status AS ENUM ('pending', 'generating', 'completed', 'failed');
CREATE TYPE script_status AS ENUM ('uploaded', 'parsing', 'parsed', 'failed');
CREATE TYPE generation_job_status AS ENUM ('queued', 'processing', 'completed', 'failed');
CREATE TYPE credit_transaction_type AS ENUM ('grant', 'purchase', 'usage', 'refund', 'expiration');

-- ===========================================
-- USERS (extends Supabase auth.users)
-- ===========================================

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    avatar_url TEXT,
    credits INTEGER NOT NULL DEFAULT 10,
    subscription_tier subscription_tier NOT NULL DEFAULT 'free',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);

-- ===========================================
-- SUBSCRIPTIONS
-- ===========================================

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    tier subscription_tier NOT NULL DEFAULT 'free',
    status subscription_status NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ===========================================
-- PROJECTS
-- ===========================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    status project_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- ===========================================
-- SCENES
-- ===========================================

CREATE TABLE scenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    scene_number INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    dialogue TEXT,
    characters TEXT[] DEFAULT '{}',
    location TEXT,
    time_of_day VARCHAR(20) NOT NULL DEFAULT 'day',
    camera_angle VARCHAR(30) NOT NULL DEFAULT 'medium',
    style VARCHAR(20) NOT NULL DEFAULT 'cinematic',
    aspect_ratio VARCHAR(10) NOT NULL DEFAULT '16:9',
    image_url TEXT,
    prompt TEXT,
    negative_prompt TEXT,
    status scene_status NOT NULL DEFAULT 'pending',
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, scene_number)
);

CREATE INDEX idx_scenes_project_id ON scenes(project_id);
CREATE INDEX idx_scenes_status ON scenes(status);
CREATE INDEX idx_scenes_scene_number ON scenes(scene_number);

-- ===========================================
-- SCRIPTS
-- ===========================================

CREATE TABLE scripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    file_size INTEGER NOT NULL,
    storage_path TEXT,
    content TEXT,
    parsed_scenes JSONB DEFAULT '[]'::jsonb,
    status script_status NOT NULL DEFAULT 'uploaded',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scripts_user_id ON scripts(user_id);
CREATE INDEX idx_scripts_status ON scripts(status);

-- ===========================================
-- GENERATION JOBS
-- ===========================================

CREATE TABLE generation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status generation_job_status NOT NULL DEFAULT 'queued',
    prompt TEXT NOT NULL,
    negative_prompt TEXT,
    image_url TEXT,
    error_message TEXT,
    attempts INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_generation_jobs_scene_id ON generation_jobs(scene_id);
CREATE INDEX idx_generation_jobs_user_id ON generation_jobs(user_id);
CREATE INDEX idx_generation_jobs_status ON generation_jobs(status);

-- ===========================================
-- CREDIT TRANSACTIONS
-- ===========================================

CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type credit_transaction_type NOT NULL,
    description TEXT NOT NULL,
    balance_after INTEGER NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);

-- ===========================================
-- STORAGE BUCKETS (Supabase Storage)
-- ===========================================

-- Scripts bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('scripts', 'scripts', false)
ON CONFLICT (id) DO NOTHING;

-- Generated images bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Exports bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('exports', 'exports', true)
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
    ON projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
    ON projects FOR DELETE
    USING (auth.uid() = user_id);

-- Scenes
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view scenes in own projects"
    ON scenes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = scenes.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert scenes in own projects"
    ON scenes FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = scenes.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update scenes in own projects"
    ON scenes FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = scenes.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete scenes in own projects"
    ON scenes FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = scenes.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Scripts
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scripts"
    ON scripts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scripts"
    ON scripts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scripts"
    ON scripts FOR DELETE
    USING (auth.uid() = user_id);

-- Generation Jobs
ALTER TABLE generation_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generation jobs"
    ON generation_jobs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generation jobs"
    ON generation_jobs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Credit Transactions
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
    ON credit_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- ===========================================
-- FUNCTIONS & TRIGGERS
-- ===========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenes_updated_at BEFORE UPDATE ON scenes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON scripts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create user record on signup
CREATE OR REPLACE FUNCTION create_user_record()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, name, credits, subscription_tier)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'name',
        10,
        'free'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_record();

-- Deduct credits on generation job creation
CREATE OR REPLACE FUNCTION deduct_generation_credits()
RETURNS TRIGGER AS $$
BEGIN
    -- Deduct 1 credit
    UPDATE users SET credits = credits - 1 WHERE id = NEW.user_id;
    
    -- Record transaction
    INSERT INTO credit_transactions (user_id, amount, type, description, balance_after)
    SELECT 
        NEW.user_id,
        -1,
        'usage',
        'Image generation for scene ' || NEW.scene_id::text,
        credits - 1
    FROM users WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_generation_job_created
    AFTER INSERT ON generation_jobs
    FOR EACH ROW
    WHEN (NEW.status = 'queued')
    EXECUTE FUNCTION deduct_generation_credits();

-- ===========================================
-- INITIAL DATA
-- ===========================================

-- Insert default subscription tiers (for reference)
-- This is just documentation, actual tiers are in code
