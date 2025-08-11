import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Users,
  Play,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  BarChart
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  schedule: string;
  category: string;
  description: string;
  topics: string[];
  enrolledStudents: number;
  maxStudents: number;
  progress?: number;
}

const VirtualLearning = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('all');

  // Sample module data
  const modules: Module[] = [
    {
      id: 'mod-001',
      title: 'Advanced Cardiac Anatomy',
      instructor: 'Dr. Sarah Johnson',
      duration: '6 weeks',
      schedule: 'Tuesdays & Thursdays, 10:00 AM',
      category: 'Anatomy',
      description: 'Comprehensive study of cardiac structures and functions using AI-enhanced 3D models and virtual dissection tools.',
      topics: ['Heart Chambers', 'Valvular Anatomy', 'Coronary Circulation', 'Conduction System'],
      enrolledStudents: 42,
      maxStudents: 50,
      progress: 0
    },
    {
      id: 'mod-002',
      title: 'Neural Network Applications in Diagnosis',
      instructor: 'Dr. Michael Chen',
      duration: '8 weeks',
      schedule: 'Mondays & Wednesdays, 2:00 PM',
      category: 'AI Medicine',
      description: 'Explore how neural networks are revolutionizing medical diagnosis with practical applications and case studies.',
      topics: ['Diagnostic Algorithms', 'Imaging Analysis', 'Predictive Models', 'Clinical Decision Support'],
      enrolledStudents: 38,
      maxStudents: 45,
      progress: 0
    },
    {
      id: 'mod-003',
      title: 'Pharmacology of Antimicrobials',
      instructor: 'Dr. Elena Rodriguez',
      duration: '5 weeks',
      schedule: 'Fridays, 1:00 PM',
      category: 'Pharmacology',
      description: 'Study of antimicrobial agents, mechanisms of action, resistance patterns, and clinical applications.',
      topics: ['Antibiotics Classes', 'Mechanisms of Resistance', 'Clinical Applications', 'Adverse Effects'],
      enrolledStudents: 35,
      maxStudents: 40,
      progress: 0
    },
    {
      id: 'mod-004',
      title: 'Medical Imaging Interpretation',
      instructor: 'Dr. James Wilson',
      duration: '7 weeks',
      schedule: 'Tuesdays & Fridays, 9:00 AM',
      category: 'Radiology',
      description: 'Develop skills in interpreting various medical imaging modalities with AI-assisted analysis techniques.',
      topics: ['X-ray Interpretation', 'CT Scan Analysis', 'MRI Fundamentals', 'Ultrasound Basics'],
      enrolledStudents: 30,
      maxStudents: 35,
      progress: 0
    },
    {
      id: 'mod-005',
      title: 'Surgical Techniques in Virtual Reality',
      instructor: 'Dr. Priya Sharma',
      duration: '9 weeks',
      schedule: 'Mondays & Thursdays, 11:00 AM',
      category: 'Surgery',
      description: 'Practice surgical procedures in an immersive VR environment with haptic feedback and AI guidance.',
      topics: ['Basic Surgical Skills', 'Laparoscopic Techniques', 'Suturing Methods', 'Emergency Procedures'],
      enrolledStudents: 25,
      maxStudents: 30,
      progress: 0
    },
    {
      id: 'mod-006',
      title: 'Molecular Mechanisms of Disease',
      instructor: 'Dr. Robert Kim',
      duration: '10 weeks',
      schedule: 'Wednesdays & Fridays, 3:00 PM',
      category: 'Pathology',
      description: 'Explore the molecular and cellular basis of disease processes with interactive molecular modeling.',
      topics: ['Cell Injury Mechanisms', 'Inflammation Pathways', 'Neoplasia', 'Genetic Disorders'],
      enrolledStudents: 40,
      maxStudents: 45,
      progress: 0
    }
  ];

  const filteredModules = selectedTab === 'all'
    ? modules
    : modules.filter(module => module.category.toLowerCase() === selectedTab.toLowerCase());

  const handleEnroll = (moduleId: string) => {
    if (moduleId === 'mod-001') {
      navigate('/advanced-cardiac-anatomy');
    }
    else if (moduleId === "mod-002"){
      navigate("/neural-network-diagnosis")
    }
     else if (moduleId === "mod-003"){
      navigate("/antimicrobial-pharmacology")
    }
    else if (moduleId === "mod-004"){
      navigate("/medical-imaging-interpretation")
    }
    else if (moduleId === "mod-005"){
      navigate("/surgical-techniques-vr")
    }
     else if (moduleId === "mod-006"){
      navigate("/molecular-mechanisms")
    }
    else {
      navigate(`/virtual-learning/module/${moduleId}`);
    }
    // In a real app, this would call an API to enroll the student
    // console.log(`Enrolled in module: ${moduleId}`);

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-medical-primary/20 to-medical-secondary/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Users className="h-10 w-10 text-medical-primary" />
              Virtual Learning
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Attend interactive virtual classes with AI-enhanced content and expert faculty
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
            Back to AI Enhanced Learning
          </Button>
        </div>

        {/* Module Categories */}
        <Tabs defaultValue="all" className="mb-8" onValueChange={setSelectedTab}>
          <div className="border-b mb-4">
            <TabsList className="bg-transparent">
              <TabsTrigger value="all" className="data-[state=active]:text-medical-primary data-[state=active]:border-b-2 data-[state=active]:border-medical-primary rounded-none">
                All Modules
              </TabsTrigger>
              <TabsTrigger value="anatomy" className="data-[state=active]:text-medical-primary data-[state=active]:border-b-2 data-[state=active]:border-medical-primary rounded-none">
                Anatomy
              </TabsTrigger>
              <TabsTrigger value="ai medicine" className="data-[state=active]:text-medical-primary data-[state=active]:border-b-2 data-[state=active]:border-medical-primary rounded-none">
                AI Medicine
              </TabsTrigger>
              <TabsTrigger value="pharmacology" className="data-[state=active]:text-medical-primary data-[state=active]:border-b-2 data-[state=active]:border-medical-primary rounded-none">
                Pharmacology
              </TabsTrigger>
              <TabsTrigger value="radiology" className="data-[state=active]:text-medical-primary data-[state=active]:border-b-2 data-[state=active]:border-medical-primary rounded-none">
                Radiology
              </TabsTrigger>
              <TabsTrigger value="surgery" className="data-[state=active]:text-medical-primary data-[state=active]:border-b-2 data-[state=active]:border-medical-primary rounded-none">
                Surgery
              </TabsTrigger>
              <TabsTrigger value="pathology" className="data-[state=active]:text-medical-primary data-[state=active]:border-b-2 data-[state=active]:border-medical-primary rounded-none">
                Pathology
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={selectedTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map(module => (
                <Card key={module.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-medical-primary/30">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className="bg-medical-primary/20 text-medical-primary hover:bg-medical-primary/30">
                        {module.category}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {module.enrolledStudents}/{module.maxStudents} Students
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold mt-2 text-medical-primary">{module.title}</CardTitle>
                    <CardDescription className="text-sm">
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3" />
                        <span>Instructor: {module.instructor}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{module.description}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-xs">
                        <Clock className="h-3 w-3 mr-2 text-medical-primary" />
                        <span>Duration: {module.duration}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <Calendar className="h-3 w-3 mr-2 text-medical-primary" />
                        <span>Schedule: {module.schedule}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-xs font-semibold mb-2">Topics Covered:</h4>
                      <div className="flex flex-wrap gap-1">
                        {module.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleEnroll(module.id)}
                      className="w-full bg-gradient-to-r from-medical-primary to-medical-secondary text-white hover:from-medical-primary/90 hover:to-medical-secondary/90"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Attend Class
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dashboard Summary */}
        <div className="mt-12 bg-muted rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-medical-primary">Your Learning Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-medical-primary/20 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-medical-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">0</h3>
                  <p className="text-sm text-muted-foreground">Active Modules</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-medical-secondary/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-medical-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">0</h3>
                  <p className="text-sm text-muted-foreground">Completed Modules</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-campus-gold/20 flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-campus-gold" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">0</h3>
                  <p className="text-sm text-muted-foreground">Certificates Earned</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Enroll in a module to start tracking your progress and earning certificates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VirtualLearning;