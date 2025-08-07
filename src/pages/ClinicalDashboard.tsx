import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Upload, Users, DollarSign, Clock, FileText } from 'lucide-react';

const ClinicalDashboard = () => {
  const [clinicalCenter, setClinicalCenter] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [rotations, setRotations] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // For now, we'll use a mock clinical center ID
      // In a real app, this would come from authentication
      const clinicalCenterId = '123'; // This should come from auth context

      // Fetch clinical center info
      const { data: centerData, error: centerError } = await supabase
        .from('clinical_centers')
        .select('*')
        .eq('id', clinicalCenterId)
        .single();

      if (centerError && centerError.code !== 'PGRST116') {
        console.error('Error fetching clinical center:', centerError);
      } else if (centerData) {
        setClinicalCenter(centerData);
      }

      // Fetch assigned students
      const { data: studentsData, error: studentsError } = await supabase
        .from('clinical_student_assignments')
        .select(`
          *,
          student_enrollments (
            id,
            student_name,
            roll_number,
            email,
            phone_number,
            courses (name)
          )
        `)
        .eq('clinical_center_id', clinicalCenterId);

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
      } else {
        setStudents(studentsData || []);
      }

      // Fetch attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('clinical_attendance')
        .select(`
          *,
          clinical_student_assignments (
            student_enrollments (student_name, roll_number)
          )
        `)
        .order('attendance_date', { ascending: false })
        .limit(50);

      if (attendanceError) {
        console.error('Error fetching attendance:', attendanceError);
      } else {
        setAttendance(attendanceData || []);
      }

      // Fetch rotations
      const { data: rotationsData, error: rotationsError } = await supabase
        .from('clinical_rotations')
        .select(`
          *,
          clinical_student_assignments (
            student_enrollments (student_name, roll_number)
          )
        `);

      if (rotationsError) {
        console.error('Error fetching rotations:', rotationsError);
      } else {
        setRotations(rotationsData || []);
      }

      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('clinical_payments')
        .select(`
          *,
          clinical_student_assignments (
            student_enrollments (student_name, roll_number)
          )
        `)
        .eq('clinical_center_id', clinicalCenterId);

      if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
      } else {
        setPayments(paymentsData || []);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (assignmentId: string, status: 'present' | 'absent', hoursCompleted: number = 0) => {
    try {
      const { error } = await supabase
        .from('clinical_attendance')
        .insert({
          assignment_id: assignmentId,
          status: status,
          hours_completed: hoursCompleted,
          marked_by: 'Clinical Administrator'
        });

      if (error) throw error;

      toast.success(`Attendance marked as ${status}`);
      fetchDashboardData(); // Refresh data
    } catch (error: any) {
      toast.error('Failed to mark attendance: ' + error.message);
    }
  };

  const updateRotationProgress = async (rotationId: string, completedHours: number) => {
    try {
      const { error } = await supabase
        .from('clinical_rotations')
        .update({ completed_hours: completedHours })
        .eq('id', rotationId);

      if (error) throw error;

      toast.success('Rotation progress updated');
      fetchDashboardData();
    } catch (error: any) {
      toast.error('Failed to update progress: ' + error.message);
    }
  };

  const uploadCompletionLetter = async (assignmentId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${assignmentId}-completion-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicURL } = supabase.storage
        .from('student-documents')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('clinical_student_assignments')
        .update({ completion_letter_url: publicURL.publicUrl })
        .eq('id', assignmentId);

      if (updateError) throw updateError;

      toast.success('Completion letter uploaded successfully');
      fetchDashboardData();
    } catch (error: any) {
      toast.error('Failed to upload completion letter: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading Clinical Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Clinical Dashboard</h1>
          <p className="text-muted-foreground">
            {clinicalCenter?.name || 'Clinical Center'} Management Portal
          </p>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="rotations" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Rotations
            </TabsTrigger>
            <TabsTrigger value="completion" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Completion
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="ai-logs" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              AI Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">
                          {assignment.student_enrollments?.student_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Roll No: {assignment.student_enrollments?.roll_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Course: {assignment.student_enrollments?.courses?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Duration: {new Date(assignment.start_date).toLocaleDateString()} - {new Date(assignment.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'}>
                          {assignment.status}
                        </Badge>
                        <Button 
                          size="sm"
                          onClick={() => markAttendance(assignment.id, 'present', 8)}
                        >
                          Mark Present
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => markAttendance(assignment.id, 'absent', 0)}
                        >
                          Mark Absent
                        </Button>
                      </div>
                    </div>
                  ))}
                  {students.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No students assigned yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Attendance Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendance.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">
                          {record.clinical_student_assignments?.student_enrollments?.student_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Roll No: {record.clinical_student_assignments?.student_enrollments?.roll_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: {new Date(record.attendance_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={record.status === 'present' ? 'default' : 'destructive'}>
                          {record.status}
                        </Badge>
                        {record.hours_completed > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Hours: {record.hours_completed}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {attendance.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No attendance records found.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rotations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Rotation Hours Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rotations.map((rotation) => (
                    <div key={rotation.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">
                            {rotation.clinical_student_assignments?.student_enrollments?.student_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Department: {rotation.department}
                          </p>
                        </div>
                        <Badge variant={rotation.status === 'completed' ? 'default' : 'secondary'}>
                          {rotation.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ 
                                width: `${(rotation.completed_hours / rotation.required_hours) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {rotation.completed_hours} / {rotation.required_hours} hours
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Hours"
                            className="w-20"
                            min="0"
                            max={rotation.required_hours}
                            onBlur={(e) => {
                              const hours = parseInt(e.target.value);
                              if (hours >= 0 && hours <= rotation.required_hours) {
                                updateRotationProgress(rotation.id, hours);
                              }
                            }}
                          />
                          <Button size="sm">Update</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {rotations.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No rotation records found.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completion" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Completion Letters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">
                          {assignment.student_enrollments?.student_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Training Faculty: {assignment.training_faculty_name || 'Not assigned'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Department: {assignment.training_department || 'Not specified'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {assignment.completion_letter_url ? (
                          <Button size="sm" variant="outline" asChild>
                            <a href={assignment.completion_letter_url} target="_blank" rel="noopener noreferrer">
                              View Letter
                            </a>
                          </Button>
                        ) : (
                          <Label htmlFor={`upload-${assignment.id}`} className="cursor-pointer">
                            <Button size="sm">Upload Letter</Button>
                            <Input
                              id={`upload-${assignment.id}`}
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  uploadCompletionLetter(assignment.id, file);
                                }
                              }}
                            />
                          </Label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">
                          {payment.clinical_student_assignments?.student_enrollments?.student_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {payment.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(payment.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${payment.amount}</p>
                        <Badge variant={payment.status === 'received' ? 'default' : 'destructive'}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {payments.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No payment records found.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-logs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI in Clinical Practice Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Track AI learning hours as defined per course curriculum
                  </p>
                  <Button>Upload AI Practice Log</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClinicalDashboard;