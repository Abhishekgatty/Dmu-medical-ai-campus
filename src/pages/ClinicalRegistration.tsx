import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ClinicalRegistration = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    facility_name: '',
    head_name: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    facilities: [] as string[],
    number_of_beds: '',
    departments: [] as string[],
    student_roll_numbers: [] as string[],
    course_accepting: [] as string[],
    international_students: false
  });

  const facilityOptions = ['OPD', 'IPD', 'OT', 'Casualty'];
  const departmentOptions = [
    'Internal Medicine', 'Surgery', 'Pediatrics', 'Obstetrics & Gynecology',
    'Psychiatry', 'Orthopedics', 'Dermatology', 'Radiology', 'Pathology',
    'Anesthesiology', 'Emergency Medicine', 'Cardiology', 'Neurology'
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*');
    
    if (error) {
      toast.error('Failed to load courses');
      return;
    }
    
    setCourses(data || []);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleRollNumbersChange = (value: string) => {
    const rollNumbers = value.split(',').map(num => num.trim()).filter(num => num);
    setFormData(prev => ({
      ...prev,
      student_roll_numbers: rollNumbers
    }));
  };

  const handleLocationSelect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          toast.success('Location captured successfully');
        },
        (error) => {
          toast.error('Failed to get location. Please enable location services.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('clinical_registrations')
        .insert({
          facility_name: formData.facility_name,
          head_name: formData.head_name,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          state: formData.state,
          address: formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude,
          facilities: formData.facilities,
          number_of_beds: parseInt(formData.number_of_beds),
          departments: formData.departments,
          student_roll_numbers: formData.student_roll_numbers,
          course_accepting: formData.course_accepting,
          international_students: formData.international_students
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Clinical registration submitted successfully! Awaiting admin approval.');
      navigate('/clinical-dashboard');
    } catch (error: any) {
      toast.error('Failed to submit registration: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Clinical Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facility_name">Name of Clinic/Hospital/Medical Facility *</Label>
                  <Input
                    id="facility_name"
                    value={formData.facility_name}
                    onChange={(e) => handleInputChange('facility_name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="head_name">Head Name *</Label>
                  <Input
                    id="head_name"
                    value={formData.head_name}
                    onChange={(e) => handleInputChange('head_name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Google Maps Location</Label>
                  <div className="flex items-center gap-4">
                    <Button type="button" onClick={handleLocationSelect} variant="outline">
                      📍 Get Current Location
                    </Button>
                    {formData.latitude && formData.longitude && (
                      <span className="text-sm text-muted-foreground">
                        Location: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="number_of_beds">Number of Beds *</Label>
                  <Input
                    id="number_of_beds"
                    type="number"
                    value={formData.number_of_beds}
                    onChange={(e) => handleInputChange('number_of_beds', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Facilities *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {facilityOptions.map((facility) => (
                    <div key={facility} className="flex items-center space-x-2">
                      <Checkbox
                        id={facility}
                        checked={formData.facilities.includes(facility)}
                        onCheckedChange={(checked) => 
                          handleArrayChange('facilities', facility, !!checked)
                        }
                      />
                      <Label htmlFor={facility}>{facility}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Departments *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                  {departmentOptions.map((dept) => (
                    <div key={dept} className="flex items-center space-x-2">
                      <Checkbox
                        id={dept}
                        checked={formData.departments.includes(dept)}
                        onCheckedChange={(checked) => 
                          handleArrayChange('departments', dept, !!checked)
                        }
                      />
                      <Label htmlFor={dept} className="text-sm">{dept}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="student_roll_numbers">Student Acceptance (Roll Numbers)</Label>
                <Textarea
                  id="student_roll_numbers"
                  placeholder="Enter roll numbers separated by commas (e.g., 2023001, 2023002, 2023003)"
                  onChange={(e) => handleRollNumbersChange(e.target.value)}
                />
              </div>

              <div>
                <Label>Courses Accepting</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={course.id}
                        checked={formData.course_accepting.includes(course.id)}
                        onCheckedChange={(checked) => 
                          handleArrayChange('course_accepting', course.id, !!checked)
                        }
                      />
                      <Label htmlFor={course.id}>{course.name} ({course.code})</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="international_students"
                  checked={formData.international_students}
                  onCheckedChange={(checked) => 
                    handleInputChange('international_students', !!checked)
                  }
                />
                <Label htmlFor="international_students">Accept International Students</Label>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClinicalRegistration;