-- Update faculty table with new fields
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS degree TEXT;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS year_of_completion INTEGER;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS experience_years_new INTEGER;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS extra_courses TEXT[];
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS payment_details JSONB;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS faculty_id TEXT UNIQUE;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended'));
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Create faculty registrations table (separate from faculty table for approval workflow)
CREATE TABLE public.faculty_registrations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    degree TEXT NOT NULL,
    year_of_completion INTEGER NOT NULL,
    specialty TEXT NOT NULL,
    experience_years INTEGER NOT NULL,
    extra_courses TEXT[],
    address TEXT NOT NULL,
    country TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    payment_details JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    faculty_id TEXT UNIQUE,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create faculty uploads table
CREATE TABLE public.faculty_uploads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    faculty_id UUID REFERENCES public.faculty(id) NOT NULL,
    upload_type TEXT NOT NULL CHECK (upload_type IN ('teaching_material', 'video_lecture', 'ai_module', 'course_content')),
    subject_id UUID REFERENCES public.subjects(id),
    title TEXT NOT NULL,
    topic TEXT,
    summary TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create faculty classes (separate from student classes for faculty management)
CREATE TABLE public.faculty_scheduled_classes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    faculty_id UUID REFERENCES public.faculty(id) NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    class_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    meeting_link TEXT,
    meeting_platform TEXT DEFAULT 'zoom',
    max_students INTEGER DEFAULT 30,
    enrolled_students INTEGER DEFAULT 0,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create faculty earnings table
CREATE TABLE public.faculty_earnings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    faculty_id UUID REFERENCES public.faculty(id) NOT NULL,
    class_id UUID REFERENCES public.faculty_scheduled_classes(id),
    student_enrollment_id UUID REFERENCES public.student_enrollments(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'processing')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student progress tracking table
CREATE TABLE public.student_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_enrollment_id UUID REFERENCES public.student_enrollments(id) NOT NULL,
    faculty_id UUID REFERENCES public.faculty(id) NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) NOT NULL,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    notes TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faculty_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_scheduled_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for faculty registrations
CREATE POLICY "Anyone can submit faculty registration" ON public.faculty_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their faculty registration" ON public.faculty_registrations FOR SELECT USING (true);

-- Create policies for faculty operations
CREATE POLICY "Faculty can manage their uploads" ON public.faculty_uploads FOR ALL USING (true);
CREATE POLICY "Faculty can manage their classes" ON public.faculty_scheduled_classes FOR ALL USING (true);
CREATE POLICY "Faculty can view their earnings" ON public.faculty_earnings FOR SELECT USING (true);
CREATE POLICY "Faculty can manage student progress" ON public.student_progress FOR ALL USING (true);

-- Create storage bucket for faculty materials
INSERT INTO storage.buckets (id, name, public) 
VALUES ('faculty-materials', 'faculty-materials', false);

-- Create storage policies for faculty materials
CREATE POLICY "Faculty can upload materials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'faculty-materials');
CREATE POLICY "Faculty can view materials" ON storage.objects FOR SELECT USING (bucket_id = 'faculty-materials');
CREATE POLICY "Faculty can update materials" ON storage.objects FOR UPDATE USING (bucket_id = 'faculty-materials');

-- Add triggers
CREATE TRIGGER update_faculty_registrations_updated_at BEFORE UPDATE ON public.faculty_registrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate faculty ID
CREATE OR REPLACE FUNCTION public.generate_faculty_id(specialty_param TEXT, year_param INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    specialty_code TEXT;
    serial_number INTEGER;
    faculty_id_result TEXT;
BEGIN
    -- Create specialty code (first 3 letters, uppercase)
    specialty_code := UPPER(LEFT(REGEXP_REPLACE(specialty_param, '[^a-zA-Z]', '', 'g'), 3));
    
    -- Get next serial number for this specialty and year
    SELECT COALESCE(MAX(
        CAST(
            SPLIT_PART(
                SPLIT_PART(faculty_id, '-', 4), 
                '', 1
            ) AS INTEGER
        )
    ), 0) + 1
    INTO serial_number
    FROM public.faculty_registrations 
    WHERE faculty_id LIKE 'FAC-' || specialty_code || '-' || year_param || '-%';
    
    -- Generate the faculty ID
    faculty_id_result := 'FAC-' || specialty_code || '-' || year_param || '-' || LPAD(serial_number::TEXT, 3, '0');
    
    RETURN faculty_id_result;
END;
$$;