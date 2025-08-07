import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Target,
  Brain,
  MessageCircle,
  Calendar,
  Award,
  ArrowRight,
  Sparkles,
  Heart,
  Lightbulb
} from "lucide-react";

export const StudentPortalFeatures = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Academic Excellence Dashboard",
      description: "Track your GPA, degree progress, assignments, and academic goals with visual analytics and insights.",
      icon: TrendingUp,
      route: "/student-academic-dashboard",
      color: "from-blue-500 to-cyan-600",
      highlights: ["Progress Tracking", "GPA Analytics", "Goal Setting", "Achievement Badges"],
      badge: "Popular",
      badgeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Faculty Mentorship Hub",
      description: "Connect with expert faculty members for personalized guidance, research opportunities, and career advice.",
      icon: Brain,
      route: "/faculty-mentorship-hub",
      color: "from-purple-500 to-pink-600",
      highlights: ["Expert Faculty", "Research Guidance", "Career Mentoring", "1-on-1 Sessions"],
      badge: "New",
      badgeColor: "bg-green-100 text-green-800"
    },
    {
      title: "Study Group Network",
      description: "Find study partners, join collaborative groups, and connect with peer tutors for enhanced learning.",
      icon: Users,
      route: "/study-group-network",
      color: "from-green-500 to-emerald-600",
      highlights: ["Peer Learning", "Study Groups", "Collaborative Projects", "Skill Sharing"],
      badge: "Community",
      badgeColor: "bg-orange-100 text-orange-800"
    },
    {
      title: "Student Resource Hub",
      description: "Access comprehensive learning materials, support services, tutoring options, and scholarship opportunities.",
      icon: BookOpen,
      route: "/student-resource-hub",
      color: "from-orange-500 to-red-600",
      highlights: ["Learning Materials", "Support Services", "Scholarships", "Tutoring"],
      badge: "Essential",
      badgeColor: "bg-purple-100 text-purple-800"
    }
  ];

  const quickActions = [
    {
      title: "Schedule Study Session",
      description: "Book your next group study session",
      icon: Calendar,
      action: () => navigate("/study-group-network"),
      color: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      title: "Find a Mentor",
      description: "Connect with faculty experts",
      icon: MessageCircle,
      action: () => navigate("/faculty-mentorship-hub"),
      color: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      title: "Track Progress",
      description: "View your academic achievements",
      icon: Target,
      action: () => navigate("/student-academic-dashboard"),
      color: "bg-gradient-to-r from-green-500 to-emerald-500"
    },
    {
      title: "Browse Resources",
      description: "Access learning materials",
      icon: Award,
      action: () => navigate("/student-resource-hub"),
      color: "bg-gradient-to-r from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-medical-primary mr-3" />
          <h2 className="text-3xl font-bold text-academic">Enhanced Student Portal Features</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover powerful new tools designed to accelerate your academic journey and connect you with the support you need to excel.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className="shadow-elegant border-ai-accent/20 hover:shadow-lg transition-all cursor-pointer group"
            onClick={action.action}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="shadow-elegant border-ai-accent/20 hover:shadow-xl transition-all group overflow-hidden"
          >
            <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <Badge className={feature.badgeColor}>
                      {feature.badge}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="text-base mt-3">
                {feature.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {feature.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center text-sm">
                    <Heart className="h-3 w-3 text-medical-primary mr-2 flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => navigate(feature.route)}
                className="w-full academic-gradient text-white group-hover:shadow-lg transition-all"
                size="lg"
              >
                <span>Explore {feature.title.split(' ')[0]}</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <Card className="shadow-elegant border-ai-accent/20 bg-gradient-to-br from-medical-primary/5 to-ai-accent/5">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <Lightbulb className="h-8 w-8 text-medical-primary mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-academic mb-2">Why Use These Features?</h3>
            <p className="text-muted-foreground">Transform your academic experience with tools designed for medical students</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Improve Performance</h4>
              <p className="text-sm text-muted-foreground">Track progress, set goals, and achieve academic excellence with data-driven insights.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Build Connections</h4>
              <p className="text-sm text-muted-foreground">Connect with peers, mentors, and faculty to build a strong professional network.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Access Resources</h4>
              <p className="text-sm text-muted-foreground">Get instant access to learning materials, support services, and opportunities.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};