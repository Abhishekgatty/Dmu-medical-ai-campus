// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";
// import { 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardHeader, 
//   CardTitle 
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { 
//   User, 
//   GraduationCap, 
//   MapPin, 
//   Upload, 
//   Edit, 
//   Save, 
//   Facebook, 
//   Twitter, 
//   Instagram, 
//   Linkedin, 
//   Globe, 
//   FileText, 
//   Award, 
//   Pencil, 
//   X, 
//   Plus,
//   Book,
//   Eye
// } from "lucide-react";

// // Define interfaces for type safety
// interface StudentProfileData {
//   id: string;
//   enrollment_id: string;
//   profile_photo_url: string | null;
//   bio: string | null;
//   interests: string[];
//   skills: string[];
//   social_links: Record<string, any>;
//   education_background: string | null;
//   achievements: string[];
//   created_at: string;
//   updated_at: string;
// }

// interface ProfileFormData {
//   bio: string;
//   interests: string[];
//   skills: string[];
//   education_background: string;
//   social_links: {
//     facebook: string;
//     twitter: string;
//     instagram: string;
//     linkedin: string;
//     website: string;
//   };
//   profile_photo_url?: string;
// }

// interface StudentEnrollment {
//   id: string;
//   student_name: string;
//   roll_number: string;
//   email: string;
//   course_id: string;
//   status: string;
//   address: string;
//   phone_number: string;
//   fathers_name: string;
//   course?: {
//     name: string;
//     code: string;
//     duration: string;
//   };
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

// export const StudentProfile = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // State management
//   const [studentEnrollment, setStudentEnrollment] = useState<StudentEnrollment | null>(null);
//   const [profile, setProfile] = useState<StudentProfileData | null>(null);
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [photoUploading, setPhotoUploading] = useState(false);

//   // Form state
//   const [formData, setFormData] = useState<ProfileFormData>({
//     bio: "",
//     interests: [],
//     skills: [],
//     education_background: "",
//     social_links: {
//       facebook: "",
//       twitter: "",
//       instagram: "",
//       linkedin: "",
//       website: ""
//     }
//   });

//   // New interest or skill input
//   const [newInterest, setNewInterest] = useState("");
//   const [newSkill, setNewSkill] = useState("");

//   // Fetch student data and profile on component mount
//   useEffect(() => {
//     fetchStudentData();
//   }, []);

//   const fetchStudentData = async () => {
//     try {
//       setLoading(true);

//       // Get current user
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         navigate('/student-portal');
//         return;
//       }

//       // Get student enrollment
//       const { data: enrollment, error: enrollmentError } = await supabase
//         .from('student_enrollments')
//         .select(`*, courses(name, code, duration)`)
//         .eq('email', user.email)
//         .maybeSingle();

//       if (enrollmentError) throw enrollmentError;

//       if (!enrollment) {
//         toast({
//           title: "Not enrolled",
//           description: "You need to complete enrollment before accessing your profile",
//           variant: "destructive"
//         });
//         navigate('/student-enrollment');
//         return;
//       }

//       // Transform enrollment data to match our interface
//       const transformedEnrollment: StudentEnrollment = {
//         ...enrollment,
//         course: enrollment.courses
//       };

//       setStudentEnrollment(transformedEnrollment);

//       // Fetch student profile
//       const { data: profileData, error: profileError } = await supabase
//         .from('student_profiles')
//         .select('*')
//         .eq('enrollment_id', enrollment.id)
//         .maybeSingle();

//       if (profileError) throw profileError;

//       // If profile exists, set it to state
//       if (profileData) {
//         setProfile(profileData as StudentProfileData);

//         // Parse social links to handle different types
//         const socialLinks = typeof profileData.social_links === 'string' 
//           ? JSON.parse(profileData.social_links) 
//           : profileData.social_links || {};

//         setFormData({
//           bio: profileData.bio || "",
//           interests: profileData.interests || [],
//           skills: profileData.skills || [],
//           education_background: profileData.education_background || "",
//           social_links: {
//             facebook: socialLinks.facebook || "",
//             twitter: socialLinks.twitter || "",
//             instagram: socialLinks.instagram || "",
//             linkedin: socialLinks.linkedin || "",
//             website: socialLinks.website || ""
//           }
//         });
//       }

//       // Fetch student documents
//       await fetchDocuments(enrollment.id);

//       setLoading(false);
//     } catch (error: any) {
//       console.error('Error fetching student data:', error);
//       toast({
//         title: "Error",
//         description: error.message || "Failed to load profile data",
//         variant: "destructive"
//       });
//       setLoading(false);
//     }
//   };

//   const fetchDocuments = async (enrollmentId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('student_documents')
//         .select(`
//           *,
//           document_categories (name)
//         `)
//         .eq('enrollment_id', enrollmentId)
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
//     } catch (error: any) {
//       console.error('Error fetching documents:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load documents",
//         variant: "destructive"
//       });
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;

//     if (name.startsWith('social_links.')) {
//       const socialKey = name.split('.')[1];
//       setFormData(prev => ({
//         ...prev,
//         social_links: {
//           ...prev.social_links,
//           [socialKey]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const addInterest = () => {
//     if (!newInterest.trim()) return;
//     setFormData(prev => ({
//       ...prev,
//       interests: [...prev.interests, newInterest.trim()]
//     }));
//     setNewInterest("");
//   };

//   const removeInterest = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       interests: prev.interests.filter((_, i) => i !== index)
//     }));
//   };

//   const addSkill = () => {
//     if (!newSkill.trim()) return;
//     setFormData(prev => ({
//       ...prev,
//       skills: [...prev.skills, newSkill.trim()]
//     }));
//     setNewSkill("");
//   };

//   const removeSkill = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       skills: prev.skills.filter((_, i) => i !== index)
//     }));
//   };

//   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !studentEnrollment) return;

//     try {
//       setPhotoUploading(true);

//       // Get user info for path creation
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       // Create path for the image
//       const fileExt = file.name.split('.').pop();
//       const filePath = `${user.id}/${Date.now()}.${fileExt}`;

//       // Upload to storage
//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from('student-profiles')
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       // Get public URL
//       const { data: { publicUrl } } = supabase.storage
//         .from('student-profiles')
//         .getPublicUrl(filePath);

//       // Update profile with new photo URL
//       const updatedFormData = {
//         ...formData,
//         profile_photo_url: publicUrl
//       };

//       await saveProfile(updatedFormData);

//       toast({
//         title: "Success",
//         description: "Profile photo updated successfully",
//       });
//     } catch (error: any) {
//       console.error('Error uploading photo:', error);
//       toast({
//         title: "Upload Failed",
//         description: error.message || "Failed to upload profile photo",
//         variant: "destructive"
//       });
//     } finally {
//       setPhotoUploading(false);
//     }
//   };

//   const saveProfile = async (data = formData) => {
//     if (!studentEnrollment) return;

//     try {
//       const profileData = {
//         enrollment_id: studentEnrollment.id,
//         bio: data.bio,
//         interests: data.interests,
//         skills: data.skills,
//         social_links: data.social_links,
//         education_background: data.education_background,
//         profile_photo_url: data.profile_photo_url || profile?.profile_photo_url
//       };

//       // If profile already exists, update it
//       if (profile) {
//         const { error } = await supabase
//           .from('student_profiles')
//           .update(profileData)
//           .eq('id', profile.id);

//         if (error) throw error;
//       } 
//       // Otherwise create new profile
//       else {
//         const { data: { user } } = await supabase.auth.getUser();
//         if (!user) return;

//         const { error } = await supabase
//           .from('student_profiles')
//           .insert({
//             ...profileData,
//             id: user.id
//           });

//         if (error) throw error;
//       }

//       // Refresh profile data
//       await fetchStudentData();
//       setEditing(false);

//       toast({
//         title: "Success",
//         description: "Profile updated successfully",
//       });
//     } catch (error: any) {
//       console.error('Error saving profile:', error);
//       toast({
//         title: "Error",
//         description: error.message || "Failed to save profile",
//         variant: "destructive"
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ai-accent mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!studentEnrollment) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10 flex items-center justify-center">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle className="text-center text-2xl">Not Enrolled</CardTitle>
//             <CardDescription className="text-center">
//               You need to complete enrollment before accessing your profile
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="flex justify-center">
//             <Button onClick={() => navigate('/student-enrollment')}>
//               Go to Enrollment
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-medical-primary via-ai-accent to-neural-purple py-8">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between">
//             <div className="text-white">
//               <h1 className="text-3xl font-bold">Student Profile</h1>
//               <p className="text-white/80">Manage your student profile</p>
//             </div>
//             <Button variant="outline" onClick={() => navigate('/student-dashboard')} className="text-white border-white hover:bg-white/20">
//               Dashboard
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left sidebar - Profile summary */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card className="shadow-elegant border-ai-accent/20">
//               <CardHeader className="text-center pb-2">
//                 <div className="relative mx-auto">
//                   <Avatar className="w-32 h-32 mx-auto">
//                     <AvatarImage src={profile?.profile_photo_url || ""} />
//                     <AvatarFallback className="text-4xl bg-medical-primary/20">
//                       {studentEnrollment.student_name.charAt(0)}
//                     </AvatarFallback>
//                   </Avatar>

//                   <label htmlFor="profile-photo" className="absolute bottom-0 right-1/4 bg-medical-primary text-white p-2 rounded-full cursor-pointer hover:bg-medical-primary/80 transition-colors">
//                     <Upload size={16} />
//                     <input 
//                       type="file" 
//                       id="profile-photo" 
//                       className="hidden" 
//                       accept="image/*"
//                       onChange={handlePhotoUpload}
//                       disabled={photoUploading}
//                     />
//                   </label>
//                 </div>

//                 <CardTitle className="mt-4 text-2xl">
//                   {studentEnrollment.student_name}
//                 </CardTitle>
//                 <CardDescription>
//                   {studentEnrollment.roll_number}
//                 </CardDescription>

//                 <div className="flex justify-center mt-2">
//                   <Badge variant="outline" className="bg-medical-primary/10">
//                     {studentEnrollment.course?.name || "Student"}
//                   </Badge>
//                 </div>
//               </CardHeader>

//               <CardContent className="pt-2">
//                 <div className="space-y-4 mt-2">
//                   <div className="flex items-center gap-2 text-sm">
//                     <GraduationCap size={16} className="text-medical-primary" />
//                     <span>
//                       {studentEnrollment.course?.name} ({studentEnrollment.course?.code})
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-2 text-sm">
//                     <MapPin size={16} className="text-medical-primary" />
//                     <span>{studentEnrollment.address}</span>
//                   </div>

//                   <div className="flex items-center gap-2 text-sm">
//                     <User size={16} className="text-medical-primary" />
//                     <span>{studentEnrollment.email}</span>
//                   </div>

//                   {profile?.social_links && (
//                     <div className="flex justify-center space-x-3 mt-4">
//                       {profile.social_links.facebook && (
//                         <a href={profile.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
//                           <Facebook size={18} />
//                         </a>
//                       )}
//                       {profile.social_links.twitter && (
//                         <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
//                           <Twitter size={18} />
//                         </a>
//                       )}
//                       {profile.social_links.instagram && (
//                         <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
//                           <Instagram size={18} />
//                         </a>
//                       )}
//                       {profile.social_links.linkedin && (
//                         <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
//                           <Linkedin size={18} />
//                         </a>
//                       )}
//                       {profile.social_links.website && (
//                         <a href={profile.social_links.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
//                           <Globe size={18} />
//                         </a>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Bio Card - Only show if not editing */}
//             {!editing && profile?.bio && (
//               <Card className="shadow-elegant border-ai-accent/20">
//                 <CardHeader>
//                   <CardTitle className="text-lg">About Me</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-sm whitespace-pre-line">{profile.bio}</p>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Skills & Interests - Only show if not editing */}
//             {!editing && profile && (
//               <Card className="shadow-elegant border-ai-accent/20">
//                 <CardHeader>
//                   <CardTitle className="text-lg">Skills & Interests</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {profile.skills?.length > 0 && (
//                     <div className="mb-4">
//                       <h4 className="text-sm font-medium mb-2">Skills</h4>
//                       <div className="flex flex-wrap gap-2">
//                         {profile.skills.map((skill, index) => (
//                           <Badge key={index} variant="secondary">
//                             {skill}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {profile.interests?.length > 0 && (
//                     <div>
//                       <h4 className="text-sm font-medium mb-2">Interests</h4>
//                       <div className="flex flex-wrap gap-2">
//                         {profile.interests.map((interest, index) => (
//                           <Badge key={index} variant="outline">
//                             {interest}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Main content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Edit Profile Form */}
//             {editing ? (
//               <Card className="shadow-elegant border-ai-accent/20">
//                 <CardHeader className="pb-2">
//                   <div className="flex justify-between items-center">
//                     <CardTitle>Edit Profile</CardTitle>
//                     <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
//                       Cancel
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <Label htmlFor="bio">About Me</Label>
//                       <Textarea
//                         id="bio"
//                         name="bio"
//                         placeholder="Tell us about yourself"
//                         value={formData.bio}
//                         onChange={handleInputChange}
//                         className="min-h-[120px]"
//                       />
//                     </div>

