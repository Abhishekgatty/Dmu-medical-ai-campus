// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// import { Calendar } from "@/components/ui/calendar";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
// import { 
//   User, 
//   GraduationCap, 
//   MapPin, 
//   Calendar as CalendarIcon, 
//   Upload, 
//   DollarSign, 
//   Brain, 
//   ChevronDown,
//   Edit,
//   Save,
//   FileText,
//   Award,
//   BookOpen,
//   Hospital,
//   Clock,
//   TrendingUp,
//   Lock,
//   Folder,
//   Download,
//   Eye,
//   Target,
//   CheckCircle,
//   AlertTriangle
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { StudentPortalFeatures } from "@/components/StudentPortalFeatures";
// import mixpanel from "./mixpanel";
// import { useLocation } from "react-router-dom"; 
// // Types
// interface StudentData {
//   id: string;
//   student_name: string;
//   roll_number: string;
//   email: string;
//   course: {
//     name: string;
//     code: string;
//     duration: string;
//   };
//   status: string;
// }

// interface Subject {
//   id: string;
//   name: string;
//   code: string;
//   credits: number;
//   semester: number;
// }

// interface Faculty {
//   id: string;
//   name: string;
//   specializations: string[];
//   experience_years: number;
//   country: string;
//   city: string;
//   hourly_rate: number;
//   distance?: number;
// }

// interface Document {
//   id: string;
//   title: string;
//   file_name: string;
//   category_name: string;
//   file_url: string;
//   is_verified: boolean;
//   created_at: string;
// }

// export const StudentDashboard = () => {

//    const location = useLocation();

//       useEffect(() => {
//         const fullUrl = window.location.href;

//         mixpanel.track("Page Viewed", {
//           full_url: fullUrl,
//           path: location.pathname,
//           title: document.title,
//           timestamp: new Date().toISOString(),
//         });
//       }, [location.pathname]);

//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // Sample student ID - in real app, get from authentication
//   // const studentId = "sample-enrollment-id";

//   const [studentData, setStudentData] = useState<StudentData | null>(null);
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [faculty, setFaculty] = useState<Faculty[]>([]);
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
//   const [enrollments, setEnrollments] = useState([]);
//    const studentId = localStorage.getItem("user_id");



//   // Collapsible states
//   const [sectionsOpen, setSectionsOpen] = useState({
//     profile: true,
//     subjects: true,
//     calendar: false,
//     clinical: false,
//     attendance: false,
//     payments: false,
//     locker: false,
//     examCenter: false, // Added exam center section
//     ai: false
//   });

//   // Exam eligibility state
//   const [examEligibility, setExamEligibility] = useState({
//     isEligible: false,
//     attendance: 85,
//     completedPortions: 5,
//     totalPortions: 6,
//     projectCompleted: true,
//     missingRequirements: [] as string[]
//   });

//   useEffect(() => {
//     // In a real app, fetch actual student data
//     setStudentData({
//       id: studentId,
//       student_name: "John Doe",
//       roll_number: "DMU-MD-2025-001",
//       email: "john.doe@student.dmu.edu",
//       course: {
//         name: "Doctor of Medicine (MD)",
//         code: "MD",
//         duration: "6 years"
//       },
//       status: "active"
//     });

//     fetchSubjects();
//     fetchFaculty();
//     fetchDocuments();
//     checkExamEligibility(); // Check exam eligibility
//     setLoading(false);
//   }, []);


//    useEffect(() => {
//     const fetchEnrollments = async () => {
//       const { data, error } = await supabase
//         .from("student_enrollments")
//         .select("*");

//       if (error) {
//         console.error("❌ Error fetching enrollments:", error.message);
//       } else {
//         console.log("✅ Enrollments:", data);
//         setEnrollments(data);
//       }
//     };

//     fetchEnrollments();
//   }, []);

//   const fetchSubjects = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('subjects')
//         .select('*')
//         .order('semester', { ascending: true });

//       if (error) throw error;
//       setSubjects(data || []);
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//     }
//   };

//   const fetchFaculty = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('faculty')
//         .select('*')
//         .order('name');

//       if (error) throw error;
//       setFaculty(data || []);
//     } catch (error) {
//       console.error('Error fetching faculty:', error);
//     }
//   };

//   const fetchDocuments = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('student_documents')
//         .select(`
//           *,
//           document_categories (name)
//         `)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       const formattedDocs = data?.map(doc => ({
//         id: doc.id,
//         title: doc.title,
//         file_name: doc.file_name,
//         category_name: doc.document_categories?.name || 'Unknown',
//         file_url: doc.file_url,
//         is_verified: doc.is_verified,
//         created_at: doc.created_at
//       })) || [];

//       setDocuments(formattedDocs);
//     } catch (error) {
//       console.error('Error fetching documents:', error);
//     }
//   };

//   const checkExamEligibility = async () => {
//     try {
//       // Get current user
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       // Get student enrollment to check approval status
//       const { data: enrollment } = await supabase
//         .from('student_enrollments')
//         .select('*')
//         .eq('email', user.email)
//         .single();

//       // Only show exam center for approved students
//       if (!enrollment || enrollment.status !== 'approved') {
//         return;
//       }

//       // Simulate checking exam eligibility for approved students
//       const attendance = 85;
//       const completedPortions = 6;
//       const totalPortions = 6;
//       const projectCompleted = true;

//       const missingRequirements = [];

//       if (attendance < 85) {
//         missingRequirements.push(`Attendance: ${attendance}% (Required: 85%)`);
//       }

//       if (completedPortions < totalPortions) {
//         missingRequirements.push(`Completed Portions: ${completedPortions}/${totalPortions} (Required: All)`);
//       }

