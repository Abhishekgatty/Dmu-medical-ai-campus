import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import aiLearningIcon from "@/assets/ai-learning-icon.png";
import curriculumIcon from "@/assets/curriculum-icon.png";
import globalRotationsIcon from "@/assets/global-rotations-icon.png";
import attendanceIcon from "@/assets/attendance-icon.png";
import facultyMatchingIcon from "@/assets/faculty-matching-icon.png";
import notificationIcon from "@/assets/notification-icon.png";

const features = [
  {
    title: "AI-Enhanced Learning",
    description: "Personalized medical education powered by machine learning algorithms and neural networks",
    icon: aiLearningIcon,
    gradient: "from-ai-accent via-ai-accent-glow to-neural-purple",
    badge: "Smart"
  },
  {
    title: "Global Curriculum Standards",
    description: "World-class medical curriculum meeting international standards with AI-driven enhancements",
    icon: curriculumIcon,
    gradient: "from-medical-primary via-campus-gold to-medical-primary-light",
    badge: "Accredited"
  },
  {
    title: "International Clinical Rotations",
    description: "Hands-on clinical experience at top medical institutions across 50+ countries",
    icon: globalRotationsIcon,
    gradient: "from-medical-secondary via-lab-green to-ai-accent-light",
    badge: "Global"
  },
  {
    title: "Smart Attendance System",
    description: "AI-powered attendance tracking for both virtual and physical campus activities",
    icon: attendanceIcon,
    gradient: "from-campus-gold via-neural-purple to-medical-primary",
    badge: "Automated"
  },
  {
    title: "Faculty AI Matching",
    description: "Intelligent system connecting students with optimal faculty mentors based on learning patterns",
    icon: facultyMatchingIcon,
    gradient: "from-neural-purple via-ai-accent to-campus-gold",
    badge: "Intelligent"
  },
  {
    title: "Campus Notification Hub",
    description: "Unified communication system for academic updates, research opportunities, and campus events",
    icon: notificationIcon,
    gradient: "from-lab-green via-medical-secondary to-ai-accent-glow",
    badge: "Connected"
  }
];

export const FeatureGrid = () => {
  const navigate = useNavigate();

  const handleFeatureClick = (title: string) => {
    if (title === "Global Curriculum Standards") {
      navigate('/courses');
    } else if (title === "International Clinical Rotations") {
      navigate('/international-clinical-rotations');
    } else if (title === "AI-Enhanced Learning") {
      navigate('/ai-enhanced-learning');
    } else if (title === "Smart Attendance System") {
      navigate('/smart-attendance');
    } else if (title === "Campus Notification Hub") {
      navigate('/notifications');
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background via-ai-accent/5 to-neural-purple/5 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-ai-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-neural-purple/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block glass-effect px-6 py-2 rounded-full mb-6">
            <span className="text-ai-accent font-semibold">🎓 Academic Excellence</span>
          </div>
          <h2 className="heading-section">
            Complete Medical AI Education Ecosystem
          </h2>
          <p className="text-campus max-w-3xl mx-auto">
            Experience the future of medical education with our comprehensive platform that seamlessly integrates
            artificial intelligence, global clinical training, and cutting-edge campus technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
             <div 
               key={feature.title}
                className={`group relative campus-card overflow-hidden elegant-hover animate-bounce-in ${
                  feature.title === "Global Curriculum Standards" || 
                  feature.title === "International Clinical Rotations" || 
                  feature.title === "AI-Enhanced Learning" ||
                  feature.title === "Smart Attendance System" ||
                  feature.title === "Campus Notification Hub" ? "cursor-pointer" : ""
                }`}
               style={{ animationDelay: `${index * 0.1}s` }}
               onClick={() => handleFeatureClick(feature.title)}
             >
              {/* Feature badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="glass-effect px-3 py-1 rounded-full">
                  <span className="text-xs font-semibold text-ai-accent">{feature.badge}</span>
                </div>
              </div>
              
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <div className="relative p-8">
                <div className={`w-20 h-20 mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <img 
                    src={feature.icon} 
                    alt={feature.title}
                    className="w-full h-full object-contain filter brightness-0 invert"
                  />
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-academic group-hover:scale-105 transition-transform">
                  {feature.title}
                </h3>
                
                <p className="text-campus leading-relaxed mb-6">
                  {feature.description}
                </p>

                 {/* Learn more link */}
                 <div className="pt-4 border-t border-ai-accent/20">
                   <button 
                     onClick={() => handleFeatureClick(feature.title)} 
                     className="text-ai-accent hover:text-neural-purple transition-colors font-medium text-sm group-hover:underline"
                   >
                     {feature.title === "Global Curriculum Standards" ? "View Courses" : 
                      feature.title === "International Clinical Rotations" ? "Explore Rotations" : "Learn More"} →
                   </button>
                 </div>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-ai-accent to-neural-purple rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur"></div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="campus-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-academic">Ready to Transform Your Medical Career?</h3>
            <p className="text-campus mb-6">
              Join thousands of students already experiencing the future of medical education through our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="academic-gradient px-8 py-3 text-lg elegant-hover">
                Schedule Campus Tour
              </Button>
              <Button variant="outline" className="border-ai-accent/30 text-ai-accent hover:bg-ai-accent/10 px-8 py-3">
                Download Brochure
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};