//                     <div>
//                       <Label htmlFor="education_background">Education Background</Label>
//                       <Textarea
//                         id="education_background"
//                         name="education_background"
//                         placeholder="Share your educational background"
//                         value={formData.education_background}
//                         onChange={handleInputChange}
//                       />
//                     </div>

//                     <div>
//                       <Label>Interests</Label>
//                       <div className="flex flex-wrap gap-2 mb-2">
//                         {formData.interests.map((interest, index) => (
//                           <Badge key={index} variant="outline" className="px-2 py-1">
//                             {interest}
//                             <X
//                               size={14}
//                               className="ml-1 cursor-pointer"
//                               onClick={() => removeInterest(index)}
//                             />
//                           </Badge>
//                         ))}
//                       </div>
//                       <div className="flex gap-2">
//                         <Input
//                           placeholder="Add an interest"
//                           value={newInterest}
//                           onChange={(e) => setNewInterest(e.target.value)}
//                           onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
//                         />
//                         <Button type="button" size="sm" onClick={addInterest}>
//                           <Plus size={16} />
//                         </Button>
//                       </div>
//                     </div>

//                     <div>
//                       <Label>Skills</Label>
//                       <div className="flex flex-wrap gap-2 mb-2">
//                         {formData.skills.map((skill, index) => (
//                           <Badge key={index} variant="secondary" className="px-2 py-1">
//                             {skill}
//                             <X
//                               size={14}
//                               className="ml-1 cursor-pointer"
//                               onClick={() => removeSkill(index)}
//                             />
//                           </Badge>
//                         ))}
//                       </div>
//                       <div className="flex gap-2">
//                         <Input
//                           placeholder="Add a skill"
//                           value={newSkill}
//                           onChange={(e) => setNewSkill(e.target.value)}
//                           onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
//                         />
//                         <Button type="button" size="sm" onClick={addSkill}>
//                           <Plus size={16} />
//                         </Button>
//                       </div>
//                     </div>

//                     <div>
//                       <Label>Social Links</Label>
//                       <div className="space-y-3 mt-2">
//                         <div className="flex items-center gap-2">
//                           <Facebook size={18} className="text-blue-600" />
//                           <Input
//                             name="social_links.facebook"
//                             placeholder="Facebook URL"
//                             value={formData.social_links.facebook}
//                             onChange={handleInputChange}
//                           />
//                         </div>

//                         <div className="flex items-center gap-2">
//                           <Twitter size={18} className="text-blue-400" />
//                           <Input
//                             name="social_links.twitter"
//                             placeholder="Twitter URL"
//                             value={formData.social_links.twitter}
//                             onChange={handleInputChange}
//                           />
//                         </div>

//                         <div className="flex items-center gap-2">
//                           <Instagram size={18} className="text-pink-600" />
//                           <Input
//                             name="social_links.instagram"
//                             placeholder="Instagram URL"
//                             value={formData.social_links.instagram}
//                             onChange={handleInputChange}
//                           />
//                         </div>