//       // Check if project is required (for higher studies - MSc, MPT, etc.)
//       const requiresProject = studentData?.course.code && 
//         (studentData.course.code.includes('MSC') || studentData.course.code.includes('MPT'));

//       if (requiresProject && !projectCompleted) {
//         missingRequirements.push('Project completion required for higher studies');
//       }

//       const isEligible = missingRequirements.length === 0 && attendance >= 85 && completedPortions === totalPortions;

//       setExamEligibility({
//         isEligible,
//         attendance,
//         completedPortions,
//         totalPortions,
//         projectCompleted,
//         missingRequirements
//       });

//       // Auto-open exam center if eligible
//       if (isEligible) {
//         setSectionsOpen(prev => ({ ...prev, examCenter: true }));
//       }
//     } catch (error) {
//       console.error('Error checking exam eligibility:', error);
//     }
//   };

//   const toggleSection = (section: string) => {
//     setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
//   };

//   const toggleEditMode = (section: string) => {
//     setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
//   };

//   if (loading || !studentData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ai-accent mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-medical-primary via-ai-accent to-neural-purple py-6">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between">
//             <div className="text-white">
//               <h1 className="text-3xl font-bold">Student Dashboard</h1>
//               <p className="text-white/80">Welcome back, {studentData.student_name}</p>
//             </div>
//               <div className="flex space-x-2">
//                 <Button variant="ghost" onClick={() => navigate("/student-academic-dashboard")} className="text-white hover:bg-white/20">
//                   Academic Dashboard
//                 </Button>
//                 <Button variant="ghost" onClick={() => navigate("/")} className="text-white hover:bg-white/20">
//                   Back to Home
//                 </Button>
//               </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Student Profile Section */}
//             <Collapsible open={sectionsOpen.profile} onOpenChange={() => toggleSection('profile')}>
//               <Card className="shadow-elegant border-ai-accent/20">
//                 <CollapsibleTrigger asChild>
//                   <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <User className="h-6 w-6 text-ai-accent" />
//                         <CardTitle>Student Profile</CardTitle>
//                       </div>

//                       <ChevronDown className={`h-5 w-5 transition-transform ${sectionsOpen.profile ? 'transform rotate-180' : ''}`} />
//                     </div>
//                   </CardHeader>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent>
//                   <CardContent>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <Label>Name</Label>
//                         <p className="text-lg font-medium text-academic">{studentData.student_name}</p>
//                       </div>
//                       <div>
//                         <Label>Roll Number</Label>
//                         <p className="text-lg font-medium text-academic">{studentData.roll_number}</p>
//                       </div>
//                       <div>
//                         <Label>Course</Label>
//                         <p className="text-lg font-medium text-academic">{studentData.course.name} ({studentData.course.code})</p>
//                       </div>
//                       <div>
//                         <Label>Duration</Label>
//                         <p className="text-lg font-medium text-academic">{studentData.course.duration}</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </CollapsibleContent>
//               </Card>
//             </Collapsible>

//             {/* Subjects & Faculty Selection */}
//             <Collapsible open={sectionsOpen.subjects} onOpenChange={() => toggleSection('subjects')}>
//               <Card className="shadow-elegant border-ai-accent/20">
//                 <CollapsibleTrigger asChild>
//                   <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <BookOpen className="h-6 w-6 text-ai-accent" />
//                         <CardTitle>Subjects & Faculty Selection</CardTitle>
//                       </div>
//                       <ChevronDown className={`h-5 w-5 transition-transform ${sectionsOpen.subjects ? 'transform rotate-180' : ''}`} />
//                     </div>
//                   </CardHeader>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {subjects.map((subject) => (
//                         <div key={subject.id} className="border rounded-lg p-4">
//                           <div className="flex items-center justify-between mb-3">
//                             <div>
//                               <h4 className="font-semibold">{subject.name} ({subject.code})</h4>
//                               <p className="text-sm text-muted-foreground">
//                                 Credits: {subject.credits} | Semester: {subject.semester}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <Label>Nearby Faculty (within 25km)</Label>
//                               <Select>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select nearby faculty" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   {faculty.slice(0, 3).map((f) => (
//                                     <SelectItem key={f.id} value={f.id}>
//                                       {f.name} - {f.city}, {f.country} ({f.experience_years}y exp)
//                                     </SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                             </div>

//                             <div>
//                               <Label>International Faculty</Label>
//                               <Select>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select international faculty" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   {faculty.map((f) => (
//                                     <SelectItem key={f.id} value={f.id}>
//                                       {f.name} - {f.country} ({f.experience_years}y exp) - ${f.hourly_rate}/hr
//                                     </SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                           </div>

//                           <div className="mt-3">
//                             <p className="text-sm text-muted-foreground">
//                               Selected Faculty: <Badge variant="outline">Max 2 per subject</Badge>
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </CollapsibleContent>
//               </Card>
//             </Collapsible>

