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
  Users, 
  Plus, 
  Search, 
  Calendar,
  ArrowLeft,
  MapPin,
  Clock,
  BookOpen,
  Video,
  MessageCircle,
  Star,
  UserPlus,
  Settings,
  Globe,
  Coffee,
  Lightbulb,
  Target
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  course: string;
  creator_name: string;
  member_count: number;
  max_members: number;
  meeting_type: 'virtual' | 'in-person' | 'hybrid';
  location?: string;
  meeting_frequency: string;
  next_meeting?: string;
  study_goals: string[];
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  language: string;
  created_at: string;
  status: 'active' | 'recruiting' | 'full';
  tags: string[];
}

interface PeerTutor {
  id: string;
  name: string;
  course: string;
  subjects: string[];
  experience_level: number;
  rating: number;
  availability: string[];
  hourly_rate?: number;
  bio: string;
  languages: string[];
  tutoring_style: string[];
  achievements: string[];
  location: string;
}

interface MyGroup {
  id: string;
  group_name: string;
  role: 'creator' | 'member';
  subject: string;
  next_meeting?: string;
  member_count: number;
  study_progress: number;
}

export const StudyGroupNetwork = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<StudyGroup[]>([]);
  const [peerTutors, setPeerTutors] = useState<PeerTutor[]>([]);
  const [myGroups, setMyGroups] = useState<MyGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedMeetingType, setSelectedMeetingType] = useState("");
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [newGroupForm, setNewGroupForm] = useState({
    name: "",
    description: "",
    subject: "",
    meeting_type: "virtual" as const,
    location: "",
    meeting_frequency: "weekly",
    max_members: 6,
    skill_level: "mixed" as const,
    study_goals: "",
    language: "English"
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterGroups();
  }, [searchTerm, selectedSubject, selectedMeetingType, studyGroups]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockGroups: StudyGroup[] = [
        {
          id: '1',
          name: 'Cardiovascular System Study Circle',
          description: 'Deep dive into heart anatomy, physiology, and pathology. Perfect for preparing for cardiology rotations.',
          subject: 'Cardiology',
          course: 'Doctor of Medicine',
          creator_name: 'Sarah Chen',
          member_count: 4,
          max_members: 6,
          meeting_type: 'virtual',
          meeting_frequency: 'Weekly',
          next_meeting: '2025-08-08T19:00:00Z',
          study_goals: ['ECG interpretation', 'Heart sounds recognition', 'Case studies'],
          skill_level: 'intermediate',
          language: 'English',
          created_at: '2025-07-20T10:00:00Z',
          status: 'recruiting',
          tags: ['cardiology', 'clinical', 'exam-prep']
        },
        {
          id: '2',
          name: 'Neuroanatomy Visualization Group',
          description: 'Using 3D models and imaging to master brain anatomy. Great for visual learners!',
          subject: 'Neurology',
          course: 'Doctor of Medicine',
          creator_name: 'Michael Park',
          member_count: 6,
          max_members: 6,
          meeting_type: 'hybrid',
          location: 'Medical Library, Room 205',
          meeting_frequency: 'Bi-weekly',
          next_meeting: '2025-08-10T14:00:00Z',
          study_goals: ['Brain anatomy', '3D visualization', 'Clinical correlation'],
          skill_level: 'beginner',
          language: 'English',
          created_at: '2025-07-15T14:30:00Z',
          status: 'full',
          tags: ['neurology', 'anatomy', 'visual-learning']
        },
        {
          id: '3',
          name: 'USMLE Step 1 Prep Warriors',
          description: 'Intensive USMLE Step 1 preparation with practice questions and concepts review.',
          subject: 'USMLE Preparation',
          course: 'Doctor of Medicine',
          creator_name: 'Emily Rodriguez',
          member_count: 8,
          max_members: 10,
          meeting_type: 'virtual',
          meeting_frequency: 'Daily',
          next_meeting: '2025-08-06T20:00:00Z',
          study_goals: ['Practice questions', 'Concept review', 'Test strategies'],
          skill_level: 'advanced',
          language: 'English',
          created_at: '2025-07-01T09:00:00Z',
          status: 'active',
          tags: ['usmle', 'exam-prep', 'intensive']
        }
      ];

      const mockTutors: PeerTutor[] = [
        {
          id: '1',
          name: 'Alex Johnson',
          course: 'Doctor of Medicine (4th Year)',
          subjects: ['Cardiology', 'Internal Medicine', 'Clinical Skills'],
          experience_level: 3,
          rating: 4.9,
          availability: ['Monday 18:00-21:00', 'Wednesday 19:00-22:00', 'Saturday 10:00-16:00'],
          hourly_rate: 25,
          bio: 'Top student with clinical experience. Specializing in cardiology and internal medicine.',
          languages: ['English', 'Spanish'],
          tutoring_style: ['Visual explanations', 'Case-based learning', 'Practice questions'],
          achievements: ['Dean\'s List 3 years', 'Research publications', 'Clinical excellence award'],
          location: 'Boston, MA'
        },
        {
          id: '2',
          name: 'Maria Santos',
          course: 'Doctor of Medicine (5th Year)',
          subjects: ['Neurology', 'Anatomy', 'Physiology'],
          experience_level: 4,
          rating: 4.8,
          availability: ['Tuesday 17:00-20:00', 'Thursday 18:00-21:00', 'Sunday 14:00-18:00'],
          hourly_rate: 30,
          bio: 'Neurology resident with passion for teaching. Expert in neuroanatomy and clinical neurology.',
          languages: ['English', 'Portuguese', 'Spanish'],
          tutoring_style: ['Interactive discussions', 'Diagram explanations', 'Clinical correlation'],
          achievements: ['Top 5% of class', 'Teaching assistant', 'Research in neurodegenerative diseases'],
          location: 'Toronto, ON'
        }
      ];

      const mockMyGroups: MyGroup[] = [
        {
          id: '1',
          group_name: 'Cardiovascular System Study Circle',
          role: 'member',
          subject: 'Cardiology',
          next_meeting: '2025-08-08T19:00:00Z',
          member_count: 4,
          study_progress: 65
        }
      ];

      setStudyGroups(mockGroups);
      setPeerTutors(mockTutors);
      setMyGroups(mockMyGroups);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load study groups",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const filterGroups = () => {
    let filtered = studyGroups;

    if (searchTerm) {
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(group => group.subject === selectedSubject);
    }

    if (selectedMeetingType) {
      filtered = filtered.filter(group => group.meeting_type === selectedMeetingType);
    }

    setFilteredGroups(filtered);
  };

  const handleCreateGroup = async () => {
    try {
      const studyGoalsArray = newGroupForm.study_goals.split(',').map(goal => goal.trim()).filter(Boolean);
      
      const newGroup: StudyGroup = {
        id: Date.now().toString(),
        name: newGroupForm.name,
        description: newGroupForm.description,
        subject: newGroupForm.subject,
        course: 'Doctor of Medicine',
        creator_name: 'Current User', // In real app, get from auth
        member_count: 1,
        max_members: newGroupForm.max_members,
        meeting_type: newGroupForm.meeting_type,
        location: newGroupForm.location,
        meeting_frequency: newGroupForm.meeting_frequency,
        study_goals: studyGoalsArray,
        skill_level: newGroupForm.skill_level,
        language: newGroupForm.language,
        created_at: new Date().toISOString(),
        status: 'recruiting',
        tags: [newGroupForm.subject.toLowerCase(), 'study-group']
      };

      setStudyGroups(prev => [newGroup, ...prev]);
      setCreateGroupDialogOpen(false);
      setNewGroupForm({
        name: "",
        description: "",
        subject: "",
        meeting_type: "virtual",
        location: "",
        meeting_frequency: "weekly",
        max_members: 6,
        skill_level: "mixed",
        study_goals: "",
        language: "English"
      });

      toast({
        title: "Study Group Created",
        description: "Your study group has been created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create study group",
        variant: "destructive"
      });
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      setStudyGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, member_count: group.member_count + 1 }
          : group
      ));

      toast({
        title: "Joined Study Group",
        description: "You've successfully joined the study group!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to join study group",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recruiting': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'full': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const subjects = [...new Set(studyGroups.map(g => g.subject))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ai-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading study network...</p>
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
                <h1 className="text-3xl font-bold">Study Group Network</h1>
              </div>
              <p className="text-white/80">Connect with peers and find study partners</p>
            </div>
            <Button 
              onClick={() => setCreateGroupDialogOpen(true)}
              className="bg-white text-medical-primary hover:bg-white/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Groups</TabsTrigger>
            <TabsTrigger value="my-groups">My Groups ({myGroups.length})</TabsTrigger>
            <TabsTrigger value="tutors">Peer Tutors</TabsTrigger>
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
                        placeholder="Search study groups by name, subject, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ai-accent"
                    >
                      <option value="">All Subjects</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full md:w-48">
                    <select
                      value={selectedMeetingType}
                      onChange={(e) => setSelectedMeetingType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ai-accent"
                    >
                      <option value="">All Meeting Types</option>
                      <option value="virtual">Virtual</option>
                      <option value="in-person">In-Person</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <Card key={group.id} className="shadow-elegant border-ai-accent/20 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{group.name}</CardTitle>
                        <CardDescription className="text-sm">{group.description}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(group.status)}>
                        {group.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{group.subject}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-muted-foreground mr-1" />
                        <span>{group.member_count}/{group.max_members}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        {group.meeting_type === 'virtual' ? (
                          <Video className="h-4 w-4 text-muted-foreground mr-2" />
                        ) : group.meeting_type === 'in-person' ? (
                          <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                        ) : (
                          <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                        )}
                        <span className="capitalize">{group.meeting_type}</span>
                        {group.location && (
                          <span className="text-muted-foreground ml-1">- {group.location}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{group.meeting_frequency}</span>
                      </div>
                      {group.next_meeting && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-medical-primary">
                            Next: {new Date(group.next_meeting).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Study Goals:</p>
                      <div className="flex flex-wrap gap-1">
                        {group.study_goals.slice(0, 2).map((goal, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {goal}
                          </Badge>
                        ))}
                        {group.study_goals.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{group.study_goals.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Level: {group.skill_level}</span>
                      <span>Created by {group.creator_name}</span>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => joinGroup(group.id)}
                      disabled={group.status === 'full'}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {group.status === 'full' ? 'Group Full' : 'Join Group'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-groups" className="space-y-6">
            <Card className="shadow-elegant border-ai-accent/20">
              <CardHeader>
                <CardTitle>My Study Groups</CardTitle>
                <CardDescription>Groups you've created or joined</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myGroups.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">You haven't joined any study groups yet</p>
                      <p className="text-sm text-muted-foreground">Browse available groups to get started</p>
                    </div>
                  ) : (
                    myGroups.map((group) => (
                      <div key={group.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{group.group_name}</h3>
                            <p className="text-sm text-muted-foreground">{group.subject}</p>
                          </div>
                          <Badge variant={group.role === 'creator' ? 'default' : 'secondary'}>
                            {group.role}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="text-sm">
                            <Users className="h-4 w-4 inline mr-1" />
                            {group.member_count} members
                          </div>
                          {group.next_meeting && (
                            <div className="text-sm">
                              <Calendar className="h-4 w-4 inline mr-1" />
                              {new Date(group.next_meeting).toLocaleDateString()}
                            </div>
                          )}
                          <div className="text-sm">
                            <Target className="h-4 w-4 inline mr-1" />
                            {group.study_progress}% progress
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Group Chat
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule
                          </Button>
                          {group.role === 'creator' && (
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4 mr-2" />
                              Manage
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutors" className="space-y-6">
            <Card className="shadow-elegant border-ai-accent/20">
              <CardHeader>
                <CardTitle>Peer Tutors</CardTitle>
                <CardDescription>Connect with experienced students for one-on-one guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {peerTutors.map((tutor) => (
                    <div key={tutor.id} className="border rounded-lg p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-medical-primary/20 text-medical-primary">
                            {tutor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{tutor.name}</h3>
                          <p className="text-sm text-muted-foreground">{tutor.course}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{tutor.rating}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {tutor.experience_level} years experience
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{tutor.bio}</p>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Subjects</p>
                          <div className="flex flex-wrap gap-1">
                            {tutor.subjects.map((subject, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Teaching Style</p>
                          <div className="flex flex-wrap gap-1">
                            {tutor.tutoring_style.slice(0, 2).map((style, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {style}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
                            <span>{tutor.location}</span>
                          </div>
                          {tutor.hourly_rate && (
                            <span className="font-medium text-medical-primary">
                              ${tutor.hourly_rate}/hr
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Group Dialog */}
      <Dialog open={createGroupDialogOpen} onOpenChange={setCreateGroupDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Study Group</DialogTitle>
            <DialogDescription>
              Set up a new study group to connect with fellow students
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Group Name</label>
                <Input
                  placeholder="e.g., Cardiology Study Circle"
                  value={newGroupForm.name}
                  onChange={(e) => setNewGroupForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="e.g., Cardiology, Anatomy"
                  value={newGroupForm.subject}
                  onChange={(e) => setNewGroupForm(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe your study group's focus and goals..."
                value={newGroupForm.description}
                onChange={(e) => setNewGroupForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Meeting Type</label>
                <select
                  value={newGroupForm.meeting_type}
                  onChange={(e) => setNewGroupForm(prev => ({ ...prev, meeting_type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ai-accent"
                >
                  <option value="virtual">Virtual</option>
                  <option value="in-person">In-Person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Meeting Frequency</label>
                <select
                  value={newGroupForm.meeting_frequency}
                  onChange={(e) => setNewGroupForm(prev => ({ ...prev, meeting_frequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ai-accent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {newGroupForm.meeting_type !== 'virtual' && (
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="e.g., Medical Library, Room 205"
                  value={newGroupForm.location}
                  onChange={(e) => setNewGroupForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Max Members</label>
                <Input
                  type="number"
                  min="2"
                  max="20"
                  value={newGroupForm.max_members}
                  onChange={(e) => setNewGroupForm(prev => ({ ...prev, max_members: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Skill Level</label>
                <select
                  value={newGroupForm.skill_level}
                  onChange={(e) => setNewGroupForm(prev => ({ ...prev, skill_level: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ai-accent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Study Goals (comma-separated)</label>
              <Input
                placeholder="e.g., ECG interpretation, Heart sounds, Case studies"
                value={newGroupForm.study_goals}
                onChange={(e) => setNewGroupForm(prev => ({ ...prev, study_goals: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setCreateGroupDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateGroup}
              disabled={!newGroupForm.name || !newGroupForm.subject || !newGroupForm.description}
            >
              Create Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};