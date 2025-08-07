-- Create faculty table
CREATE TABLE public.faculty (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    specializations TEXT[] NOT NULL,
    experience_years INTEGER NOT NULL,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    max_students INTEGER DEFAULT 50,
    current_students INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10, 2),
    bio TEXT,
    qualifications TEXT[],
    languages TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subjects table
CREATE TABLE public.subjects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    credits INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clinical centers table
CREATE TABLE public.clinical_centers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    specialties TEXT[],
    capacity INTEGER NOT NULL,
    current_students INTEGER DEFAULT 0,
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_faculty_assignments table
CREATE TABLE public.student_faculty_assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID REFERENCES public.student_enrollments(id) NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) NOT NULL,
    faculty_id UUID REFERENCES public.faculty(id) NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    UNIQUE(enrollment_id, subject_id, faculty_id)
);

-- Create classes table
CREATE TABLE public.classes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_id UUID REFERENCES public.subjects(id) NOT NULL,
    faculty_id UUID REFERENCES public.faculty(id) NOT NULL,
    enrollment_id UUID REFERENCES public.student_enrollments(id) NOT NULL,
    class_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'missed')),
    meeting_link TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    class_id UUID REFERENCES public.classes(id) NOT NULL,
    enrollment_id UUID REFERENCES public.student_enrollments(id) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(class_id, enrollment_id)
);

-- Create clinical_assignments table
CREATE TABLE public.clinical_assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID REFERENCES public.student_enrollments(id) NOT NULL,
    clinical_center_id UUID REFERENCES public.clinical_centers(id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    completion_letter_url TEXT,
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID REFERENCES public.student_enrollments(id) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    payment_method TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_faculty_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Faculty viewable by everyone" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Subjects viewable by everyone" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Clinical centers viewable by everyone" ON public.clinical_centers FOR SELECT USING (true);

-- Student-specific policies
CREATE POLICY "Students can view their assignments" ON public.student_faculty_assignments FOR SELECT USING (true);
CREATE POLICY "Students can insert their assignments" ON public.student_faculty_assignments FOR INSERT WITH CHECK (true);

CREATE POLICY "Students can view their classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Students can view their attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Students can view their clinical assignments" ON public.clinical_assignments FOR SELECT USING (true);
CREATE POLICY "Students can update clinical assignments" ON public.clinical_assignments FOR UPDATE USING (true);
CREATE POLICY "Students can insert clinical assignments" ON public.clinical_assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Students can view their payments" ON public.payments FOR SELECT USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON public.faculty FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clinical_centers_updated_at BEFORE UPDATE ON public.clinical_centers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.subjects (course_id, name, code, credits, semester) 
SELECT c.id, 'Anatomy and Physiology', 'ANAT101', 6, 1 FROM public.courses c WHERE c.code = 'MD' LIMIT 1;

INSERT INTO public.subjects (course_id, name, code, credits, semester) 
SELECT c.id, 'Medical Ethics', 'METH102', 3, 1 FROM public.courses c WHERE c.code = 'MD' LIMIT 1;

INSERT INTO public.subjects (course_id, name, code, credits, semester) 
SELECT c.id, 'AI in Medical Diagnosis', 'AIMD201', 4, 2 FROM public.courses c WHERE c.code = 'MD' LIMIT 1;

-- Insert sample faculty
INSERT INTO public.faculty (name, email, specializations, experience_years, country, city, latitude, longitude, hourly_rate, qualifications, languages) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@dmu.edu', ARRAY['Cardiology', 'Internal Medicine'], 15, 'United States', 'New York', 40.7128, -74.0060, 150.00, ARRAY['MD', 'Board Certified Cardiologist'], ARRAY['English', 'Spanish']),
('Prof. James Wilson', 'james.wilson@dmu.edu', ARRAY['Anatomy', 'Physiology'], 20, 'United Kingdom', 'London', 51.5074, -0.1278, 120.00, ARRAY['PhD Anatomy', 'MBBS'], ARRAY['English']),
('Dr. Maria Rodriguez', 'maria.rodriguez@dmu.edu', ARRAY['AI in Medicine', 'Data Science'], 8, 'Spain', 'Barcelona', 41.3851, 2.1734, 130.00, ARRAY['PhD Computer Science', 'MD'], ARRAY['Spanish', 'English', 'French']);

-- Insert sample clinical centers
INSERT INTO public.clinical_centers (name, address, city, country, latitude, longitude, specialties, capacity, contact_email, contact_phone) VALUES
('Metropolitan General Hospital', '123 Health St, Downtown', 'New York', 'United States', 40.7589, -73.9851, ARRAY['Emergency Medicine', 'Surgery', 'Internal Medicine'], 50, 'admin@metrohealth.com', '+1-555-0123'),
('London Medical Centre', '456 Harley St, Westminster', 'London', 'United Kingdom', 51.5238, -0.1450, ARRAY['Cardiology', 'Neurology', 'Pediatrics'], 30, 'info@londonmedical.com', '+44-20-7946-0958'),
('Barcelona Clinical Institute', '789 Passeig de Gràcia', 'Barcelona', 'Spain', 41.3916, 2.1649, ARRAY['Oncology', 'Radiology', 'Pathology'], 40, 'contact@barcelonaclinic.es', '+34-93-123-4567');