//             {/* Clinical Center Selection */}
//             <Collapsible open={sectionsOpen.clinical} onOpenChange={() => toggleSection('clinical')}>
//               <Card className="shadow-elegant border-ai-accent/20">
//                 <CollapsibleTrigger asChild>
//                   <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <Hospital className="h-6 w-6 text-ai-accent" />
//                         <CardTitle>Clinical Center Selection</CardTitle>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Button size="sm" variant="ghost" onClick={() => toggleEditMode('clinical')}>
//                           {editMode.clinical ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
//                         </Button>
//                         <ChevronDown className={`h-5 w-5 transition-transform ${sectionsOpen.clinical ? 'transform rotate-180' : ''}`} />
//                       </div>
//                     </div>
//                   </CardHeader>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div>
//                         <Label>Select Clinical Center</Label>
//                         <Select disabled={!editMode.clinical}>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Choose clinical center by location" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="metro-general">Metropolitan General Hospital - New York, US</SelectItem>
//                             <SelectItem value="london-medical">London Medical Centre - London, UK</SelectItem>
//                             <SelectItem value="barcelona-clinic">Barcelona Clinical Institute - Barcelona, ES</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div>
//                         <Label>Upload Clinical Completion Letter (PDF)</Label>
//                         <div className="border-2 border-dashed border-ai-accent/30 rounded-lg p-6 text-center">
//                           <Upload className="h-8 w-8 text-ai-accent mx-auto mb-2" />
//                           <p className="text-sm text-muted-foreground">
//                             Upload your clinical completion certificate
//                           </p>
//                           <input type="file" accept=".pdf" className="hidden" />
//                           <Button variant="outline" size="sm" className="mt-2">
//                             Choose File
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </CollapsibleContent>
//               </Card>
//             </Collapsible>

//             {/* Digital Locker */}
//             <Collapsible open={sectionsOpen.locker} onOpenChange={() => toggleSection('locker')}>
//               <Card className="shadow-elegant border-ai-accent/20">
//                 <CollapsibleTrigger asChild>
//                   <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <Folder className="h-6 w-6 text-ai-accent" />
//                         <CardTitle>Digital Locker</CardTitle>
//                       </div>
//                       <ChevronDown className={`h-5 w-5 transition-transform ${sectionsOpen.locker ? 'transform rotate-180' : ''}`} />
//                     </div>
//                   </CardHeader>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent>
//                   <CardContent>
//                     <Tabs defaultValue="documents" className="w-full">
//                       <TabsList className="grid w-full grid-cols-3">
//                         <TabsTrigger value="documents">Documents</TabsTrigger>
//                         <TabsTrigger value="works">Works</TabsTrigger>
//                         <TabsTrigger value="achievements">Achievements</TabsTrigger>
//                       </TabsList>

//                       <TabsContent value="documents" className="space-y-4">
//                         <div className="flex justify-between items-center">
//                           <h4 className="font-semibold">My Documents</h4>
//                           <Button size="sm">
//                             <Upload className="h-4 w-4 mr-2" />
//                             Upload Document
//                           </Button>
//                         </div>

//                         <div className="grid gap-3">
//                           {documents.slice(0, 5).map((doc) => (
//                             <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
//                               <div className="flex items-center space-x-3">
//                                 <FileText className="h-5 w-5 text-ai-accent" />
//                                 <div>
//                                   <p className="font-medium">{doc.title}</p>
//                                   <p className="text-sm text-muted-foreground">
//                                     {doc.category_name} | {new Date(doc.created_at).toLocaleDateString()}
//                                   </p>
//                                 </div>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 {doc.is_verified && <Badge variant="secondary">Verified</Badge>}
//                                 <Button size="sm" variant="ghost">
//                                   <Eye className="h-4 w-4" />
//                                 </Button>
//                                 <Button size="sm" variant="ghost">
//                                   <Download className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </TabsContent>

//                       <TabsContent value="works" className="space-y-4">
//                         <div className="flex justify-between items-center">
//                           <h4 className="font-semibold">My Works & Assignments</h4>
//                           <Button size="sm">
//                             <Upload className="h-4 w-4 mr-2" />
//                             Submit Work
//                           </Button>
//                         </div>

//                         <div className="text-center py-8 text-muted-foreground">
//                           <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                           <p>No assignments submitted yet</p>
//                         </div>
//                       </TabsContent>

//                       <TabsContent value="achievements" className="space-y-4">
//                         <div className="flex justify-between items-center">
//                           <h4 className="font-semibold">Certificates & Achievements</h4>
//                           <Button size="sm">
//                             <Award className="h-4 w-4 mr-2" />
//                             Add Achievement
//                           </Button>
//                         </div>

//                         <div className="text-center py-8 text-muted-foreground">
//                           <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                           <p>No achievements added yet</p>
//                         </div>
//                       </TabsContent>
//                     </Tabs>
//                   </CardContent>
//                 </CollapsibleContent>
//               </Card>
//             </Collapsible>

//             {/* Enhanced Student Portal Features */}
//             <div className="mt-8">
//               <StudentPortalFeatures />
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Calendar Widget */}
//             <Collapsible open={sectionsOpen.calendar} onOpenChange={() => toggleSection('calendar')}>
//               <Card className="shadow-elegant border-ai-accent/20">
//                 <CollapsibleTrigger asChild>
//                   <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <CalendarIcon className="h-5 w-5 text-ai-accent" />
//                         <CardTitle className="text-lg">Upcoming Classes</CardTitle>
//                       </div>
//                       <ChevronDown className={`h-4 w-4 transition-transform ${sectionsOpen.calendar ? 'transform rotate-180' : ''}`} />
//                     </div>
//                   </CardHeader>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent>
//                   <CardContent>
//                     <Calendar mode="single" className="rounded-md border" />
//                     <div className="mt-4 space-y-2">
//                       <div className="text-sm">
//                         <div className="flex items-center justify-between p-2 bg-ai-accent/10 rounded">
//                           <span>Anatomy Class</span>
//                           <span>2:00 PM</span>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </CollapsibleContent>
//               </Card>
//             </Collapsible>

