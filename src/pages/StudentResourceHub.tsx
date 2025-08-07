import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  HeadphonesIcon, 
  Calendar,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Play,
  Clock,
  Star,
  User,
  FileText,
  Video,
  Mic,
  Brain,
  Target,
  Award,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Globe,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'audio' | 'interactive';
  category: string;
  subject: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  author: string;
  rating: number;
  downloads: number;
  url: string;
  thumbnail?: string;
  tags: string[];
  created_at: string;
  is_premium: boolean;
}

interface TutoringService {
  id: string;
  service_name: string;
  description: string;
  contact_person: string;
  email: string;
  phone?: string;
  subjects: string[];
  availability: string;
  location: string;
  type: 'online' | 'in-person' | 'hybrid';
  pricing: string;
  rating: number;
  website?: string;
  specializations: string[];
}

interface SupportService {
  id: string;
  service_name: string;
  description: string;
  department: string;
  contact_email: string;
  contact_phone?: string;
  office_location?: string;
  hours: string;
  service_type: 'academic' | 'counseling' | 'career' | 'financial' | 'technical' | 'health';
  is_emergency: boolean;
  website?: string;
}

interface Scholarship {
  id: string;
  title: string;
  description: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  requirements: string[];
  application_link: string;
  provider: string;
  type: 'merit' | 'need-based' | 'research' | 'diversity' | 'international';
  status: 'open' | 'closing-soon' | 'closed';
}

