-- Upgrade faculty registration system with enhanced experience and degree tracking

-- Create faculty degree details table
CREATE TABLE public.faculty_degree_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  degree_type TEXT NOT NULL CHECK (degree_type IN ('bachelor', 'master', 'phd', 'diploma', 'certificate')),
  degree_name TEXT NOT NULL,
  specialization TEXT,
  institution_name TEXT NOT NULL,
  university_name TEXT,
  country TEXT NOT NULL,
  start_year INTEGER NOT NULL,
  completion_year INTEGER NOT NULL,
  grade_percentage NUMERIC(5,2),
  grade_gpa NUMERIC(3,2),
  is_verified BOOLEAN DEFAULT false,
  verification_document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faculty_degree_details ENABLE ROW LEVEL SECURITY;

-- Create policies for faculty degree details
CREATE POLICY "Faculty can view their degree details" 
ON public.faculty_degree_details 
FOR SELECT 
USING (true);

CREATE POLICY "Faculty can insert their degree details" 
ON public.faculty_degree_details 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Faculty can update their degree details" 
ON public.faculty_degree_details 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can manage all degree details" 
ON public.faculty_degree_details 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'clinical_admin')
));

-- Create faculty work experience table
CREATE TABLE public.faculty_work_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  organization_type TEXT CHECK (organization_type IN ('hospital', 'clinic', 'university', 'research_institute', 'private_practice', 'government', 'ngo', 'other')),
  position_title TEXT NOT NULL,
  department TEXT,
  specialization TEXT,
  location_city TEXT,
  location_country TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE, -- NULL means current position
  is_current BOOLEAN DEFAULT false,
  job_responsibilities TEXT,
  skills_gained TEXT[],
  salary_range TEXT,
  reason_for_leaving TEXT,
  supervisor_name TEXT,
  supervisor_contact TEXT,
  experience_certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Ensure only one current position per faculty
  CONSTRAINT unique_current_position UNIQUE NULLS NOT DISTINCT (faculty_registration_id, is_current)
);

-- Enable RLS
ALTER TABLE public.faculty_work_experience ENABLE ROW LEVEL SECURITY;

-- Create policies for work experience
CREATE POLICY "Faculty can view their work experience" 
ON public.faculty_work_experience 
FOR SELECT 
USING (true);

CREATE POLICY "Faculty can insert their work experience" 
ON public.faculty_work_experience 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Faculty can update their work experience" 
ON public.faculty_work_experience 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can manage all work experience" 
ON public.faculty_work_experience 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'clinical_admin')
));

-- Create faculty DMU tenure tracking table
CREATE TABLE public.faculty_dmu_tenure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE UNIQUE,
  dmu_joining_date DATE NOT NULL,
  dmu_exit_date DATE, -- NULL means still active
  current_position TEXT NOT NULL,
  current_department TEXT,
  employment_type TEXT CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'visiting', 'adjunct')),
  tenure_status TEXT DEFAULT 'active' CHECK (tenure_status IN ('active', 'inactive', 'terminated', 'resigned')),
  performance_rating NUMERIC(2,1) CHECK (performance_rating >= 1.0 AND performance_rating <= 5.0),
  total_dmu_experience_months INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faculty_dmu_tenure ENABLE ROW LEVEL SECURITY;

-- Create policies for DMU tenure
CREATE POLICY "Faculty can view their DMU tenure" 
ON public.faculty_dmu_tenure 
FOR SELECT 
USING (true);

CREATE POLICY "Faculty can insert their DMU tenure" 
ON public.faculty_dmu_tenure 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage DMU tenure" 
ON public.faculty_dmu_tenure 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'clinical_admin')
));

-- Add new columns to existing faculty_registrations table
ALTER TABLE public.faculty_registrations 
ADD COLUMN bachelor_degree_year INTEGER,
ADD COLUMN bachelor_degree_institution TEXT,
ADD COLUMN master_degree_year INTEGER,
ADD COLUMN master_degree_institution TEXT,
ADD COLUMN total_experience_months INTEGER DEFAULT 0,
ADD COLUMN calculated_experience_years NUMERIC(4,2) DEFAULT 0,
ADD COLUMN bachelor_to_current_experience_years NUMERIC(4,2) DEFAULT 0,
ADD COLUMN master_to_current_experience_years NUMERIC(4,2) DEFAULT 0,
ADD COLUMN last_experience_calculation_date DATE DEFAULT CURRENT_DATE;

