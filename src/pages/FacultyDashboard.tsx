import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Calendar as CalendarIcon, 
  Upload, 
  DollarSign, 
  Brain, 
  ChevronDown,
  Edit,
  Save,
  Play,
  Users,
  FileText,
  Video,
  CheckCircle,
  XCircle,
  TrendingUp,
  BookOpen,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import mixpanel from "./mixpanel";
import { useLocation } from "react-router-dom"; 

// Types
interface FacultyData {
  id: string;
  full_name: string;
  faculty_id: string;
  specialty: string;
  experience_years: number;
  email: string;
  degree: string;
  status: string;
  phone?: string;
  address?: string;
  country?: string;
}

interface FacultyProfile {
  id: string;
  profile_photo_url?: string;
  bio?: string;
  languages?: string[];
  qualifications?: string[];
  social_links?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  teaching_philosophy?: string;
  office_hours?: Record<string, string>;
}

interface ScheduledClass {
  id: string;
  title: string;
  class_date: string;
  duration_minutes: number;
  enrolled_students: number;
  max_students: number;
  status: string;
}

interface StudentProgress {
  id: string;
  student_name: string;
  subject_name: string;
  progress_percentage: number;
  status: string;
  last_attendance: string;
}

export const FacultyDashboard = () => {

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

  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Sample faculty ID - in real app, get from authentication
  const facultyId = "FAC-CAR-2024-001";
  
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null);
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfile | null>(null);
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({
    profile: false,
    bio: false,
    languages: false,
    qualifications: false,
    socialLinks: false
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
const [userId, setUserId] = useState<string | null>(null);
  // Collapsible states
  const [sectionsOpen, setSectionsOpen] = useState({
    profile: true,
    calendar: true,
    uploads: false,
    students: false,
    progress: false,
    earnings: false,
    ai: false
  });

  // Form states
  const [newClass, setNewClass] = useState({
    title: "",
    subject: "",
    date: "",
    time: "",
    duration: "60",
    maxStudents: "30"
  });

  const [uploadData, setUploadData] = useState({
    type: "teaching_material",
    subject: "",
    topic: "",
    summary: "",
    file: null as File | null
  });


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




  useEffect(() => {
    // In a real app, fetch actual faculty data and profile
    const fetchFacultyData = async () => {
      try {
        // Sample faculty data - in a real app, this would come from the database
        setFacultyData({
          id: facultyId,
          full_name: "Dr. Sarah Johnson",
          faculty_id: "FAC-CAR-2024-001",
          specialty: "Cardiology",
          experience_years: 15,
          email: "sarah.johnson@dmu.edu",
          degree: "MBBS, MD",
          status: "approved",
          phone: "+1 (555) 123-4567",
          address: "123 Medical Center Dr, Healthcare City",
          country: "US"
        });
        
        // Sample profile data - in a real app, fetch from faculty_profiles table
        setFacultyProfile({
          id: facultyId,
          profile_photo_url: null,
          bio: "Cardiology specialist with 15 years of experience in interventional procedures and cardiac imaging. Passionate about teaching and integrating AI in cardiac diagnostics.",
          languages: ["English", "Spanish", "French"],
          qualifications: ["MBBS", "MD Cardiology", "Fellowship in Interventional Cardiology", "Certified Medical Educator"],
          social_links: {
            linkedin: "https://linkedin.com/in/drsarahjohnson",
            twitter: "https://twitter.com/drsarahjohnson",
            website: "https://drsarahjohnson.com"
          },
          teaching_philosophy: "I believe in practical, hands-on learning integrated with theoretical foundations and AI-enhanced diagnostic tools.",
          office_hours: {
            "Monday": "9:00 AM - 12:00 PM",
            "Wednesday": "1:00 PM - 4:00 PM",
            "Friday": "10:00 AM - 2:00 PM"
          }
        });
        
        // Sample data - replace with real API calls
        setScheduledClasses([
          {
            id: "1",
            title: "Advanced Cardiac Catheterization",
            class_date: "2024-01-25T14:00:00",
            duration_minutes: 90,
            enrolled_students: 12,
            max_students: 20,
            status: "scheduled"
          },
          {
            id: "2", 
            title: "ECG Interpretation Masterclass",
            class_date: "2024-01-27T10:00:00",
            duration_minutes: 60,
            enrolled_students: 8,
            max_students: 15,
            status: "scheduled"
          }
        ]);

        setStudentProgress([
          {
            id: "1",
            student_name: "John Doe",
            subject_name: "Cardiology Basics",
            progress_percentage: 85,
            status: "in_progress",
            last_attendance: "2024-01-20"
          },
          {
            id: "2",
            student_name: "Jane Smith", 
            subject_name: "Advanced Cardiac Procedures",
            progress_percentage: 92,
            status: "completed",
            last_attendance: "2024-01-22"
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        toast({
          title: "Error",
          description: "Failed to load faculty data. Please refresh the page.",
          variant: "destructive"
        });
      }
    };
    
    fetchFacultyData();
  }, []);

  const toggleSection = (section: string) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleEditMode = (section: string) => {
    setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleProfileUpdate = async (fieldName: string, value: any) => {
    try {
      // In a real app, update the database with the new value
      if (fieldName === 'personalInfo') {
        setFacultyData(prev => ({ ...prev!, ...value }));
      } else {
        setFacultyProfile(prev => ({ ...prev!, [fieldName]: value }));
      }
      
      toggleEditMode(fieldName);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleProfilePhotoUpload = async () => {
    if (!profilePhotoFile) {
      toast({
        title: "Error",
        description: "Please select a photo to upload.",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real app, upload to Supabase storage
      // const userId = (await supabase.auth.getUser()).data.user?.id;
      // const filePath = `${userId}/${profilePhotoFile.name}`;
      // const { data, error } = await supabase.storage
      //   .from('faculty-profiles')
      //   .upload(filePath, profilePhotoFile, {
      //     upsert: true
      //   });
      
      // if (error) throw error;
      
      // const { data: { publicUrl } } = supabase.storage
      //   .from('faculty-profiles')
      //   .getPublicUrl(filePath);
      
      // await supabase
      //   .from('faculty_profiles')
      //   .upsert({ 
      //     id: userId,
      //     profile_photo_url: publicUrl
      //   });
      
      // Set a sample URL for demonstration
      const samplePhotoUrl = URL.createObjectURL(profilePhotoFile);
      setFacultyProfile(prev => ({ ...prev!, profile_photo_url: samplePhotoUrl }));
      
      toast({
        title: "Photo Uploaded",
        description: "Your profile photo has been updated successfully."
      });
      
      setProfilePhotoFile(null);
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload profile photo. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleScheduleClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In real app, save to database
      toast({
        title: "Class Scheduled Successfully!",
        description: `${newClass.title} scheduled for ${newClass.date} at ${newClass.time}`
      });
      
      // Reset form
      setNewClass({
        title: "",
        subject: "",
        date: "",
        time: "",
        duration: "60",
        maxStudents: "30"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule class. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }

    try {
      // In real app, upload file to Supabase storage
      toast({
        title: "Upload Successful!",
        description: `${uploadData.file.name} has been uploaded successfully.`
      });
      
      // Reset form
      setUploadData({
        type: "teaching_material",
        subject: "",
        topic: "",
        summary: "",
        file: null
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const startLiveClass = (classId: string) => {
    // Integration with Zoom/Teams would go here
    toast({
      title: "Starting Live Class...",
      description: "Redirecting to video conference platform"
    });
  };

  const markAttendance = (studentId: string, status: 'present' | 'absent') => {
    toast({
      title: "Attendance Marked",
      description: `Student marked as ${status}`
    });
  };

  if (loading || !facultyData) {
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
              <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
              <p className="text-white/80">Welcome back, {facultyData.full_name}</p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/")} className="text-white hover:bg-white/20">
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Faculty Profile */}
            <Collapsible open={sectionsOpen.profile} onOpenChange={() => toggleSection('profile')}>
              <Card className="shadow-elegant border-ai-accent/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="h-6 w-6 text-ai-accent" />
                        <CardTitle>Faculty Profile</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${sectionsOpen.profile ? 'transform rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Profile Photo Upload */}
                      <div className="flex flex-col items-center space-y-3">
                        <div className="relative group">
                          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-ai-accent/30 bg-muted/30 flex items-center justify-center">
                            {facultyProfile?.profile_photo_url ? (
                              <img 
                                src={facultyProfile.profile_photo_url} 
                                alt={facultyData.full_name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-20 h-20 text-muted-foreground" />
                            )}
                          </div>
                          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                            onClick={() => document.getElementById('profile-photo-upload')?.click()}>
                            <Upload className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          id="profile-photo-upload"
                          className="hidden"
                          onChange={(e) => setProfilePhotoFile(e.target.files?.[0] || null)}
                        />
                        {profilePhotoFile && (
                          <div className="flex flex-col space-y-2 items-center">
                            <p className="text-xs text-muted-foreground truncate max-w-[12rem]">{profilePhotoFile.name}</p>
                            <Button 
                              size="sm" 
                              onClick={handleProfilePhotoUpload}
                              className="academic-gradient text-white"
                            >
                              Upload Photo
                            </Button>
                          </div>
                        )}
                        {!profilePhotoFile && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs"
                            onClick={() => document.getElementById('profile-photo-upload')?.click()}
                          >
                            Change Photo
                          </Button>
                        )}
                      </div>

                      {/* Profile Information */}
                      <div className="flex-1 space-y-4">
                        {/* Personal Information */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-academic">Personal Information</h3>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleEditMode('personalInfo')}
                              className="h-8 px-2"
                            >
                              {editMode.personalInfo ? (
                                <Save className="h-4 w-4 text-ai-accent" />
                              ) : (
                                <Edit className="h-4 w-4 text-ai-accent" />
                              )}
                            </Button>
                          </div>

                          {editMode.personalInfo ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Full Name</Label>
                                <Input 
                                  defaultValue={facultyData.full_name}
                                  className="mt-1"
                                  onChange={(e) => setFacultyData(prev => ({ ...prev!, full_name: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label>Specialty</Label>
                                <Input 
                                  defaultValue={facultyData.specialty}
                                  className="mt-1"
                                  onChange={(e) => setFacultyData(prev => ({ ...prev!, specialty: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label>Phone</Label>
                                <Input 
                                  defaultValue={facultyData.phone}
                                  className="mt-1"
                                  onChange={(e) => setFacultyData(prev => ({ ...prev!, phone: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label>Email</Label>
                                <Input 
                                  defaultValue={facultyData.email}
                                  className="mt-1"
                                  readOnly
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Address</Label>
                                <Textarea 
                                  defaultValue={facultyData.address}
                                  className="mt-1"
                                  onChange={(e) => setFacultyData(prev => ({ ...prev!, address: e.target.value }))}
                                />
                              </div>
                              <div className="md:col-span-2 flex justify-end">
                                <Button 
                                  variant="default" 
                                  className="academic-gradient text-white"
                                  onClick={() => {
                                    handleProfileUpdate('personalInfo', {
                                      full_name: facultyData.full_name,
                                      specialty: facultyData.specialty,
                                      phone: facultyData.phone,
                                      address: facultyData.address
                                    });
                                  }}
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Name</Label>
                                <p className="text-lg font-medium text-academic">{facultyData.full_name}</p>
                              </div>
                              <div>
                                <Label>Faculty ID</Label>
                                <p className="text-lg font-medium text-academic">{facultyData.faculty_id}</p>
                              </div>
                              <div>
                                <Label>Specialty</Label>
                                <p className="text-lg font-medium text-academic">{facultyData.specialty}</p>
                              </div>
                              <div>
                                <Label>Experience</Label>
                                <p className="text-lg font-medium text-academic">{facultyData.experience_years} years</p>
                              </div>
                              <div>
                                <Label>Phone</Label>
                                <p className="text-lg font-medium text-academic">{facultyData.phone || "Not provided"}</p>
                              </div>
                              <div>
                                <Label>Email</Label>
                                <p className="text-lg font-medium text-academic">{facultyData.email}</p>
                              </div>
                              {facultyData.address && (
                                <div className="md:col-span-2">
                                  <Label>Address</Label>
                                  <p className="text-lg font-medium text-academic">{facultyData.address}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Professional Bio */}
                        <div className="space-y-2 border-t border-ai-accent/10 pt-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-academic">Professional Bio</h3>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleEditMode('bio')}
                              className="h-8 px-2"
                            >
                              {editMode.bio ? (
                                <Save className="h-4 w-4 text-ai-accent" />
                              ) : (
                                <Edit className="h-4 w-4 text-ai-accent" />
                              )}
                            </Button>
                          </div>

                          {editMode.bio ? (
                            <div className="space-y-4">
                              <Textarea 
                                defaultValue={facultyProfile?.bio}
                                className="min-h-[100px]"
                                placeholder="Enter your professional bio here..."
                                onChange={(e) => setFacultyProfile(prev => ({ ...prev!, bio: e.target.value }))}
                              />
                              <div className="flex justify-end">
                                <Button 
                                  variant="default" 
                                  className="academic-gradient text-white"
                                  onClick={() => handleProfileUpdate('bio', facultyProfile?.bio)}
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-academic">
                              {facultyProfile?.bio || "No professional bio provided. Click Edit to add your bio."}
                            </p>
                          )}
                        </div>

                        {/* Languages */}
                        <div className="space-y-2 border-t border-ai-accent/10 pt-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-academic">Languages</h3>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleEditMode('languages')}
                              className="h-8 px-2"
                            >
                              {editMode.languages ? (
                                <Save className="h-4 w-4 text-ai-accent" />
                              ) : (
                                <Edit className="h-4 w-4 text-ai-accent" />
                              )}
                            </Button>
                          </div>

                          {editMode.languages ? (
                            <div className="space-y-4">
                              <div className="flex flex-wrap gap-2">
                                {facultyProfile?.languages?.map((language, index) => (
                                  <div key={index} className="flex items-center bg-ai-accent/10 rounded-full px-3 py-1">
                                    <span className="text-sm">{language}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const updatedLanguages = [...(facultyProfile?.languages || [])];
                                        updatedLanguages.splice(index, 1);
                                        setFacultyProfile(prev => ({ ...prev!, languages: updatedLanguages }));
                                      }}
                                      className="ml-2 h-4 w-4 p-0"
                                    >
                                      ×
                                    </Button>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input 
                                  placeholder="Add a language (e.g., English, Spanish)"
                                  id="language-input"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const input = document.getElementById('language-input') as HTMLInputElement;
                                      if (input.value.trim()) {
                                        setFacultyProfile(prev => ({
                                          ...prev!,
                                          languages: [...(prev?.languages || []), input.value.trim()]
                                        }));
                                        input.value = '';
                                      }
                                    }
                                  }}
                                />
                                <Button 
                                  variant="outline"
                                  onClick={() => {
                                    const input = document.getElementById('language-input') as HTMLInputElement;
                                    if (input.value.trim()) {
                                      setFacultyProfile(prev => ({
                                        ...prev!,
                                        languages: [...(prev?.languages || []), input.value.trim()]
                                      }));
                                      input.value = '';
                                    }
                                  }}
                                >
                                  Add
                                </Button>
                              </div>
                              <div className="flex justify-end">
                                <Button 
                                  variant="default" 
                                  className="academic-gradient text-white"
                                  onClick={() => handleProfileUpdate('languages', facultyProfile?.languages)}
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {facultyProfile?.languages?.length ? 
                                facultyProfile.languages.map((language, index) => (
                                  <Badge key={index} variant="outline" className="bg-ai-accent/10">
                                    {language}
                                  </Badge>
                                )) : 
                                <p className="text-muted-foreground">No languages specified.</p>
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Upload Section */}
            <Collapsible open={sectionsOpen.uploads} onOpenChange={() => toggleSection('uploads')}>
              <Card className="shadow-elegant border-ai-accent/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Upload className="h-6 w-6 text-ai-accent" />
                        <CardTitle>Upload Section</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${sectionsOpen.uploads ? 'transform rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <Tabs defaultValue="materials" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="materials">Teaching Materials</TabsTrigger>
                        <TabsTrigger value="video">Video Lectures</TabsTrigger>
                        <TabsTrigger value="ai-module">AI Modules</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="materials" className="space-y-4">
                        <form onSubmit={handleFileUpload} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Subject *</Label>
                              <Input
                                value={uploadData.subject}
                                onChange={(e) => setUploadData(prev => ({ ...prev, subject: e.target.value }))}
                                placeholder="e.g., Cardiology Basics"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Topic *</Label>
                              <Input
                                value={uploadData.topic}
                                onChange={(e) => setUploadData(prev => ({ ...prev, topic: e.target.value }))}
                                placeholder="e.g., ECG Analysis"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Summary</Label>
                            <Textarea
                              value={uploadData.summary}
                              onChange={(e) => setUploadData(prev => ({ ...prev, summary: e.target.value }))}
                              placeholder="Brief description of the content..."
                              className="min-h-[80px]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Upload File (PDF or Video) *</Label>
                            <div className="border-2 border-dashed border-ai-accent/30 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 text-ai-accent mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground mb-2">
                                {uploadData.file ? uploadData.file.name : "Choose file to upload"}
                              </p>
                              <input
                                type="file"
                                accept=".pdf,.mp4,.mov,.avi,.wmv"
                                onChange={(e) => setUploadData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                                className="hidden"
                                id="material-upload"
                                required
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('material-upload')?.click()}
                              >
                                Choose File
                              </Button>
                            </div>
                          </div>
                          
                          <Button type="submit" className="w-full academic-gradient text-white">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Material
                          </Button>
                        </form>
                      </TabsContent>
                      
                      <TabsContent value="video" className="space-y-4">
                        <div className="text-center py-8">
                          <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">Video lecture upload coming soon...</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="ai-module" className="space-y-4">
                        <div className="text-center py-8">
                          <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">AI module upload (monthly requirement)</p>
                          <Button className="mt-4 academic-gradient text-white">
                            Upload This Month's AI Module
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Student Management */}
            <Collapsible open={sectionsOpen.students} onOpenChange={() => toggleSection('students')}>
              <Card className="shadow-elegant border-ai-accent/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Users className="h-6 w-6 text-ai-accent" />
                        <CardTitle>Student Management</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${sectionsOpen.students ? 'transform rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-4">
                      {studentProgress.map((student) => (
                        <div key={student.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{student.student_name}</h4>
                              <p className="text-sm text-muted-foreground">{student.subject_name}</p>
                            </div>
                            <Badge variant={student.status === 'completed' ? 'default' : 'secondary'}>
                              {student.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Progress:</span>
                              <span className="text-sm font-medium">{student.progress_percentage}%</span>
                            </div>
                            <Progress value={student.progress_percentage} className="h-2" />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Last attended: {new Date(student.last_attendance).toLocaleDateString()}
                            </span>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAttendance(student.id, 'present')}
                                className="text-lab-green"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Present
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAttendance(student.id, 'absent')}
                                className="text-destructive"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Absent
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar & Scheduling */}
            <Collapsible open={sectionsOpen.calendar} onOpenChange={() => toggleSection('calendar')}>
              <Card className="shadow-elegant border-ai-accent/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CalendarIcon className="h-5 w-5 text-ai-accent" />
                        <CardTitle className="text-lg">Schedule Classes</CardTitle>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${sectionsOpen.calendar ? 'transform rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border mb-4" />
                    
                    {/* Quick Class Scheduler */}
                    <form onSubmit={handleScheduleClass} className="space-y-3">
                      <Input
                        placeholder="Class title"
                        value={newClass.title}
                        onChange={(e) => setNewClass(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={newClass.date}
                          onChange={(e) => setNewClass(prev => ({ ...prev, date: e.target.value }))}
                          required
                        />
                        <Input
                          type="time"
                          value={newClass.time}
                          onChange={(e) => setNewClass(prev => ({ ...prev, time: e.target.value }))}
                          required
                        />
                      </div>
                      <Button type="submit" size="sm" className="w-full academic-gradient text-white">
                        Schedule Class
                      </Button>
                    </form>
                    
                    {/* Upcoming Classes */}
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold text-sm">Upcoming Classes</h4>
                      {scheduledClasses.map((classItem) => (
                        <div key={classItem.id} className="text-sm p-2 bg-muted/30 rounded">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{classItem.title}</span>
                            <Button
                              size="sm"
                              onClick={() => startLiveClass(classItem.id)}
                              className="text-xs px-2 py-1 h-6 academic-gradient text-white"
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Start Live
                            </Button>
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(classItem.class_date).toLocaleDateString()} at {new Date(classItem.class_date).toLocaleTimeString()}
                          </div>
                          <div className="text-xs">
                            {classItem.enrolled_students}/{classItem.max_students} students
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Monthly Earnings */}
            <Collapsible open={sectionsOpen.earnings} onOpenChange={() => toggleSection('earnings')}>
              <Card className="shadow-elegant border-ai-accent/20">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-ai-accent" />
                        <CardTitle className="text-lg">Earnings Report</CardTitle>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${sectionsOpen.earnings ? 'transform rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-academic">$3,450</div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Classes Taught:</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Students Taught:</span>
                        <span className="font-medium">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg. Rating:</span>
                        <span className="font-medium">4.8/5</span>
                      </div>
                    </div>
                    
                    <Button size="sm" className="w-full" variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Full Report
                    </Button>
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