export const StudentResourceHub = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [tutoringServices, setTutoringServices] = useState<TutoringService[]>([]);
  const [supportServices, setSupportServices] = useState<SupportService[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    filterResources();
  }, [searchTerm, selectedCategory, selectedType, resources]);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Mock resources data
      const mockResources: Resource[] = [
        {
          id: '1',
          title: 'Comprehensive Cardiology Study Guide',
          description: 'Complete guide covering heart anatomy, physiology, and common pathologies with clinical correlations.',
          type: 'document',
          category: 'Study Materials',
          subject: 'Cardiology',
          difficulty_level: 'intermediate',
          duration: '2 hours read',
          author: 'Dr. Sarah Wilson',
          rating: 4.8,
          downloads: 1250,
          url: '/resources/cardiology-guide.pdf',
          tags: ['cardiology', 'anatomy', 'physiology', 'pathology'],
          created_at: '2025-07-15T10:00:00Z',
          is_premium: false
        },
        {
          id: '2',
          title: 'ECG Interpretation Masterclass',
          description: 'Video series teaching ECG reading from basics to advanced arrhythmia recognition.',
          type: 'video',
          category: 'Video Lectures',
          subject: 'Cardiology',
          difficulty_level: 'advanced',
          duration: '3.5 hours',
          author: 'Prof. Michael Chen',
          rating: 4.9,
          downloads: 890,
          url: '/resources/ecg-masterclass',
          thumbnail: '/thumbnails/ecg-video.jpg',
          tags: ['ecg', 'cardiology', 'arrhythmia', 'interpretation'],
          created_at: '2025-07-20T14:30:00Z',
          is_premium: true
        },
        {
          id: '3',
          title: 'Anatomy Podcast Series',
          description: 'Audio lectures covering human anatomy systems with mnemonics and memory techniques.',
          type: 'audio',
          category: 'Podcasts',
          subject: 'Anatomy',
          difficulty_level: 'beginner',
          duration: '45 min/episode',
          author: 'Dr. Emily Rodriguez',
          rating: 4.7,
          downloads: 2100,
          url: '/resources/anatomy-podcast',
          tags: ['anatomy', 'audio', 'mnemonics', 'systems'],
          created_at: '2025-07-10T09:15:00Z',
          is_premium: false
        }
      ];

      const mockTutoringServices: TutoringService[] = [
        {
          id: '1',
          service_name: 'Medical Minds Tutoring',
          description: 'Specialized medical education tutoring with certified physicians and top students.',
          contact_person: 'Dr. Jennifer Adams',
          email: 'info@medicalminds.com',
          phone: '+1-555-0123',
          subjects: ['Anatomy', 'Physiology', 'Pathology', 'Pharmacology'],
          availability: 'Mon-Fri 9AM-9PM, Weekends 10AM-6PM',
          location: 'Online & Boston Area',
          type: 'hybrid',
          pricing: '$45-75/hour depending on subject',
          rating: 4.8,
          website: 'https://medicalminds.com',
          specializations: ['USMLE Prep', 'Medical School Support', 'Research Guidance']
        },
        {
          id: '2',
          service_name: 'Peer Learning Network',
          description: 'Student-to-student tutoring with verified high-performing medical students.',
          contact_person: 'Sarah Kim',
          email: 'connect@peerlearning.net',
          subjects: ['All Medical Subjects', 'Study Strategies', 'Exam Preparation'],
          availability: '24/7 Online Platform',
          location: 'Global - Online',
          type: 'online',
          pricing: '$25-40/hour',
          rating: 4.6,
          website: 'https://peerlearning.net',
          specializations: ['Peer Support', 'Study Groups', 'Exam Techniques']
        }
      ];

      const mockSupportServices: SupportService[] = [
        {
          id: '1',
          service_name: 'Academic Support Center',
          description: 'Comprehensive academic support including study skills, tutoring referrals, and learning accommodations.',
          department: 'Student Success',
          contact_email: 'academic.support@dmu.edu',
          contact_phone: '+1-555-0100',
          office_location: 'Student Center, Room 205',
          hours: 'Monday-Friday 8AM-6PM',
          service_type: 'academic',
          is_emergency: false,
          website: 'https://dmu.edu/academic-support'
        },
        {
          id: '2',
          service_name: 'Student Counseling Services',
          description: 'Mental health support, stress management, and personal counseling for medical students.',
          department: 'Student Health & Wellness',
          contact_email: 'counseling@dmu.edu',
          contact_phone: '+1-555-0911',
          office_location: 'Health Center, 3rd Floor',
          hours: '24/7 Crisis Line, Regular hours: Mon-Fri 9AM-5PM',
          service_type: 'counseling',
          is_emergency: true,
          website: 'https://dmu.edu/counseling'
        },
        {
          id: '3',
          service_name: 'Career Development Office',
          description: 'Resume building, interview preparation, residency guidance, and career planning.',
          department: 'Career Services',
          contact_email: 'careers@dmu.edu',
          contact_phone: '+1-555-0150',
          office_location: 'Administration Building, Room 120',
          hours: 'Monday-Friday 9AM-5PM',
          service_type: 'career',
          is_emergency: false,
          website: 'https://dmu.edu/careers'
        }
      ];

      const mockScholarships: Scholarship[] = [
        {
          id: '1',
          title: 'Medical Excellence Scholarship',
          description: 'Merit-based scholarship for outstanding medical students with strong academic performance.',
          amount: '$5,000 - $15,000',
          deadline: '2025-09-15',
          eligibility: ['GPA ≥ 3.7', 'Full-time enrollment', 'Demonstrated leadership'],
          requirements: ['Academic transcript', 'Personal statement', 'Two recommendation letters'],
          application_link: 'https://dmu.edu/scholarships/excellence',
          provider: 'DMU Foundation',
          type: 'merit',
          status: 'open'
        },
        {
          id: '2',
          title: 'Healthcare Diversity Fellowship',
          description: 'Supporting underrepresented students in medicine to promote diversity in healthcare.',
          amount: '$10,000',
          deadline: '2025-08-20',
          eligibility: ['Underrepresented minority', 'Financial need demonstrated', 'Community service'],
          requirements: ['FAFSA form', 'Diversity essay', 'Community service documentation'],
          application_link: 'https://healthcarediversity.org/fellowship',
          provider: 'Healthcare Diversity Foundation',
          type: 'diversity',
          status: 'closing-soon'
        }
      ];

      setResources(mockResources);
      setTutoringServices(mockTutoringServices);
      setSupportServices(mockSupportServices);
      setScholarships(mockScholarships);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (selectedType) {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    setFilteredResources(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'video': return Video;
      case 'audio': return Mic;
      case 'interactive': return Brain;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closing-soon': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [...new Set(resources.map(r => r.category))];
  const types = ['document', 'video', 'audio', 'interactive'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ai-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resource hub...</p>
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
                <h1 className="text-3xl font-bold">Student Resource Hub</h1>
              </div>
              <p className="text-white/80">Access learning materials, support services, and opportunities</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="resources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="resources">Learning Resources</TabsTrigger>
            <TabsTrigger value="tutoring">Tutoring Services</TabsTrigger>
            <TabsTrigger value="support">Support Services</TabsTrigger>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-6">
            {/* Search and Filter */}
            <Card className="shadow-elegant border-ai-accent/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search resources by title, subject, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ai-accent"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full md:w-48">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ai-accent"
                    >
                      <option value="">All Types</option>
                      {types.map(type => (
                        <option key={type} value={type} className="capitalize">{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type);
                return (
                  <Card key={resource.id} className="shadow-elegant border-ai-accent/20 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <TypeIcon className="h-5 w-5 text-medical-primary" />
                          <Badge variant="secondary" className="text-xs capitalize">
                            {resource.type}
                          </Badge>
                          {resource.is_premium && (
                            <Badge className="text-xs bg-yellow-100 text-yellow-800">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{resource.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription className="text-sm">{resource.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 text-muted-foreground mr-1" />
                          <span>{resource.subject}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span>{resource.duration}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>{resource.author}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Download className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>{resource.downloads} downloads</span>
                        </div>
                        <Badge variant="outline" className={`text-xs ${
                          resource.difficulty_level === 'beginner' ? 'bg-green-50' :
                          resource.difficulty_level === 'intermediate' ? 'bg-yellow-50' :
                          'bg-red-50'
                        }`}>
                          {resource.difficulty_level}
                        </Badge>
                      </div>

                      <div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {resource.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          {resource.type === 'video' || resource.type === 'audio' ? (
                            <Play className="h-4 w-4 mr-2" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          {resource.type === 'video' ? 'Watch' : 
                           resource.type === 'audio' ? 'Listen' : 'Download'}
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="tutoring" className="space-y-6">
            <Card className="shadow-elegant border-ai-accent/20">
              <CardHeader>
                <CardTitle>Tutoring Services</CardTitle>
                <CardDescription>Professional tutoring and academic support services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tutoringServices.map((service) => (
                    <div key={service.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{service.service_name}</h3>
                          <p className="text-sm text-muted-foreground">{service.contact_person}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{service.rating}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Subjects</p>
                          <div className="flex flex-wrap gap-1">
                            {service.subjects.map((subject, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Specializations</p>
                          <div className="flex flex-wrap gap-1">
                            {service.specializations.map((spec, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{service.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{service.availability}</span>
                          </div>
                          <div className="flex items-center">
                            <Target className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="font-medium text-medical-primary">{service.pricing}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" className="flex-1">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        {service.website && (
                          <Button size="sm" variant="outline">
                            <Globe className="h-4 w-4 mr-2" />
                            Website
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card className="shadow-elegant border-ai-accent/20">
              <CardHeader>
                <CardTitle>Support Services</CardTitle>
                <CardDescription>Academic, personal, and professional support services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {supportServices.map((service) => (
                    <div key={service.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{service.service_name}</h3>
                          <p className="text-sm text-muted-foreground">{service.department}</p>
                        </div>
                        {service.is_emergency && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Emergency
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <Mail className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                          <span>{service.contact_email}</span>
                        </div>
                        {service.contact_phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{service.contact_phone}</span>
                          </div>
                        )}
                        {service.office_location && (
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                            <span>{service.office_location}</span>
                          </div>
                        )}
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                          <span>{service.hours}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        {service.website && (
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scholarships" className="space-y-6">
            <Card className="shadow-elegant border-ai-accent/20">
              <CardHeader>
                <CardTitle>Scholarship Opportunities</CardTitle>
                <CardDescription>Financial support and funding opportunities for medical students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {scholarships.map((scholarship) => (
                    <div key={scholarship.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{scholarship.title}</h3>
                          <p className="text-sm text-muted-foreground">{scholarship.provider}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(scholarship.status)}>
                            {scholarship.status === 'closing-soon' ? 'Closing Soon' : scholarship.status}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {scholarship.type}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">{scholarship.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Award Amount</h4>
                          <p className="text-lg font-semibold text-medical-primary">{scholarship.amount}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Application Deadline</h4>
                          <p className="text-sm">{new Date(scholarship.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Eligibility Requirements</h4>
                          <ul className="text-sm space-y-1">
                            {scholarship.eligibility.map((req, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-3 w-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Application Requirements</h4>
                          <ul className="text-sm space-y-1">
                            {scholarship.requirements.map((req, index) => (
                              <li key={index} className="flex items-start">
                                <FileText className="h-3 w-3 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Button className="w-full" disabled={scholarship.status === 'closed'}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {scholarship.status === 'closed' ? 'Application Closed' : 'Apply Now'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};