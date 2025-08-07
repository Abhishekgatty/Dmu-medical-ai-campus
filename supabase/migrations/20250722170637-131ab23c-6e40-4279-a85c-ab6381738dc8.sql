-- Create digital locker tables for student documents
CREATE TABLE public.document_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student documents table
CREATE TABLE public.student_documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID REFERENCES public.student_enrollments(id) NOT NULL,
    category_id UUID REFERENCES public.document_categories(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    verification_notes TEXT,
    verified_by UUID,
    verified_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.student_achievements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID REFERENCES public.student_enrollments(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    achievement_type TEXT NOT NULL CHECK (achievement_type IN ('certificate', 'award', 'recognition', 'completion', 'grade', 'project', 'research')),
    issued_by TEXT,
    issue_date DATE,
    certificate_url TEXT,
    grade_score TEXT,
    metadata JSONB,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignments/works table
CREATE TABLE public.student_works (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID REFERENCES public.student_enrollments(id) NOT NULL,
    subject_id UUID REFERENCES public.subjects(id),
    title TEXT NOT NULL,
    description TEXT,
    work_type TEXT NOT NULL CHECK (work_type IN ('assignment', 'project', 'research', 'presentation', 'report', 'thesis', 'case_study')),
    file_url TEXT,
    submission_date TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    grade TEXT,
    feedback TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'graded', 'revision_required')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for student documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('student-documents', 'student-documents', false);

-- Enable Row Level Security
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_works ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Document categories viewable by everyone" ON public.document_categories FOR SELECT USING (true);

CREATE POLICY "Students can view their documents" ON public.student_documents FOR SELECT USING (true);
CREATE POLICY "Students can insert their documents" ON public.student_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Students can update their documents" ON public.student_documents FOR UPDATE USING (true);

CREATE POLICY "Students can view their achievements" ON public.student_achievements FOR SELECT USING (true);
CREATE POLICY "Students can insert their achievements" ON public.student_achievements FOR INSERT WITH CHECK (true);

CREATE POLICY "Students can view their works" ON public.student_works FOR SELECT USING (true);
CREATE POLICY "Students can insert their works" ON public.student_works FOR INSERT WITH CHECK (true);
CREATE POLICY "Students can update their works" ON public.student_works FOR UPDATE USING (true);

-- Create storage policies for student documents
CREATE POLICY "Students can upload their documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'student-documents');
CREATE POLICY "Students can view their documents" ON storage.objects FOR SELECT USING (bucket_id = 'student-documents');
CREATE POLICY "Students can update their documents" ON storage.objects FOR UPDATE USING (bucket_id = 'student-documents');
CREATE POLICY "Students can delete their documents" ON storage.objects FOR DELETE USING (bucket_id = 'student-documents');

-- Add triggers for updated_at
CREATE TRIGGER update_student_documents_updated_at BEFORE UPDATE ON public.student_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_student_works_updated_at BEFORE UPDATE ON public.student_works FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default document categories
INSERT INTO public.document_categories (name, description, icon) VALUES
('Academic Records', 'Transcripts, grade reports, and academic certificates', '🎓'),
('Medical Documents', 'Medical reports, health records, and clinical certificates', '🏥'),
('Personal Documents', 'ID copies, personal certificates, and legal documents', '📄'),
('Assignments', 'Completed assignments, projects, and coursework', '📝'),
('Achievements', 'Awards, recognitions, and achievement certificates', '🏆'),
('Research Work', 'Research papers, thesis, and publications', '🔬'),
('Clinical Records', 'Clinical rotation reports and completion certificates', '⚕️'),
('Miscellaneous', 'Other important documents and files', '📁');

-- Insert sample payment records for demonstration
INSERT INTO public.payments (enrollment_id, amount, description, due_date, status) 
SELECT se.id, 5000.00, 'Semester 1 Tuition Fee', CURRENT_DATE + INTERVAL '30 days', 'pending' 
FROM public.student_enrollments se 
WHERE se.status = 'approved' 
LIMIT 3;

INSERT INTO public.payments (enrollment_id, amount, description, due_date, paid_date, status) 
SELECT se.id, 1500.00, 'Lab Fee - Semester 1', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '5 days', 'paid' 
FROM public.student_enrollments se 
WHERE se.status = 'approved' 
LIMIT 2;