//             {/* Attendance Tracker */}
//             <Collapsible open={sectionsOpen.attendance} onOpenChange={() => toggleSection('attendance')}>
//               <Card className="shadow-elegant border-ai-accent/20">
//                 <CollapsibleTrigger asChild>
//                   <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <Clock className="h-5 w-5 text-ai-accent" />
//                         <CardTitle className="text-lg">Attendance</CardTitle>
//                       </div>
//                       <ChevronDown className={`h-4 w-4 transition-transform ${sectionsOpen.attendance ? 'transform rotate-180' : ''}`} />
//                     </div>
//                   </CardHeader>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent>
//                   <CardContent>
//                     <div className="text-center mb-4">
//                       <div className="text-3xl font-bold text-academic">85%</div>
//                       <p className="text-sm text-muted-foreground">This Month</p>
//                     </div>
//                     <Progress value={85} className="mb-4" />
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span>Present:</span>
//                         <span className="font-medium">17 days</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Absent:</span>
//                         <span className="font-medium">3 days</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </CollapsibleContent>
//               </Card>
//             </Collapsible>

//             {/* Payment Summary */}
//             <Collapsible open={sectionsOpen.payments} onOpenChange={() => toggleSection('payments')}>
//               <Card className="shadow-elegant border-ai-accent/20">
//                 <CollapsibleTrigger asChild>
//                   <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <DollarSign className="h-5 w-5 text-ai-accent" />
//                         <CardTitle className="text-lg">Payment Summary</CardTitle>
//                       </div>
//                       <ChevronDown className={`h-4 w-4 transition-transform ${sectionsOpen.payments ? 'transform rotate-180' : ''}`} />
//                     </div>
//                   </CardHeader>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent>
//                   <CardContent className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm">Fees Paid:</span>
//                       <span className="font-medium text-lab-green">$1,500</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm">Pending:</span>
//                       <span className="font-medium text-yellow-600">$5,000</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm">Due Date:</span>
//                       <span className="font-medium">Jan 30, 2025</span>
//                     </div>
//                     <Button size="sm" className="w-full academic-gradient text-white">
//                       Make Payment
//                     </Button>
//                   </CardContent>
//                 </CollapsibleContent>
//               </Card>
//             </Collapsible>

//             {/* EXAM CENTER */}
//             <Collapsible open={sectionsOpen.examCenter} onOpenChange={() => toggleSection('examCenter')}>
//               <Card className={`shadow-elegant border-2 ${
//                 examEligibility.isEligible 
//                   ? 'border-green-300 bg-green-50 animate-pulse' 
//                   : 'border-yellow-300 bg-yellow-50'
//               }`}>
//                 <CollapsibleTrigger asChild>
//                   <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <Target className={`h-6 w-6 ${
//                           examEligibility.isEligible ? 'text-green-600' : 'text-yellow-600'
//                         }`} />
//                         <div>
//                           <CardTitle className={`text-lg ${
//                             examEligibility.isEligible ? 'text-green-800' : 'text-yellow-800'
//                           }`}>
//                             EXAM CENTER
//                           </CardTitle>
//                           {examEligibility.isEligible && (
//                             <Badge className="bg-green-500 text-white text-xs">
//                               ✓ ELIGIBLE
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
//                       <ChevronDown className={`h-5 w-5 transition-transform ${sectionsOpen.examCenter ? 'transform rotate-180' : ''}`} />
//                     </div>
//                   </CardHeader>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {/* Eligibility Status */}
//                       <div className="space-y-3">
//                         {/* Attendance Check */}
//                         <div className="flex items-center justify-between p-3 rounded-lg border">
//                           <div className="flex items-center space-x-2">
//                             {examEligibility.attendance >= 85 ? (
//                               <CheckCircle className="h-4 w-4 text-green-600" />
//                             ) : (
//                               <AlertTriangle className="h-4 w-4 text-red-600" />
//                             )}
//                             <span className="text-sm font-medium">Attendance</span>
//                           </div>
//                           <Badge variant={examEligibility.attendance >= 85 ? 'default' : 'destructive'}>
//                             {examEligibility.attendance}%
//                           </Badge>
//                         </div>

//                         {/* Portions Completed Check */}
//                         <div className="flex items-center justify-between p-3 rounded-lg border">
//                           <div className="flex items-center space-x-2">
//                             {examEligibility.completedPortions === examEligibility.totalPortions ? (
//                               <CheckCircle className="h-4 w-4 text-green-600" />
//                             ) : (
//                               <AlertTriangle className="h-4 w-4 text-yellow-600" />
//                             )}
//                             <span className="text-sm font-medium">Course Completion</span>
//                           </div>
//                           <Badge variant={
//                             examEligibility.completedPortions === examEligibility.totalPortions ? 'default' : 'secondary'
//                           }>
//                             {examEligibility.completedPortions}/{examEligibility.totalPortions}
//                           </Badge>
//                         </div>

//                         {/* Project Check */}
//                         <div className="flex items-center justify-between p-3 rounded-lg border">
//                           <div className="flex items-center space-x-2">
//                             {examEligibility.projectCompleted ? (
//                               <CheckCircle className="h-4 w-4 text-green-600" />
//                             ) : (
//                               <AlertTriangle className="h-4 w-4 text-yellow-600" />
//                             )}
//                             <span className="text-sm font-medium">Project Status</span>
//                           </div>
//                           <Badge variant={examEligibility.projectCompleted ? 'default' : 'secondary'}>
//                             {examEligibility.projectCompleted ? 'Complete' : 'Pending'}
//                           </Badge>
//                         </div>
//                       </div>