//                         <div className="flex items-center gap-2">
//                           <Linkedin size={18} className="text-blue-700" />
//                           <Input
//                             name="social_links.linkedin"
//                             placeholder="LinkedIn URL"
//                             value={formData.social_links.linkedin}
//                             onChange={handleInputChange}
//                           />
//                         </div>

//                         <div className="flex items-center gap-2">
//                           <Globe size={18} />
//                           <Input
//                             name="social_links.website"
//                             placeholder="Personal Website URL"
//                             value={formData.social_links.website}
//                             onChange={handleInputChange}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="pt-4">
//                       <Button 
//                         className="w-full"
//                         onClick={() => saveProfile()}
//                       >
//                         <Save size={16} className="mr-2" />
//                         Save Profile
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ) : (
//               <Card className="shadow-elegant border-ai-accent/20">
//                 <CardHeader className="pb-2">
//                   <div className="flex justify-between items-center">
//                     <CardTitle>Profile Details</CardTitle>
//                     <Button 
//                       variant="outline" 
//                       size="sm" 
//                       onClick={() => setEditing(true)}
//                     >
//                       <Edit size={16} className="mr-2" />
//                       Edit Profile
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   {!profile ? (
//                     <div className="text-center py-8">
//                       <p className="text-muted-foreground mb-4">
//                         Complete your profile to showcase your information
//                       </p>
//                       <Button onClick={() => setEditing(true)}>
//                         Create Profile
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="space-y-6">
//                       {/* Education Background */}
//                       {profile.education_background && (
//                         <div>
//                           <h3 className="text-lg font-medium flex items-center">
//                             <Book size={18} className="mr-2 text-medical-primary" />
//                             Education Background
//                           </h3>
//                           <p className="mt-2 text-sm whitespace-pre-line">
//                             {profile.education_background}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {/* Tabs for Documents, Works and Achievements */}
//             <Card className="shadow-elegant border-ai-accent/20">
//               <CardHeader className="pb-2">
//                 <CardTitle>Academic Records</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Tabs defaultValue="documents" className="w-full">
//                   <TabsList className="grid w-full grid-cols-3">
//                     <TabsTrigger value="documents">Documents</TabsTrigger>
//                     <TabsTrigger value="works">Works</TabsTrigger>
//                     <TabsTrigger value="achievements">Achievements</TabsTrigger>
//                   </TabsList>

//                   <TabsContent value="documents" className="space-y-4">
//                     {documents.length > 0 ? (
//                       <div className="grid gap-3">
//                         {documents.map((doc) => (
//                           <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
//                             <div className="flex items-center space-x-3">
//                               <FileText className="h-5 w-5 text-ai-accent" />
//                               <div>
//                                 <p className="font-medium">{doc.title}</p>
//                                 <p className="text-sm text-muted-foreground">
//                                   {doc.category_name} | {new Date(doc.created_at).toLocaleDateString()}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="flex items-center">
//                               {doc.is_verified && (
//                                 <Badge variant="secondary" className="mr-2">Verified</Badge>
//                               )}
//                               <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
//                                 <Button size="sm" variant="ghost">
//                                   <Eye className="h-4 w-4" />
//                                 </Button>
//                               </a>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                         <p>No documents uploaded yet</p>
//                       </div>
//                     )}
//                   </TabsContent>

//                   <TabsContent value="works" className="space-y-4">
//                     <div className="text-center py-8 text-muted-foreground">
//                       <Pencil className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                       <p>No works submitted yet</p>
//                     </div>
//                   </TabsContent>

//                   <TabsContent value="achievements" className="space-y-4">
//                     {profile?.achievements?.length > 0 ? (
//                       <div className="grid gap-3">
//                         {profile.achievements.map((achievement, index) => (
//                           <div key={index} className="flex items-center p-3 border rounded-lg">
//                             <Award className="h-5 w-5 text-ai-accent mr-3" />
//                             <span>{achievement}</span>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                         <p>No achievements added yet</p>
//                       </div>
//                     )}
//                   </TabsContent>
//                 </Tabs>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentProfile;





import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  GraduationCap,
  MapPin,
  Upload,
  Edit,
  Save,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  FileText,
  Award,
  Pencil,
  X,
  Plus,
  Book,
  Eye
} from "lucide-react";

// Define interfaces for type safety
interface StudentProfileData {
  id: string;
  enrollment_id: string;
  profile_photo_url: string | null;
  bio: string | null;
  interests: string[];
  skills: string[];
  social_links: Record<string, any>;
  education_background: string | null;
  achievements: string[];
  created_at: string;
  updated_at: string;
  name: string | null;
  roll_number: string | null;
  course_id: string | null;
}

interface ProfileFormData {
  bio: string;
  interests: string[];
  skills: string[];
  education_background: string;
  social_links: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    website: string;

  };
  name: string;
  profile_photo_url?: string;
  roll_number: string;
  course_id: string;
}

interface StudentEnrollment {
  id: string;
  student_name: string;
  roll_number: string;
  email: string;
  course_id: string;
  status: string;
  address: string;
  phone_number: string;
  fathers_name: string;
  course?: {
    name: string;
    code: string;
    duration: string;
  };
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

export const StudentProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State management
  const [studentEnrollment, setStudentEnrollment] = useState<StudentEnrollment | null>(null);
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ProfileFormData>({
    bio: "",
    interests: [],
    skills: [],
    education_background: "",
    social_links: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      website: "",
    },
    name: "",

    course_id: "",
    roll_number: "",
  });

  // New interest or skill input
  const [newInterest, setNewInterest] = useState("");
  const [newSkill, setNewSkill] = useState("");






  // Fetch student data and profile on component mount
  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/student-portal');
        return;
      }

      // Get student enrollment
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('student_enrollments')
        .select(`*, courses(name, code, duration)`)
        .eq('email', user.email)
        .maybeSingle();

      if (enrollmentError) throw enrollmentError;

      if (!enrollment) {
        toast({
          title: "Not enrolled",
          description: "You need to complete enrollment before accessing your profile",
          variant: "destructive"
        });
        navigate('/student-enrollment');
        return;
      }

      // Transform enrollment data to match our interface
      const transformedEnrollment: StudentEnrollment = {
        ...enrollment,
        course: enrollment.courses
      };

      setStudentEnrollment(transformedEnrollment);

      // Fetch student profile
      const { data: profileData, error: profileError } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('enrollment_id', enrollment.id)
        .maybeSingle();

      if (profileError) throw profileError;

      // If profile exists, set it to state
      if (profileData) {
        setProfile(profileData as StudentProfileData);

        // Parse social links to handle different types
        const socialLinks = typeof profileData.social_links === 'string'
          ? JSON.parse(profileData.social_links)
          : profileData.social_links || {};


       

       

          setFormData({
            bio: profileData.bio || "",
            interests: profileData.interests || [],
            skills: profileData.skills || [],
            education_background: profileData.education_background || "",
            social_links: {
              facebook: socialLinks.facebook || "",
              twitter: socialLinks.twitter || "",
              instagram: socialLinks.instagram || "",
              linkedin: socialLinks.linkedin || "",
              website: socialLinks.website || "",
            },
            name: transformedEnrollment.student_name || "",
            course_id: transformedEnrollment.course_id || "",
            roll_number: transformedEnrollment.roll_number || "",
          });
      }

      // Fetch student documents
      await fetchDocuments(enrollment.id);

      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching student data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load profile data",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const fetchDocuments = async (enrollmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('student_documents')
        .select(`
          *,
          document_categories (name)
        `)
        .eq('enrollment_id', enrollmentId)
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
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('social_links.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [socialKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addInterest = () => {
    if (!newInterest.trim()) return;
    setFormData(prev => ({
      ...prev,
      interests: [...prev.interests, newInterest.trim()]
    }));
    setNewInterest("");
  };

  const removeInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {

    if (!newSkill.trim()) return;



    setFormData(prev => {
      const updatedSkills = [...prev.skills, newSkill.trim()];


      return {
        ...prev,
        skills: updatedSkills
      };
    });

    setNewSkill(""); // clear the input field
  };



  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !studentEnrollment) return;

    try {
      setPhotoUploading(true);

      // Get user info for path creation
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create path for the image
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('student-profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('student-profiles')
        .getPublicUrl(filePath);

      // Update profile with new photo URL
      const updatedFormData = {
        ...formData,
        profile_photo_url: publicUrl
      };

      await saveProfile(updatedFormData);

      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload profile photo",
        variant: "destructive"
      });
    } finally {
      setPhotoUploading(false);
    }
  };

  const saveProfile = async (data = formData) => {
    if (!studentEnrollment) return;

    try {
      const profileData = {
        enrollment_id: studentEnrollment.id,
        bio: data.bio,
        interests: data.interests,
        skills: data.skills,
        social_links: data.social_links,
        education_background: data.education_background,
        profile_photo_url: data.profile_photo_url || profile?.profile_photo_url,
        name: data.name,
        roll_number: data.roll_number,
        // course_name:data.course_name,

      };

      // If profile already exists, update it
      if (profile) {
        const { error } = await supabase
          .from('student_profiles')
          .update(profileData)
          .eq('id', profile.id);

        if (error) throw error;
      }
      // Otherwise create new profile
      else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
          .from('student_profiles')
          .insert({
            ...profileData,
            id: user.id
          });

        if (error) throw error;
      }

      // Refresh profile data
      await fetchStudentData();
      setEditing(false);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ai-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!studentEnrollment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Not Enrolled</CardTitle>
            <CardDescription className="text-center">
              You need to complete enrollment before accessing your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/student-enrollment')}>
              Go to Enrollment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-medical-primary via-ai-accent to-neural-purple py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-3xl font-bold">Student Profile</h1>
              <p className="text-white/80">Manage your student profile</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/student-dashboard')} className="text-white border-white hover:bg-white/20">
              Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar - Profile summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-elegant border-ai-accent/20">



              <CardHeader className="text-center pb-2">
                <div className="relative mx-auto">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage src={profile?.profile_photo_url || ""} />
                    <AvatarFallback className="text-4xl bg-medical-primary/20">
                      {studentEnrollment.student_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <label htmlFor="profile-photo" className="absolute bottom-0 right-1/4 bg-medical-primary text-white p-2 rounded-full cursor-pointer hover:bg-medical-primary/80 transition-colors">
                    <Upload size={16} />
                    <input
                      type="file"
                      id="profile-photo"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={photoUploading}
                    />
                  </label>
                </div>

                <CardTitle className="mt-4 text-2xl">
                  {studentEnrollment.student_name}
                </CardTitle>
                <CardDescription>
                  {studentEnrollment.roll_number}
                </CardDescription>

                <div className="flex justify-center mt-2">
                  <Badge variant="outline" className="bg-medical-primary/10">
                    {studentEnrollment.course?.name || "Student"}
                  </Badge>
                </div>

              </CardHeader>

              <CardContent className="pt-2">
                <div className="space-y-4 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap size={16} className="text-medical-primary" />
                    <span>
                      {studentEnrollment.course?.name} ({studentEnrollment.course?.code})
                    </span>
                  </div>


                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-medical-primary" />
                    <span>{studentEnrollment.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <User size={16} className="text-medical-primary" />
                    <span>{studentEnrollment.email}</span>
                  </div>


                  {profile?.social_links && (
                    <div className="flex justify-center space-x-3 mt-4">
                      {profile.social_links.facebook && (
                        <a href={profile.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          <Facebook size={18} />
                        </a>
                      )}
                      {profile.social_links.twitter && (
                        <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                          <Twitter size={18} />
                        </a>
                      )}
                      {profile.social_links.instagram && (
                        <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                          <Instagram size={18} />
                        </a>
                      )}
                      {profile.social_links.linkedin && (
                        <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                          <Linkedin size={18} />
                        </a>
                      )}
                      {profile.social_links.website && (
                        <a href={profile.social_links.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                          <Globe size={18} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bio Card - Only show if not editing */}
            {!editing && profile?.bio && (
              <Card className="shadow-elegant border-ai-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg">About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Skills & Interests - Only show if not editing */}
            {!editing && profile && (
              <Card className="shadow-elegant border-ai-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg">Skillss & Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.skills?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => {
                          console.log("🎯 Rendering skill:", skill);
                          return (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}


                  {profile.interests?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, index) => (
                          <Badge key={index} variant="outline">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile Form */}
            {editing ? (
              <Card className="shadow-elegant border-ai-accent/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Edit Profile</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bio">About Me</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about yourself"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="min-h-[120px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="education_background">Education Background</Label>
                      <Textarea
                        id="education_background"
                        name="education_background"
                        placeholder="Share your educational background"
                        value={formData.education_background}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label>Interests</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.interests.map((interest, index) => (
                          <Badge key={index} variant="outline" className="px-2 py-1">
                            {interest}
                            <X
                              size={14}
                              className="ml-1 cursor-pointer"
                              onClick={() => removeInterest(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add an interest"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                        />
                        <Button type="button" size="sm" onClick={addInterest}>
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Skills</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="px-2 py-1">
                            {skill}
                            <X
                              size={14}
                              className="ml-1 cursor-pointer"
                              onClick={() => removeSkill(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill"
                          value={newSkill}
                          onChange={(e) => {
                            console.log("⌨️ Typing skillmmmmmm:", e.target.value);
                            setNewSkill(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              console.log("⏎ Enter key pressed – adding skill:", newSkill);
                              addSkill();
                            }
                          }}
                        />

                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {

                            addSkill();
                          }}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>

                    </div>

                    <div>
                      <Label>Social Links</Label>
                      <div className="space-y-3 mt-2">
                        <div className="flex items-center gap-2">
                          <Facebook size={18} className="text-blue-600" />
                          <Input
                            name="social_links.facebook"
                            placeholder="Facebook URL"
                            value={formData.social_links.facebook}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Twitter size={18} className="text-blue-400" />
                          <Input
                            name="social_links.twitter"
                            placeholder="Twitter URL"
                            value={formData.social_links.twitter}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Instagram size={18} className="text-pink-600" />
                          <Input
                            name="social_links.instagram"
                            placeholder="Instagram URL"
                            value={formData.social_links.instagram}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Linkedin size={18} className="text-blue-700" />
                          <Input
                            name="social_links.linkedin"
                            placeholder="LinkedIn URL"
                            value={formData.social_links.linkedin}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Globe size={18} />
                          <Input
                            name="social_links.website"
                            placeholder="Personal Website URL"
                            value={formData.social_links.website}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        className="w-full"
                        onClick={() => saveProfile()}
                      >
                        <Save size={16} className="mr-2" />
                        Save Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-elegant border-ai-accent/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Profile Details</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                    >
                      <Edit size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {!profile ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Complete your profile to showcase your information
                      </p>
                      <Button onClick={() => setEditing(true)}>
                        Create Profile
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Education Background */}
                      {profile.education_background && (
                        <div>
                          <h3 className="text-lg font-medium flex items-center">
                            <Book size={18} className="mr-2 text-medical-primary" />
                            Education Background
                          </h3>
                          <p className="mt-2 text-sm whitespace-pre-line">
                            {profile.education_background}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tabs for Documents, Works and Achievements */}
            <Card className="shadow-elegant border-ai-accent/20">
              <CardHeader className="pb-2">
                <CardTitle>Academic Records</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="documents" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="works">Works</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  </TabsList>

                  <TabsContent value="documents" className="space-y-4">
                    {documents.length > 0 ? (
                      <div className="grid gap-3">
                        {documents.map((doc) => (
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
                            <div className="flex items-center">
                              {doc.is_verified && (
                                <Badge variant="secondary" className="mr-2">Verified</Badge>
                              )}
                              <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No documents uploaded yet</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="works" className="space-y-4">
                    <div className="text-center py-8 text-muted-foreground">
                      <Pencil className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No works submitted yet</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="achievements" className="space-y-4">
                    {profile?.achievements?.length > 0 ? (
                      <div className="grid gap-3">
                        {profile.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center p-3 border rounded-lg">
                            <Award className="h-5 w-5 text-ai-accent mr-3" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No achievements added yet</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;





