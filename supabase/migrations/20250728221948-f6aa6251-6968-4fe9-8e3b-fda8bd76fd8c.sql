-- Comprehensive Faculty Management System Enhancement
-- Implementing all suggested features plus additional valuable functionality

-- 1. Faculty Performance & Rating System
CREATE TABLE public.faculty_student_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  student_enrollment_id UUID NOT NULL REFERENCES public.student_enrollments(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id),
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  teaching_effectiveness NUMERIC(2,1) CHECK (teaching_effectiveness >= 1.0 AND teaching_effectiveness <= 5.0),
  communication_skills NUMERIC(2,1) CHECK (communication_skills >= 1.0 AND communication_skills <= 5.0),
  subject_knowledge NUMERIC(2,1) CHECK (subject_knowledge >= 1.0 AND subject_knowledge <= 5.0),
  responsiveness NUMERIC(2,1) CHECK (responsiveness >= 1.0 AND responsiveness <= 5.0),
  feedback_text TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  semester TEXT,
  academic_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(faculty_id, student_enrollment_id, class_id)
);

CREATE TABLE public.faculty_peer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_faculty_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  reviewed_faculty_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  review_period TEXT NOT NULL,
  collaboration_rating NUMERIC(2,1) CHECK (collaboration_rating >= 1.0 AND collaboration_rating <= 5.0),
  professionalism_rating NUMERIC(2,1) CHECK (professionalism_rating >= 1.0 AND professionalism_rating <= 5.0),
  innovation_rating NUMERIC(2,1) CHECK (innovation_rating >= 1.0 AND innovation_rating <= 5.0),
  leadership_rating NUMERIC(2,1) CHECK (leadership_rating >= 1.0 AND leadership_rating <= 5.0),
  review_comments TEXT,
  strengths TEXT,
  improvement_areas TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(reviewer_faculty_id, reviewed_faculty_id, review_period)
);

-- 2. Faculty Certification & License Management
CREATE TABLE public.faculty_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  certification_type TEXT NOT NULL CHECK (certification_type IN ('medical_license', 'board_certification', 'specialty_certification', 'teaching_license', 'research_certification', 'other')),
  certification_name TEXT NOT NULL,
  issuing_authority TEXT NOT NULL,
  license_number TEXT,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'expired', 'revoked')),
  certificate_document_url TEXT,
  renewal_required BOOLEAN DEFAULT false,
  renewal_reminder_sent BOOLEAN DEFAULT false,
  country_issued TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Faculty Availability & Scheduling
CREATE TABLE public.faculty_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  is_available BOOLEAN DEFAULT true,
  availability_type TEXT CHECK (availability_type IN ('teaching', 'consultation', 'research', 'all')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.faculty_leave_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('vacation', 'sick_leave', 'conference', 'research', 'sabbatical', 'emergency', 'other')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Faculty Skills & Competency Matrix
CREATE TABLE public.faculty_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  skill_category TEXT NOT NULL CHECK (skill_category IN ('clinical', 'teaching', 'research', 'technology', 'leadership', 'communication', 'languages')),
  skill_name TEXT NOT NULL,
  proficiency_level TEXT NOT NULL CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  self_assessment_score NUMERIC(2,1) CHECK (self_assessment_score >= 1.0 AND self_assessment_score <= 5.0),
  verified_score NUMERIC(2,1) CHECK (verified_score >= 1.0 AND verified_score <= 5.0),
  years_of_experience INTEGER DEFAULT 0,
  last_used DATE,
  certification_available BOOLEAN DEFAULT false,
  wants_to_improve BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(faculty_registration_id, skill_name)
);

CREATE TABLE public.competency_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id),
  competency_name TEXT NOT NULL,
  required_proficiency_level TEXT NOT NULL CHECK (required_proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  weight NUMERIC(3,2) DEFAULT 1.0,
  is_mandatory BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Faculty Research & Publications Tracker
CREATE TABLE public.faculty_research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  project_title TEXT NOT NULL,
  project_description TEXT,
  research_area TEXT,
  project_status TEXT DEFAULT 'planning' CHECK (project_status IN ('planning', 'active', 'completed', 'suspended', 'cancelled')),
  start_date DATE,
  expected_end_date DATE,
  actual_end_date DATE,
  funding_amount NUMERIC(15,2),
  funding_source TEXT,
  grant_number TEXT,
  collaborators TEXT[],
  project_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.faculty_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  publication_type TEXT NOT NULL CHECK (publication_type IN ('journal_article', 'book', 'book_chapter', 'conference_paper', 'patent', 'thesis', 'other')),
  title TEXT NOT NULL,
  journal_name TEXT,
  conference_name TEXT,
  publisher TEXT,
  publication_date DATE,
  volume TEXT,
  issue TEXT,
  pages TEXT,
  doi TEXT,
  isbn TEXT,
  impact_factor NUMERIC(5,3),
  citation_count INTEGER DEFAULT 0,
  co_authors TEXT[],
  abstract TEXT,
  keywords TEXT[],
  publication_url TEXT,
  is_peer_reviewed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Faculty Matching Algorithm Support Tables
CREATE TABLE public.faculty_specialization_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id),
  proficiency_score NUMERIC(3,2) DEFAULT 1.0,
  teaching_preference BOOLEAN DEFAULT true,
  last_taught DATE,
  student_feedback_avg NUMERIC(2,1),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(faculty_registration_id, subject_id)
);

