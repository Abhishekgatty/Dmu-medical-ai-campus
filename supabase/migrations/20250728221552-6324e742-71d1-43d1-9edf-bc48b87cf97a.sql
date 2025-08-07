-- Fix security issue by removing SECURITY DEFINER from the view and making it a regular view

-- Drop the existing view
DROP VIEW IF EXISTS public.faculty_experience_summary;

-- Recreate the view without SECURITY DEFINER (regular view)
CREATE VIEW public.faculty_experience_summary AS
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