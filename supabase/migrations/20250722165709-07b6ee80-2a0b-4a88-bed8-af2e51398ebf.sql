-- Create courses table
CREATE TABLE public.courses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    duration TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student enrollments table
CREATE TABLE public.student_enrollments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name TEXT NOT NULL,
    fathers_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    guardian_number TEXT NOT NULL,
    address TEXT NOT NULL,
    course_id UUID REFERENCES public.courses(id) NOT NULL,
    marksheet_url TEXT,
    government_id_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    roll_number TEXT UNIQUE,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin approvals table for tracking approval workflow
CREATE TABLE public.admin_approvals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID REFERENCES public.student_enrollments(id) NOT NULL,
    admin_notes TEXT,
    decision TEXT CHECK (decision IN ('approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_approvals ENABLE ROW LEVEL SECURITY;

-- Create policies for courses (public read)
CREATE POLICY "Courses are viewable by everyone" 
ON public.courses 
FOR SELECT 
USING (true);

-- Create policies for student enrollments (users can insert their own)
CREATE POLICY "Anyone can submit enrollment" 
ON public.student_enrollments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own enrollments by email" 
ON public.student_enrollments 
FOR SELECT 
USING (true);

-- Create policies for admin approvals (restricted)
CREATE POLICY "Admin approvals are restricted" 
ON public.admin_approvals 
FOR ALL 
USING (false);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
BEFORE UPDATE ON public.student_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for enrollment documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('enrollment-documents', 'enrollment-documents', false);

-- Create storage policies for enrollment documents
CREATE POLICY "Anyone can upload enrollment documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'enrollment-documents');

CREATE POLICY "Users can view enrollment documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'enrollment-documents');

-- Insert sample courses
INSERT INTO public.courses (name, code, duration, description) VALUES
('Doctor of Medicine (MD)', 'MD', '6 years', 'Comprehensive medical program with AI integration'),
('Bachelor of Medicine and Surgery', 'MBBS', '5.5 years', 'Traditional medical degree with modern AI tools'),
('Master of Science in Medical AI', 'MSAI', '2 years', 'Advanced AI applications in healthcare'),
('Digital Health and Telemedicine', 'DHT', '1 year', 'Specialized program in digital healthcare solutions'),
('Medical Data Science', 'MDS', '18 months', 'Data science applications in medical research'),
('AI-Powered Diagnostics', 'APD', '1 year', 'Specialized training in AI diagnostic tools');