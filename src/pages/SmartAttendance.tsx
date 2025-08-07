import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  ClipboardCheck, 
  Search,
  UserCheck,
  AlertTriangle,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

// Types
interface Student {
  id: string;
  name: string;
  email: string;
  enrolled_date: string;
  course: string;
  attendance_percentage: number;
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'excused';
  class_name: string;
  faculty_name: string;
}

interface Faculty {
  id: string;
  name: string;
  specialty: string;
  students_count: number;
}

const SmartAttendance = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<'faculty' | 'student' | 'unauthenticated'>('unauthenticated');
  const [isLoading, setIsLoading] = useState(true);
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [facultyData, setFacultyData] = useState<Faculty | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  // Demo data for UI presentation
  const demoStudents: Student[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      enrolled_date: '2025-05-15',
      course: 'Medical Informatics',
      attendance_percentage: 92
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      enrolled_date: '2025-05-12',
      course: 'Clinical AI Applications',
      attendance_percentage: 88
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      enrolled_date: '2025-05-10',
      course: 'Medical Informatics',
      attendance_percentage: 95
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      enrolled_date: '2025-04-28',
      course: 'AI in Diagnostics',
      attendance_percentage: 79
    },
    {
      id: '5',
      name: 'David Rodriguez',
      email: 'david.rodriguez@example.com',
      enrolled_date: '2025-04-20',
      course: 'Clinical AI Applications',
      attendance_percentage: 84
    },
  ];

  const demoFaculty: Faculty = {
    id: '1',
    name: 'Dr. James Wilson',
    specialty: 'Medical Informatics',
    students_count: 25
  };

  const demoAttendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      date: '2025-07-20',
      status: 'present',
      class_name: 'Advanced Neural Networks in Medicine',
      faculty_name: 'Dr. James Wilson'
    },
    {
      id: '2',
      date: '2025-07-18',
      status: 'present',
      class_name: 'AI-Assisted Diagnostics Lab',
      faculty_name: 'Dr. James Wilson'
    },
    {
      id: '3',
      date: '2025-07-15',
      status: 'absent',
      class_name: 'Medical Data Analysis',
      faculty_name: 'Dr. James Wilson'
    },
    {
      id: '4',
      date: '2025-07-12',
      status: 'present',
      class_name: 'Clinical Applications of ML',
      faculty_name: 'Dr. James Wilson'
    },
    {
      id: '5',
      date: '2025-07-10',
      status: 'excused',
      class_name: 'Medical Imaging Interpretation',
      faculty_name: 'Dr. James Wilson'
    },
  ];

  useEffect(() => {
    checkUserAuth();
  }, []);

  useEffect(() => {
    if (userRole !== 'unauthenticated') {
      loadUserData();
    }
  }, [userRole]);

  useEffect(() => {
    filterStudents();
  }, [searchQuery, studentData]);

  const checkUserAuth = async () => {
    try {
      // Get current user from Supabase
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error fetching user:', error);
        setIsLoading(false);
        return;
      }
      
      if (!user) {
        setUserRole('unauthenticated');
        setIsLoading(false);
        return;
      }
      
      // Check if user is faculty or student
      // For demo, we're setting based on email pattern
      if (user.email?.includes('faculty')) {
        setUserRole('faculty');
      } else {
        setUserRole('student');
      }
      
      // In a real application, you would check a roles table or user metadata
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    setIsLoading(true);
    
    try {
      if (userRole === 'faculty') {
        // Normally fetch from Supabase
        // In demo, use sample data
        setFacultyData(demoFaculty);
        setStudentData(demoStudents);
      } else if (userRole === 'student') {
        // In a real app, fetch only the current student's data
        setAttendanceRecords(demoAttendanceRecords);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchQuery.trim()) {
      setFilteredStudents(studentData);
      return;
    }
    
    const filtered = studentData.filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredStudents(filtered);
  };

  const getAttendanceStatusColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  // Conditionally render based on authentication and role
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading Attendance System...</p>
        </div>
      </div>
    );
  }

  // Not authenticated view
  if (userRole === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Smart Attendance System</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access restricted to approved faculty and enrolled students
            </p>
          </div>
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You must be logged in as a registered faculty member or enrolled student to access the attendance system.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col space-y-2">
                <Button onClick={() => navigate('/')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-medical-primary/20 to-medical-secondary/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <ClipboardCheck className="h-10 w-10 text-medical-primary" />
              Smart Attendance System
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {userRole === 'faculty' 
                ? 'View and manage attendance for your enrolled students' 
                : 'View your course attendance records'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2 hover:bg-primary hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Faculty View */}
        {userRole === 'faculty' && (
          <>
            {/* Faculty Info Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-medical-primary" />
                  Faculty Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-medical-primary/20 flex items-center justify-center">
                      <User className="h-6 w-6 text-medical-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Faculty Name</p>
                      <p className="font-medium">{facultyData?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-medical-secondary/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-medical-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <p className="font-medium">{facultyData?.students_count}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-campus-gold/20 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-campus-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Specialty</p>
                      <p className="font-medium">{facultyData?.specialty}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Students Attendance List */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Enrolled Students Attendance</CardTitle>
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Enrolled Date</TableHead>
                        <TableHead>Attendance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{student.name}</span>
                                <span className="text-xs text-muted-foreground">{student.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>{student.course}</TableCell>
                            <TableCell>{new Date(student.enrolled_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={getAttendanceStatusColor(student.attendance_percentage)}>
                                  {student.attendance_percentage}%
                                </span>
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      student.attendance_percentage >= 90 ? 'bg-green-500' :
                                      student.attendance_percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${student.attendance_percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Users className="h-12 w-12 mb-2 opacity-20" />
                              <p>No students found</p>
                              {searchQuery && (
                                <p className="text-sm">Try a different search term</p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Student View */}
        {userRole === 'student' && (
          <>
            {/* Student Attendance Summary */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="rounded-lg bg-white shadow-sm p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">
                          {attendanceRecords.filter(r => r.status === 'present').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Present</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-white shadow-sm p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">
                          {attendanceRecords.filter(r => r.status === 'absent').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Absent</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-white shadow-sm p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">
                          {attendanceRecords.filter(r => r.status === 'excused').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Excused</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Attendance Rate */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Attendance Rate</h4>
                    <p className="text-sm font-medium">
                      {Math.round((attendanceRecords.filter(r => r.status === 'present').length / attendanceRecords.length) * 100)}%
                    </p>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-medical-primary rounded-full"
                      style={{ 
                        width: `${Math.round((attendanceRecords.filter(r => r.status === 'present').length / attendanceRecords.length) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Attendance Records */}
            <Card>
              <CardHeader>
                <CardTitle>Your Attendance History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>{record.class_name}</TableCell>
                          <TableCell>{record.faculty_name}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                record.status === 'present' ? 'bg-green-100 text-green-800' :
                                record.status === 'absent' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default SmartAttendance;