CREATE TABLE public.student_learning_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.student_enrollments(id) ON DELETE CASCADE,
  learning_style TEXT CHECK (learning_style IN ('visual', 'auditory', 'kinesthetic', 'reading_writing')),
  preferred_communication_style TEXT CHECK (preferred_communication_style IN ('formal', 'casual', 'structured', 'flexible')),
  preferred_languages TEXT[],
  timezone_preference TEXT,
  availability_preference TEXT, -- morning, afternoon, evening, flexible
  interaction_frequency TEXT CHECK (interaction_frequency IN ('high', 'medium', 'low')),
  feedback_preference TEXT CHECK (feedback_preference IN ('immediate', 'weekly', 'monthly')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Faculty Professional Development
CREATE TABLE public.faculty_training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name TEXT NOT NULL,
  program_type TEXT CHECK (program_type IN ('mandatory', 'optional', 'specialized')),
  description TEXT,
  duration_hours INTEGER,
  cme_credits NUMERIC(4,2),
  provider_name TEXT,
  program_url TEXT,
  prerequisites TEXT[],
  target_audience TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.faculty_training_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  training_program_id UUID NOT NULL REFERENCES public.faculty_training_programs(id) ON DELETE CASCADE,
  completion_date DATE NOT NULL,
  score NUMERIC(5,2),
  certificate_url TEXT,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(faculty_registration_id, training_program_id, completion_date)
);

CREATE TABLE public.faculty_development_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  plan_year INTEGER NOT NULL,
  career_goals TEXT,
  skill_development_goals TEXT[],
  research_goals TEXT,
  teaching_goals TEXT,
  target_certifications TEXT[],
  mentorship_needs TEXT,
  progress_notes TEXT,
  completion_status TEXT DEFAULT 'in_progress' CHECK (completion_status IN ('not_started', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(faculty_registration_id, plan_year)
);

-- 8. Additional Valuable Features

-- Faculty Mentorship Program
CREATE TABLE public.faculty_mentorship (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_faculty_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  mentee_faculty_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  mentorship_type TEXT CHECK (mentorship_type IN ('teaching', 'research', 'career', 'general')),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'terminated')),
  goals TEXT,
  progress_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Faculty Innovation & Awards
CREATE TABLE public.faculty_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  award_name TEXT NOT NULL,
  award_category TEXT CHECK (award_category IN ('teaching', 'research', 'service', 'innovation', 'leadership', 'lifetime_achievement')),
  awarding_organization TEXT NOT NULL,
  award_date DATE NOT NULL,
  award_level TEXT CHECK (award_level IN ('institutional', 'national', 'international')),
  description TEXT,
  award_value NUMERIC(15,2),
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Faculty Quality Assurance
CREATE TABLE public.faculty_quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  metric_period TEXT NOT NULL, -- e.g., "2024-Q1", "2024-Spring"
  student_satisfaction_avg NUMERIC(2,1),
  class_completion_rate NUMERIC(5,2),
  response_time_hours NUMERIC(8,2),
  content_quality_score NUMERIC(2,1),
  innovation_score NUMERIC(2,1),
  collaboration_score NUMERIC(2,1),
  overall_performance_score NUMERIC(2,1),
  improvement_areas TEXT[],
  strengths TEXT[],
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(faculty_registration_id, metric_period)
);

-- Faculty Wellness & Support
CREATE TABLE public.faculty_wellness_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_registration_id UUID NOT NULL REFERENCES public.faculty_registrations(id) ON DELETE CASCADE,
  wellness_category TEXT CHECK (wellness_category IN ('work_life_balance', 'stress_level', 'job_satisfaction', 'burnout_risk', 'support_needs')),
  score NUMERIC(2,1) CHECK (score >= 1.0 AND score <= 5.0),
  notes TEXT,
  assessment_date DATE NOT NULL,
  follow_up_required BOOLEAN DEFAULT false,
  support_provided TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for all new tables
ALTER TABLE public.faculty_student_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_peer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_leave_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competency_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_specialization_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_learning_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_training_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_development_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_mentorship ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_wellness_tracking ENABLE ROW LEVEL SECURITY;