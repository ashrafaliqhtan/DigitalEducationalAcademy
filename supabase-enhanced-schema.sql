-- Add wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Add reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  points INTEGER NOT NULL,
  requirement INTEGER NOT NULL,
  rarity TEXT DEFAULT 'common'
);

-- Add user achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT REFERENCES achievements(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Add notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  action_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add user stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_study_hours INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add course ratings view
CREATE OR REPLACE VIEW course_ratings AS
SELECT 
  course_id,
  AVG(rating)::NUMERIC(3,2) as average_rating,
  COUNT(*) as total_reviews
FROM reviews
GROUP BY course_id;

-- Add RLS policies
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Wishlist policies
CREATE POLICY "Users can view their own wishlist" ON wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlist" ON wishlist
  FOR ALL USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own reviews" ON reviews
  FOR ALL USING (auth.uid() = user_id);

-- User achievements policies
CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage user achievements" ON user_achievements
  FOR ALL USING (true);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- User stats policies
CREATE POLICY "Users can view their own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage user stats" ON user_stats
  FOR ALL USING (true);

-- Insert sample achievements
INSERT INTO achievements (id, title, description, icon, category, points, requirement, rarity) VALUES
('first_course', 'First Steps', 'Complete your first course', '🎓', 'learning', 100, 1, 'common'),
('course_master', 'Course Master', 'Complete 10 courses', '🏆', 'completion', 500, 10, 'rare'),
('streak_warrior', 'Streak Warrior', 'Maintain a 7-day learning streak', '🔥', 'streak', 300, 7, 'epic'),
('knowledge_seeker', 'Knowledge Seeker', 'Study for 50 hours total', '📚', 'learning', 200, 50, 'common'),
('social_butterfly', 'Social Butterfly', 'Write 5 course reviews', '🦋', 'social', 150, 5, 'common'),
('perfectionist', 'Perfectionist', 'Score 100% on 3 quizzes', '⭐', 'completion', 250, 3, 'rare'),
('early_bird', 'Early Bird', 'Complete lessons before 9 AM for 5 days', '🌅', 'streak', 200, 5, 'epic'),
('night_owl', 'Night Owl', 'Complete lessons after 10 PM for 5 days', '🦉', 'streak', 200, 5, 'epic'),
('speed_learner', 'Speed Learner', 'Complete a course in under 24 hours', '⚡', 'completion', 400, 1, 'legendary'),
('mentor', 'Mentor', 'Help 10 students in discussions', '👨‍🏫', 'social', 350, 10, 'rare')
ON CONFLICT (id) DO NOTHING;

-- Functions for updating user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user stats when enrollments change
  IF TG_TABLE_NAME = 'enrollments' THEN
    INSERT INTO user_stats (user_id, total_points, level)
    VALUES (NEW.user_id, 0, 1)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Award points for course completion
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
      UPDATE user_stats 
      SET total_points = total_points + 100,
          level = GREATEST(1, (total_points + 100) / 500),
          updated_at = NOW()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_user_stats_trigger ON enrollments;
CREATE TRIGGER update_user_stats_trigger
  AFTER INSERT OR UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();
