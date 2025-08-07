-- Create essential authentication and user management tables

-- Create user profiles table that connects to Supabase Auth
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin', 'clinical_admin')),
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create user sessions table for tracking active sessions
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  device_info JSONB,
  ip_address INET,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sessions
CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sessions" 
ON public.user_sessions 
FOR ALL 
USING (auth.uid() = user_id);

-- Create student_auth_links table to connect auth users with student enrollments
CREATE TABLE public.student_auth_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES public.student_enrollments(id) ON DELETE CASCADE,
  linked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, enrollment_id)
);

-- Enable RLS for auth links
ALTER TABLE public.student_auth_links ENABLE ROW LEVEL SECURITY;

-- Create policies for student_auth_links
CREATE POLICY "Users can view their own auth links" 
ON public.student_auth_links 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own auth links" 
ON public.student_auth_links 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create faculty_auth_links table to connect auth users with faculty
CREATE TABLE public.faculty_auth_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  faculty_id UUID NOT NULL REFERENCES public.faculty(id) ON DELETE CASCADE,
  linked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, faculty_id)
);

-- Enable RLS for faculty auth links
ALTER TABLE public.faculty_auth_links ENABLE ROW LEVEL SECURITY;

-- Create policies for faculty_auth_links
CREATE POLICY "Users can view their own faculty auth links" 
ON public.faculty_auth_links 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own faculty auth links" 
ON public.faculty_auth_links 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create password reset tokens table
CREATE TABLE public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for password reset tokens
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for password reset tokens
CREATE POLICY "Users can view their own reset tokens" 
ON public.password_reset_tokens 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$;

-- Create trigger to execute the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON public.user_sessions(expires_at);
CREATE INDEX idx_student_auth_links_user_id ON public.student_auth_links(user_id);
CREATE INDEX idx_student_auth_links_enrollment_id ON public.student_auth_links(enrollment_id);
CREATE INDEX idx_faculty_auth_links_user_id ON public.faculty_auth_links(user_id);
CREATE INDEX idx_faculty_auth_links_faculty_id ON public.faculty_auth_links(faculty_id);