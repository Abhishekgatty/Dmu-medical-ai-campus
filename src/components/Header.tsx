import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, UserPlus, LogIn, GraduationCap, Brain, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user_id"));


  useEffect(() => {
    // Listen for changes to localStorage (e.g., login/logout in other tabs)
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem("user_id"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    toast({ title: "Logged out", description: "You have been signed out." });
    navigate("/student-portal");
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top navigation bar */}
        <div className="glass-effect rounded-2xl px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Brain className="h-8 w-8 text-ai-accent" />
                  <Stethoscope className="absolute -bottom-1 -right-1 h-4 w-4 text-campus-gold" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-academic">DMU</h1>
                  <p className="text-xs text-muted-foreground">Medical AI Campus</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => navigate('/courses')}
                className="text-white/90 hover:text-ai-accent transition-colors font-medium"
              >
                Program
              </button>
              <button
                onClick={() => navigate('/student-enrollment')}
                className="text-white/90 hover:text-ai-accent transition-colors font-medium"
              >
                Admissions
              </button>
              <a href="/ai-research-paper-assistant" className="text-white/90 hover:text-ai-accent transition-colors font-medium">
                Research
              </a>
              <a href="/campus-stats" className="text-white/90 hover:text-ai-accent transition-colors font-medium">
                Campus Life
              </a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">

              {/* <div className="flex items-center gap-4">
                <Button
                  onClick={
                    isLoggedIn
                      ? handleLogout
                      : () => navigate("/student-portal")
                  }
                  variant={isLoggedIn ? "outline" : "default"}
                  className={isLoggedIn ? "ml-2" : "academic-gradient text-white shadow-campus transition-all duration-300 hover:shadow-elegant hover:scale-105"}
                >
                  {isLoggedIn ? "Logout" : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>
                ...other action buttons (Apply Now, Faculty Portal, etc.)...
              </div> */}
              {/* Register Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="glass-effect border-ai-accent/30 text-ai-accent bg-white/90 hover:bg-ai-accent hover:text-white transition-all duration-300"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Apply Now
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white/95 backdrop-blur-md border-ai-accent/20 z-[100] shadow-elegant min-w-[200px]"
                  sideOffset={5}
                >
                  <DropdownMenuItem
                    className="hover:bg-medical-primary/10 cursor-pointer"
                    onClick={() => navigate("/student-enrollment")}
                  >
                    <GraduationCap className="w-4 h-4 mr-2 text-medical-primary" />
                    Student Application
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-medical-primary/10 cursor-pointer"
                    onClick={() => navigate("/faculty-registration")}
                  >
                    <Brain className="w-4 h-4 mr-2 text-ai-accent" />
                    Faculty Position
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-medical-primary/10 cursor-pointer"
                    onClick={() => navigate("/clinical-partnership")}
                  >
                    <Stethoscope className="w-4 h-4 mr-2 text-medical-secondary" />
                    Clinical Partnership
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Login Button */}
              <Button
                onClick={() => {
                  if (isLoggedIn) {
                    navigate("/student-profile");
                  } else {
                    navigate("/student-portal");
                  }
                }}
                className="academic-gradient text-white shadow-campus transition-all duration-300 hover:shadow-elegant hover:scale-105"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Student Portal
              </Button>

              <Button
                onClick={() => navigate("/faculty-portal")} // ← Changed route here
                className="academic-gradient text-white shadow-campus transition-all duration-300 hover:shadow-elegant hover:scale-105"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Faculty Portal
              </Button>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
};