import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User, Session } from "@supabase/supabase-js";
import mixpanel from "./mixpanel";
import { useLocation } from "react-router-dom"; 

export const FacultyPortal = () => {

    const location = useLocation();
  
    useEffect(() => {
      const fullUrl = window.location.href;
  
      mixpanel.track("Page Viewed", {
        full_url: fullUrl,
        path: location.pathname,
        title: document.title,
        timestamp: new Date().toISOString(),
      });
    }, [location.pathname]);

  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: ""
  });

  // Check authentication status and redirect if already logged in
  // useEffect(() => {
  //   const { data: { subscription } } = supabase.auth.onAuthStateChange(
  //     (event, session) => {
  //       setSession(session);
  //       setUser(session?.user ?? null);
        
  //       if (session?.user) {
  //         // Redirect authenticated users to dashboard
  //         navigate("/student-dashboard");
  //       }
  //     }
  //   );

  //   // Check for existing session
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //     setUser(session?.user ?? null);
      
  //     if (session?.user) {
  //       navigate("/student-dashboard");
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, [navigate]);


//   useEffect(() => {
//   const { data: { subscription } } = supabase.auth.onAuthStateChange(
//     (event, session) => {
//       if (event === "SIGNED_IN" && session?.user) {
//         navigate("/faculty-dashboard"); // ✅ Faculty-specific
//       }
//     }
//   );

//   supabase.auth.getSession().then(({ data: { session } }) => {
//     if (session?.user) {
//       navigate("/faculty-dashboard"); // ✅ Faculty-specific
//     }
//   });

//   return () => subscription.unsubscribe();
// }, [navigate]);


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.user) {
              //  localStorage.setItem("user_id", data.user.id);
          toast({
            title: "Login successful",
            description: "Welcome back to DMU Medical AI Campus",
          });
          // Navigation will be handled by onAuthStateChange
        }
      } else {
        // Register with Supabase
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }

        if (formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }

        const redirectUrl = `${window.location.origin}/`;
        
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: formData.name,
              role: 'faculty'
            }
          }
        });

        if (error) throw error;

        if (data.user) {
              // localStorage.setItem("user_id", data.user.id);
          toast({
            title: "Registration successful",
            description: "Please check your email to confirm your account",
          });
          
          // If email confirmation is disabled, user will be logged in immediately
          if (data.session) {
            // Navigation will be handled by onAuthStateChange
          }
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication failed",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-medical-primary via-ai-accent to-neural-purple py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Faculty Portal
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Access your DMU Medical AI Campus dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Login/Register Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="shadow-elegant border-ai-accent/20">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-academic">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your faculty account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full" onValueChange={(value) => setIsLogin(value === 'login')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="border-ai-accent/30 focus:border-ai-accent"
                        placeholder="student@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className="border-ai-accent/30 focus:border-ai-accent pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full academic-gradient text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Signing In...
                        </div>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="border-ai-accent/30 focus:border-ai-accent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="border-ai-accent/30 focus:border-ai-accent"
                        placeholder="student@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className="border-ai-accent/30 focus:border-ai-accent pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="border-ai-accent/30 focus:border-ai-accent"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full academic-gradient text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Creating Account...
                        </div>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};