//                       {examEligibility.isEligible ? (
//                         <div className="text-center">
//                           <div className="flex items-center justify-center space-x-2 mb-3">
//                             <CheckCircle className="h-5 w-5 text-green-600" />
//                             <span className="text-sm font-medium text-green-800">
//                               You are eligible for examinations!
//                             </span>
//                           </div>
//                           <Button 
//                             onClick={() => navigate('/exams')}
//                             className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium"
//                           >
//                             🎯 Apply for Exam
//                           </Button>
//                         </div>
//                       ) : (
//                         <div className="text-center">
//                           <div className="flex items-center justify-center space-x-2 mb-3">
//                             <AlertTriangle className="h-5 w-5 text-yellow-600" />
//                             <span className="text-sm font-medium text-yellow-800">
//                               Complete requirements to unlock exams
//                             </span>
//                           </div>
//                           {examEligibility.missingRequirements.length > 0 && (
//                             <div className="text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
//                               Missing: {examEligibility.missingRequirements.join(', ')}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                 </CollapsibleContent>
//               </Card>
//             </Collapsible>

//             {/* AI Learning Module */}
//             <Collapsible open={sectionsOpen.ai} onOpenChange={() => toggleSection('ai')}>
//               <Card className="shadow-elegant border-ai-accent/20">
//                 <CollapsibleTrigger asChild>
//                   <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <Brain className="h-5 w-5 text-ai-accent" />
//                         <CardTitle className="text-lg">AI Learning Module</CardTitle>
//                       </div>
//                       <ChevronDown className={`h-4 w-4 transition-transform ${sectionsOpen.ai ? 'transform rotate-180' : ''}`} />
//                     </div>
//                   </CardHeader>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent>
//                   <CardContent className="text-center">
//                     <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
//                     <p className="text-sm text-muted-foreground mb-2">
//                       Unlocks at end of academic year
//                     </p>
//                     <Badge variant="outline">Coming Soon</Badge>
//                   </CardContent>
//                 </CollapsibleContent>
//               </Card>
//             </Collapsible>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };




import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  GraduationCap,
  MapPin,
  Calendar as CalendarIcon,
  Upload,
  DollarSign,
  Brain,
  ChevronDown,
  Edit,
  Save,
  FileText,
  Award,
  BookOpen,
  Hospital,
  Clock,
  TrendingUp,
  Lock,
  Folder,
  Download,
  Eye,
  Target,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { StudentPortalFeatures } from "@/components/StudentPortalFeatures";
import mixpanel from "./mixpanel";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

// Types
interface StudentData {
  id: string;
  student_name: string;
  roll_number: string;
  email: string;
  course: {
    name: string;
    code: string;
    duration: string;
  };
  status: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
}

interface Faculty {
  id: string;
  name: string;
  specializations: string[];
  experience_years: number;
  country: string;
  city: string;
  hourly_rate: number;
  distance?: number;
}

interface Document {
  id: string;
  title: string;
  file_name: string;
  category_name: string;
  file_url: string;
  is_verified: boolean;
  created_at: string;
}

