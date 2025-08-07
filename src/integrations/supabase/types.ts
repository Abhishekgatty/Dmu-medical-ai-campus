export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_approvals: {
        Row: {
          admin_notes: string | null
          created_at: string
          decision: string | null
          enrollment_id: string
          id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          decision?: string | null
          enrollment_id: string
          id?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          decision?: string | null
          enrollment_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_approvals_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          class_id: string
          enrollment_id: string
          id: string
          recorded_at: string
          status: string
        }
        Insert: {
          class_id: string
          enrollment_id: string
          id?: string
          recorded_at?: string
          status: string
        }
        Update: {
          class_id?: string
          enrollment_id?: string
          id?: string
          recorded_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          class_date: string
          created_at: string
          duration_minutes: number | null
          enrollment_id: string
          faculty_id: string
          id: string
          meeting_link: string | null
          notes: string | null
          status: string | null
          subject_id: string
        }
        Insert: {
          class_date: string
          created_at?: string
          duration_minutes?: number | null
          enrollment_id: string
          faculty_id: string
          id?: string
          meeting_link?: string | null
          notes?: string | null
          status?: string | null
          subject_id: string
        }
        Update: {
          class_date?: string
          created_at?: string
          duration_minutes?: number | null
          enrollment_id?: string
          faculty_id?: string
          id?: string
          meeting_link?: string | null
          notes?: string | null
          status?: string | null
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_assignments: {
        Row: {
          clinical_center_id: string
          completion_letter_url: string | null
          created_at: string
          end_date: string
          enrollment_id: string
          id: string
          start_date: string
          status: string | null
        }
        Insert: {
          clinical_center_id: string
          completion_letter_url?: string | null
          created_at?: string
          end_date: string
          enrollment_id: string
          id?: string
          start_date: string
          status?: string | null
        }
        Update: {
          clinical_center_id?: string
          completion_letter_url?: string | null
          created_at?: string
          end_date?: string
          enrollment_id?: string
          id?: string
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinical_assignments_clinical_center_id_fkey"
            columns: ["clinical_center_id"]
            isOneToOne: false
            referencedRelation: "clinical_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_assignments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_attendance: {
        Row: {
          assignment_id: string
          attendance_date: string
          created_at: string
          hours_completed: number | null
          id: string
          marked_by: string | null
          notes: string | null
          status: string
        }
        Insert: {
          assignment_id: string
          attendance_date?: string
          created_at?: string
          hours_completed?: number | null
          id?: string
          marked_by?: string | null
          notes?: string | null
          status: string
        }
        Update: {
          assignment_id?: string
          attendance_date?: string
          created_at?: string
          hours_completed?: number | null
          id?: string
          marked_by?: string | null
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_attendance_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "clinical_student_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_centers: {
        Row: {
          address: string
          capacity: number
          city: string
          contact_email: string | null
          contact_phone: string | null
          country: string
          courses_accepting: string[] | null
          created_at: string
          current_students: number | null
          departments: string[] | null
          facilities: string[] | null
          head_name: string | null
          id: string
          international_students: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          number_of_beds: number | null
          specialties: string[] | null
        }
        Insert: {
          address: string
          capacity: number
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          country: string
          courses_accepting?: string[] | null
          created_at?: string
          current_students?: number | null
          departments?: string[] | null
          facilities?: string[] | null
          head_name?: string | null
          id?: string
          international_students?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          number_of_beds?: number | null
          specialties?: string[] | null
        }
        Update: {
          address?: string
          capacity?: number
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          country?: string
          courses_accepting?: string[] | null
          created_at?: string
          current_students?: number | null
          departments?: string[] | null
          facilities?: string[] | null
          head_name?: string | null
          id?: string
          international_students?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          number_of_beds?: number | null
          specialties?: string[] | null
        }
        Relationships: []
      }
      clinical_payments: {
        Row: {
          amount: number
          assignment_id: string
          clinical_center_id: string
          created_at: string
          description: string
          due_date: string
          id: string
          payment_date: string
          status: string | null
        }
        Insert: {
          amount: number
          assignment_id: string
          clinical_center_id: string
          created_at?: string
          description: string
          due_date: string
          id?: string
          payment_date?: string
          status?: string | null
        }
        Update: {
          amount?: number
          assignment_id?: string
          clinical_center_id?: string
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          payment_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinical_payments_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "clinical_student_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_payments_clinical_center_id_fkey"
            columns: ["clinical_center_id"]
            isOneToOne: false
            referencedRelation: "clinical_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_registrations: {
        Row: {
          address: string
          approved_at: string | null
          approved_by: string | null
          country: string
          course_accepting: string[] | null
          created_at: string
          departments: string[]
          email: string
          facilities: string[]
          facility_name: string
          head_name: string
          id: string
          international_students: boolean | null
          latitude: number | null
          longitude: number | null
          number_of_beds: number
          phone: string
          state: string
          status: string | null
          student_roll_numbers: string[] | null
          updated_at: string
        }
        Insert: {
          address: string
          approved_at?: string | null
          approved_by?: string | null
          country: string
          course_accepting?: string[] | null
          created_at?: string
          departments: string[]
          email: string
          facilities: string[]
          facility_name: string
          head_name: string
          id?: string
          international_students?: boolean | null
          latitude?: number | null
          longitude?: number | null
          number_of_beds: number
          phone: string
          state: string
          status?: string | null
          student_roll_numbers?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string
          approved_at?: string | null
          approved_by?: string | null
          country?: string
          course_accepting?: string[] | null
          created_at?: string
          departments?: string[]
          email?: string
          facilities?: string[]
          facility_name?: string
          head_name?: string
          id?: string
          international_students?: boolean | null
          latitude?: number | null
          longitude?: number | null
          number_of_beds?: number
          phone?: string
          state?: string
          status?: string | null
          student_roll_numbers?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      clinical_rotations: {
        Row: {
          assignment_id: string
          completed_hours: number | null
          created_at: string
          department: string
          end_date: string | null
          id: string
          required_hours: number
          start_date: string | null
          status: string | null
        }
        Insert: {
          assignment_id: string
          completed_hours?: number | null
          created_at?: string
          department: string
          end_date?: string | null
          id?: string
          required_hours: number
          start_date?: string | null
          status?: string | null
        }
        Update: {
          assignment_id?: string
          completed_hours?: number | null
          created_at?: string
          department?: string
          end_date?: string | null
          id?: string
          required_hours?: number
          start_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinical_rotations_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "clinical_student_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_student_assignments: {
        Row: {
          assigned_at: string
          clinical_center_id: string
          completion_letter_url: string | null
          created_at: string
          end_date: string
          enrollment_id: string
          id: string
          start_date: string
          status: string | null
          training_department: string | null
          training_faculty_name: string | null
        }
        Insert: {
          assigned_at?: string
          clinical_center_id: string
          completion_letter_url?: string | null
          created_at?: string
          end_date: string
          enrollment_id: string
          id?: string
          start_date: string
          status?: string | null
          training_department?: string | null
          training_faculty_name?: string | null
        }
        Update: {
          assigned_at?: string
          clinical_center_id?: string
          completion_letter_url?: string | null
          created_at?: string
          end_date?: string
          enrollment_id?: string
          id?: string
          start_date?: string
          status?: string | null
          training_department?: string | null
          training_faculty_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinical_student_assignments_clinical_center_id_fkey"
            columns: ["clinical_center_id"]
            isOneToOne: false
            referencedRelation: "clinical_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_student_assignments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      competency_requirements: {
        Row: {
          competency_name: string
          created_at: string
          id: string
          is_mandatory: boolean | null
          required_proficiency_level: string
          subject_id: string | null
          weight: number | null
        }
        Insert: {
          competency_name: string
          created_at?: string
          id?: string
          is_mandatory?: boolean | null
          required_proficiency_level: string
          subject_id?: string | null
          weight?: number | null
        }
        Update: {
          competency_name?: string
          created_at?: string
          id?: string
          is_mandatory?: boolean | null
          required_proficiency_level?: string
          subject_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "competency_requirements_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          created_at: string
          description: string | null
          duration: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      document_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      faculty: {
        Row: {
          address: string | null
          age: number | null
          approved_at: string | null
          bio: string | null
          city: string
          country: string
          created_at: string
          current_students: number | null
          degree: string | null
          email: string
          experience_years: number
          experience_years_new: number | null
          extra_courses: string[] | null
          faculty_id: string | null
          hourly_rate: number | null
          id: string
          languages: string[] | null
          latitude: number | null
          longitude: number | null
          max_students: number | null
          name: string
          payment_details: Json | null
          phone: string | null
          qualifications: string[] | null
          specializations: string[]
          specialty: string | null
          status: string | null
          updated_at: string
          year_of_completion: number | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          approved_at?: string | null
          bio?: string | null
          city: string
          country: string
          created_at?: string
          current_students?: number | null
          degree?: string | null
          email: string
          experience_years: number
          experience_years_new?: number | null
          extra_courses?: string[] | null
          faculty_id?: string | null
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          latitude?: number | null
          longitude?: number | null
          max_students?: number | null
          name: string
          payment_details?: Json | null
          phone?: string | null
          qualifications?: string[] | null
          specializations: string[]
          specialty?: string | null
          status?: string | null
          updated_at?: string
          year_of_completion?: number | null
        }
        Update: {
          address?: string | null
          age?: number | null
          approved_at?: string | null
          bio?: string | null
          city?: string
          country?: string
          created_at?: string
          current_students?: number | null
          degree?: string | null
          email?: string
          experience_years?: number
          experience_years_new?: number | null
          extra_courses?: string[] | null
          faculty_id?: string | null
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          latitude?: number | null
          longitude?: number | null
          max_students?: number | null
          name?: string
          payment_details?: Json | null
          phone?: string | null
          qualifications?: string[] | null
          specializations?: string[]
          specialty?: string | null
          status?: string | null
          updated_at?: string
          year_of_completion?: number | null
        }
        Relationships: []
      }
      faculty_auth_links: {
        Row: {
          faculty_id: string
          id: string
          linked_at: string
          user_id: string
        }
        Insert: {
          faculty_id: string
          id?: string
          linked_at?: string
          user_id: string
        }
        Update: {
          faculty_id?: string
          id?: string
          linked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_auth_links_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_availability: {
        Row: {
          availability_type: string | null
          created_at: string
          day_of_week: number
          end_time: string
          faculty_registration_id: string
          id: string
          is_available: boolean | null
          start_time: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          availability_type?: string | null
          created_at?: string
          day_of_week: number
          end_time: string
          faculty_registration_id: string
          id?: string
          is_available?: boolean | null
          start_time: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          availability_type?: string | null
          created_at?: string
          day_of_week?: number
          end_time?: string
          faculty_registration_id?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_availability_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_availability_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_availability_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_awards: {
        Row: {
          award_category: string | null
          award_date: string
          award_level: string | null
          award_name: string
          award_value: number | null
          awarding_organization: string
          certificate_url: string | null
          created_at: string
          description: string | null
          faculty_registration_id: string
          id: string
        }
        Insert: {
          award_category?: string | null
          award_date: string
          award_level?: string | null
          award_name: string
          award_value?: number | null
          awarding_organization: string
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          faculty_registration_id: string
          id?: string
        }
        Update: {
          award_category?: string | null
          award_date?: string
          award_level?: string | null
          award_name?: string
          award_value?: number | null
          awarding_organization?: string
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          faculty_registration_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_awards_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_awards_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_awards_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_certifications: {
        Row: {
          certificate_document_url: string | null
          certification_name: string
          certification_type: string
          country_issued: string
          created_at: string
          expiry_date: string | null
          faculty_registration_id: string
          id: string
          is_active: boolean | null
          issue_date: string
          issuing_authority: string
          license_number: string | null
          renewal_reminder_sent: boolean | null
          renewal_required: boolean | null
          updated_at: string
          verification_status: string | null
        }
        Insert: {
          certificate_document_url?: string | null
          certification_name: string
          certification_type: string
          country_issued: string
          created_at?: string
          expiry_date?: string | null
          faculty_registration_id: string
          id?: string
          is_active?: boolean | null
          issue_date: string
          issuing_authority: string
          license_number?: string | null
          renewal_reminder_sent?: boolean | null
          renewal_required?: boolean | null
          updated_at?: string
          verification_status?: string | null
        }
        Update: {
          certificate_document_url?: string | null
          certification_name?: string
          certification_type?: string
          country_issued?: string
          created_at?: string
          expiry_date?: string | null
          faculty_registration_id?: string
          id?: string
          is_active?: boolean | null
          issue_date?: string
          issuing_authority?: string
          license_number?: string | null
          renewal_reminder_sent?: boolean | null
          renewal_required?: boolean | null
          updated_at?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_certifications_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_certifications_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_certifications_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_degree_details: {
        Row: {
          completion_year: number
          country: string
          created_at: string
          degree_name: string
          degree_type: string
          faculty_registration_id: string
          grade_gpa: number | null
          grade_percentage: number | null
          id: string
          institution_name: string
          is_verified: boolean | null
          specialization: string | null
          start_year: number
          university_name: string | null
          updated_at: string
          verification_document_url: string | null
        }
        Insert: {
          completion_year: number
          country: string
          created_at?: string
          degree_name: string
          degree_type: string
          faculty_registration_id: string
          grade_gpa?: number | null
          grade_percentage?: number | null
          id?: string
          institution_name: string
          is_verified?: boolean | null
          specialization?: string | null
          start_year: number
          university_name?: string | null
          updated_at?: string
          verification_document_url?: string | null
        }
        Update: {
          completion_year?: number
          country?: string
          created_at?: string
          degree_name?: string
          degree_type?: string
          faculty_registration_id?: string
          grade_gpa?: number | null
          grade_percentage?: number | null
          id?: string
          institution_name?: string
          is_verified?: boolean | null
          specialization?: string | null
          start_year?: number
          university_name?: string | null
          updated_at?: string
          verification_document_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_degree_details_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_degree_details_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_degree_details_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_development_plans: {
        Row: {
          career_goals: string | null
          completion_status: string | null
          created_at: string
          faculty_registration_id: string
          id: string
          mentorship_needs: string | null
          plan_year: number
          progress_notes: string | null
          research_goals: string | null
          skill_development_goals: string[] | null
          target_certifications: string[] | null
          teaching_goals: string | null
          updated_at: string
        }
        Insert: {
          career_goals?: string | null
          completion_status?: string | null
          created_at?: string
          faculty_registration_id: string
          id?: string
          mentorship_needs?: string | null
          plan_year: number
          progress_notes?: string | null
          research_goals?: string | null
          skill_development_goals?: string[] | null
          target_certifications?: string[] | null
          teaching_goals?: string | null
          updated_at?: string
        }
        Update: {
          career_goals?: string | null
          completion_status?: string | null
          created_at?: string
          faculty_registration_id?: string
          id?: string
          mentorship_needs?: string | null
          plan_year?: number
          progress_notes?: string | null
          research_goals?: string | null
          skill_development_goals?: string[] | null
          target_certifications?: string[] | null
          teaching_goals?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_development_plans_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_development_plans_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_development_plans_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_dmu_tenure: {
        Row: {
          created_at: string
          current_department: string | null
          current_position: string
          dmu_exit_date: string | null
          dmu_joining_date: string
          employment_type: string | null
          faculty_registration_id: string
          id: string
          performance_rating: number | null
          tenure_status: string | null
          total_dmu_experience_months: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_department?: string | null
          current_position: string
          dmu_exit_date?: string | null
          dmu_joining_date: string
          employment_type?: string | null
          faculty_registration_id: string
          id?: string
          performance_rating?: number | null
          tenure_status?: string | null
          total_dmu_experience_months?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_department?: string | null
          current_position?: string
          dmu_exit_date?: string | null
          dmu_joining_date?: string
          employment_type?: string | null
          faculty_registration_id?: string
          id?: string
          performance_rating?: number | null
          tenure_status?: string | null
          total_dmu_experience_months?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_dmu_tenure_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: true
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_dmu_tenure_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: true
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_dmu_tenure_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: true
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_earnings: {
        Row: {
          amount: number
          class_id: string | null
          created_at: string
          currency: string | null
          description: string | null
          faculty_id: string
          id: string
          payment_date: string
          payment_status: string | null
          student_enrollment_id: string | null
        }
        Insert: {
          amount: number
          class_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          faculty_id: string
          id?: string
          payment_date?: string
          payment_status?: string | null
          student_enrollment_id?: string | null
        }
        Update: {
          amount?: number
          class_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          faculty_id?: string
          id?: string
          payment_date?: string
          payment_status?: string | null
          student_enrollment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_earnings_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "faculty_scheduled_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_earnings_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_earnings_student_enrollment_id_fkey"
            columns: ["student_enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_leave_schedule: {
        Row: {
          approval_status: string | null
          approved_by: string | null
          created_at: string
          end_date: string
          faculty_registration_id: string
          id: string
          leave_type: string
          notes: string | null
          reason: string | null
          start_date: string
          updated_at: string
        }
        Insert: {
          approval_status?: string | null
          approved_by?: string | null
          created_at?: string
          end_date: string
          faculty_registration_id: string
          id?: string
          leave_type: string
          notes?: string | null
          reason?: string | null
          start_date: string
          updated_at?: string
        }
        Update: {
          approval_status?: string | null
          approved_by?: string | null
          created_at?: string
          end_date?: string
          faculty_registration_id?: string
          id?: string
          leave_type?: string
          notes?: string | null
          reason?: string | null
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_leave_schedule_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_leave_schedule_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_leave_schedule_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_mentorship: {
        Row: {
          created_at: string
          end_date: string | null
          goals: string | null
          id: string
          mentee_faculty_id: string
          mentor_faculty_id: string
          mentorship_type: string | null
          progress_notes: string | null
          start_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          goals?: string | null
          id?: string
          mentee_faculty_id: string
          mentor_faculty_id: string
          mentorship_type?: string | null
          progress_notes?: string | null
          start_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          goals?: string | null
          id?: string
          mentee_faculty_id?: string
          mentor_faculty_id?: string
          mentorship_type?: string | null
          progress_notes?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_mentorship_mentee_faculty_id_fkey"
            columns: ["mentee_faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_mentorship_mentee_faculty_id_fkey"
            columns: ["mentee_faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_mentorship_mentee_faculty_id_fkey"
            columns: ["mentee_faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_mentorship_mentor_faculty_id_fkey"
            columns: ["mentor_faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_mentorship_mentor_faculty_id_fkey"
            columns: ["mentor_faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_mentorship_mentor_faculty_id_fkey"
            columns: ["mentor_faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_peer_reviews: {
        Row: {
          collaboration_rating: number | null
          created_at: string
          id: string
          improvement_areas: string | null
          innovation_rating: number | null
          leadership_rating: number | null
          professionalism_rating: number | null
          review_comments: string | null
          review_period: string
          reviewed_faculty_id: string
          reviewer_faculty_id: string
          strengths: string | null
          updated_at: string
        }
        Insert: {
          collaboration_rating?: number | null
          created_at?: string
          id?: string
          improvement_areas?: string | null
          innovation_rating?: number | null
          leadership_rating?: number | null
          professionalism_rating?: number | null
          review_comments?: string | null
          review_period: string
          reviewed_faculty_id: string
          reviewer_faculty_id: string
          strengths?: string | null
          updated_at?: string
        }
        Update: {
          collaboration_rating?: number | null
          created_at?: string
          id?: string
          improvement_areas?: string | null
          innovation_rating?: number | null
          leadership_rating?: number | null
          professionalism_rating?: number | null
          review_comments?: string | null
          review_period?: string
          reviewed_faculty_id?: string
          reviewer_faculty_id?: string
          strengths?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_peer_reviews_reviewed_faculty_id_fkey"
            columns: ["reviewed_faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_peer_reviews_reviewed_faculty_id_fkey"
            columns: ["reviewed_faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_peer_reviews_reviewed_faculty_id_fkey"
            columns: ["reviewed_faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_peer_reviews_reviewer_faculty_id_fkey"
            columns: ["reviewer_faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_peer_reviews_reviewer_faculty_id_fkey"
            columns: ["reviewer_faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_peer_reviews_reviewer_faculty_id_fkey"
            columns: ["reviewer_faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_profiles: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          languages: string[] | null
          office_hours: Json | null
          profile_photo_url: string | null
          qualifications: string[] | null
          social_links: Json | null
          teaching_philosophy: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id: string
          languages?: string[] | null
          office_hours?: Json | null
          profile_photo_url?: string | null
          qualifications?: string[] | null
          social_links?: Json | null
          teaching_philosophy?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          languages?: string[] | null
          office_hours?: Json | null
          profile_photo_url?: string | null
          qualifications?: string[] | null
          social_links?: Json | null
          teaching_philosophy?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_publications: {
        Row: {
          abstract: string | null
          citation_count: number | null
          co_authors: string[] | null
          conference_name: string | null
          created_at: string
          doi: string | null
          faculty_registration_id: string
          id: string
          impact_factor: number | null
          is_peer_reviewed: boolean | null
          isbn: string | null
          issue: string | null
          journal_name: string | null
          keywords: string[] | null
          pages: string | null
          publication_date: string | null
          publication_type: string
          publication_url: string | null
          publisher: string | null
          title: string
          updated_at: string
          volume: string | null
        }
        Insert: {
          abstract?: string | null
          citation_count?: number | null
          co_authors?: string[] | null
          conference_name?: string | null
          created_at?: string
          doi?: string | null
          faculty_registration_id: string
          id?: string
          impact_factor?: number | null
          is_peer_reviewed?: boolean | null
          isbn?: string | null
          issue?: string | null
          journal_name?: string | null
          keywords?: string[] | null
          pages?: string | null
          publication_date?: string | null
          publication_type: string
          publication_url?: string | null
          publisher?: string | null
          title: string
          updated_at?: string
          volume?: string | null
        }
        Update: {
          abstract?: string | null
          citation_count?: number | null
          co_authors?: string[] | null
          conference_name?: string | null
          created_at?: string
          doi?: string | null
          faculty_registration_id?: string
          id?: string
          impact_factor?: number | null
          is_peer_reviewed?: boolean | null
          isbn?: string | null
          issue?: string | null
          journal_name?: string | null
          keywords?: string[] | null
          pages?: string | null
          publication_date?: string | null
          publication_type?: string
          publication_url?: string | null
          publisher?: string | null
          title?: string
          updated_at?: string
          volume?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_publications_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_publications_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_publications_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_quality_metrics: {
        Row: {
          calculated_at: string | null
          class_completion_rate: number | null
          collaboration_score: number | null
          content_quality_score: number | null
          faculty_registration_id: string
          id: string
          improvement_areas: string[] | null
          innovation_score: number | null
          metric_period: string
          overall_performance_score: number | null
          response_time_hours: number | null
          strengths: string[] | null
          student_satisfaction_avg: number | null
        }
        Insert: {
          calculated_at?: string | null
          class_completion_rate?: number | null
          collaboration_score?: number | null
          content_quality_score?: number | null
          faculty_registration_id: string
          id?: string
          improvement_areas?: string[] | null
          innovation_score?: number | null
          metric_period: string
          overall_performance_score?: number | null
          response_time_hours?: number | null
          strengths?: string[] | null
          student_satisfaction_avg?: number | null
        }
        Update: {
          calculated_at?: string | null
          class_completion_rate?: number | null
          collaboration_score?: number | null
          content_quality_score?: number | null
          faculty_registration_id?: string
          id?: string
          improvement_areas?: string[] | null
          innovation_score?: number | null
          metric_period?: string
          overall_performance_score?: number | null
          response_time_hours?: number | null
          strengths?: string[] | null
          student_satisfaction_avg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_quality_metrics_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_quality_metrics_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_quality_metrics_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_registrations: {
        Row: {
          address: string
          age: number
          approved_at: string | null
          bachelor_degree_institution: string | null
          bachelor_degree_year: number | null
          bachelor_to_current_experience_years: number | null
          calculated_experience_years: number | null
          country: string
          created_at: string
          degree: string
          email: string
          experience_years: number
          extra_courses: string[] | null
          faculty_id: string | null
          full_name: string
          id: string
          last_experience_calculation_date: string | null
          master_degree_institution: string | null
          master_degree_year: number | null
          master_to_current_experience_years: number | null
          payment_details: Json | null
          phone: string
          specialty: string
          status: string | null
          total_experience_months: number | null
          updated_at: string
          year_of_completion: number
        }
        Insert: {
          address: string
          age: number
          approved_at?: string | null
          bachelor_degree_institution?: string | null
          bachelor_degree_year?: number | null
          bachelor_to_current_experience_years?: number | null
          calculated_experience_years?: number | null
          country: string
          created_at?: string
          degree: string
          email: string
          experience_years: number
          extra_courses?: string[] | null
          faculty_id?: string | null
          full_name: string
          id?: string
          last_experience_calculation_date?: string | null
          master_degree_institution?: string | null
          master_degree_year?: number | null
          master_to_current_experience_years?: number | null
          payment_details?: Json | null
          phone: string
          specialty: string
          status?: string | null
          total_experience_months?: number | null
          updated_at?: string
          year_of_completion: number
        }
        Update: {
          address?: string
          age?: number
          approved_at?: string | null
          bachelor_degree_institution?: string | null
          bachelor_degree_year?: number | null
          bachelor_to_current_experience_years?: number | null
          calculated_experience_years?: number | null
          country?: string
          created_at?: string
          degree?: string
          email?: string
          experience_years?: number
          extra_courses?: string[] | null
          faculty_id?: string | null
          full_name?: string
          id?: string
          last_experience_calculation_date?: string | null
          master_degree_institution?: string | null
          master_degree_year?: number | null
          master_to_current_experience_years?: number | null
          payment_details?: Json | null
          phone?: string
          specialty?: string
          status?: string | null
          total_experience_months?: number | null
          updated_at?: string
          year_of_completion?: number
        }
        Relationships: []
      }
      faculty_research_projects: {
        Row: {
          actual_end_date: string | null
          collaborators: string[] | null
          created_at: string
          expected_end_date: string | null
          faculty_registration_id: string
          funding_amount: number | null
          funding_source: string | null
          grant_number: string | null
          id: string
          project_description: string | null
          project_status: string | null
          project_title: string
          project_url: string | null
          research_area: string | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          actual_end_date?: string | null
          collaborators?: string[] | null
          created_at?: string
          expected_end_date?: string | null
          faculty_registration_id: string
          funding_amount?: number | null
          funding_source?: string | null
          grant_number?: string | null
          id?: string
          project_description?: string | null
          project_status?: string | null
          project_title: string
          project_url?: string | null
          research_area?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          actual_end_date?: string | null
          collaborators?: string[] | null
          created_at?: string
          expected_end_date?: string | null
          faculty_registration_id?: string
          funding_amount?: number | null
          funding_source?: string | null
          grant_number?: string | null
          id?: string
          project_description?: string | null
          project_status?: string | null
          project_title?: string
          project_url?: string | null
          research_area?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_research_projects_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_research_projects_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_research_projects_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_scheduled_classes: {
        Row: {
          class_date: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          enrolled_students: number | null
          faculty_id: string
          id: string
          max_students: number | null
          meeting_link: string | null
          meeting_platform: string | null
          status: string | null
          subject_id: string
          title: string
        }
        Insert: {
          class_date: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          enrolled_students?: number | null
          faculty_id: string
          id?: string
          max_students?: number | null
          meeting_link?: string | null
          meeting_platform?: string | null
          status?: string | null
          subject_id: string
          title: string
        }
        Update: {
          class_date?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          enrolled_students?: number | null
          faculty_id?: string
          id?: string
          max_students?: number | null
          meeting_link?: string | null
          meeting_platform?: string | null
          status?: string | null
          subject_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_scheduled_classes_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_scheduled_classes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_skills: {
        Row: {
          certification_available: boolean | null
          created_at: string
          faculty_registration_id: string
          id: string
          last_used: string | null
          proficiency_level: string
          self_assessment_score: number | null
          skill_category: string
          skill_name: string
          updated_at: string
          verified_score: number | null
          wants_to_improve: boolean | null
          years_of_experience: number | null
        }
        Insert: {
          certification_available?: boolean | null
          created_at?: string
          faculty_registration_id: string
          id?: string
          last_used?: string | null
          proficiency_level: string
          self_assessment_score?: number | null
          skill_category: string
          skill_name: string
          updated_at?: string
          verified_score?: number | null
          wants_to_improve?: boolean | null
          years_of_experience?: number | null
        }
        Update: {
          certification_available?: boolean | null
          created_at?: string
          faculty_registration_id?: string
          id?: string
          last_used?: string | null
          proficiency_level?: string
          self_assessment_score?: number | null
          skill_category?: string
          skill_name?: string
          updated_at?: string
          verified_score?: number | null
          wants_to_improve?: boolean | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_skills_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_skills_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_skills_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_specialization_mapping: {
        Row: {
          created_at: string
          faculty_registration_id: string
          id: string
          last_taught: string | null
          proficiency_score: number | null
          student_feedback_avg: number | null
          subject_id: string
          teaching_preference: boolean | null
        }
        Insert: {
          created_at?: string
          faculty_registration_id: string
          id?: string
          last_taught?: string | null
          proficiency_score?: number | null
          student_feedback_avg?: number | null
          subject_id: string
          teaching_preference?: boolean | null
        }
        Update: {
          created_at?: string
          faculty_registration_id?: string
          id?: string
          last_taught?: string | null
          proficiency_score?: number | null
          student_feedback_avg?: number | null
          subject_id?: string
          teaching_preference?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_specialization_mapping_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_specialization_mapping_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_specialization_mapping_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_specialization_mapping_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_student_ratings: {
        Row: {
          academic_year: string | null
          class_id: string | null
          communication_skills: number | null
          created_at: string
          faculty_id: string
          feedback_text: string | null
          id: string
          is_anonymous: boolean | null
          rating: number
          responsiveness: number | null
          semester: string | null
          student_enrollment_id: string
          subject_knowledge: number | null
          teaching_effectiveness: number | null
        }
        Insert: {
          academic_year?: string | null
          class_id?: string | null
          communication_skills?: number | null
          created_at?: string
          faculty_id: string
          feedback_text?: string | null
          id?: string
          is_anonymous?: boolean | null
          rating: number
          responsiveness?: number | null
          semester?: string | null
          student_enrollment_id: string
          subject_knowledge?: number | null
          teaching_effectiveness?: number | null
        }
        Update: {
          academic_year?: string | null
          class_id?: string | null
          communication_skills?: number | null
          created_at?: string
          faculty_id?: string
          feedback_text?: string | null
          id?: string
          is_anonymous?: boolean | null
          rating?: number
          responsiveness?: number | null
          semester?: string | null
          student_enrollment_id?: string
          subject_knowledge?: number | null
          teaching_effectiveness?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_student_ratings_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_student_ratings_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_student_ratings_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_student_ratings_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_student_ratings_student_enrollment_id_fkey"
            columns: ["student_enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_training_completions: {
        Row: {
          certificate_url: string | null
          completion_date: string
          created_at: string
          faculty_registration_id: string
          feedback: string | null
          id: string
          score: number | null
          training_program_id: string
        }
        Insert: {
          certificate_url?: string | null
          completion_date: string
          created_at?: string
          faculty_registration_id: string
          feedback?: string | null
          id?: string
          score?: number | null
          training_program_id: string
        }
        Update: {
          certificate_url?: string | null
          completion_date?: string
          created_at?: string
          faculty_registration_id?: string
          feedback?: string | null
          id?: string
          score?: number | null
          training_program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_training_completions_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_training_completions_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_training_completions_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_training_completions_training_program_id_fkey"
            columns: ["training_program_id"]
            isOneToOne: false
            referencedRelation: "faculty_training_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_training_programs: {
        Row: {
          cme_credits: number | null
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          prerequisites: string[] | null
          program_name: string
          program_type: string | null
          program_url: string | null
          provider_name: string | null
          target_audience: string[] | null
        }
        Insert: {
          cme_credits?: number | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          prerequisites?: string[] | null
          program_name: string
          program_type?: string | null
          program_url?: string | null
          provider_name?: string | null
          target_audience?: string[] | null
        }
        Update: {
          cme_credits?: number | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          prerequisites?: string[] | null
          program_name?: string
          program_type?: string | null
          program_url?: string | null
          provider_name?: string | null
          target_audience?: string[] | null
        }
        Relationships: []
      }
      faculty_uploads: {
        Row: {
          created_at: string
          faculty_id: string
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          is_public: boolean | null
          subject_id: string | null
          summary: string | null
          title: string
          topic: string | null
          upload_type: string
        }
        Insert: {
          created_at?: string
          faculty_id: string
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          is_public?: boolean | null
          subject_id?: string | null
          summary?: string | null
          title: string
          topic?: string | null
          upload_type: string
        }
        Update: {
          created_at?: string
          faculty_id?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          is_public?: boolean | null
          subject_id?: string | null
          summary?: string | null
          title?: string
          topic?: string | null
          upload_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_uploads_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_uploads_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_wellness_tracking: {
        Row: {
          assessment_date: string
          created_at: string
          faculty_registration_id: string
          follow_up_required: boolean | null
          id: string
          notes: string | null
          score: number | null
          support_provided: string | null
          wellness_category: string | null
        }
        Insert: {
          assessment_date: string
          created_at?: string
          faculty_registration_id: string
          follow_up_required?: boolean | null
          id?: string
          notes?: string | null
          score?: number | null
          support_provided?: string | null
          wellness_category?: string | null
        }
        Update: {
          assessment_date?: string
          created_at?: string
          faculty_registration_id?: string
          follow_up_required?: boolean | null
          id?: string
          notes?: string | null
          score?: number | null
          support_provided?: string | null
          wellness_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_wellness_tracking_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_wellness_tracking_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_wellness_tracking_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_work_experience: {
        Row: {
          created_at: string
          department: string | null
          end_date: string | null
          experience_certificate_url: string | null
          faculty_registration_id: string
          id: string
          is_current: boolean | null
          job_responsibilities: string | null
          location_city: string | null
          location_country: string
          organization_name: string
          organization_type: string | null
          position_title: string
          reason_for_leaving: string | null
          salary_range: string | null
          skills_gained: string[] | null
          specialization: string | null
          start_date: string
          supervisor_contact: string | null
          supervisor_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          end_date?: string | null
          experience_certificate_url?: string | null
          faculty_registration_id: string
          id?: string
          is_current?: boolean | null
          job_responsibilities?: string | null
          location_city?: string | null
          location_country: string
          organization_name: string
          organization_type?: string | null
          position_title: string
          reason_for_leaving?: string | null
          salary_range?: string | null
          skills_gained?: string[] | null
          specialization?: string | null
          start_date: string
          supervisor_contact?: string | null
          supervisor_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          end_date?: string | null
          experience_certificate_url?: string | null
          faculty_registration_id?: string
          id?: string
          is_current?: boolean | null
          job_responsibilities?: string | null
          location_city?: string | null
          location_country?: string
          organization_name?: string
          organization_type?: string | null
          position_title?: string
          reason_for_leaving?: string | null
          salary_range?: string | null
          skills_gained?: string[] | null
          specialization?: string | null
          start_date?: string
          supervisor_contact?: string | null
          supervisor_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_work_experience_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_comprehensive_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_work_experience_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_experience_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_work_experience_faculty_registration_id_fkey"
            columns: ["faculty_registration_id"]
            isOneToOne: false
            referencedRelation: "faculty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_reads: {
        Row: {
          id: string
          notification_id: string
          read_at: string
          user_email: string
        }
        Insert: {
          id?: string
          notification_id: string
          read_at?: string
          user_email: string
        }
        Update: {
          id?: string
          notification_id?: string
          read_at?: string
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_reads_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string | null
          expiry_date: string | null
          id: string
          is_active: boolean | null
          publish_date: string
          target_role: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          publish_date?: string
          target_role: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          publish_date?: string
          target_role?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          description: string
          due_date: string
          enrollment_id: string
          id: string
          paid_date: string | null
          payment_method: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          due_date: string
          enrollment_id: string
          id?: string
          paid_date?: string | null
          payment_method?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          due_date?: string
          enrollment_id?: string
          id?: string
          paid_date?: string | null
          payment_method?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          enrollment_id: string
          id: string
          post_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          enrollment_id: string
          id?: string
          post_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          enrollment_id?: string
          id?: string
          post_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          enrollment_id: string
          id: string
          post_id: string
        }
        Insert: {
          created_at?: string
          enrollment_id: string
          id?: string
          post_id: string
        }
        Update: {
          created_at?: string
          enrollment_id?: string
          id?: string
          post_id?: string
        }
        Relationships: []
      }
      student_achievements: {
        Row: {
          achievement_type: string
          certificate_url: string | null
          created_at: string
          description: string | null
          enrollment_id: string
          grade_score: string | null
          id: string
          is_public: boolean | null
          issue_date: string | null
          issued_by: string | null
          metadata: Json | null
          title: string
        }
        Insert: {
          achievement_type: string
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          enrollment_id: string
          grade_score?: string | null
          id?: string
          is_public?: boolean | null
          issue_date?: string | null
          issued_by?: string | null
          metadata?: Json | null
          title: string
        }
        Update: {
          achievement_type?: string
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          enrollment_id?: string
          grade_score?: string | null
          id?: string
          is_public?: boolean | null
          issue_date?: string | null
          issued_by?: string | null
          metadata?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_achievements_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      student_admission_status: {
        Row: {
          academic_year: string | null
          admission_date: string | null
          approved_at: string | null
          approved_by: string | null
          batch_id: string | null
          created_at: string
          document_verification_status: string
          eligibility_check_status: string
          enrollment_id: string
          final_approval_status: string
          id: string
          rejection_reason: string | null
          semester_admitted: number | null
          student_id: string | null
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          admission_date?: string | null
          approved_at?: string | null
          approved_by?: string | null
          batch_id?: string | null
          created_at?: string
          document_verification_status?: string
          eligibility_check_status?: string
          enrollment_id: string
          final_approval_status?: string
          id?: string
          rejection_reason?: string | null
          semester_admitted?: number | null
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          admission_date?: string | null
          approved_at?: string | null
          approved_by?: string | null
          batch_id?: string | null
          created_at?: string
          document_verification_status?: string
          eligibility_check_status?: string
          enrollment_id?: string
          final_approval_status?: string
          id?: string
          rejection_reason?: string | null
          semester_admitted?: number | null
          student_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_admission_status_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "student_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_admission_status_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      student_auth_links: {
        Row: {
          enrollment_id: string
          id: string
          linked_at: string
          user_id: string
        }
        Insert: {
          enrollment_id: string
          id?: string
          linked_at?: string
          user_id: string
        }
        Update: {
          enrollment_id?: string
          id?: string
          linked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_auth_links_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      student_batches: {
        Row: {
          batch_name: string
          batch_year: number
          course_id: string
          created_at: string
          current_students: number | null
          end_date: string | null
          id: string
          max_students: number
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          batch_name: string
          batch_year: number
          course_id: string
          created_at?: string
          current_students?: number | null
          end_date?: string | null
          id?: string
          max_students?: number
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          batch_name?: string
          batch_year?: number
          course_id?: string
          created_at?: string
          current_students?: number | null
          end_date?: string | null
          id?: string
          max_students?: number
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_batches_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      student_class_enrollments: {
        Row: {
          class_id: string
          completion_date: string | null
          created_at: string
          enrolled_at: string
          enrollment_id: string
          grade: string | null
          id: string
          status: string | null
        }
        Insert: {
          class_id: string
          completion_date?: string | null
          created_at?: string
          enrolled_at?: string
          enrollment_id: string
          grade?: string | null
          id?: string
          status?: string | null
        }
        Update: {
          class_id?: string
          completion_date?: string | null
          created_at?: string
          enrolled_at?: string
          enrollment_id?: string
          grade?: string | null
          id?: string
          status?: string | null
        }
        Relationships: []
      }
      student_completion_tracking: {
        Row: {
          actual_graduation_date: string | null
          admission_status_id: string
          completion_status: string
          created_at: string
          credits_completed: number | null
          current_gpa: number | null
          current_semester: number
          expected_graduation_date: string | null
          id: string
          overall_gpa: number | null
          total_credits_required: number | null
          total_semesters: number
          updated_at: string
        }
        Insert: {
          actual_graduation_date?: string | null
          admission_status_id: string
          completion_status?: string
          created_at?: string
          credits_completed?: number | null
          current_gpa?: number | null
          current_semester?: number
          expected_graduation_date?: string | null
          id?: string
          overall_gpa?: number | null
          total_credits_required?: number | null
          total_semesters?: number
          updated_at?: string
        }
        Update: {
          actual_graduation_date?: string | null
          admission_status_id?: string
          completion_status?: string
          created_at?: string
          credits_completed?: number | null
          current_gpa?: number | null
          current_semester?: number
          expected_graduation_date?: string | null
          id?: string
          overall_gpa?: number | null
          total_credits_required?: number | null
          total_semesters?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_completion_tracking_admission_status_id_fkey"
            columns: ["admission_status_id"]
            isOneToOne: false
            referencedRelation: "student_admission_status"
            referencedColumns: ["id"]
          },
        ]
      }
      student_connections: {
        Row: {
          accepted_at: string | null
          addressee_enrollment_id: string
          created_at: string
          id: string
          requester_enrollment_id: string
          status: string | null
        }
        Insert: {
          accepted_at?: string | null
          addressee_enrollment_id: string
          created_at?: string
          id?: string
          requester_enrollment_id: string
          status?: string | null
        }
        Update: {
          accepted_at?: string | null
          addressee_enrollment_id?: string
          created_at?: string
          id?: string
          requester_enrollment_id?: string
          status?: string | null
        }
        Relationships: []
      }
      student_document_verification: {
        Row: {
          created_at: string
          document_type: string
          document_url: string
          enrollment_id: string
          id: string
          updated_at: string
          verification_notes: string | null
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          document_url: string
          enrollment_id: string
          id?: string
          updated_at?: string
          verification_notes?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          document_url?: string
          enrollment_id?: string
          id?: string
          updated_at?: string
          verification_notes?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_document_verification_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      student_documents: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          enrollment_id: string
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          is_verified: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          enrollment_id: string
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          is_verified?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          enrollment_id?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          is_verified?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_documents_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      student_enrollments: {
        Row: {
          address: string
          approved_at: string | null
          approved_by: string | null
          course_id: string
          created_at: string
          email: string
          fathers_name: string
          government_id_url: string | null
          guardian_number: string
          id: string
          marksheet_url: string | null
          phone_number: string
          roll_number: string | null
          status: string
          student_name: string
          submitted_at: string
          updated_at: string
        }
        Insert: {
          address: string
          approved_at?: string | null
          approved_by?: string | null
          course_id: string
          created_at?: string
          email: string
          fathers_name: string
          government_id_url?: string | null
          guardian_number: string
          id?: string
          marksheet_url?: string | null
          phone_number: string
          roll_number?: string | null
          status?: string
          student_name: string
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          address?: string
          approved_at?: string | null
          approved_by?: string | null
          course_id?: string
          created_at?: string
          email?: string
          fathers_name?: string
          government_id_url?: string | null
          guardian_number?: string
          id?: string
          marksheet_url?: string | null
          phone_number?: string
          roll_number?: string | null
          status?: string
          student_name?: string
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      student_experiences: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          enrollment_id: string
          id: string
          is_current: boolean | null
          location: string | null
          organization: string
          skills_gained: string[] | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          enrollment_id: string
          id?: string
          is_current?: boolean | null
          location?: string | null
          organization: string
          skills_gained?: string[] | null
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          enrollment_id?: string
          id?: string
          is_current?: boolean | null
          location?: string | null
          organization?: string
          skills_gained?: string[] | null
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_faculty_assignments: {
        Row: {
          assigned_at: string
          enrollment_id: string
          faculty_id: string
          id: string
          status: string | null
          subject_id: string
        }
        Insert: {
          assigned_at?: string
          enrollment_id: string
          faculty_id: string
          id?: string
          status?: string | null
          subject_id: string
        }
        Update: {
          assigned_at?: string
          enrollment_id?: string
          faculty_id?: string
          id?: string
          status?: string | null
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_faculty_assignments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_faculty_assignments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_faculty_assignments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      student_learning_preferences: {
        Row: {
          availability_preference: string | null
          created_at: string
          enrollment_id: string
          feedback_preference: string | null
          id: string
          interaction_frequency: string | null
          learning_style: string | null
          preferred_communication_style: string | null
          preferred_languages: string[] | null
          timezone_preference: string | null
          updated_at: string
        }
        Insert: {
          availability_preference?: string | null
          created_at?: string
          enrollment_id: string
          feedback_preference?: string | null
          id?: string
          interaction_frequency?: string | null
          learning_style?: string | null
          preferred_communication_style?: string | null
          preferred_languages?: string[] | null
          timezone_preference?: string | null
          updated_at?: string
        }
        Update: {
          availability_preference?: string | null
          created_at?: string
          enrollment_id?: string
          feedback_preference?: string | null
          id?: string
          interaction_frequency?: string | null
          learning_style?: string | null
          preferred_communication_style?: string | null
          preferred_languages?: string[] | null
          timezone_preference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_learning_preferences_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      student_posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string
          enrollment_id: string
          id: string
          is_public: boolean | null
          likes_count: number | null
          media_urls: string[] | null
          post_type: string | null
          updated_at: string
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string
          enrollment_id: string
          id?: string
          is_public?: boolean | null
          likes_count?: number | null
          media_urls?: string[] | null
          post_type?: string | null
          updated_at?: string
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string
          enrollment_id?: string
          id?: string
          is_public?: boolean | null
          likes_count?: number | null
          media_urls?: string[] | null
          post_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          achievements: string[] | null
          bio: string | null
          contact_preferences: Json | null
          created_at: string
          current_semester: number | null
          education_background: string | null
          enrollment_id: string | null
          gpa: number | null
          graduation_year: number | null
          id: string
          interests: string[] | null
          profile_photo_url: string | null
          skills: string[] | null
          social_links: Json | null
          specialization: string | null
          updated_at: string
        }
        Insert: {
          achievements?: string[] | null
          bio?: string | null
          contact_preferences?: Json | null
          created_at?: string
          current_semester?: number | null
          education_background?: string | null
          enrollment_id?: string | null
          gpa?: number | null
          graduation_year?: number | null
          id: string
          interests?: string[] | null
          profile_photo_url?: string | null
          skills?: string[] | null
          social_links?: Json | null
          specialization?: string | null
          updated_at?: string
        }
        Update: {
          achievements?: string[] | null
          bio?: string | null
          contact_preferences?: Json | null
          created_at?: string
          current_semester?: number | null
          education_background?: string | null
          enrollment_id?: string | null
          gpa?: number | null
          graduation_year?: number | null
          id?: string
          interests?: string[] | null
          profile_photo_url?: string | null
          skills?: string[] | null
          social_links?: Json | null
          specialization?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      student_progress: {
        Row: {
          created_at: string
          faculty_id: string
          id: string
          last_updated: string | null
          notes: string | null
          progress_percentage: number | null
          status: string | null
          student_enrollment_id: string
          subject_id: string
        }
        Insert: {
          created_at?: string
          faculty_id: string
          id?: string
          last_updated?: string | null
          notes?: string | null
          progress_percentage?: number | null
          status?: string | null
          student_enrollment_id: string
          subject_id: string
        }
        Update: {
          created_at?: string
          faculty_id?: string
          id?: string
          last_updated?: string | null
          notes?: string | null
          progress_percentage?: number | null
          status?: string | null
          student_enrollment_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_student_enrollment_id_fkey"
            columns: ["student_enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      student_skills: {
        Row: {
          created_at: string
          endorsed_by: string[] | null
          enrollment_id: string
          id: string
          proficiency_level: string | null
          skill_name: string
        }
        Insert: {
          created_at?: string
          endorsed_by?: string[] | null
          enrollment_id: string
          id?: string
          proficiency_level?: string | null
          skill_name: string
        }
        Update: {
          created_at?: string
          endorsed_by?: string[] | null
          enrollment_id?: string
          id?: string
          proficiency_level?: string | null
          skill_name?: string
        }
        Relationships: []
      }
      student_works: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          enrollment_id: string
          feedback: string | null
          file_url: string | null
          grade: string | null
          id: string
          status: string | null
          subject_id: string | null
          submission_date: string | null
          title: string
          updated_at: string
          work_type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          enrollment_id: string
          feedback?: string | null
          file_url?: string | null
          grade?: string | null
          id?: string
          status?: string | null
          subject_id?: string | null
          submission_date?: string | null
          title: string
          updated_at?: string
          work_type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          enrollment_id?: string
          feedback?: string | null
          file_url?: string | null
          grade?: string | null
          id?: string
          status?: string | null
          subject_id?: string | null
          submission_date?: string | null
          title?: string
          updated_at?: string
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_works_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_works_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          course_id: string
          created_at: string
          credits: number
          description: string | null
          id: string
          name: string
          semester: number
        }
        Insert: {
          code: string
          course_id: string
          created_at?: string
          credits: number
          description?: string | null
          id?: string
          name: string
          semester: number
        }
        Update: {
          code?: string
          course_id?: string
          created_at?: string
          credits?: number
          description?: string | null
          id?: string
          name?: string
          semester?: number
        }
        Relationships: [
          {
            foreignKeyName: "subjects_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          last_login_at?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          device_info: Json | null
          expires_at: string
          id: string
          ip_address: unknown | null
          last_activity: string | null
          session_token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          last_activity?: string | null
          session_token: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          last_activity?: string | null
          session_token?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      faculty_comprehensive_dashboard: {
        Row: {
          active_certifications: number | null
          active_mentorships: number | null
          active_research_projects: number | null
          avg_student_rating: number | null
          calculated_experience_years: number | null
          dmu_joining_date: string | null
          email: string | null
          expiring_certifications: number | null
          full_name: string | null
          id: string | null
          last_metrics_update: string | null
          overall_performance_score: number | null
          specialty: string | null
          status: string | null
          tenure_status: string | null
          total_awards: number | null
          total_publications: number | null
          total_ratings_received: number | null
          total_skills_listed: number | null
          trainings_completed_this_year: number | null
        }
        Relationships: []
      }
      faculty_experience_summary: {
        Row: {
          bachelor_degrees_count: number | null
          bachelor_to_current_experience_years: number | null
          dmu_exit_date: string | null
          dmu_experience_years: number | null
          dmu_joining_date: string | null
          email: string | null
          full_name: string | null
          id: string | null
          master_degrees_count: number | null
          master_to_current_experience_years: number | null
          previous_organizations_count: number | null
          specialty: string | null
          status: string | null
          tenure_status: string | null
          total_experience_years: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_degree_experience: {
        Args: { faculty_reg_id: string; degree_type_param: string }
        Returns: number
      }
      calculate_faculty_experience: {
        Args: { faculty_reg_id: string }
        Returns: number
      }
      calculate_faculty_quality_metrics: {
        Args: { faculty_reg_id: string; period_param: string }
        Returns: undefined
      }
      calculate_faculty_student_match_score: {
        Args: {
          faculty_reg_id: string
          student_enrollment_id: string
          subject_id_param: string
        }
        Returns: number
      }
      check_certification_expiry: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_faculty_id: {
        Args: { specialty_param: string; year_param: number }
        Returns: string
      }
      generate_student_id: {
        Args: { batch_name_param: string; admission_year_param: number }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