-- Create function to calculate total work experience
CREATE OR REPLACE FUNCTION public.calculate_faculty_experience(faculty_reg_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
    total_months INTEGER := 0;
    exp_record RECORD;
BEGIN
    -- Calculate experience from all work positions
    FOR exp_record IN 
        SELECT start_date, COALESCE(end_date, CURRENT_DATE) as end_date
        FROM public.faculty_work_experience 
        WHERE faculty_registration_id = faculty_reg_id
    LOOP
        total_months := total_months + 
            EXTRACT(YEAR FROM AGE(exp_record.end_date, exp_record.start_date)) * 12 + 
            EXTRACT(MONTH FROM AGE(exp_record.end_date, exp_record.start_date));
    END LOOP;
    
    -- Add DMU experience
    SELECT COALESCE(total_dmu_experience_months, 0) INTO exp_record
    FROM public.faculty_dmu_tenure 
    WHERE faculty_registration_id = faculty_reg_id;
    
    total_months := total_months + COALESCE(exp_record, 0);
    
    RETURN ROUND(total_months / 12.0, 2);
END;
$$;

-- Create function to calculate degree-specific experience
CREATE OR REPLACE FUNCTION public.calculate_degree_experience(faculty_reg_id UUID, degree_type_param TEXT)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
    degree_completion_year INTEGER;
    total_months INTEGER := 0;
    exp_record RECORD;
BEGIN
    -- Get degree completion year
    SELECT completion_year INTO degree_completion_year
    FROM public.faculty_degree_details 
    WHERE faculty_registration_id = faculty_reg_id 
    AND degree_type = degree_type_param
    ORDER BY completion_year DESC
    LIMIT 1;
    
    IF degree_completion_year IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Calculate experience from work positions after degree completion
    FOR exp_record IN 
        SELECT start_date, COALESCE(end_date, CURRENT_DATE) as end_date
        FROM public.faculty_work_experience 
        WHERE faculty_registration_id = faculty_reg_id
        AND start_date >= (degree_completion_year || '-01-01')::DATE
    LOOP
        total_months := total_months + 
            EXTRACT(YEAR FROM AGE(exp_record.end_date, exp_record.start_date)) * 12 + 
            EXTRACT(MONTH FROM AGE(exp_record.end_date, exp_record.start_date));
    END LOOP;
    
    -- Add DMU experience if started after degree
    SELECT dmu_joining_date, COALESCE(dmu_exit_date, CURRENT_DATE) as exit_date
    INTO exp_record
    FROM public.faculty_dmu_tenure 
    WHERE faculty_registration_id = faculty_reg_id
    AND dmu_joining_date >= (degree_completion_year || '-01-01')::DATE;
    
    IF exp_record IS NOT NULL THEN
        total_months := total_months + 
            EXTRACT(YEAR FROM AGE(exp_record.exit_date, exp_record.dmu_joining_date)) * 12 + 
            EXTRACT(MONTH FROM AGE(exp_record.exit_date, exp_record.dmu_joining_date));
    END IF;
    
    RETURN ROUND(total_months / 12.0, 2);
END;
$$;

-- Create function to update DMU experience automatically
CREATE OR REPLACE FUNCTION public.update_dmu_experience()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
    months_experience INTEGER;
BEGIN
    -- Calculate DMU experience in months
    IF NEW.dmu_exit_date IS NULL THEN
        -- Still active, calculate from joining date to now
        months_experience := EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.dmu_joining_date)) * 12 + 
                            EXTRACT(MONTH FROM AGE(CURRENT_DATE, NEW.dmu_joining_date));
    ELSE
        -- Calculate from joining to exit date
        months_experience := EXTRACT(YEAR FROM AGE(NEW.dmu_exit_date, NEW.dmu_joining_date)) * 12 + 
                            EXTRACT(MONTH FROM AGE(NEW.dmu_exit_date, NEW.dmu_joining_date));
    END IF;
    
    NEW.total_dmu_experience_months := months_experience;
    RETURN NEW;
END;
$$;

-- Create function to update faculty registration experience calculations
CREATE OR REPLACE FUNCTION public.update_faculty_experience_calculations()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
    faculty_reg_id UUID;
BEGIN
    -- Get faculty registration ID based on the trigger source
    IF TG_TABLE_NAME = 'faculty_work_experience' THEN
        faculty_reg_id := COALESCE(NEW.faculty_registration_id, OLD.faculty_registration_id);
    ELSIF TG_TABLE_NAME = 'faculty_dmu_tenure' THEN
        faculty_reg_id := COALESCE(NEW.faculty_registration_id, OLD.faculty_registration_id);
    ELSIF TG_TABLE_NAME = 'faculty_registrations' THEN
        faculty_reg_id := NEW.id;
    END IF;
    
    -- Update experience calculations in faculty_registrations
    UPDATE public.faculty_registrations 
    SET 
        total_experience_months = (
            COALESCE((
                SELECT SUM(
                    EXTRACT(YEAR FROM AGE(COALESCE(end_date, CURRENT_DATE), start_date)) * 12 + 
                    EXTRACT(MONTH FROM AGE(COALESCE(end_date, CURRENT_DATE), start_date))
                )
                FROM public.faculty_work_experience 
                WHERE faculty_registration_id = faculty_reg_id
            ), 0) +
            COALESCE((
                SELECT total_dmu_experience_months
                FROM public.faculty_dmu_tenure 
                WHERE faculty_registration_id = faculty_reg_id
            ), 0)
        ),
        calculated_experience_years = public.calculate_faculty_experience(faculty_reg_id),
        bachelor_to_current_experience_years = public.calculate_degree_experience(faculty_reg_id, 'bachelor'),
        master_to_current_experience_years = public.calculate_degree_experience(faculty_reg_id, 'master'),
        last_experience_calculation_date = CURRENT_DATE
    WHERE id = faculty_reg_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers for automatic experience calculation
