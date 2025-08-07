import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Upload, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Globe, ChevronDown } from "lucide-react";

// Country codes for phone numbers
const countryCodes = [
  { code: "+1", country: "United States & Canada" },
  { code: "+44", country: "United Kingdom" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+86", country: "China" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+81", country: "Japan" },
  { code: "+7", country: "Russia" },
  { code: "+55", country: "Brazil" },
  { code: "+27", country: "South Africa" },
  { code: "+971", country: "United Arab Emirates" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+65", country: "Singapore" },
  { code: "+852", country: "Hong Kong" },
  { code: "+82", country: "South Korea" },
  { code: "+39", country: "Italy" },
  { code: "+34", country: "Spain" },
  { code: "+31", country: "Netherlands" },
  { code: "+90", country: "Turkey" },
  { code: "+52", country: "Mexico" },
  { code: "+351", country: "Portugal" },
  { code: "+353", country: "Ireland" },
  { code: "+64", country: "New Zealand" },
  { code: "+60", country: "Malaysia" },
  { code: "+63", country: "Philippines" },
  { code: "+66", country: "Thailand" },
  { code: "+94", country: "Sri Lanka" },
  { code: "+977", country: "Nepal" },
  { code: "+880", country: "Bangladesh" },
  { code: "+92", country: "Pakistan" },
  { code: "+234", country: "Nigeria" },
  { code: "+254", country: "Kenya" },
  { code: "+20", country: "Egypt" },
  { code: "+962", country: "Jordan" },
  { code: "+961", country: "Lebanon" },
  { code: "+968", country: "Oman" },
  { code: "+973", country: "Bahrain" },
  { code: "+974", country: "Qatar" },
  { code: "+965", country: "Kuwait" },
  { code: "+972", country: "Israel" },
  { code: "+46", country: "Sweden" },
  { code: "+47", country: "Norway" },
  { code: "+45", country: "Denmark" },
  { code: "+358", country: "Finland" },
  { code: "+48", country: "Poland" },
  { code: "+420", country: "Czech Republic" },
  { code: "+36", country: "Hungary" },
  { code: "+43", country: "Austria" },
  { code: "+41", country: "Switzerland" }
];

interface Course {
  id: string;
  name: string;
  code: string;
  duration: string;
  description: string;
}

export const StudentEnrollment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    studentName: "",
    fathersName: "",
    email: "",
    countryCode: "+1", // Default country code
    phoneNumber: "",
    guardianCountryCode: "+1", // Default country code
    guardianNumber: "",
    address: "",
    courseId: ""
  });

  const [files, setFiles] = useState({
    marksheet: null as File | null,
    governmentId: null as File | null
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('name');

      if (error) throw error;
      setCourses(data || []);
      
      // Sort country codes alphabetically by country name
      countryCodes.sort((a, b) => a.country.localeCompare(b.country));
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses. Please refresh the page.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (type: 'marksheet' | 'governmentId', file: File | null) => {
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('enrollment-documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from('enrollment-documents')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files.marksheet || !files.governmentId) {
      toast({
        title: "Missing Documents",
        description: "Please upload both marksheet and government ID documents.",
        variant: "destructive"
      });
      return;
    }
    
    // Combine country code with phone number
    const formattedPhoneNumber = `${formData.countryCode} ${formData.phoneNumber}`;
    const formattedGuardianNumber = `${formData.guardianCountryCode} ${formData.guardianNumber}`;

    setLoading(true);

    try {
      // Upload files
      const marksheetUrl = await uploadFile(files.marksheet, 'marksheets');
      const governmentIdUrl = await uploadFile(files.governmentId, 'government-ids');

      // Submit enrollment
      const { data, error } = await supabase
        .from('student_enrollments')
        .insert({
          student_name: formData.studentName,
          fathers_name: formData.fathersName,
          email: formData.email,
          phone_number: formattedPhoneNumber,
          guardian_number: formattedGuardianNumber,
          address: formData.address,
          course_id: formData.courseId,
          marksheet_url: marksheetUrl,
          government_id_url: governmentIdUrl
        })
        .select()
        .single();

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Application Submitted Successfully!",
        description: "Please check your email for approval updates.",
      });

    } catch (error: any) {
      console.error('Error submitting enrollment:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center shadow-elegant border-ai-accent/20">
          <CardContent className="pt-6 pb-8">
            <CheckCircle className="h-16 w-16 text-lab-green mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-academic mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Please check your email for approval updates. Once approved, you'll receive your student roll number and can access your dashboard.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/student-dashboard")}
                className="w-full academic-gradient text-white"
              >
                Go to Student Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-medical-primary via-ai-accent to-neural-purple py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Button 
            variant="secondary" 
            onClick={() => navigate("/")}
            className="text-ai-accent shadow-sm hover:shadow-md px-4 py-2 transition-all"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Student Enrolment Form
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Begin your journey in AI-powered medical education at DMU
            </p>
          </div>
        </div>
      </div>

      {/* Enrollment Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-elegant border-ai-accent/20">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-academic">Student Enrolment Application</CardTitle>
              <CardDescription className="text-lg">
                Complete all required fields to submit your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name *</Label>
                    <Input
                      id="studentName"
                      value={formData.studentName}
                      onChange={(e) => handleInputChange("studentName", e.target.value)}
                      className="border-ai-accent/30 focus:border-ai-accent"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fathersName">Father's Name *</Label>
                    <Input
                      id="fathersName"
                      value={formData.fathersName}
                      onChange={(e) => handleInputChange("fathersName", e.target.value)}
                      className="border-ai-accent/30 focus:border-ai-accent"
                      placeholder="Enter father's full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-ai-accent/30 focus:border-ai-accent"
                      placeholder="student@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <div className="flex gap-2">
                      <div className="w-1/3">
                        <Select 
                          value={formData.countryCode} 
                          onValueChange={(value) => handleInputChange("countryCode", value)}
                        >
                          <SelectTrigger className="border-ai-accent/30 focus:border-ai-accent">
                            <div className="flex items-center gap-1">
                              <Globe className="h-3.5 w-3.5" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="max-h-[15rem] overflow-y-auto">
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <div className="flex justify-between items-center w-full">
                                  <span>{country.code}</span>
                                  <span className="text-xs text-muted-foreground ml-2">{country.country}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                          className="border-ai-accent/30 focus:border-ai-accent"
                          placeholder="123-456-7890"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardianNumber">Guardian Number *</Label>
                    <div className="flex gap-2">
                      <div className="w-1/3">
                        <Select 
                          value={formData.guardianCountryCode} 
                          onValueChange={(value) => handleInputChange("guardianCountryCode", value)}
                        >
                          <SelectTrigger className="border-ai-accent/30 focus:border-ai-accent">
                            <div className="flex items-center gap-1">
                              <Globe className="h-3.5 w-3.5" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="max-h-[15rem] overflow-y-auto">
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <div className="flex justify-between items-center w-full">
                                  <span>{country.code}</span>
                                  <span className="text-xs text-muted-foreground ml-2">{country.country}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Input
                          id="guardianNumber"
                          value={formData.guardianNumber}
                          onChange={(e) => handleInputChange("guardianNumber", e.target.value)}
                          className="border-ai-accent/30 focus:border-ai-accent"
                          placeholder="123-456-7890"
                          required
                        />
                      </div>
                    </div>
                  </div>
                        <div className="space-y-2">
                    <Label htmlFor="courseId">Course Opted *</Label>
                    <Select onValueChange={(value) => handleInputChange("courseId", value)}>
                      <SelectTrigger className="border-ai-accent/30 focus:border-ai-accent">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Dynamic course list from database */}
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name} ({course.code}) - {course.duration}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="border-ai-accent/30 focus:border-ai-accent min-h-[100px]"
                    placeholder="Enter complete address including city, state, and postal code"
                    required
                  />
                </div>

                {/* Document Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>12th/HS Marksheet Upload (PDF) *</Label>
                    <div className="border-2 border-dashed border-ai-accent/30 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-ai-accent mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        {files.marksheet ? files.marksheet.name : "Click to upload marksheet"}
                      </p>
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={(e) => handleFileChange('marksheet', e.target.files?.[0] || null)}
                        className="hidden"
                        id="marksheet-upload"
                        required
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('marksheet-upload')?.click()}
                        className="border-ai-accent/30"
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>National ID / Passport / Government ID *</Label>
                    <div className="border-2 border-dashed border-ai-accent/30 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-ai-accent mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        {files.governmentId ? files.governmentId.name : "Click to upload ID"}
                      </p>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('governmentId', e.target.files?.[0] || null)}
                        className="hidden"
                        id="government-id-upload"
                        required
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('government-id-upload')?.click()}
                        className="border-ai-accent/30"
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full academic-gradient text-white shadow-campus hover:shadow-elegant transition-all duration-300"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-5 h-5 mr-2" />
                        Submit Enrollment Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};





// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { GraduationCap, Upload, ArrowLeft, CheckCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { Globe, ChevronDown } from "lucide-react";

// // Country codes for phone numbers
// const countryCodes = [
//   { code: "+1", country: "United States & Canada" },
//   { code: "+44", country: "United Kingdom" },
//   { code: "+91", country: "India" },
//   { code: "+61", country: "Australia" },
//   { code: "+86", country: "China" },
//   { code: "+49", country: "Germany" },
//   { code: "+33", country: "France" },
//   { code: "+81", country: "Japan" },
//   { code: "+7", country: "Russia" },
//   { code: "+55", country: "Brazil" },
//   { code: "+27", country: "South Africa" },
//   { code: "+971", country: "United Arab Emirates" },
//   { code: "+966", country: "Saudi Arabia" },
//   { code: "+65", country: "Singapore" },
//   { code: "+852", country: "Hong Kong" },
//   { code: "+82", country: "South Korea" },
//   { code: "+39", country: "Italy" },
//   { code: "+34", country: "Spain" },
//   { code: "+31", country: "Netherlands" },
//   { code: "+90", country: "Turkey" },
//   { code: "+52", country: "Mexico" },
//   { code: "+351", country: "Portugal" },
//   { code: "+353", country: "Ireland" },
//   { code: "+64", country: "New Zealand" },
//   { code: "+60", country: "Malaysia" },
//   { code: "+63", country: "Philippines" },
//   { code: "+66", country: "Thailand" },
//   { code: "+94", country: "Sri Lanka" },
//   { code: "+977", country: "Nepal" },
//   { code: "+880", country: "Bangladesh" },
//   { code: "+92", country: "Pakistan" },
//   { code: "+234", country: "Nigeria" },
//   { code: "+254", country: "Kenya" },
//   { code: "+20", country: "Egypt" },
//   { code: "+962", country: "Jordan" },
//   { code: "+961", country: "Lebanon" },
//   { code: "+968", country: "Oman" },
//   { code: "+973", country: "Bahrain" },
//   { code: "+974", country: "Qatar" },
//   { code: "+965", country: "Kuwait" },
//   { code: "+972", country: "Israel" },
//   { code: "+46", country: "Sweden" },
//   { code: "+47", country: "Norway" },
//   { code: "+45", country: "Denmark" },
//   { code: "+358", country: "Finland" },
//   { code: "+48", country: "Poland" },
//   { code: "+420", country: "Czech Republic" },
//   { code: "+36", country: "Hungary" },
//   { code: "+43", country: "Austria" },
//   { code: "+41", country: "Switzerland" }
// ];

// interface Course {
//   id: string;
//   name: string;
//   code: string;
//   duration: string;
//   description: string;
// }

// export const StudentEnrollment = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
  
//   const [formData, setFormData] = useState({
//     studentName: "",
//     fathersName: "",
//     email: "",
//     countryCode: "+1", // Default country code
//     phoneNumber: "",
//     guardianCountryCode: "+1", // Default country code
//     guardianNumber: "",
//     address: "",
//     courseId: ""
//   });

//   const [files, setFiles] = useState({
//     marksheet: null as File | null,
//     governmentId: null as File | null
//   });

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('courses')
//         .select('*')
//         .order('name');

//       if (error) throw error;
//       setCourses(data || []);
      
//       // Sort country codes alphabetically by country name
//       countryCodes.sort((a, b) => a.country.localeCompare(b.country));
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load courses. Please refresh the page.",
//         variant: "destructive"
//       });
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleFileChange = (type: 'marksheet' | 'governmentId', file: File | null) => {
//     setFiles(prev => ({ ...prev, [type]: file }));
//   };

//   const uploadFile = async (file: File, folder: string) => {
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
//     const { error: uploadError } = await supabase.storage
//       .from('enrollment-documents')
//       .upload(fileName, file);

//     if (uploadError) throw uploadError;
    
//     const { data } = supabase.storage
//       .from('enrollment-documents')
//       .getPublicUrl(fileName);

//     return data.publicUrl;
//   };

//   // Add this to your existing code
// // const sendApprovalEmail = async (email: string, studentName: string) => {
// //   try {
// //     const { data, error } = await supabase.functions.invoke('send-enrollment-email', {
// //       body: JSON.stringify({
// //         email,
// //         studentName
// //       })
// //     });

// //     if (error) throw error;
// //     return data;
// //   } catch (error) {
// //     console.error('Error sending email:', error);
// //     throw error;
// //   }
// // };

// const sendApprovalEmail = async (email: string, name: string) => {
//   try {
//     // Validate inputs
//     if (!email || !name) {
//       throw new Error("Email and name are required");
//     }
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       throw new Error("Invalid email format");
//     }

//     const { data, error } = await supabase.functions.invoke("send-enrollment-email", {
//       body: JSON.stringify({
//         email,
//         name, // Updated to match Edge Function
//         approvedBy: "Admin", // Static value, can be dynamic if needed
//       }),
//     });

//     if (error) {
//       console.error("Supabase function error:", error);
//       throw new Error(`Failed to send email: ${error.message || "Unknown error"}`);
//     }

//     return data;
//   } catch (error: any) {
//     console.error("Error sending approval email:", error);
//     throw new Error(error.message || "Failed to send approval email");
//   }
// };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!files.marksheet || !files.governmentId) {
//       toast({
//         title: "Missing Documents",
//         description: "Please upload both marksheet and government ID documents.",
//         variant: "destructive"
//       });
//       return;
//     }
    
//     // Combine country code with phone number
//     const formattedPhoneNumber = `${formData.countryCode} ${formData.phoneNumber}`;
//     const formattedGuardianNumber = `${formData.guardianCountryCode} ${formData.guardianNumber}`;

//     setLoading(true);

//     try {
//       // Upload files
//       const marksheetUrl = await uploadFile(files.marksheet, 'marksheets');
//       const governmentIdUrl = await uploadFile(files.governmentId, 'government-ids');

//       // Submit enrollment
//       const { data, error } = await supabase
//         .from('student_enrollments')
//         .insert({
//           student_name: formData.studentName,
//           fathers_name: formData.fathersName,
//           email: formData.email,
//           phone_number: formattedPhoneNumber,
//           guardian_number: formattedGuardianNumber,
//           address: formData.address,
//           course_id: formData.courseId,
//           marksheet_url: marksheetUrl,
//           government_id_url: governmentIdUrl
//         })
//         .select()
//         .single();

//       if (error) throw error;
//       // added
//        await sendApprovalEmail(formData.email, formData.studentName);

//       setSubmitted(true);
//       toast({
//         title: "Application Submitted Successfully!",
//         description: "Please check your email for approval updates.",
//       });

//     } catch (error: any) {
//       console.error('Error submitting enrollment:', error);
//       toast({
//         title: "Submission Failed",
//         description: error.message || "Failed to submit application. Please try again.",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10 flex items-center justify-center">
//         <Card className="max-w-md mx-auto text-center shadow-elegant border-ai-accent/20">
//           <CardContent className="pt-6 pb-8">
//             <CheckCircle className="h-16 w-16 text-lab-green mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-academic mb-2">Application Submitted!</h2>
//             <p className="text-muted-foreground mb-6">
//               Please check your email for approval updates. Once approved, you'll receive your student roll number and can access your dashboard.
//             </p>
//             <div className="space-y-3">
//               <Button 
//                 onClick={() => navigate("/student-dashboard")}
//                 className="w-full academic-gradient text-white"
//               >
//                 Go to Student Dashboard
//               </Button>
//               <Button 
//                 variant="outline"
//                 onClick={() => navigate("/")}
//                 className="w-full"
//               >
//                 Return to Home
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10">
//       {/* Header */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-medical-primary via-ai-accent to-neural-purple py-16">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="container mx-auto px-4 relative z-10">
//           <Button 
//             variant="secondary" 
//             onClick={() => navigate("/")}
//             className="text-ai-accent shadow-sm hover:shadow-md px-4 py-2 transition-all"
//             size="lg"
//           >
//             <ArrowLeft className="w-5 h-5 mr-2" />
//             Back to Home
//           </Button>
//           <div className="text-center">
//             <div className="flex justify-center mb-4">
//               <GraduationCap className="h-16 w-16 text-white" />
//             </div>
//             <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
//               Student Enrolment Form
//             </h1>
//             <p className="text-xl text-white/90 max-w-2xl mx-auto">
//               Begin your journey in AI-powered medical education at DMU
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Enrollment Form */}
//       <div className="container mx-auto px-4 py-12">
//         <div className="max-w-4xl mx-auto">
//           <Card className="shadow-elegant border-ai-accent/20">
//             <CardHeader className="text-center pb-8">
//               <CardTitle className="text-3xl text-academic">Student Enrolment Application</CardTitle>
//               <CardDescription className="text-lg">
//                 Complete all required fields to submit your application
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Personal Information */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="studentName">Student Name *</Label>
//                     <Input
//                       id="studentName"
//                       value={formData.studentName}
//                       onChange={(e) => handleInputChange("studentName", e.target.value)}
//                       className="border-ai-accent/30 focus:border-ai-accent"
//                       placeholder="Enter full name"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="fathersName">Father's Name *</Label>
//                     <Input
//                       id="fathersName"
//                       value={formData.fathersName}
//                       onChange={(e) => handleInputChange("fathersName", e.target.value)}
//                       className="border-ai-accent/30 focus:border-ai-accent"
//                       placeholder="Enter father's full name"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email *</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) => handleInputChange("email", e.target.value)}
//                       className="border-ai-accent/30 focus:border-ai-accent"
//                       placeholder="student@example.com"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="phoneNumber">Phone Number *</Label>
//                     <div className="flex gap-2">
//                       <div className="w-1/3">
//                         <Select 
//                           value={formData.countryCode} 
//                           onValueChange={(value) => handleInputChange("countryCode", value)}
//                         >
//                           <SelectTrigger className="border-ai-accent/30 focus:border-ai-accent">
//                             <div className="flex items-center gap-1">
//                               <Globe className="h-3.5 w-3.5" />
//                               <SelectValue />
//                             </div>
//                           </SelectTrigger>
//                           <SelectContent className="max-h-[15rem] overflow-y-auto">
//                             {countryCodes.map((country) => (
//                               <SelectItem key={country.code} value={country.code}>
//                                 <div className="flex justify-between items-center w-full">
//                                   <span>{country.code}</span>
//                                   <span className="text-xs text-muted-foreground ml-2">{country.country}</span>
//                                 </div>
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div className="flex-1">
//                         <Input
//                           id="phoneNumber"
//                           value={formData.phoneNumber}
//                           onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
//                           className="border-ai-accent/30 focus:border-ai-accent"
//                           placeholder="123-456-7890"
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="guardianNumber">Guardian Number *</Label>
//                     <div className="flex gap-2">
//                       <div className="w-1/3">
//                         <Select 
//                           value={formData.guardianCountryCode} 
//                           onValueChange={(value) => handleInputChange("guardianCountryCode", value)}
//                         >
//                           <SelectTrigger className="border-ai-accent/30 focus:border-ai-accent">
//                             <div className="flex items-center gap-1">
//                               <Globe className="h-3.5 w-3.5" />
//                               <SelectValue />
//                             </div>
//                           </SelectTrigger>
//                           <SelectContent className="max-h-[15rem] overflow-y-auto">
//                             {countryCodes.map((country) => (
//                               <SelectItem key={country.code} value={country.code}>
//                                 <div className="flex justify-between items-center w-full">
//                                   <span>{country.code}</span>
//                                   <span className="text-xs text-muted-foreground ml-2">{country.country}</span>
//                                 </div>
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div className="flex-1">
//                         <Input
//                           id="guardianNumber"
//                           value={formData.guardianNumber}
//                           onChange={(e) => handleInputChange("guardianNumber", e.target.value)}
//                           className="border-ai-accent/30 focus:border-ai-accent"
//                           placeholder="123-456-7890"
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>
//                         <div className="space-y-2">
//                     <Label htmlFor="courseId">Course Opted *</Label>
//                     <Select onValueChange={(value) => handleInputChange("courseId", value)}>
//                       <SelectTrigger className="border-ai-accent/30 focus:border-ai-accent">
//                         <SelectValue placeholder="Select a course" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {/* Dynamic course list from database */}
//                         {courses.map((course) => (
//                           <SelectItem key={course.id} value={course.id}>
//                             {course.name} ({course.code}) - {course.duration}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {/* Address */}
//                 <div className="space-y-2">
//                   <Label htmlFor="address">Address *</Label>
//                   <Textarea
//                     id="address"
//                     value={formData.address}
//                     onChange={(e) => handleInputChange("address", e.target.value)}
//                     className="border-ai-accent/30 focus:border-ai-accent min-h-[100px]"
//                     placeholder="Enter complete address including city, state, and postal code"
//                     required
//                   />
//                 </div>

