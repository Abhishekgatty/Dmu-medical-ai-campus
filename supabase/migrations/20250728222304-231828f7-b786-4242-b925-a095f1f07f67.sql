-- Add RLS policies for all new faculty management tables with proper UUID casting

-- Faculty Student Ratings Policies  
CREATE POLICY "Students can insert their faculty ratings" 
ON public.faculty_student_ratings 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.student_enrollments 
  WHERE id = student_enrollment_id AND email = (auth.jwt() ->> 'email')
));

CREATE POLICY "Faculty can view their ratings" 
ON public.faculty_student_ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can view all ratings" 
ON public.faculty_student_ratings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'clinical_admin')
));

-- Faculty Peer Reviews Policies
CREATE POLICY "Faculty can manage peer reviews" 
ON public.faculty_peer_reviews 
FOR ALL 
USING (true);

-- Faculty Certifications Policies
CREATE POLICY "Faculty can manage their certifications" 
ON public.faculty_certifications 
FOR ALL 
USING (true);

-- Faculty Availability Policies
CREATE POLICY "Faculty can manage their availability" 
ON public.faculty_availability 
FOR ALL 
USING (true);

CREATE POLICY "Students can view faculty availability" 
ON public.faculty_availability 
FOR SELECT 
USING (true);

-- Faculty Leave Schedule Policies
CREATE POLICY "Faculty can manage their leave schedule" 
ON public.faculty_leave_schedule 
FOR ALL 
USING (true);

-- Faculty Skills Policies
CREATE POLICY "Faculty can manage their skills" 
ON public.faculty_skills 
FOR ALL 
USING (true);

CREATE POLICY "Everyone can view faculty skills" 
ON public.faculty_skills 
FOR SELECT 
USING (true);

-- Competency Requirements Policies
CREATE POLICY "Everyone can view competency requirements" 
ON public.competency_requirements 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage competency requirements" 
ON public.competency_requirements 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'clinical_admin')
));

-- Faculty Research Projects Policies
CREATE POLICY "Faculty can manage their research projects" 
ON public.faculty_research_projects 
FOR ALL 
USING (true);

-- Faculty Publications Policies
CREATE POLICY "Faculty can manage their publications" 
ON public.faculty_publications 
FOR ALL 
USING (true);

-- Faculty Specialization Mapping Policies
CREATE POLICY "Faculty can manage their specialization mapping" 
ON public.faculty_specialization_mapping 
FOR ALL 
USING (true);

-- Student Learning Preferences Policies
CREATE POLICY "Students can manage their learning preferences" 
ON public.student_learning_preferences 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.student_enrollments 
  WHERE id = enrollment_id AND email = (auth.jwt() ->> 'email')
));

-- Faculty Training Programs Policies
CREATE POLICY "Everyone can view training programs" 
ON public.faculty_training_programs 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage training programs" 
ON public.faculty_training_programs 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'clinical_admin')
));

-- Faculty Training Completions Policies
CREATE POLICY "Faculty can manage their training completions" 
ON public.faculty_training_completions 
FOR ALL 
USING (true);

-- Faculty Development Plans Policies
CREATE POLICY "Faculty can manage their development plans" 
ON public.faculty_development_plans 
FOR ALL 
USING (true);

-- Faculty Mentorship Policies
CREATE POLICY "Faculty can manage mentorship" 
ON public.faculty_mentorship 
FOR ALL 
USING (true);

-- Faculty Awards Policies
CREATE POLICY "Faculty can manage their awards" 
ON public.faculty_awards 
FOR ALL 
USING (true);

CREATE POLICY "Everyone can view faculty awards" 
ON public.faculty_awards 
FOR SELECT 
USING (true);

-- Faculty Quality Metrics Policies
CREATE POLICY "Faculty can view their quality metrics" 
ON public.faculty_quality_metrics 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage all quality metrics" 
ON public.faculty_quality_metrics 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'clinical_admin')
));

-- Faculty Wellness Tracking Policies
CREATE POLICY "Faculty can manage their wellness tracking" 
ON public.faculty_wellness_tracking 
FOR ALL 
USING (true);