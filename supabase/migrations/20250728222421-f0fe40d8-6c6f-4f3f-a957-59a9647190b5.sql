-- Add automation functions, triggers, and additional features

-- Create triggers for updated_at columns on new tables
CREATE TRIGGER update_faculty_student_ratings_updated_at
    BEFORE UPDATE ON public.faculty_student_ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_peer_reviews_updated_at
    BEFORE UPDATE ON public.faculty_peer_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_certifications_updated_at
    BEFORE UPDATE ON public.faculty_certifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_availability_updated_at
    BEFORE UPDATE ON public.faculty_availability
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_leave_schedule_updated_at
    BEFORE UPDATE ON public.faculty_leave_schedule
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_skills_updated_at
    BEFORE UPDATE ON public.faculty_skills
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_research_projects_updated_at
    BEFORE UPDATE ON public.faculty_research_projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_publications_updated_at
    BEFORE UPDATE ON public.faculty_publications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_learning_preferences_updated_at
    BEFORE UPDATE ON public.student_learning_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_development_plans_updated_at
    BEFORE UPDATE ON public.faculty_development_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_mentorship_updated_at
    BEFORE UPDATE ON public.faculty_mentorship
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function for faculty matching algorithm
CREATE OR REPLACE FUNCTION public.calculate_faculty_student_match_score(
  faculty_reg_id UUID,
  student_enrollment_id UUID,
  subject_id_param UUID
) RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
    specialization_score NUMERIC := 0;
    availability_score NUMERIC := 0;
    rating_score NUMERIC := 0;
    language_score NUMERIC := 0;
    total_score NUMERIC := 0;
    faculty_languages TEXT[];
    student_languages TEXT[];
BEGIN
    -- Calculate specialization alignment score (40% weight)
    SELECT COALESCE(proficiency_score, 0) INTO specialization_score
    FROM public.faculty_specialization_mapping
    WHERE faculty_registration_id = faculty_reg_id AND subject_id = subject_id_param;
    
    -- Calculate availability alignment score (20% weight)
    SELECT CASE 
        WHEN COUNT(*) > 0 THEN 1.0 
        ELSE 0.0 
    END INTO availability_score
    FROM public.faculty_availability
    WHERE faculty_registration_id = faculty_reg_id AND is_available = true;
    
    -- Calculate historical rating score (30% weight)
    SELECT COALESCE(AVG(rating), 2.5) INTO rating_score
    FROM public.faculty_student_ratings
    WHERE faculty_id = faculty_reg_id;
    
    -- Calculate language compatibility score (10% weight)
    SELECT ARRAY_AGG(language) INTO faculty_languages
    FROM (
        SELECT UNNEST(languages) as language 
        FROM public.faculty_registrations 
        WHERE id = faculty_reg_id
    ) f;
    
    SELECT ARRAY_AGG(language) INTO student_languages
    FROM (
        SELECT UNNEST(preferred_languages) as language 
        FROM public.student_learning_preferences 
        WHERE enrollment_id = student_enrollment_id
    ) s;
    
    -- Simple language overlap calculation
    IF faculty_languages && student_languages THEN
        language_score := 1.0;
    ELSE
        language_score := 0.5; -- Partial score if no perfect match
    END IF;
    
    -- Calculate weighted total score
    total_score := (specialization_score * 0.4) + 
                   (availability_score * 0.2) + 
                   (rating_score * 0.3) + 
                   (language_score * 0.1);
                   
    RETURN ROUND(total_score, 2);
END;
$$;

-- Create function to auto-expire certifications
CREATE OR REPLACE FUNCTION public.check_certification_expiry()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
    -- Update expired certifications
    UPDATE public.faculty_certifications 
    SET verification_status = 'expired',
        is_active = false
    WHERE expiry_date < CURRENT_DATE 
    AND verification_status != 'expired';
    
    -- Send renewal reminders (update reminder flag)
    UPDATE public.faculty_certifications 
    SET renewal_reminder_sent = true
    WHERE expiry_date <= CURRENT_DATE + INTERVAL '30 days'
    AND expiry_date > CURRENT_DATE
    AND renewal_reminder_sent = false
    AND is_active = true;
END;
$$;

