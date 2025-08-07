import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  Shield,
  Users,
  Calendar
} from 'lucide-react';

const Exams = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [eligibilityData, setEligibilityData] = useState({
    isEligible: false,
    attendance: 0,
    completedPortions: 0,
    totalPortions: 0,
    projectCompleted: false,
    missingRequirements: [] as string[]
  });

  // This will be updated when the external link is provided
  const EXTERNAL_EXAM_PLATFORM_URL = "https://secure-exam-platform.edu"; // Placeholder

  useEffect(() => {
    checkEligibility();
  }, []);

  const checkEligibility = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Access denied. Please log in as a student.');
        navigate('/student-portal');
        return;
      }

      // Get student enrollment
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('student_enrollments')
        .select('*')
        .eq('email', user.email)
        .single();

      if (enrollmentError || !enrollment) {
        toast.error('Student enrollment not found. Only registered students can access exams.');
        navigate('/student-portal');
        return;
      }

      if (enrollment.status !== 'approved') {
        toast.error('Access denied. Your enrollment must be approved to access exams.');
        navigate('/student-dashboard');
        return;
      }

      // Check attendance
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('*')
        .eq('enrollment_id', enrollment.id);

      const totalClasses = attendanceData?.length || 0;
      const presentClasses = attendanceData?.filter(a => a.status === 'present').length || 0;
      const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

      // Check completed subjects/portions (using student_progress)
      const { data: progressData } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_enrollment_id', enrollment.id);

      const completedPortions = progressData?.filter(p => p.status === 'completed' || p.progress_percentage === 100).length || 0;
      const totalPortions = progressData?.length || 0;

      // Check if project is completed (using student_works)
      const { data: worksData } = await supabase
        .from('student_works')
        .select('*')
        .eq('enrollment_id', enrollment.id)
        .eq('work_type', 'project');

      const projectCompleted = worksData?.some(w => w.status === 'submitted' || w.grade) || false;

      // Determine eligibility
      const missingRequirements = [];
      
      if (attendancePercentage < 85) {
        missingRequirements.push(`Attendance: ${attendancePercentage}% (Required: 85%)`);
      }
      
      if (totalPortions > 0 && completedPortions < totalPortions) {
        missingRequirements.push(`Completed Portions: ${completedPortions}/${totalPortions} (Required: All)`);
      }
      
      // Check if project is required (for higher studies - MSc, MPT, etc.)
      const requiresProject = enrollment.course_id && 
        (enrollment.course_id.includes('MSC') || enrollment.course_id.includes('MPT'));
      
      if (requiresProject && !projectCompleted) {
        missingRequirements.push('Project completion required for higher studies');
      }

      const isEligible = missingRequirements.length === 0 && totalPortions > 0;

      // If student doesn't meet basic requirements, redirect back to dashboard
      if (!isEligible && missingRequirements.length > 0) {
        toast.error('You do not meet the eligibility requirements for exams. Please complete all requirements first.');
        setTimeout(() => navigate('/student-dashboard'), 3000);
      }

      setEligibilityData({
        isEligible,
        attendance: attendancePercentage,
        completedPortions,
        totalPortions,
        projectCompleted,
        missingRequirements
      });

    } catch (error) {
      console.error('Error checking eligibility:', error);
      toast.error('Failed to check exam eligibility');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = () => {
    if (!eligibilityData.isEligible) {
      toast.error('You do not meet the eligibility requirements for exams');
      return;
    }

    setRedirecting(true);
    toast.success('Redirecting to secure exam platform...');
    
    // Redirect after 3 seconds
    setTimeout(() => {
      window.open(EXTERNAL_EXAM_PLATFORM_URL, '_blank');
      // Optionally redirect back to dashboard
      navigate('/student-dashboard');
    }, 3000);
  };

  const handleBackToDashboard = () => {
    navigate('/student-dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Checking Exam Eligibility...</p>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <Shield className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-bold mb-4">Redirecting to Secure Platform</h2>
            <p className="text-muted-foreground mb-6">
              You are being redirected to our secure exams platform.
            </p>
            <Progress value={100} className="w-full mb-4 animate-pulse" />
            <p className="text-sm text-muted-foreground">
              Please wait while we prepare your exam session...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Exam Center
          </h1>
          <p className="text-muted-foreground">
            Check your eligibility and access secure examinations
          </p>
        </div>

        {/* Eligibility Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {eligibilityData.isEligible ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Exam Eligibility Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eligibilityData.isEligible ? (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-800">
                    You are eligible to take exams!
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-red-800">
                    You do not meet the eligibility requirements
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Requirements Checklist */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Eligibility Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Attendance */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    eligibilityData.attendance >= 85 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {eligibilityData.attendance >= 85 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Attendance Requirement</h3>
                    <p className="text-sm text-muted-foreground">Minimum 85% attendance required</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={eligibilityData.attendance >= 85 ? 'default' : 'destructive'}>
                    {eligibilityData.attendance}%
                  </Badge>
                </div>
              </div>

              {/* Course Completion */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    eligibilityData.completedPortions === eligibilityData.totalPortions && eligibilityData.totalPortions > 0 
                      ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {eligibilityData.completedPortions === eligibilityData.totalPortions && eligibilityData.totalPortions > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Course Completion</h3>
                    <p className="text-sm text-muted-foreground">All course portions must be completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    eligibilityData.completedPortions === eligibilityData.totalPortions && eligibilityData.totalPortions > 0 
                      ? 'default' : 'destructive'
                  }>
                    {eligibilityData.completedPortions}/{eligibilityData.totalPortions}
                  </Badge>
                </div>
              </div>

              {/* Project Completion (if required) */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    eligibilityData.projectCompleted ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {eligibilityData.projectCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Project Requirement</h3>
                    <p className="text-sm text-muted-foreground">
                      Required for higher studies (MSc, MPT, etc.)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={eligibilityData.projectCompleted ? 'default' : 'secondary'}>
                    {eligibilityData.projectCompleted ? 'Completed' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Missing Requirements */}
        {!eligibilityData.isEligible && eligibilityData.missingRequirements.length > 0 && (
          <Card className="mb-6 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Missing Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {eligibilityData.missingRequirements.map((requirement, index) => (
                  <li key={index} className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            onClick={handleBackToDashboard}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          {eligibilityData.isEligible && (
            <Button 
              onClick={handleStartExam}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Start Examination
            </Button>
          )}
        </div>

        {/* Exam Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Examination Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium">Duration</h3>
                <p className="text-sm text-muted-foreground">3 hours</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium">Format</h3>
                <p className="text-sm text-muted-foreground">Online Proctored</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium">Attempts</h3>
                <p className="text-sm text-muted-foreground">Single Attempt</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensure stable internet connection</li>
                <li>• Use a supported browser (Chrome, Firefox)</li>
                <li>• Keep your student ID ready</li>
                <li>• Find a quiet, well-lit environment</li>
                <li>• Camera and microphone access required for proctoring</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Exams;