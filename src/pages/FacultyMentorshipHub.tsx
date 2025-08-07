import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  User, 
  Star, 
  MessageCircle, 
  Calendar,
  ArrowLeft,
  Search,
  Filter,
  BookOpen,
  Brain,
  Users,
  Clock,
  Award,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  Target
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Faculty {
  id: string;
  name: string;
  specialty: string;
  experience_years: number;
  country: string;
  city: string;
  bio: string;
  qualifications: string[];
  languages: string[];
  hourly_rate: number;
  rating: number;
  total_students: number;
  research_interests: string[];
  availability_status: 'available' | 'busy' | 'unavailable';
  profile_image?: string;
}

interface MentorshipRequest {
  id: string;
  faculty_id: string;
  faculty_name: string;
  student_message: string;
  purpose: string;
  preferred_meeting_type: 'virtual' | 'in-person' | 'flexible';
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

interface ActiveMentorship {
  id: string;
  faculty_id: string;
  faculty_name: string;
  start_date: string;
  focus_areas: string[];
  meeting_frequency: string;
  progress_notes: string[];
  next_meeting?: string;
  status: 'active' | 'completed' | 'paused';
}

export const FacultyMentorshipHub = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([]);
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [activeMentorships, setActiveMentorships] = useState<ActiveMentorship[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    message: "",
    purpose: "",
    meeting_type: "virtual" as const
  });

  useEffect(() => {
    fetchFacultyData();
    fetchMentorshipData();
  }, []);

  useEffect(() => {
    filterFaculty();
  }, [searchTerm, selectedSpecialty, faculty]);

  const fetchFacultyData = async () => {
    try {
      // Mock faculty data - in real app, fetch from Supabase
      const mockFaculty: Faculty[] = [
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          experience_years: 15,
          country: 'United States',
          city: 'Boston',
          bio: 'Leading cardiologist with expertise in interventional cardiology and heart failure management.',
          qualifications: ['MD', 'FACC', 'PhD in Cardiovascular Medicine'],
          languages: ['English', 'Spanish'],
          hourly_rate: 150,
          rating: 4.8,
          total_students: 25,
          research_interests: ['Heart Failure', 'Cardiac Imaging', 'Preventive Cardiology'],
          availability_status: 'available'
        },
        {
          id: '2',
          name: 'Prof. Michael Chen',
          specialty: 'Neurology',
          experience_years: 20,
          country: 'Canada',
          city: 'Toronto',
          bio: 'Neurology professor specializing in neuroimaging and neurodegenerative diseases.',
          qualifications: ['MD', 'PhD', 'FRCPC'],
          languages: ['English', 'Mandarin'],
          hourly_rate: 180,
          rating: 4.9,
          total_students: 18,
          research_interests: ['Alzheimer\'s Disease', 'Brain Imaging', 'Cognitive Neuroscience'],
          availability_status: 'available'
        },
        {
          id: '3',
          name: 'Dr. Elena Rodriguez',
          specialty: 'Pediatrics',
          experience_years: 12,
          country: 'Spain',
          city: 'Madrid',
          bio: 'Pediatric specialist with focus on child development and pediatric emergency medicine.',
          qualifications: ['MD', 'Pediatric Emergency Medicine Certification'],
          languages: ['Spanish', 'English', 'French'],
          hourly_rate: 120,
          rating: 4.7,
          total_students: 30,
          research_interests: ['Child Development', 'Pediatric Emergency Care', 'Vaccination Programs'],
          availability_status: 'busy'
        }
      ];

      setFaculty(mockFaculty);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching faculty:', error);
      toast({
        title: "Error",
        description: "Failed to load faculty data",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const fetchMentorshipData = async () => {
    try {
      // Mock mentorship data
      const mockRequests: MentorshipRequest[] = [
        {
          id: '1',
          faculty_id: '1',
          faculty_name: 'Dr. Sarah Johnson',
          student_message: 'I would like guidance on cardiac research methodology.',
          purpose: 'Research Guidance',
          preferred_meeting_type: 'virtual',
          status: 'pending',
          created_at: '2025-07-25T10:00:00Z'
        }
      ];

      const mockActiveMentorships: ActiveMentorship[] = [
        {
          id: '1',
          faculty_id: '2',
          faculty_name: 'Prof. Michael Chen',
          start_date: '2025-06-01',
          focus_areas: ['Neuroimaging Techniques', 'Research Methods'],
          meeting_frequency: 'Weekly',
          progress_notes: [
            'Discussed basics of MRI interpretation',
            'Reviewed current research papers in neurodegenerative diseases'
          ],
          next_meeting: '2025-08-05T14:00:00Z',
          status: 'active'
        }
      ];

      setRequests(mockRequests);
      setActiveMentorships(mockActiveMentorships);
    } catch (error: any) {
      console.error('Error fetching mentorship data:', error);
    }
  };

  const filterFaculty = () => {
    let filtered = faculty;

    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.research_interests.some(interest => 
          interest.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(f => f.specialty === selectedSpecialty);
    }

    setFilteredFaculty(filtered);
  };

  const handleRequestMentorship = async () => {
    if (!selectedFaculty) return;

    try {
      // In real app, save to Supabase
      const newRequest: MentorshipRequest = {
        id: Date.now().toString(),
        faculty_id: selectedFaculty.id,
        faculty_name: selectedFaculty.name,
        student_message: requestForm.message,
        purpose: requestForm.purpose,
        preferred_meeting_type: requestForm.meeting_type,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      setRequests(prev => [...prev, newRequest]);
      setRequestDialogOpen(false);
      setRequestForm({ message: "", purpose: "", meeting_type: "virtual" });
      
      toast({
        title: "Request Sent",
        description: `Your mentorship request has been sent to ${selectedFaculty.name}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send mentorship request",
        variant: "destructive"
      });
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50';
      case 'busy': return 'text-yellow-600 bg-yellow-50';
      case 'unavailable': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const specialties = [...new Set(faculty.map(f => f.specialty))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ai-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading mentorship hub...</p>
        </div>
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
              <div className="flex items-center space-x-3 mb-2">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/student-dashboard")}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-3xl font-bold">Faculty Mentorship Hub</h1>
              </div>
              <p className="text-white/80">Connect with expert faculty for personalized guidance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Faculty</TabsTrigger>
            <TabsTrigger value="requests">My Requests ({requests.length})</TabsTrigger>
            <TabsTrigger value="active">Active Mentorships ({activeMentorships.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filter */}
            <Card className="shadow-elegant border-ai-accent/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search faculty by name, specialty, or research interests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ai-accent"
                    >
                      <option value="">All Specialties</option>
                      {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Faculty Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFaculty.map((facultyMember) => (
                <Card key={facultyMember.id} className="shadow-elegant border-ai-accent/20 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={facultyMember.profile_image} />
                        <AvatarFallback className="bg-medical-primary/20 text-medical-primary">
                          {facultyMember.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{facultyMember.name}</CardTitle>
                        <CardDescription>{facultyMember.specialty}</CardDescription>
                        <div className="flex items-center mt-2">
                          <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">
                            {facultyMember.city}, {facultyMember.country}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={getAvailabilityColor(facultyMember.availability_status)}>
                        {facultyMember.availability_status}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{facultyMember.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Brain className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{facultyMember.experience_years} years experience</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{facultyMember.total_students} students mentored</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Research Interests:</p>
                      <div className="flex flex-wrap gap-1">
                        {facultyMember.research_interests.slice(0, 2).map((interest, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {facultyMember.research_interests.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{facultyMember.research_interests.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => {
                        setSelectedFaculty(facultyMember);
                        setRequestDialogOpen(true);
                      }}
                      disabled={facultyMember.availability_status === 'unavailable'}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Request Mentorship
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card className="shadow-elegant border-ai-accent/20">
              <CardHeader>
                <CardTitle>Mentorship Requests</CardTitle>
                <CardDescription>Track your pending and processed mentorship requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No mentorship requests yet</p>
                      <p className="text-sm text-muted-foreground">Browse faculty to send your first request</p>
                    </div>
                  ) : (
                    requests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{request.faculty_name}</h3>
                            <p className="text-sm text-muted-foreground">{request.purpose}</p>
                          </div>
                          <Badge variant={
                            request.status === 'accepted' ? 'default' :
                            request.status === 'declined' ? 'destructive' : 'secondary'
                          }>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{request.student_message}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Sent: {new Date(request.created_at).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>Meeting type: {request.preferred_meeting_type}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <Card className="shadow-elegant border-ai-accent/20">
              <CardHeader>
                <CardTitle>Active Mentorships</CardTitle>
                <CardDescription>Manage your ongoing mentorship relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activeMentorships.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No active mentorships</p>
                      <p className="text-sm text-muted-foreground">Your accepted requests will appear here</p>
                    </div>
                  ) : (
                    activeMentorships.map((mentorship) => (
                      <div key={mentorship.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{mentorship.faculty_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Started: {new Date(mentorship.start_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="default">
                            {mentorship.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium mb-2">Focus Areas</h4>
                            <div className="space-y-1">
                              {mentorship.focus_areas.map((area, index) => (
                                <div key={index} className="flex items-center text-sm">
                                  <Target className="h-3 w-3 text-medical-primary mr-2" />
                                  <span>{area}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Meeting Details</h4>
                            <p className="text-sm text-muted-foreground">
                              Frequency: {mentorship.meeting_frequency}
                            </p>
                            {mentorship.next_meeting && (
                              <p className="text-sm text-medical-primary">
                                Next: {new Date(mentorship.next_meeting).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Progress Notes</h4>
                          <div className="space-y-2">
                            {mentorship.progress_notes.slice(-3).map((note, index) => (
                              <div key={index} className="flex items-start text-sm">
                                <CheckCircle className="h-3 w-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{note}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Meeting
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Send Message
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Mentorship Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Mentorship</DialogTitle>
            <DialogDescription>
              Send a mentorship request to {selectedFaculty?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Purpose of Mentorship</label>
              <Input
                placeholder="e.g., Research guidance, Career advice, Skill development"
                value={requestForm.purpose}
                onChange={(e) => setRequestForm(prev => ({ ...prev, purpose: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Message to Faculty</label>
              <Textarea
                placeholder="Introduce yourself and explain why you'd like their mentorship..."
                value={requestForm.message}
                onChange={(e) => setRequestForm(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Preferred Meeting Type</label>
              <select
                value={requestForm.meeting_type}
                onChange={(e) => setRequestForm(prev => ({ ...prev, meeting_type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ai-accent"
              >
                <option value="virtual">Virtual</option>
                <option value="in-person">In-Person</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRequestMentorship}
              disabled={!requestForm.message || !requestForm.purpose}
            >
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};