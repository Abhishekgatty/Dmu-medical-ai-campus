-- Create a storage bucket for faculty profile photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('faculty-profiles', 'faculty-profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the faculty-profiles bucket
CREATE POLICY "Faculty members can upload their own profile photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'faculty-profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Faculty members can update their own profile photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'faculty-profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Faculty profile photos are publicly viewable"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'faculty-profiles');

-- Create faculty_profiles table to store additional profile information
CREATE TABLE public.faculty_profiles (
  id UUID PRIMARY KEY REFERENCES public.faculty(id) ON DELETE CASCADE,
  profile_photo_url TEXT,
  bio TEXT,
  languages TEXT[] DEFAULT ARRAY[]::TEXT[],
  qualifications TEXT[] DEFAULT ARRAY[]::TEXT[],
  social_links JSONB DEFAULT '{}'::JSONB,
  teaching_philosophy TEXT,
  office_hours JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.faculty_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for faculty_profiles
CREATE POLICY "Faculty members can view their own profile"
ON public.faculty_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Faculty members can update their own profile"
ON public.faculty_profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Faculty members can insert their own profile"
ON public.faculty_profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_faculty_profiles_updated_at
BEFORE UPDATE ON public.faculty_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();