-- Create function to calculate faculty quality metrics
CREATE OR REPLACE FUNCTION public.calculate_faculty_quality_metrics(
  faculty_reg_id UUID,
  period_param TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
    avg_satisfaction NUMERIC;
    completion_rate NUMERIC;
    avg_response_time NUMERIC;
    total_classes INTEGER;
    completed_classes INTEGER;
BEGIN
    -- Calculate student satisfaction average
    SELECT AVG(rating) INTO avg_satisfaction
    FROM public.faculty_student_ratings
    WHERE faculty_id = faculty_reg_id;
    
    -- Calculate class completion rate (simplified)
    SELECT COUNT(*) INTO total_classes
    FROM public.classes
    WHERE faculty_id = (
        SELECT id FROM public.faculty 
        WHERE id IN (
            SELECT faculty_id FROM public.faculty_auth_links 
            WHERE user_id IN (
                SELECT id FROM public.user_profiles 
                WHERE id = auth.uid()
            )
        )
    );
    
    SELECT COUNT(*) INTO completed_classes
    FROM public.classes
    WHERE faculty_id = (
        SELECT id FROM public.faculty 
        WHERE id IN (
            SELECT faculty_id FROM public.faculty_auth_links 
            WHERE user_id IN (
                SELECT id FROM public.user_profiles 
                WHERE id = auth.uid()
            )
        )
    ) AND status = 'completed';
    
    IF total_classes > 0 THEN
        completion_rate := (completed_classes::NUMERIC / total_classes::NUMERIC) * 100;
    ELSE
        completion_rate := 0;
    END IF;
    
    -- Insert or update quality metrics
    INSERT INTO public.faculty_quality_metrics (
        faculty_registration_id,
        metric_period,
        student_satisfaction_avg,
        class_completion_rate,
        overall_performance_score
    ) VALUES (
        faculty_reg_id,
        period_param,
        avg_satisfaction,
        completion_rate,
        (COALESCE(avg_satisfaction, 0) + COALESCE(completion_rate/20, 0)) / 2
    )
    ON CONFLICT (faculty_registration_id, metric_period)
    DO UPDATE SET
        student_satisfaction_avg = EXCLUDED.student_satisfaction_avg,
        class_completion_rate = EXCLUDED.class_completion_rate,
        overall_performance_score = EXCLUDED.overall_performance_score,
        calculated_at = now();
END;
$$;

-- Create additional indexes for performance optimization
CREATE INDEX idx_faculty_student_ratings_faculty_id ON public.faculty_student_ratings(faculty_id);
CREATE INDEX idx_faculty_student_ratings_semester ON public.faculty_student_ratings(semester, academic_year);
CREATE INDEX idx_faculty_peer_reviews_period ON public.faculty_peer_reviews(review_period);
CREATE INDEX idx_faculty_certifications_expiry ON public.faculty_certifications(expiry_date) WHERE is_active = true;
CREATE INDEX idx_faculty_availability_day_time ON public.faculty_availability(day_of_week, start_time, end_time);
CREATE INDEX idx_faculty_leave_dates ON public.faculty_leave_schedule(start_date, end_date);
CREATE INDEX idx_faculty_skills_category ON public.faculty_skills(skill_category, proficiency_level);
CREATE INDEX idx_faculty_research_status ON public.faculty_research_projects(project_status);
CREATE INDEX idx_faculty_publications_date ON public.faculty_publications(publication_date DESC);
CREATE INDEX idx_faculty_publications_type ON public.faculty_publications(publication_type);
CREATE INDEX idx_faculty_training_completion_date ON public.faculty_training_completions(completion_date DESC);
CREATE INDEX idx_faculty_awards_date ON public.faculty_awards(award_date DESC);
CREATE INDEX idx_faculty_awards_category ON public.faculty_awards(award_category);

-- Create comprehensive faculty dashboard view
CREATE VIEW public.faculty_comprehensive_dashboard AS
SELECT 
    fr.id,
    fr.full_name,
    fr.email,
    fr.specialty,
    fr.status,
    fr.calculated_experience_years,
    dt.dmu_joining_date,
    dt.tenure_status,
    -- Rating metrics
    COALESCE(AVG(fsr.rating), 0) as avg_student_rating,
    COUNT(fsr.id) as total_ratings_received,
    -- Certification counts
    (SELECT COUNT(*) FROM public.faculty_certifications fc 
     WHERE fc.faculty_registration_id = fr.id AND fc.is_active = true) as active_certifications,
    (SELECT COUNT(*) FROM public.faculty_certifications fc 
     WHERE fc.faculty_registration_id = fr.id AND fc.expiry_date <= CURRENT_DATE + INTERVAL '30 days') as expiring_certifications,
    -- Research metrics
    (SELECT COUNT(*) FROM public.faculty_research_projects frp 
     WHERE frp.faculty_registration_id = fr.id AND frp.project_status = 'active') as active_research_projects,
    (SELECT COUNT(*) FROM public.faculty_publications fp 
     WHERE fp.faculty_registration_id = fr.id) as total_publications,
    -- Training metrics
    (SELECT COUNT(*) FROM public.faculty_training_completions ftc 
     WHERE ftc.faculty_registration_id = fr.id 
     AND ftc.completion_date >= CURRENT_DATE - INTERVAL '1 year') as trainings_completed_this_year,
    -- Skills count
    (SELECT COUNT(*) FROM public.faculty_skills fs 
     WHERE fs.faculty_registration_id = fr.id) as total_skills_listed,
    -- Awards count
    (SELECT COUNT(*) FROM public.faculty_awards fa 
     WHERE fa.faculty_registration_id = fr.id) as total_awards,
    -- Mentorship count
    (SELECT COUNT(*) FROM public.faculty_mentorship fm 
     WHERE fm.mentor_faculty_id = fr.id AND fm.status = 'active') as active_mentorships,
    -- Quality metrics
    fqm.overall_performance_score,
    fqm.calculated_at as last_metrics_update
FROM public.faculty_registrations fr
LEFT JOIN public.faculty_dmu_tenure dt ON fr.id = dt.faculty_registration_id
LEFT JOIN public.faculty_student_ratings fsr ON fr.id = fsr.faculty_id
LEFT JOIN public.faculty_quality_metrics fqm ON fr.id = fqm.faculty_registration_id 
    AND fqm.metric_period = TO_CHAR(CURRENT_DATE, 'YYYY-Q"Q"')
GROUP BY fr.id, fr.full_name, fr.email, fr.specialty, fr.status, fr.calculated_experience_years, 
         dt.dmu_joining_date, dt.tenure_status, fqm.overall_performance_score, fqm.calculated_at;