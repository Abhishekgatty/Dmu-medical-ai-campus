-- Create a storage bucket for student profile photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-profiles', 'student-profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the student-profiles bucket
CREATE POLICY "Students can upload their own profile photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'student-profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Students can update their own profile photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'student-profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Student profile photos are publicly viewable"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'student-profiles');

-- Create student_profiles table to store additional profile information
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY,
  enrollment_id UUID REFERENCES public.student_enrollments(id) ON DELETE CASCADE,
  profile_photo_url TEXT,
  bio TEXT,
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  social_links JSONB DEFAULT '{}'::JSONB,
  education_background TEXT,
  achievements TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for student_profiles
CREATE POLICY "Students can view their own profile"
ON public.student_profiles
FOR SELECT
TO authenticated
USING (enrollment_id IN (
  SELECT id FROM public.student_enrollments 
  WHERE email = auth.jwt() ->> 'email'
));

CREATE POLICY "Students can update their own profile"
ON public.student_profiles
FOR UPDATE
TO authenticated
USING (enrollment_id IN (
  SELECT id FROM public.student_enrollments 
  WHERE email = auth.jwt() ->> 'email'
));

CREATE POLICY "Students can insert their own profile"
ON public.student_profiles
FOR INSERT
TO authenticated
WITH CHECK (enrollment_id IN (
  SELECT id FROM public.student_enrollments 
  WHERE email = auth.jwt() ->> 'email'
));

-- Create trigger for updated_at
CREATE TRIGGER update_student_profiles_updated_at
BEFORE UPDATE ON public.student_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add public view policy to allow viewing profiles by others
CREATE POLICY "Student profiles are publicly viewable"
ON public.student_profiles
FOR SELECT
TO anon
USING (true);