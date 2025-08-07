import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Brain, ArrowLeft, CheckCircle, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const FacultyRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    degree: "MBBS",
    yearOfCompletion: "",
    specialty: "",
    experienceYears: "",
    extraCourses: [] as string[],
    address: "",
    country: "",
    email: "",
    phone: "",
    paymentDetails: {
      accountType: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      paypalEmail: ""
    }
  });

  const [customCourse, setCustomCourse] = useState("");
  
  const predefinedCourses = [
    "Advanced Cardiac Life Support (ACLS)",
    "Basic Life Support (BLS)", 
    "Pediatric Advanced Life Support (PALS)",
    "Critical Care Medicine",
    "Emergency Medicine",
    "Internal Medicine Board Certification",
    "Surgical Skills Certification",
    "Medical Ethics and Law",
    "Clinical Research Methods",
    "Digital Health and Telemedicine"
  ];

  const specialties = [
    "Cardiology", "Neurology", "Oncology", "Pediatrics", "Surgery",
    "Internal Medicine", "Emergency Medicine", "Radiology", "Pathology",
    "Dermatology", "Ophthalmology", "Psychiatry", "Orthopedics",
    "Anesthesiology", "Obstetrics and Gynecology", "AI in Medicine"
  ];

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as object,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCourseToggle = (course: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      extraCourses: checked 
        ? [...prev.extraCourses, course]
        : prev.extraCourses.filter(c => c !== course)
    }));
  };

  const addCustomCourse = () => {
    if (customCourse.trim() && !formData.extraCourses.includes(customCourse.trim())) {
      setFormData(prev => ({
        ...prev,
        extraCourses: [...prev.extraCourses, customCourse.trim()]
      }));
      setCustomCourse("");
    }
  };

  const removeCourse = (course: string) => {
    setFormData(prev => ({
      ...prev,
      extraCourses: prev.extraCourses.filter(c => c !== course)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('faculty_registrations')
        .insert({
          full_name: formData.fullName,
          age: parseInt(formData.age),
          degree: formData.degree,
          year_of_completion: parseInt(formData.yearOfCompletion),
          specialty: formData.specialty,
          experience_years: parseInt(formData.experienceYears),
          extra_courses: formData.extraCourses,
          address: formData.address,
          country: formData.country,
          email: formData.email,
          phone: formData.phone,
          payment_details: formData.paymentDetails
        });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Registration Submitted Successfully!",
        description: "Your application is under review. You'll receive your Faculty ID upon approval."
      });

    } catch (error: any) {
      console.error('Error submitting faculty registration:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center shadow-elegant border-ai-accent/20">
          <CardContent className="pt-6 pb-8">
            <CheckCircle className="h-16 w-16 text-lab-green mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-academic mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Your faculty application is under admin review. Once approved, you'll receive your Faculty ID and can access your dashboard where you can edit your profile, add a photo, and manage your classes.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/faculty-dashboard")}
                className="w-full academic-gradient text-white"
              >
                Go to Faculty Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-primary/5 via-ai-accent/5 to-neural-purple/10">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-medical-primary via-ai-accent to-neural-purple py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Button 
            variant="secondary" 
            onClick={() => navigate("/")}
            className="text-ai-accent shadow-sm hover:shadow-md px-4 py-2 transition-all"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Brain className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Faculty Registration
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join our distinguished faculty team and shape the future of AI-powered medical education
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-elegant border-ai-accent/20">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-academic">Faculty Application Form</CardTitle>
              <CardDescription className="text-lg">
                Complete all required fields to join our medical education platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-academic">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="border-ai-accent/30 focus:border-ai-accent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        min="25"
                        max="70"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        className="border-ai-accent/30 focus:border-ai-accent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="border-ai-accent/30 focus:border-ai-accent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="border-ai-accent/30 focus:border-ai-accent"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Select onValueChange={(value) => handleInputChange("country", value)}>
                        <SelectTrigger className="border-ai-accent/30 focus:border-ai-accent">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="ES">Spain</SelectItem>
                          <SelectItem value="IN">India</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-1">
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="border-ai-accent/30 focus:border-ai-accent min-h-[80px]"
                        placeholder="Complete address including city, state, and postal code"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Qualifications */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-academic">Professional Qualifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree *</Label>
                      <Select onValueChange={(value) => handleInputChange("degree", value)} defaultValue="MBBS">
                        <SelectTrigger className="border-ai-accent/30 focus:border-ai-accent">
                          <SelectValue />
                        </SelectTrigger>
                         <SelectContent>
                          <SelectItem value="MBBS">MBBS</SelectItem>
                          <SelectItem value="BDS">BDS (Bachelor of Dental Surgery)</SelectItem>
                          
                          {/* Nursing Degrees */}
                          <SelectItem value="BSc_Nursing">BSc Nursing</SelectItem>
                          <SelectItem value="MSc_Nursing_MedSurg">MSc Nursing (Medical Surgical)</SelectItem>
                          <SelectItem value="MSc_Nursing_Pediatric">MSc Nursing (Pediatric)</SelectItem>
                          <SelectItem value="MSc_Nursing_OBG">MSc Nursing (OBG)</SelectItem>
                          <SelectItem value="MSc_Nursing_Psych">MSc Nursing (Psychiatric)</SelectItem>
                          <SelectItem value="MSc_Nursing_CommHealth">MSc Nursing (Community Health)</SelectItem>
                          
                          {/* Allied Health Degrees */}
                          <SelectItem value="BSc_Allied_MLT">BSc Allied Health (Medical Lab Technology)</SelectItem>
                          <SelectItem value="BSc_Allied_RT">BSc Allied Health (Radiology Technology)</SelectItem>
                          <SelectItem value="BSc_Allied_OT">BSc Allied Health (Operation Theater)</SelectItem>
                          <SelectItem value="MSc_Allied_MLT">MSc Allied Health (Medical Lab Technology)</SelectItem>
                          <SelectItem value="MSc_Allied_RT">MSc Allied Health (Radiology Technology)</SelectItem>
                          
                          {/* Physiotherapy Degrees */}
                          <SelectItem value="BPT">BPT (Bachelor of Physiotherapy)</SelectItem>
                          <SelectItem value="MPT_Ortho">MPT (Orthopedics)</SelectItem>
                          <SelectItem value="MPT_Neuro">MPT (Neurology)</SelectItem>
                          <SelectItem value="MPT_Sports">MPT (Sports)</SelectItem>
                          <SelectItem value="MPT_Cardio">MPT (Cardiovascular)</SelectItem>
                          
                          {/* Nutrition Degrees */}
                          <SelectItem value="BSc_Nutrition">BSc Nutrition and Dietetics</SelectItem>
                          <SelectItem value="MSc_Nutrition">MSc Nutrition and Dietetics</SelectItem>
                          
                          {/* Medical Degrees */}
                          <SelectItem value="MD">MD (Doctor of Medicine)</SelectItem>
                          <SelectItem value="DO">DO (Doctor of Osteopathic Medicine)</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearOfCompletion">Year of Completion *</Label>
                      <Input
                        id="yearOfCompletion"
                        type="number"
                        min="1980"
                        max={new Date().getFullYear()}
                        value={formData.yearOfCompletion}
                        onChange={(e) => handleInputChange("yearOfCompletion", e.target.value)}
                        className="border-ai-accent/30 focus:border-ai-accent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experienceYears">Experience (Years) *</Label>
                      <Input
                        id="experienceYears"
                        type="number"
                        min="0"
                        max="50"
                        value={formData.experienceYears}
                        onChange={(e) => handleInputChange("experienceYears", e.target.value)}
                        className="border-ai-accent/30 focus:border-ai-accent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty *</Label>
                    <Select onValueChange={(value) => handleInputChange("specialty", value)}>
                      <SelectTrigger className="border-ai-accent/30 focus:border-ai-accent">
                        <SelectValue placeholder="Select your specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Extra Courses */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-academic">Extra Courses / Certificates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {predefinedCourses.map((course) => (
                      <div key={course} className="flex items-center space-x-2">
                        <Checkbox
                          id={course}
                          checked={formData.extraCourses.includes(course)}
                          onCheckedChange={(checked) => handleCourseToggle(course, checked as boolean)}
                        />
                        <Label htmlFor={course} className="text-sm">{course}</Label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Custom Course Input */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add custom course/certificate"
                      value={customCourse}
                      onChange={(e) => setCustomCourse(e.target.value)}
                      className="border-ai-accent/30 focus:border-ai-accent"
                    />
                    <Button type="button" onClick={addCustomCourse} variant="outline">
                      Add
                    </Button>
                  </div>
                  
                  {/* Selected Courses */}
                  {formData.extraCourses.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Courses:</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.extraCourses.map((course) => (
                          <div key={course} className="flex items-center bg-ai-accent/10 rounded-full px-3 py-1">
                            <span className="text-sm">{course}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCourse(course)}
                              className="ml-2 h-4 w-4 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-academic flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <Select onValueChange={(value) => handleInputChange("paymentDetails.accountType", value)}>
                        <SelectTrigger className="border-ai-accent/30 focus:border-ai-accent">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checking">Checking Account</SelectItem>
                          <SelectItem value="savings">Savings Account</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={formData.paymentDetails.bankName}
                        onChange={(e) => handleInputChange("paymentDetails.bankName", e.target.value)}
                        className="border-ai-accent/30 focus:border-ai-accent"
                        placeholder="Bank name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={formData.paymentDetails.accountNumber}
                        onChange={(e) => handleInputChange("paymentDetails.accountNumber", e.target.value)}
                        className="border-ai-accent/30 focus:border-ai-accent"
                        placeholder="Account number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input
                        id="routingNumber"
                        value={formData.paymentDetails.routingNumber}
                        onChange={(e) => handleInputChange("paymentDetails.routingNumber", e.target.value)}
                        className="border-ai-accent/30 focus:border-ai-accent"
                        placeholder="Routing number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paypalEmail">PayPal Email (if using PayPal)</Label>
                    <Input
                      id="paypalEmail"
                      type="email"
                      value={formData.paymentDetails.paypalEmail}
                      onChange={(e) => handleInputChange("paymentDetails.paypalEmail", e.target.value)}
                      className="border-ai-accent/30 focus:border-ai-accent"
                      placeholder="paypal@example.com"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full academic-gradient text-white shadow-campus hover:shadow-elegant transition-all duration-300"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-2" />
                        Submit Faculty Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};