-- Create clinical registrations table
CREATE TABLE public.clinical_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_name TEXT NOT NULL,
  head_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  facilities TEXT[] NOT NULL, -- OPD/IPD/OT/Casualty
  number_of_beds INTEGER NOT NULL,
  departments TEXT[] NOT NULL,
  student_roll_numbers TEXT[],
  course_accepting UUID[], -- References to courses table
  international_students BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clinical_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit clinical registration" 
ON public.clinical_registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their clinical registration" 
ON public.clinical_registrations 
FOR SELECT 
USING (true);

-- Create clinical student assignments table
CREATE TABLE public.clinical_student_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinical_center_id UUID NOT NULL REFERENCES public.clinical_centers(id),
  enrollment_id UUID NOT NULL REFERENCES public.student_enrollments(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active', -- active, completed, cancelled
  completion_letter_url TEXT,
  training_faculty_name TEXT,
  training_department TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clinical_student_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Clinical centers can manage assignments" 
ON public.clinical_student_assignments 
FOR ALL 
USING (true);

-- Create clinical attendance table
CREATE TABLE public.clinical_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.clinical_student_assignments(id),
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
  hours_completed INTEGER DEFAULT 0,
  notes TEXT,
  marked_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(assignment_id, attendance_date)
);

-- Enable RLS
ALTER TABLE public.clinical_attendance ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Clinical centers can manage attendance" 
ON public.clinical_attendance 
FOR ALL 
USING (true);

-- Create clinical rotation tracking table
CREATE TABLE public.clinical_rotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.clinical_student_assignments(id),
  department TEXT NOT NULL,
  required_hours INTEGER NOT NULL,
  completed_hours INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clinical_rotations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Clinical centers can manage rotations" 
ON public.clinical_rotations 
FOR ALL 
USING (true);

-- Create clinical payments table
CREATE TABLE public.clinical_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinical_center_id UUID NOT NULL REFERENCES public.clinical_centers(id),
  assignment_id UUID NOT NULL REFERENCES public.clinical_student_assignments(id),
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending', -- pending, received, overdue
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clinical_payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Clinical centers can manage payments" 
ON public.clinical_payments 
FOR ALL 
USING (true);

-- Update clinical_centers table to add missing fields
ALTER TABLE public.clinical_centers 
ADD COLUMN IF NOT EXISTS head_name TEXT,
ADD COLUMN IF NOT EXISTS facilities TEXT[],
ADD COLUMN IF NOT EXISTS number_of_beds INTEGER,
ADD COLUMN IF NOT EXISTS departments TEXT[],
ADD COLUMN IF NOT EXISTS international_students BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS courses_accepting UUID[];

-- Create trigger for updated_at
CREATE TRIGGER update_clinical_registrations_updated_at
BEFORE UPDATE ON public.clinical_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();