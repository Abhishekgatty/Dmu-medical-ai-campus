-- Create missing tables for complete student profile system

-- Table for student class enrollments/registrations
CREATE TABLE IF NOT EXISTS public.student_class_enrollments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID NOT NULL,
    class_id UUID NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
    grade TEXT,
    completion_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_class_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS policies for student class enrollments
CREATE POLICY "Students can view their class enrollments" 
ON public.student_class_enrollments 
FOR SELECT 
USING (true);

CREATE POLICY "Students can enroll in classes" 
ON public.student_class_enrollments 
FOR INSERT 
WITH CHECK (true);

-- Table for student social activities/posts (like Facebook posts)
CREATE TABLE IF NOT EXISTS public.student_posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID NOT NULL,
    content TEXT NOT NULL,
    media_urls TEXT[],
    post_type TEXT DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'video', 'achievement', 'study_update')),
    is_public BOOLEAN DEFAULT true,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for student posts
CREATE POLICY "Students can manage their posts" 
ON public.student_posts 
FOR ALL 
USING (true);

CREATE POLICY "Public posts viewable by everyone" 
ON public.student_posts 
FOR SELECT 
USING (is_public = true);

-- Table for post likes
CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL,
    enrollment_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(post_id, enrollment_id)
);

-- Enable RLS
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies for post likes
CREATE POLICY "Users can manage their likes" 
ON public.post_likes 
FOR ALL 
USING (true);

-- Table for post comments
CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL,
    enrollment_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for post comments
CREATE POLICY "Users can manage their comments" 
ON public.post_comments 
FOR ALL 
USING (true);

CREATE POLICY "Comments viewable on public posts" 
ON public.post_comments 
FOR SELECT 
USING (true);

-- Table for student connections/friends
CREATE TABLE IF NOT EXISTS public.student_connections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_enrollment_id UUID NOT NULL,
    addressee_enrollment_id UUID NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(requester_enrollment_id, addressee_enrollment_id)
);

-- Enable RLS
ALTER TABLE public.student_connections ENABLE ROW LEVEL SECURITY;

-- RLS policies for student connections
CREATE POLICY "Students can manage their connections" 
ON public.student_connections 
FOR ALL 
USING (true);

-- Table for student skills and endorsements
CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID NOT NULL,
    skill_name TEXT NOT NULL,
    proficiency_level TEXT DEFAULT 'beginner' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    endorsed_by UUID[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(enrollment_id, skill_name)
);

-- Enable RLS
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;

-- RLS policies for student skills
CREATE POLICY "Students can manage their skills" 
ON public.student_skills 
FOR ALL 
USING (true);

CREATE POLICY "Skills viewable by everyone" 
ON public.student_skills 
FOR SELECT 
USING (true);

-- Table for student experiences/internships
CREATE TABLE IF NOT EXISTS public.student_experiences (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID NOT NULL,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    location TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    skills_gained TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_experiences ENABLE ROW LEVEL SECURITY;

-- RLS policies for student experiences
CREATE POLICY "Students can manage their experiences" 
ON public.student_experiences 
FOR ALL 
USING (true);

CREATE POLICY "Experiences viewable by everyone" 
ON public.student_experiences 
FOR SELECT 
USING (true);

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for tables that have updated_at columns
CREATE TRIGGER update_student_posts_updated_at
    BEFORE UPDATE ON public.student_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at
    BEFORE UPDATE ON public.post_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_experiences_updated_at
    BEFORE UPDATE ON public.student_experiences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing student_profiles table if it doesn't have all needed columns
ALTER TABLE public.student_profiles 
ADD COLUMN IF NOT EXISTS current_semester INTEGER,
ADD COLUMN IF NOT EXISTS gpa DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS graduation_year INTEGER,
ADD COLUMN IF NOT EXISTS specialization TEXT,
ADD COLUMN IF NOT EXISTS contact_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb;