-- Create tables for student admission workflow and batch management

-- Create student batches table
CREATE TABLE public.student_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_name TEXT NOT NULL UNIQUE,
  batch_year INTEGER NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id),
  start_date DATE NOT NULL,
  end_date DATE,
  max_students INTEGER NOT NULL DEFAULT 50,
  current_students INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_batches ENABLE ROW LEVEL SECURITY;

-- Create policies for student_batches
CREATE POLICY "Student batches viewable by everyone" 
ON public.student_batches 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage student batches" 
ON public.student_batches 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'clinical_admin')
));

-- Create document verification table
CREATE TABLE public.student_document_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.student_enrollments(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('marksheet', 'government_id', 'medical_certificate', 'character_certificate', 'passport', 'visa')),
  document_url TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'needs_resubmission')),
  verified_by UUID REFERENCES auth.users(id),
  verification_notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(enrollment_id, document_type)
);

-- Enable RLS
ALTER TABLE public.student_document_verification ENABLE ROW LEVEL SECURITY;

-- Create policies for document verification
CREATE POLICY "Students can view their document verification" 
ON public.student_document_verification 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.student_enrollments 
  WHERE id = enrollment_id AND email = (auth.jwt() ->> 'email')
));

CREATE POLICY "Students can insert their document verification" 
ON public.student_document_verification 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.student_enrollments 
  WHERE id = enrollment_id AND email = (auth.jwt() ->> 'email')
));

CREATE POLICY "Students can update their document verification" 
ON public.student_document_verification 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.student_enrollments 
  WHERE id = enrollment_id AND email = (auth.jwt() ->> 'email')
));

CREATE POLICY "Admins can manage all document verifications" 
ON public.student_document_verification 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'clinical_admin')
));

-- Create student admission status table
CREATE TABLE public.student_admission_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.student_enrollments(id) ON DELETE CASCADE UNIQUE,
  batch_id UUID REFERENCES public.student_batches(id),
  eligibility_check_status TEXT NOT NULL DEFAULT 'pending' CHECK (eligibility_check_status IN ('pending', 'passed', 'failed')),
  document_verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (document_verification_status IN ('pending', 'completed', 'incomplete')),
  final_approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (final_approval_status IN ('pending', 'approved', 'rejected', 'waitlisted')),
  admission_date DATE,
  rejection_reason TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  student_id TEXT UNIQUE, -- Generated student ID after approval
  semester_admitted INTEGER DEFAULT 1,
  academic_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_admission_status ENABLE ROW LEVEL SECURITY;

-- Create policies for admission status
CREATE POLICY "Students can view their admission status" 
ON public.student_admission_status 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.student_enrollments 
  WHERE id = enrollment_id AND email = (auth.jwt() ->> 'email')
));

CREATE POLICY "Admins can manage admission status" 
ON public.student_admission_status 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'clinical_admin')
));

-- Create student completion tracking table
CREATE TABLE public.student_completion_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admission_status_id UUID NOT NULL REFERENCES public.student_admission_status(id) ON DELETE CASCADE,
  current_semester INTEGER NOT NULL DEFAULT 1,
  total_semesters INTEGER NOT NULL DEFAULT 10, -- Typical medical course duration
  current_gpa NUMERIC(3,2),
  overall_gpa NUMERIC(3,2),
  credits_completed INTEGER DEFAULT 0,
  total_credits_required INTEGER DEFAULT 200,
  expected_graduation_date DATE,
  actual_graduation_date DATE,
  completion_status TEXT NOT NULL DEFAULT 'in_progress' CHECK (completion_status IN ('in_progress', 'completed', 'dropped_out', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_completion_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for completion tracking
CREATE POLICY "Students can view their completion tracking" 
ON public.student_completion_tracking 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.student_admission_status sas
  JOIN public.student_enrollments se ON sas.enrollment_id = se.id
  WHERE sas.id = admission_status_id AND se.email = (auth.jwt() ->> 'email')
));

CREATE POLICY "Faculty and admins can view completion tracking" 
ON public.student_completion_tracking 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'faculty', 'clinical_admin')
));

CREATE POLICY "Admins can manage completion tracking" 
ON public.student_completion_tracking 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'clinical_admin')
));

-- Add triggers for updated_at columns
CREATE TRIGGER update_student_batches_updated_at
  BEFORE UPDATE ON public.student_batches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_document_verification_updated_at
  BEFORE UPDATE ON public.student_document_verification
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_admission_status_updated_at
  BEFORE UPDATE ON public.student_admission_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_completion_tracking_updated_at
  BEFORE UPDATE ON public.student_completion_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate student ID
CREATE OR REPLACE FUNCTION public.generate_student_id(batch_name_param text, admission_year_param integer)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
    batch_code TEXT;
    serial_number INTEGER;
    student_id_result TEXT;
BEGIN
    -- Create batch code (first 3 letters, uppercase)
    batch_code := UPPER(LEFT(REGEXP_REPLACE(batch_name_param, '[^a-zA-Z]', '', 'g'), 3));
    
    -- Get next serial number for this batch and year
    SELECT COALESCE(MAX(
        CAST(
            SPLIT_PART(
                SPLIT_PART(student_id, '-', 4), 
                '', 1
            ) AS INTEGER
        )
    ), 0) + 1
    INTO serial_number
    FROM public.student_admission_status 
    WHERE student_id LIKE 'STU-' || batch_code || '-' || admission_year_param || '-%';
    
    -- Generate the student ID
    student_id_result := 'STU-' || batch_code || '-' || admission_year_param || '-' || LPAD(serial_number::TEXT, 4, '0');
    
    RETURN student_id_result;
END;
$$;

-- Create function to automatically create admission status on enrollment
CREATE OR REPLACE FUNCTION public.handle_new_enrollment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.student_admission_status (enrollment_id, academic_year)
  VALUES (
    NEW.id,
    EXTRACT(YEAR FROM now())::TEXT || '-' || (EXTRACT(YEAR FROM now()) + 1)::TEXT
  );
  RETURN NEW;
END;
$$;

-- Create trigger to execute the function on enrollment creation
CREATE TRIGGER on_student_enrollment_created
  AFTER INSERT ON public.student_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_enrollment();

-- Create function to automatically create completion tracking on approval
CREATE OR REPLACE FUNCTION public.handle_student_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
    batch_record RECORD;
    expected_grad_date DATE;
BEGIN
  -- Only trigger when status changes to approved
  IF NEW.final_approval_status = 'approved' AND OLD.final_approval_status != 'approved' THEN
    -- Get batch information if batch is assigned
    IF NEW.batch_id IS NOT NULL THEN
      SELECT * INTO batch_record FROM public.student_batches WHERE id = NEW.batch_id;
      -- Calculate expected graduation date (typically 5 years for medical course)
      expected_grad_date := batch_record.start_date + INTERVAL '5 years';
    ELSE
      expected_grad_date := CURRENT_DATE + INTERVAL '5 years';
    END IF;
    
    -- Create completion tracking record
    INSERT INTO public.student_completion_tracking (
      admission_status_id, 
      expected_graduation_date
    )
    VALUES (NEW.id, expected_grad_date);
    
    -- Generate student ID if not already assigned
    IF NEW.student_id IS NULL AND NEW.batch_id IS NOT NULL THEN
      NEW.student_id := public.generate_student_id(
        batch_record.batch_name, 
        EXTRACT(YEAR FROM NEW.admission_date)::INTEGER
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for student approval
CREATE TRIGGER on_student_approval
  BEFORE UPDATE ON public.student_admission_status
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_student_approval();

-- Create indexes for better performance
CREATE INDEX idx_student_batches_course_id ON public.student_batches(course_id);
CREATE INDEX idx_student_batches_year ON public.student_batches(batch_year);
CREATE INDEX idx_student_document_verification_enrollment_id ON public.student_document_verification(enrollment_id);
CREATE INDEX idx_student_document_verification_status ON public.student_document_verification(verification_status);
CREATE INDEX idx_student_admission_status_enrollment_id ON public.student_admission_status(enrollment_id);
CREATE INDEX idx_student_admission_status_batch_id ON public.student_admission_status(batch_id);
CREATE INDEX idx_student_admission_status_final_status ON public.student_admission_status(final_approval_status);
CREATE INDEX idx_student_completion_tracking_admission_id ON public.student_completion_tracking(admission_status_id);
CREATE INDEX idx_student_completion_tracking_status ON public.student_completion_tracking(completion_status);