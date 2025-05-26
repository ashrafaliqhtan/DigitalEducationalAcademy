-- Enhanced course management schema

-- Update courses table with additional fields
ALTER TABLE courses ADD COLUMN IF NOT EXISTS 
  video_intro_url TEXT,
  course_image_url TEXT,
  what_you_learn JSONB DEFAULT '[]'::jsonb,
  target_audience JSONB DEFAULT '[]'::jsonb,
  course_includes JSONB DEFAULT '[]'::jsonb,
  language VARCHAR(10) DEFAULT 'en',
  subtitle_languages JSONB DEFAULT '[]'::jsonb,
  difficulty_level INTEGER DEFAULT 1,
  estimated_completion_time INTEGER DEFAULT 0,
  certificate_template_id UUID,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  last_updated_by UUID REFERENCES auth.users(id);

-- Create lesson content types table
CREATE TABLE IF NOT EXISTS lesson_content_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default content types
INSERT INTO lesson_content_types (name, description, icon) VALUES
  ('video', 'Video content', 'play-circle'),
  ('text', 'Text/Article content', 'file-text'),
  ('quiz', 'Interactive quiz', 'help-circle'),
  ('assignment', 'Assignment/Project', 'clipboard'),
  ('download', 'Downloadable resource', 'download'),
  ('live', 'Live session', 'video'),
  ('code', 'Code exercise', 'code')
ON CONFLICT (name) DO NOTHING;

-- Update lessons table
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS
  content_type VARCHAR(50) DEFAULT 'video',
  content_data JSONB DEFAULT '{}'::jsonb,
  resources JSONB DEFAULT '[]'::jsonb,
  transcript TEXT,
  notes TEXT,
  is_mandatory BOOLEAN DEFAULT true,
  completion_criteria JSONB DEFAULT '{}'::jsonb,
  estimated_duration INTEGER DEFAULT 0;

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  time_limit INTEGER, -- in minutes
  attempts_allowed INTEGER DEFAULT 1,
  passing_score INTEGER DEFAULT 70,
  randomize_questions BOOLEAN DEFAULT false,
  show_results_immediately BOOLEAN DEFAULT true,
  allow_review BOOLEAN DEFAULT true,
  is_graded BOOLEAN DEFAULT true,
  weight DECIMAL(5,2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL, -- multiple_choice, true_false, fill_blank, essay, matching
  options JSONB DEFAULT '[]'::jsonb,
  correct_answers JSONB DEFAULT '[]'::jsonb,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  position INTEGER NOT NULL,
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  duration INTEGER NOT NULL, -- in minutes
  total_marks INTEGER DEFAULT 100,
  passing_marks INTEGER DEFAULT 60,
  attempts_allowed INTEGER DEFAULT 1,
  randomize_questions BOOLEAN DEFAULT true,
  show_results_after VARCHAR(20) DEFAULT 'completion', -- completion, manual, scheduled
  results_available_at TIMESTAMP WITH TIME ZONE,
  is_proctored BOOLEAN DEFAULT false,
  proctoring_settings JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN DEFAULT false,
  scheduled_start TIMESTAMP WITH TIME ZONE,
  scheduled_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create exam questions table
CREATE TABLE IF NOT EXISTS exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,
  correct_answers JSONB DEFAULT '[]'::jsonb,
  explanation TEXT,
  marks INTEGER DEFAULT 1,
  position INTEGER NOT NULL,
  media_url TEXT,
  difficulty_level INTEGER DEFAULT 1, -- 1-5
  topic_tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  total_points INTEGER,
  answers JSONB DEFAULT '{}'::jsonb,
  time_taken INTEGER, -- in seconds
  is_completed BOOLEAN DEFAULT false,
  attempt_number INTEGER DEFAULT 1
);

-- Create exam attempts table
CREATE TABLE IF NOT EXISTS exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  total_marks INTEGER,
  answers JSONB DEFAULT '{}'::jsonb,
  time_taken INTEGER, -- in seconds
  is_completed BOOLEAN DEFAULT false,
  is_graded BOOLEAN DEFAULT false,
  graded_by UUID REFERENCES auth.users(id),
  graded_at TIMESTAMP WITH TIME ZONE,
  feedback TEXT,
  attempt_number INTEGER DEFAULT 1
);

-- Create course resources table
CREATE TABLE IF NOT EXISTS course_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  is_downloadable BOOLEAN DEFAULT true,
  access_level VARCHAR(20) DEFAULT 'enrolled', -- free, enrolled, premium
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quizzes_course_id ON quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson_id ON quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_exams_course_id ON exams(course_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_id ON exam_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_exam ON exam_attempts(user_id, exam_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_course_id ON course_resources(course_id);
