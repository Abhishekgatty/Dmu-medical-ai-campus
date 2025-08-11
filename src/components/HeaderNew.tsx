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

export const HeaderNew = () => {
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
   <header className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-purple-900 via-pink-700 to-orange-600 shadow-lg">
  <div className="max-w-7xl mx-auto px-8 py-4">
    <div className="flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-2 text-white">
        <div className="relative">
          <Brain className="h-8 w-8 text-yellow-300" />
          <Stethoscope className="absolute -bottom-1 -right-1 h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">DMU</h1>
          <p className="text-xs opacity-80">Medical AI Campus</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center space-x-8 text-white font-medium">
        <button onClick={() => navigate('/courses')} className="hover:text-yellow-300">Program</button>
        <button onClick={() => navigate('/student-enrollment')} className="hover:text-yellow-300">Admissions</button>
        <a href="/ai-research-paper-assistant" className="hover:text-yellow-300">Research</a>
        <a href="/campus-stats" className="hover:text-yellow-300">Campus Life</a>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Apply Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white hover:text-purple-900"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Apply Now
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white text-gray-800">
            <DropdownMenuItem onClick={() => navigate("/student-enrollment")}>
              <GraduationCap className="w-4 h-4 mr-2 text-purple-700" />
              Student Application
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/faculty-registration")}>
              <Brain className="w-4 h-4 mr-2 text-purple-700" />
              Faculty Position
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/clinical-partnership")}>
              <Stethoscope className="w-4 h-4 mr-2 text-purple-700" />
              Clinical Partnership
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Student Portal */}
        <Button
          onClick={() => navigate(isLoggedIn ? "/student-profile" : "/student-portal")}
          className="bg-yellow-300 text-purple-900 hover:bg-yellow-400"
        >
          <LogIn className="w-4 h-4 mr-2" /> Student Portal
        </Button>

        {/* Faculty Portal */}
        <Button
          onClick={() => navigate("/faculty-portal")}
          className="bg-yellow-300 text-purple-900 hover:bg-yellow-400"
        >
          <LogIn className="w-4 h-4 mr-2" /> Faculty Portal
        </Button>
      </div>
    </div>
  </div>
</header>

  );
};