CREATE TRIGGER update_dmu_experience_trigger
    BEFORE INSERT OR UPDATE ON public.faculty_dmu_tenure
    FOR EACH ROW
    EXECUTE FUNCTION public.update_dmu_experience();

CREATE TRIGGER update_faculty_experience_on_work_change
    AFTER INSERT OR UPDATE OR DELETE ON public.faculty_work_experience
    FOR EACH ROW
    EXECUTE FUNCTION public.update_faculty_experience_calculations();

CREATE TRIGGER update_faculty_experience_on_dmu_change
    AFTER INSERT OR UPDATE OR DELETE ON public.faculty_dmu_tenure
    FOR EACH ROW
    EXECUTE FUNCTION public.update_faculty_experience_calculations();

CREATE TRIGGER update_faculty_experience_on_degree_change
    AFTER INSERT OR UPDATE OR DELETE ON public.faculty_degree_details
    FOR EACH ROW
    EXECUTE FUNCTION public.update_faculty_experience_calculations();

-- Add triggers for updated_at columns
CREATE TRIGGER update_faculty_degree_details_updated_at
    BEFORE UPDATE ON public.faculty_degree_details
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_work_experience_updated_at
    BEFORE UPDATE ON public.faculty_work_experience
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_dmu_tenure_updated_at
    BEFORE UPDATE ON public.faculty_dmu_tenure
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create DMU tenure on faculty approval
CREATE OR REPLACE FUNCTION public.handle_faculty_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
    -- When faculty gets approved, create DMU tenure record
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        INSERT INTO public.faculty_dmu_tenure (
            faculty_registration_id,
            dmu_joining_date,
            current_position,
            employment_type
        ) VALUES (
            NEW.id,
            CURRENT_DATE,
            COALESCE(NEW.specialty, 'Faculty Member'),
            'full_time'
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for faculty approval
CREATE TRIGGER on_faculty_approval
    BEFORE UPDATE ON public.faculty_registrations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_faculty_approval();

-- Create indexes for better performance
CREATE INDEX idx_faculty_degree_details_faculty_id ON public.faculty_degree_details(faculty_registration_id);
CREATE INDEX idx_faculty_degree_details_type ON public.faculty_degree_details(degree_type);
CREATE INDEX idx_faculty_work_experience_faculty_id ON public.faculty_work_experience(faculty_registration_id);
CREATE INDEX idx_faculty_work_experience_dates ON public.faculty_work_experience(start_date, end_date);
CREATE INDEX idx_faculty_dmu_tenure_faculty_id ON public.faculty_dmu_tenure(faculty_registration_id);
CREATE INDEX idx_faculty_registrations_experience ON public.faculty_registrations(calculated_experience_years);

-- Create view for comprehensive faculty experience summary
CREATE OR REPLACE VIEW public.faculty_experience_summary AS
SELECT 
    fr.id,
    fr.full_name,
    fr.email,
    fr.specialty,
    fr.status,
    fr.calculated_experience_years as total_experience_years,
    fr.bachelor_to_current_experience_years,
    fr.master_to_current_experience_years,
    dt.dmu_joining_date,
    dt.dmu_exit_date,
    dt.tenure_status,
    ROUND(dt.total_dmu_experience_months / 12.0, 2) as dmu_experience_years,
    (
        SELECT COUNT(*) 
        FROM public.faculty_degree_details fdd 
        WHERE fdd.faculty_registration_id = fr.id AND fdd.degree_type = 'bachelor'
    ) as bachelor_degrees_count,
    (
        SELECT COUNT(*) 
        FROM public.faculty_degree_details fdd 
        WHERE fdd.faculty_registration_id = fr.id AND fdd.degree_type = 'master'
    ) as master_degrees_count,
    (
        SELECT COUNT(*) 
        FROM public.faculty_work_experience fwe 
        WHERE fwe.faculty_registration_id = fr.id
    ) as previous_organizations_count
FROM public.faculty_registrations fr
LEFT JOIN public.faculty_dmu_tenure dt ON fr.id = dt.faculty_registration_id;