export const StudentDashboard = () => {

  const location = useLocation();

  useEffect(() => {
    const fullUrl = window.location.href;

    mixpanel.track("Page Viewed", {
      full_url: fullUrl,
      path: location.pathname,
      title: document.title,
      timestamp: new Date().toISOString(),
    });
  }, [location.pathname]);

 
  const { toast } = useToast();





  // Sample student ID - in real app, get from authentication
  const studentId = "sample-enrollment-id";

  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [enrollments, setEnrollments] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState(null);
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [editHighlight, setEditHighlight] = useState(false);
  const { register, handleSubmit } = useForm();
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<Record<string, string[]>>({});
const navigate = useNavigate();

  // Collapsible states
  const [sectionsOpen, setSectionsOpen] = useState({
    profile: true,
    subjects: true,
    calendar: false,
    clinical: false,
    attendance: false,
    payments: false,
    locker: false,
    examCenter: false, // Added exam center section
    ai: false
  });

  // Exam eligibility state
  const [examEligibility, setExamEligibility] = useState({
    isEligible: false,
    attendance: 85,
    completedPortions: 5,
    totalPortions: 6,
    projectCompleted: true,
    missingRequirements: [] as string[]
  });

  // useEffect(() => {

  //   setStudentData({
  //     id: studentId,
  //     student_name: "John Doe",
  //     father_name: "Digo",
  //     roll_number: "DMU-MD-2025-001",
  //     email: "john.doe@student.dmu.edu",
  //     course: {
  //       name: "Doctor of Medicine (MD)",
  //       code: "MD",
  //       duration: "6 years"
  //     },
  //     status: "active"
  //   });

  // }, []);

  useEffect(() => {
    if (!userId) return; // Don't run until userId is available

    const fetchAll = async () => {
      await fetchStudentData(userId); // ✅ Pass actual ID
      fetchSubjects();
      fetchFaculty();
      fetchDocuments();
      checkExamEligibility();
      setLoading(false);

    };

    fetchAll();
  }, [userId]); // 👈 Dependency on userId


  useEffect(() => {
    console.log("studentData changed:", studentData);
  }, [studentData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user_id");
    toast({ title: "Logged out", description: "You have been signed out." });
    navigate("/");
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const storedId = localStorage.getItem("user_id");

      if (storedId) {
        setUserId(storedId);
        console.log("✅ User ID from localStorage:", storedId);
      } else {
        console.warn("⛔ No user ID found in localStorage");

        toast({
          title: "Unauthorized",
          description: "Please login first",
          variant: "destructive",
        });

        // ⛔ Removed navigation
      }
    }, 300); // Wait 300ms

    return () => clearTimeout(timeout);
  }, []);


  const onSubmit = async (formData) => {
    if (!userId) {
      console.error("❌ userId is missing or null");
      toast({
        title: "User ID missing",
        description: "Cannot save profile without a valid user ID.",
      });
      return;
    }

    const payload = {
      user_id: userId,
      name: formData.student_name,
      roll_number: formData.roll_number,
      father_name: formData.father_name,
    };

    console.log("🔍 Payload to save:", payload);

    // Step 1: Check if profile already exists for this user
    const { data: existingProfile, error: fetchError } = await supabase
      .from("student_profiles")
      .select("id") // just fetch id to check existence
      .eq("user_id", userId)
      .maybeSingle();

    console.log("🔍 Existing Profile:", existingProfile);
    console.log("📛 Fetch Error:", fetchError);

    if (fetchError) {
      console.error("❌ Failed to fetch existing profile:", fetchError.message);
      toast({ title: "Fetch error", description: fetchError.message });
      return;
    }

    let response;
    if (existingProfile) {
      // 🔄 Update if profile exists
      console.log("✏️ Updating profile...");
      response = await supabase
        .from("student_profiles")
        .update(payload)
        .eq("user_id", userId);
    } else {
      // ➕ Insert if no profile exists
      console.log("➕ Inserting new profile...");
      response = await supabase
        .from("student_profiles")
        .insert(payload);
    }

    const { error } = response;
    if (error) {
      toast({ title: "Save failed", description: error.message });
      console.error("❌ Save Error:", error.message);
    } else {
      toast({ title: "✅ Profile saved successfully" });
      fetchStudentData(userId);
      setProfileEditMode(false);

    }
  };





  const fetchStudentData = async (id: string) => {
    // console.log("📡 Fetching student profile for mmmmmmmmm:", id);

    const { data, error } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", id)
      .maybeSingle();

    if (error) {
      console.error("❌ Failed to fetch student data:", error.message);
      return;
    }

    if (data) {
      // console.log("✅ Student profile found.");
    } else {
      console.log("⚠️ No student profile found.");
    }

    // ✅ Always set studentData with safe values
    setStudentData({
      name: data?.name ?? "John Doe",
      father_name: data?.father_name ?? "Digo",
      roll_number: data?.roll_number ?? "DMU-MD-2025-001",
    });
  };



  useEffect(() => {
    const fetchEnrollments = async () => {
      console.log("📦 Fetching enrollments for ID:", userId);

      if (!userId) return;

      const { data, error } = await supabase
        .from("student_enrollments")
        .select("*")
        .eq("id", userId)


      if (error) {
        console.error("❌ Error fetching enrollments:", error.message);
      } else {
        console.log("✅ Enrollmentsmmmmmmmmmmm:", data);
        setEnrollments(data);
      }
    };

    fetchEnrollments();
  }, [userId]); // ✅ make sure the effect runs when userId is set



  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('semester', { ascending: true });

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchFaculty = async () => {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .order('name');

      if (error) throw error;
      console.log('✅ Faculty fetchedaaaaaaaaaaaaaaaa:', data);
      setFaculty(data || []);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  // 888888888888888888888888888888888888888888888888888888888888888888888888888
  const handleAssignFaculty = async (subjectId: string) => {
    const facultyId = selectedFaculty[subjectId];
    if (!facultyId) {
      alert("Please select a faculty.");
      return;
    }

    const insertData = [{
      faculty_id: facultyId,
      subject_id: subjectId,
      enrollment_id,
      assigned_at: new Date().toISOString(),
      status: 'assigned'
    }];

    const { error } = await supabase.from('student_faculty_assignments').insert(insertData);

    if (error) {
      alert("Error saving faculty.");
      console.error(error);
    } else {
      alert("Faculty assigned successfully.");
    }
  };



  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('student_documents')
        .select(`
          *,
          document_categories (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedDocs = data?.map(doc => ({
        id: doc.id,
        title: doc.title,
        file_name: doc.file_name,
        category_name: doc.document_categories?.name || 'Unknown',
        file_url: doc.file_url,
        is_verified: doc.is_verified,
        created_at: doc.created_at
      })) || [];

      setDocuments(formattedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const checkExamEligibility = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get student enrollment to check approval status
      const { data: enrollment } = await supabase
        .from('student_enrollments')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      // Only show exam center for approved students
      if (!enrollment || enrollment.status !== 'approved') {
        return;
      }

      // Simulate checking exam eligibility for approved students
      const attendance = 85;
      const completedPortions = 6;
      const totalPortions = 6;
      const projectCompleted = true;

      const missingRequirements = [];

      if (attendance < 85) {
        missingRequirements.push(`Attendance: ${attendance}% (Required: 85%)`);
      }

      if (completedPortions < totalPortions) {
        missingRequirements.push(`Completed Portions: ${completedPortions}/${totalPortions} (Required: All)`);
      }

      // Check if project is required (for higher studies - MSc, MPT, etc.)
      const requiresProject = studentData?.course.code &&
        (studentData.course.code.includes('MSC') || studentData.course.code.includes('MPT'));

      if (requiresProject && !projectCompleted) {
        missingRequirements.push('Project completion required for higher studies');
      }

      const isEligible = missingRequirements.length === 0 && attendance >= 85 && completedPortions === totalPortions;

      setExamEligibility({
        isEligible,
        attendance,
        completedPortions,
        totalPortions,
        projectCompleted,
        missingRequirements
      });

      // Auto-open exam center if eligible
      if (isEligible) {
        setSectionsOpen(prev => ({ ...prev, examCenter: true }));
      }
    } catch (error) {
      console.error('Error checking exam eligibility:', error);
    }
  };

  const toggleSection = (section: string) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleEditMode = (section: string) => {
    setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading || !studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ai-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-medical-primary via-ai-accent to-neural-purple py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-3xl font-bold">Student Dashboard</h1>
              <p className="text-white/80">Welcome back, {studentData.student_name}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" onClick={() => navigate("/student-academic-dashboard")} className="text-white hover:bg-white/20">
                Academic Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate("/")} className="text-white hover:bg-white/20">
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-ai-accent border-ai-accent hover:bg-ai-accent hover:text-white transition-colors"
              >
                Logout
              </Button>
              <Button
                variant="outline"
                className="text-ai-accent border-ai-accent hover:bg-ai-accent hover:text-white transition-colors"
                onClick={() => navigate("/student-profile")}
              >
                Student Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Profile Section */}
            <Collapsible open={sectionsOpen.profile} onOpenChange={() => toggleSection('profile')}>
              <Card className="shadow-elegant border-ai-accent/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="h-6 w-6 text-ai-accent" />
                        <CardTitle>Student Profile</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${sectionsOpen.profile ? 'transform rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                          <Label>Name</Label>
                          <p className="text-lg font-medium text-academic">{studentData.name}</p>
                        </div>

                        {/* father name */}

                        <div>
                          <Label>Father Name</Label>
                          <p className="text-lg font-medium text-academic">{studentData.father_name}</p>
                        </div>

                        {/* Roll Number */}


                        <div>
                          <Label>Roll Number</Label>
                          <p className="text-lg font-medium text-academic">{studentData.roll_number}</p>
                        </div>

                        {/* Course Name and Code */}
                        {/* <div>
                            className="text-black"
                          />
                        </div>
                         <div>
                        <Label>Name</Label>
                        <p className="text-lg font-medium text-academic">{studentData.student_name}</p>
                      </div>

                        {/* Course Name and Code */}
                        {/* <div>
        <Label htmlFor="course_name">Course Name</Label>
        <Input
          id="course_name"
          {...register("course.name")}
          defaultValue={studentData.course.name}
        />
      </div>
      <div>
        <Label htmlFor="course_code">Course Code</Label>
        <Input
          id="course_code"
          {...register("course.code")}
          defaultValue={studentData.course.code}
        />
      </div> */}

                        {/* Duration */}
                        {/* <div>
        <Label htmlFor="course_duration">Duration</Label>
        <Input
          id="course_duration"
          {...register("course.duration")}
          defaultValue={studentData.course.duration}
        />
      </div> */}
                      </div>

                    </form>
                  </CardContent>

                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Subjects & Faculty Selection */}
            <Collapsible open={sectionsOpen.subjects} onOpenChange={() => toggleSection('subjects')}>
              <Card className="shadow-elegant border-ai-accent/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-6 w-6 text-ai-accent" />
                        <CardTitle>Subjects & Faculty Selection</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${sectionsOpen.subjects ? 'transform rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-4">
                      {subjects.map((subject) => (
                        <div key={subject.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{subject.name} ({subject.code})</h4>
                              <p className="text-sm text-muted-foreground">
                                Credits: {subject.credits} | Semester: {subject.semester}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Nearby Faculty (within 25km)</Label>
                              <Select
                                onValueChange={(value) =>
                                  setSelectedFaculty((prev) => ({ ...prev, [subject.id]: value }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select nearby faculty" />
                                </SelectTrigger>
                                <SelectContent>
                                  {faculty.slice(0, 3).map((f) => (
                                    <SelectItem key={f.id} value={f.id}>
                                      {f.name} - {f.city}, {f.country} ({f.experience_years}y exp)
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>International Faculty</Label>
                              <Select
                                onValueChange={(value) =>
                                  setSelectedFaculty((prev) => ({ ...prev, [subject.id]: value }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select international faculty" />
                                </SelectTrigger>
                                <SelectContent>
                                  {faculty.map((f) => (
                                    <SelectItem key={f.id} value={f.id}>
                                      {f.name} - {f.country} ({f.experience_years}y exp) - ${f.hourly_rate}/hr
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                              Selected Faculty: <Badge variant="outline">Max 2 per subject</Badge>
                            </p>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleAssignFaculty(subject.id)}
                            >
                              Select
                            </Button>

                          </div>

                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Clinical Center Selection */}
            <Collapsible open={sectionsOpen.clinical} onOpenChange={() => toggleSection('clinical')}>
              <Card className="shadow-elegant border-ai-accent/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Hospital className="h-6 w-6 text-ai-accent" />
                        <CardTitle>Clinical Center Selection</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => toggleEditMode('clinical')}>
                          {editMode.clinical ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                        </Button>
                        <ChevronDown className={`h-5 w-5 transition-transform ${sectionsOpen.clinical ? 'transform rotate-180' : ''}`} />
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Select Clinical Center</Label>
                        <Select disabled={!editMode.clinical}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose clinical center by location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="metro-general">Metropolitan General Hospital - New York, US</SelectItem>
                            <SelectItem value="london-medical">London Medical Centre - London, UK</SelectItem>
                            <SelectItem value="barcelona-clinic">Barcelona Clinical Institute - Barcelona, ES</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Upload Clinical Completion Letter (PDF)</Label>
                        <div className="border-2 border-dashed border-ai-accent/30 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 text-ai-accent mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Upload your clinical completion certificate
                          </p>
                          <input type="file" accept=".pdf" className="hidden" />
                          <Button variant="outline" size="sm" className="mt-2">
                            Choose File
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Digital Locker */}
            <Collapsible open={sectionsOpen.locker} onOpenChange={() => toggleSection('locker')}>
              <Card className="shadow-elegant border-ai-accent/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Folder className="h-6 w-6 text-ai-accent" />
                        <CardTitle>Digital Locker</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${sectionsOpen.locker ? 'transform rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <Tabs defaultValue="documents" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="works">Works</TabsTrigger>
                        <TabsTrigger value="achievements">Achievements</TabsTrigger>
                      </TabsList>

                      <TabsContent value="documents" className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">My Documents</h4>
                          <Button size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Document
                          </Button>
                        </div>

                        <div className="grid gap-3">
                          {documents.slice(0, 5).map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-ai-accent" />
                                <div>
                                  <p className="font-medium">{doc.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {doc.category_name} | {new Date(doc.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {doc.is_verified && <Badge variant="secondary">Verified</Badge>}
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="works" className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">My Works & Assignments</h4>
                          <Button size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Submit Work
                          </Button>
                        </div>

                        <div className="text-center py-8 text-muted-foreground">
                          <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No assignments submitted yet</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="achievements" className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">Certificates & Achievements</h4>
                          <Button size="sm">
                            <Award className="h-4 w-4 mr-2" />
                            Add Achievement
                          </Button>
                        </div>

                        <div className="text-center py-8 text-muted-foreground">
                          <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No achievements added yet</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Enhanced Student Portal Features */}
            <div className="mt-8">
              <StudentPortalFeatures />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar Widget */}
            <Collapsible open={sectionsOpen.calendar} onOpenChange={() => toggleSection('calendar')}>
              <Card className="shadow-elegant border-ai-accent/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CalendarIcon className="h-5 w-5 text-ai-accent" />
                        <CardTitle className="text-lg">Upcoming Classes</CardTitle>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${sectionsOpen.calendar ? 'transform rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <Calendar mode="single" className="rounded-md border" />
                    <div className="mt-4 space-y-2">
                      <div className="text-sm">
                        <div className="flex items-center justify-between p-2 bg-ai-accent/10 rounded">
                          <span>Anatomy Class</span>
                          <span>2:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Attendance Tracker */}
            <Collapsible open={sectionsOpen.attendance} onOpenChange={() => toggleSection('attendance')}>
              <Card className="shadow-elegant border-ai-accent/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-ai-accent" />
                        <CardTitle className="text-lg">Attendance</CardTitle>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${sectionsOpen.attendance ? 'transform rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-academic">85%</div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                    </div>
                    <Progress value={85} className="mb-4" />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Present:</span>
                        <span className="font-medium">17 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Absent:</span>
                        <span className="font-medium">3 days</span>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Payment Summary */}
            <Collapsible open={sectionsOpen.payments} onOpenChange={() => toggleSection('payments')}>
              <Card className="shadow-elegant border-ai-accent/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-ai-accent" />
                        <CardTitle className="text-lg">Payment Summary</CardTitle>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${sectionsOpen.payments ? 'transform rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fees Paid:</span>
                      <span className="font-medium text-lab-green">$1,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending:</span>
                      <span className="font-medium text-yellow-600">$5,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Due Date:</span>
                      <span className="font-medium">Jan 30, 2025</span>
                    </div>
                    <Button size="sm" className="w-full academic-gradient text-white">
                      Make Payment
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* EXAM CENTER */}
            <Collapsible open={sectionsOpen.examCenter} onOpenChange={() => toggleSection('examCenter')}>
              <Card className={`shadow-elegant border-2 ${examEligibility.isEligible
                ? 'border-green-300 bg-green-50 animate-pulse'
                : 'border-yellow-300 bg-yellow-50'
                }`}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Target className={`h-6 w-6 ${examEligibility.isEligible ? 'text-green-600' : 'text-yellow-600'
                          }`} />
                        <div>
                          <CardTitle className={`text-lg ${examEligibility.isEligible ? 'text-green-800' : 'text-yellow-800'
                            }`}>
                            EXAM CENTER
                          </CardTitle>
                          {examEligibility.isEligible && (
                            <Badge className="bg-green-500 text-white text-xs">
                              ✓ ELIGIBLE
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${sectionsOpen.examCenter ? 'transform rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Eligibility Status */}
                      <div className="space-y-3">
                        {/* Attendance Check */}
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center space-x-2">
                            {examEligibility.attendance >= 85 ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm font-medium">Attendance</span>
                          </div>
                          <Badge variant={examEligibility.attendance >= 85 ? 'default' : 'destructive'}>
                            {examEligibility.attendance}%
                          </Badge>
                        </div>

                        {/* Portions Completed Check */}
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center space-x-2">
                            {examEligibility.completedPortions === examEligibility.totalPortions ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            )}
                            <span className="text-sm font-medium">Course Completion</span>
                          </div>
                          <Badge variant={
                            examEligibility.completedPortions === examEligibility.totalPortions ? 'default' : 'secondary'
                          }>
                            {examEligibility.completedPortions}/{examEligibility.totalPortions}
                          </Badge>
                        </div>

                        {/* Project Check */}
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center space-x-2">
                            {examEligibility.projectCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            )}
                            <span className="text-sm font-medium">Project Status</span>
                          </div>
                          <Badge variant={examEligibility.projectCompleted ? 'default' : 'secondary'}>
                            {examEligibility.projectCompleted ? 'Complete' : 'Pending'}
                          </Badge>
                        </div>
                      </div>

                      {examEligibility.isEligible ? (
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 mb-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              You are eligible for examinations!
                            </span>
                          </div>
                          <Button
                            onClick={() => navigate('/exams')}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium"
                          >
                            🎯 Apply for Exam
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 mb-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">
                              Complete requirements to unlock exams
                            </span>
                          </div>
                          {examEligibility.missingRequirements.length > 0 && (
                            <div className="text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
                              Missing: {examEligibility.missingRequirements.join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* AI Learning Module */}
            <Collapsible open={sectionsOpen.ai} onOpenChange={() => toggleSection('ai')}>
              <Card className="shadow-elegant border-ai-accent/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Brain className="h-5 w-5 text-ai-accent" />
                        <CardTitle className="text-lg">AI Learning Module</CardTitle>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${sectionsOpen.ai ? 'transform rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="text-center">
                    <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Unlocks at end of academic year
                    </p>
                    <Badge variant="outline">Coming Soon</Badge>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};