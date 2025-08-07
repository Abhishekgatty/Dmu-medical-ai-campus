import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Stethoscope, Building2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ClinicalPartnership = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: "",
    contactName: "",
    title: "",
    email: "",
    phone: "",
    organizationType: "",
    location: "",
    specialties: [] as string[],
    capacity: "",
    experience: "",
    partnership: "",
    objectives: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialties: checked 
        ? [...prev.specialties, specialty]
        : prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Clinical partnership submitted:", formData);
  };

  const medicalSpecialties = [
    "Cardiology", "Neurology", "Oncology", "Pediatrics", "Emergency Medicine",
    "Radiology", "Pathology", "Surgery", "Internal Medicine", "Psychiatry",
    "Dermatology", "Orthopedics", "AI Diagnostics", "Telemedicine"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-secondary/5 via-ai-accent/5 to-lab-green/10">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-medical-secondary via-ai-accent to-lab-green py-20">
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
            <div className="flex justify-center mb-4">
              <Stethoscope className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Clinical Partnership
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Partner with DMU to provide cutting-edge clinical training and AI-enhanced medical education
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-elegant border-medical-secondary/20">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-academic">Partnership Application</CardTitle>
              <CardDescription className="text-lg">
                Join our network of clinical partners in revolutionizing medical education
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Organization Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange("organizationName", e.target.value)}
                      className="border-medical-secondary/30 focus:border-medical-secondary"
                      placeholder="Hospital, Clinic, Healthcare System"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizationType">Organization Type *</Label>
                    <Select onValueChange={(value) => handleInputChange("organizationType", value)}>
                      <SelectTrigger className="border-medical-secondary/30 focus:border-medical-secondary">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="clinic">Clinic</SelectItem>
                        <SelectItem value="healthcare-system">Healthcare System</SelectItem>
                        <SelectItem value="research-center">Research Center</SelectItem>
                        <SelectItem value="specialty-practice">Specialty Practice</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Primary Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      className="border-medical-secondary/30 focus:border-medical-secondary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title/Position *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="border-medical-secondary/30 focus:border-medical-secondary"
                      placeholder="e.g., Chief Medical Officer, Director"
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
                      className="border-medical-secondary/30 focus:border-medical-secondary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-medical-secondary/30 focus:border-medical-secondary"
                      required
                    />
                  </div>
                </div>

                {/* Location & Capacity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location (City, State/Country) *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="border-medical-secondary/30 focus:border-medical-secondary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Student Training Capacity</Label>
                    <Input
                      id="capacity"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange("capacity", e.target.value)}
                      className="border-medical-secondary/30 focus:border-medical-secondary"
                      placeholder="e.g., 10-15 students per rotation"
                    />
                  </div>
                </div>

                {/* Medical Specialties */}
                <div className="space-y-4">
                  <Label>Available Medical Specialties *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {medicalSpecialties.map((specialty) => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox
                          id={specialty}
                          checked={formData.specialties.includes(specialty)}
                          onCheckedChange={(checked) => 
                            handleSpecialtyChange(specialty, checked as boolean)
                          }
                        />
                        <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience & Partnership Details */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Medical Education Experience</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      className="border-medical-secondary/30 focus:border-medical-secondary min-h-[100px]"
                      placeholder="Describe your experience with medical student training, residency programs, or clinical education..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partnership">Partnership Interest *</Label>
                    <Textarea
                      id="partnership"
                      value={formData.partnership}
                      onChange={(e) => handleInputChange("partnership", e.target.value)}
                      className="border-medical-secondary/30 focus:border-medical-secondary min-h-[100px]"
                      placeholder="What type of partnership are you interested in? (Clinical rotations, research collaboration, AI training, etc.)"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objectives">Partnership Objectives</Label>
                    <Textarea
                      id="objectives"
                      value={formData.objectives}
                      onChange={(e) => handleInputChange("objectives", e.target.value)}
                      className="border-medical-secondary/30 focus:border-medical-secondary min-h-[100px]"
                      placeholder="What do you hope to achieve through this partnership with DMU Medical AI Campus?"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-medical-secondary to-lab-green text-white shadow-campus hover:shadow-elegant transition-all duration-300"
                    size="lg"
                  >
                    <Building2 className="w-5 h-5 mr-2" />
                    Submit Partnership Application
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