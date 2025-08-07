import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Target, 
  Award, 
  BookOpen, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  BarChart3,
  ArrowLeft,
  Trophy,
  User,
  Brain
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AcademicProgress {
  semester: number;
  totalCredits: number;
  completedCredits: number;
  gpa: number;
  subjects: Subject[];
}

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  grade: string;
  status: 'completed' | 'in-progress' | 'pending';
  assignments: Assignment[];
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue';
  grade?: number;
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  category: 'gpa' | 'assignment' | 'skill' | 'research';
}

export const StudentAcademicDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [academicProgress, setAcademicProgress] = useState<AcademicProgress[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Assignment[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration - in real app, fetch from Supabase
      const mockProgress: AcademicProgress[] = [
        {
          semester: 1,
          totalCredits: 24,
          completedCredits: 20,
          gpa: 3.7,
          subjects: [
            {
              id: '1',
              name: 'Human Anatomy',
              code: 'MED101',
              credits: 6,
              grade: 'A',
              status: 'completed',
              assignments: []
            },
            {
              id: '2', 
              name: 'Medical Physiology',
              code: 'MED102',
              credits: 6,
              grade: 'B+',
              status: 'in-progress',
              assignments: [
                {
                  id: '1',
                  title: 'Cardiovascular System Report',
                  dueDate: '2025-08-15',
                  status: 'pending'
                }
              ]
            }
          ]
        }
      ];

      const mockGoals: Goal[] = [
        {
          id: '1',
          title: 'Achieve 3.8 GPA this semester',
          target: 3.8,
          current: 3.7,
          deadline: '2025-12-31',
          category: 'gpa'
        },
        {
          id: '2',
          title: 'Complete Research Project',
          target: 1,
          current: 0.7,
          deadline: '2025-11-30',
          category: 'research'
        }
      ];

      const mockDeadlines: Assignment[] = [
        {
          id: '1',
          title: 'Biochemistry Lab Report',
          dueDate: '2025-08-10',
          status: 'pending'
        },
        {
          id: '2',
          title: 'Clinical Case Study',
          dueDate: '2025-08-12',
          status: 'pending'
        }
      ];

      const mockAchievements = [
        {
          id: '1',
          title: 'Dean\'s List',
          description: 'Achieved GPA > 3.5 for consecutive semesters',
          earnedDate: '2025-07-01',
          icon: Trophy
        },
        {
          id: '2',
          title: 'Research Excellence',
          description: 'Outstanding performance in research methodology',
          earnedDate: '2025-06-15',
          icon: Brain
        }
      ];

      setAcademicProgress(mockProgress);
      setGoals(mockGoals);
      setUpcomingDeadlines(mockDeadlines);
      setAchievements(mockAchievements);
      
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching academic data:', error);
      toast({
        title: "Error",
        description: "Failed to load academic dashboard",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const calculateOverallGPA = () => {
    if (academicProgress.length === 0) return 0;
    const totalGPA = academicProgress.reduce((sum, semester) => sum + semester.gpa, 0);
    return (totalGPA / academicProgress.length).toFixed(2);
  };

  const calculateDegreeProgress = () => {
    const totalCreditsNeeded = 180; // Typical medical degree
    const completedCredits = academicProgress.reduce((sum, semester) => sum + semester.completedCredits, 0);
    return Math.round((completedCredits / totalCreditsNeeded) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'pending': return 'text-orange-600';
      case 'overdue': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'pending': return AlertTriangle;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ai-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading academic dashboard...</p>
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
                <h1 className="text-3xl font-bold">Academic Excellence Dashboard</h1>
              </div>
              <p className="text-white/80">Track your academic progress and achievements</p>
            </div>
            <div className="text-white text-right">
              <div className="text-2xl font-bold">{calculateOverallGPA()}</div>
              <div className="text-sm text-white/80">Overall GPA</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-elegant border-ai-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Degree Progress</p>
                  <p className="text-2xl font-bold text-academic">{calculateDegreeProgress()}%</p>
                </div>
                <Target className="h-8 w-8 text-medical-primary" />
              </div>
              <Progress value={calculateDegreeProgress()} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-ai-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Semester</p>
                  <p className="text-2xl font-bold text-academic">
                    {academicProgress.length > 0 ? academicProgress[0].gpa : '0.0'}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Semester GPA</p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-ai-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assignments Due</p>
                  <p className="text-2xl font-bold text-academic">{upcomingDeadlines.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Next 7 days</p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-ai-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                  <p className="text-2xl font-bold text-academic">{achievements.length}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Total earned</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progress">Academic Progress</TabsTrigger>
            <TabsTrigger value="goals">Goals & Targets</TabsTrigger>
            <TabsTrigger value="deadlines">Upcoming Deadlines</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6">
            <Card className="shadow-elegant border-ai-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Semester Progress</span>
                </CardTitle>
                <CardDescription>Your academic performance by semester</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {academicProgress.map((semester) => (
                    <div key={semester.semester} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Semester {semester.semester}</h3>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">GPA: {semester.gpa}</Badge>
                          <Badge variant="outline">
                            {semester.completedCredits}/{semester.totalCredits} Credits
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {semester.subjects.map((subject) => {
                          const StatusIcon = getStatusIcon(subject.status);
                          return (
                            <div key={subject.id} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{subject.name}</h4>
                                <div className="flex items-center space-x-2">
                                  <StatusIcon className={`h-4 w-4 ${getStatusColor(subject.status)}`} />
                                  {subject.grade && (
                                    <Badge variant="secondary">{subject.grade}</Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {subject.code} • {subject.credits} Credits
                              </p>
                              {subject.assignments.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground">
                                    {subject.assignments.length} pending assignment(s)
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card className="shadow-elegant border-ai-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Academic Goals</span>
                </CardTitle>
                <CardDescription>Track your personal academic targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{goal.title}</h3>
                        <Badge variant="outline" className="capitalize">
                          {goal.category}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                        </div>
                        <Progress value={(goal.current / goal.target) * 100} />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Current: {goal.current}</span>
                          <span>Target: {goal.target}</span>
                          <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    <Target className="h-4 w-4 mr-2" />
                    Add New Goal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-6">
            <Card className="shadow-elegant border-ai-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Deadlines</span>
                </CardTitle>
                <CardDescription>Stay on top of your assignments and submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingDeadlines.map((assignment) => {
                    const StatusIcon = getStatusIcon(assignment.status);
                    const daysUntilDue = Math.ceil(
                      (new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    
                    return (
                      <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <StatusIcon className={`h-5 w-5 ${getStatusColor(assignment.status)}`} />
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={daysUntilDue <= 2 ? "destructive" : "secondary"}>
                            {daysUntilDue > 0 ? `${daysUntilDue} days` : 'Overdue'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="shadow-elegant border-ai-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Academic Achievements</span>
                </CardTitle>
                <CardDescription>Your academic milestones and recognitions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div key={achievement.id} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <IconComponent className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {achievement.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Earned: {new Date(achievement.earnedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};