//                 {/* Document Uploads */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label>12th/HS Marksheet Upload (PDF) *</Label>
//                     <div className="border-2 border-dashed border-ai-accent/30 rounded-lg p-6 text-center">
//                       <Upload className="h-8 w-8 text-ai-accent mx-auto mb-2" />
//                       <p className="text-sm text-muted-foreground mb-2">
//                         {files.marksheet ? files.marksheet.name : "Click to upload marksheet"}
//                       </p>
//                       <input 
//                         type="file" 
//                         accept=".pdf"
//                         onChange={(e) => handleFileChange('marksheet', e.target.files?.[0] || null)}
//                         className="hidden"
//                         id="marksheet-upload"
//                         required
//                       />
//                       <Button 
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={() => document.getElementById('marksheet-upload')?.click()}
//                         className="border-ai-accent/30"
//                       >
//                         Choose File
//                       </Button>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label>National ID / Passport / Government ID *</Label>
//                     <div className="border-2 border-dashed border-ai-accent/30 rounded-lg p-6 text-center">
//                       <Upload className="h-8 w-8 text-ai-accent mx-auto mb-2" />
//                       <p className="text-sm text-muted-foreground mb-2">
//                         {files.governmentId ? files.governmentId.name : "Click to upload ID"}
//                       </p>
//                       <input 
//                         type="file" 
//                         accept=".pdf,.jpg,.jpeg,.png"
//                         onChange={(e) => handleFileChange('governmentId', e.target.files?.[0] || null)}
//                         className="hidden"
//                         id="government-id-upload"
//                         required
//                       />
//                       <Button 
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={() => document.getElementById('government-id-upload')?.click()}
//                         className="border-ai-accent/30"
//                       >
//                         Choose File
//                       </Button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="pt-6">
//                   <Button 
//                     type="submit" 
//                     className="w-full academic-gradient text-white shadow-campus hover:shadow-elegant transition-all duration-300"
//                     size="lg"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                         Submitting Application...
//                       </>
//                     ) : (
//                       <>
//                         <GraduationCap className="w-5 h-5 mr-2" />
//                         Submit Enrollment Application
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };