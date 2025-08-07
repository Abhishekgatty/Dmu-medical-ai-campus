import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Calendar,
  Search,
  Filter,
  ExternalLink,
  User,
  AlertTriangle,
  FileText,
  Stethoscope
} from 'lucide-react';

interface ClinicalRotationCenter {
  id: string;
  name: string;
  country: string;
  state: string;
  city: string;
  address: string;
  website_url?: string;
  contact_person_academics?: string;
  contact_email: string;
  contact_phone?: string;
  departments?: string[];
  facilities?: string[];
  specialties?: string[];
  clinical_setup_walkthrough?: string;
  tie_up_since: string;
  number_of_beds?: number;
  capacity: number;
  current_students: number;
  application_requirements?: string[];
  created_at: string;
}

const InternationalClinicalRotations = () => {
  const navigate = useNavigate();
  const [centers, setCenters] = useState<ClinicalRotationCenter[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<ClinicalRotationCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');

  // Sample data for demonstration
  const sampleCenters: ClinicalRotationCenter[] = [
    {
      id: '1',
      name: 'Johns Hopkins Hospital',
      country: 'United States',
      state: 'Maryland',
      city: 'Baltimore',
      address: '1800 Orleans St, Baltimore, MD 21287',
      website_url: 'https://www.hopkinsmedicine.org',
      contact_person_academics: 'Dr. Jennifer Martinez, MD',
      contact_email: 'rotations@jhmi.edu',
      contact_phone: '+1-410-955-5000',
      departments: ['Cardiology', 'Oncology', 'Neurology', 'Emergency Medicine'],
      facilities: ['Level 1 Trauma Center', 'Heart Institute', 'Cancer Center', 'Research Labs'],
      specialties: ['Cardiac Surgery', 'Oncology', 'Neurosurgery'],
      clinical_setup_walkthrough: 'Our clinical rotation program offers comprehensive hands-on experience in a world-renowned academic medical center. Students will participate in daily rounds, case presentations, and direct patient care under supervision. The program includes access to cutting-edge medical technology, interdisciplinary team meetings, and research opportunities. Students are expected to maintain professionalism, punctuality, and active participation in all clinical activities.',
      tie_up_since: '2015',
      number_of_beds: 1154,
      capacity: 25,
      current_students: 22,
      application_requirements: ['USMLE Step 1 Pass', 'English Proficiency', 'Medical Malpractice Insurance', 'Background Check'],
      created_at: '2015-03-15T00:00:00.000Z'
    },
    {
      id: '2',
      name: 'Hospital Universitario La Paz',
      country: 'Spain',
      state: 'Madrid',
      city: 'Madrid',
      address: 'Paseo de la Castellana, 261, 28046 Madrid',
      website_url: 'https://www.madrid.org/hospitallapaz',
      contact_person_academics: 'Dr. Carlos Rodriguez, MD PhD',
      contact_email: 'rotaciones.internacionales@salud.madrid.org',
      contact_phone: '+34-91-727-7000',
      departments: ['Internal Medicine', 'Pediatrics', 'Surgery', 'Radiology'],
      facilities: ['Emergency Department', 'ICU', 'Operating Theaters', 'Simulation Center'],
      specialties: ['Pediatric Surgery', 'Maternal Medicine', 'Emergency Medicine'],
      clinical_setup_walkthrough: 'Students will be integrated into our multidisciplinary healthcare teams and participate in patient care across various departments. The rotation includes morning rounds, clinical case discussions, and exposure to Spanish healthcare system practices. Students will have opportunities to observe advanced procedures and participate in patient education. Basic Spanish language skills are recommended but not mandatory.',
      tie_up_since: '2018',
      number_of_beds: 1368,
      capacity: 15,
      current_students: 13,
      application_requirements: ['EU Health Insurance', 'Spanish Language Certificate (Recommended)', 'Vaccination Records', 'CV in Spanish/English'],
      created_at: '2018-06-10T00:00:00.000Z'
    },
    {
      id: '3',
      name: 'Singapore General Hospital',
      country: 'Singapore',
      state: 'Central Region',
      city: 'Singapore',
      address: 'Outram Rd, Singapore 169608',
      website_url: 'https://www.sgh.com.sg',
      contact_person_academics: 'Dr. Lim Wei Ming, MBBS FRCS',
      contact_email: 'clinical.education@sgh.com.sg',
      contact_phone: '+65-6222-3322',
      departments: ['General Surgery', 'Orthopedics', 'Gastroenterology', 'Cardiology'],
      facilities: ['Robotic Surgery Center', 'Advanced Cardiac Center', 'Emergency Department'],
      specialties: ['Minimally Invasive Surgery', 'Interventional Cardiology', 'Medical Oncology'],
      clinical_setup_walkthrough: 'The clinical rotation program provides exposure to Asian medical practices and diverse patient populations. Students will participate in ward rounds, outpatient clinics, and surgical observations. The program emphasizes evidence-based medicine and cultural competency. Students will have access to our medical library, simulation facilities, and research opportunities.',
      tie_up_since: '2020',
      number_of_beds: 1785,
      capacity: 20,
      current_students: 18,
      application_requirements: ['Singapore Work Pass', 'Medical Clearance', 'English Proficiency', 'Liability Insurance'],
      created_at: '2020-01-20T00:00:00.000Z'
    },
    {
      id: '4',
      name: 'Charité - Universitätsmedizin Berlin',
      country: 'Germany',
      state: 'Berlin',
      city: 'Berlin',
      address: 'Charitéplatz 1, 10117 Berlin',
      website_url: 'https://www.charite.de',
      contact_person_academics: 'Prof. Dr. med. Klaus Mueller',
      contact_email: 'international.rotations@charite.de',
      contact_phone: '+49-30-450-50',
      departments: ['Internal Medicine', 'Surgery', 'Neurology', 'Psychiatry'],
      facilities: ['Research Institute', 'Transplant Center', 'Neuroscience Center'],
      specialties: ['Transplant Medicine', 'Neuroscience', 'Medical Research'],
      clinical_setup_walkthrough: 'Students will experience the German healthcare system and participate in comprehensive patient care. The rotation includes bedside teaching, interdisciplinary conferences, and research seminars. Students are expected to actively participate in patient care decisions and case presentations. Basic German language skills are beneficial for better patient interaction.',
      tie_up_since: '2017',
      number_of_beds: 3001,
      capacity: 30,
      current_students: 28,
      application_requirements: ['German Language Certificate (A2 Level)', 'EU Health Insurance', 'Medical License Recognition', 'Background Verification'],
      created_at: '2017-09-05T00:00:00.000Z'
    },
    {
      id: '5',
      name: 'Tokyo Medical University Hospital',
      country: 'Japan',
      state: 'Tokyo',
      city: 'Shinjuku',
      address: '6-7-1 Nishishinjuku, Shinjuku City, Tokyo 160-0023',
      website_url: 'https://www.tokyo-med.ac.jp',
      contact_person_academics: 'Dr. Hiroshi Tanaka, MD PhD',
      contact_email: 'global.education@tokyo-med.ac.jp',
      contact_phone: '+81-3-3342-6111',
      departments: ['Internal Medicine', 'Surgery', 'Pediatrics', 'Radiology'],
      facilities: ['Advanced Imaging Center', 'Minimally Invasive Surgery Suite', 'Emergency Center'],
      specialties: ['Robotic Surgery', 'Advanced Imaging', 'Geriatric Medicine'],
      clinical_setup_walkthrough: 'Students will be immersed in Japanese medical culture and practices. The program includes participation in morning conferences, patient rounds, and cultural orientation sessions. Students will observe unique Japanese approaches to patient care and medical ethics. Translation services are provided for clinical activities.',
      tie_up_since: '2019',
      number_of_beds: 1015,
      capacity: 12,
      current_students: 10,
      application_requirements: ['Japanese Visa', 'Health Clearance', 'Cultural Orientation Completion', 'English/Japanese Language Proof'],
      created_at: '2019-04-12T00:00:00.000Z'
    }
  ];

  useEffect(() => {
    fetchRotationCenters();
  }, []);

  useEffect(() => {
    filterCenters();
  }, [centers, searchQuery, selectedCountry]);

  const fetchRotationCenters = async () => {
    try {
      setLoading(true);
      // Try to fetch from database
      const { data: dbCenters, error } = await supabase
        .from('clinical_centers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rotation centers:', error);
      }

      // Transform database data to match expected structure
      const transformedDbCenters = (dbCenters || []).map(center => ({
        ...center,
        state: center.city || 'N/A', // Use city as state fallback since state might not exist in DB
        departments: center.departments || [],
        facilities: center.facilities || [],
        specialties: center.specialties || [],
        application_requirements: [],
        clinical_setup_walkthrough: 'Clinical setup details will be provided upon acceptance.',
        tie_up_since: center.created_at ? new Date(center.created_at).getFullYear().toString() : '2020',
        contact_person_academics: center.head_name || 'Academic Coordinator',
        contact_email: center.contact_email || 'contact@hospital.com',
        website_url: `https://${center.name.toLowerCase().replace(/\s+/g, '-')}.org`
      }));

      // Use sample data for demonstration
      const allCenters = [...sampleCenters, ...transformedDbCenters];
      setCenters(allCenters);
    } catch (error) {
      console.error('Error:', error);
      setCenters(sampleCenters);
      toast.error('Failed to load rotation centers');
    } finally {
      setLoading(false);
    }
  };

  const filterCenters = () => {
    let filtered = centers;

    // Filter by country
    if (selectedCountry !== 'All') {
      filtered = filtered.filter(center => center.country === selectedCountry);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(center =>
        center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (center.departments || []).some(dept => 
          dept.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredCenters(filtered);
  };

  const getUniqueCountries = () => {
    const countries = centers.map(center => center.country);
    return ['All', ...Array.from(new Set(countries))];
  };

  const handleApplyNow = (center: ClinicalRotationCenter) => {
    const subject = `Clinical Rotation Application - ${center.name}`;
    const body = `Dear ${center.contact_person_academics || 'Academic Coordinator'},

I am writing to express my interest in applying for a clinical rotation at ${center.name}.

Student Details:
- Name: [Your Full Name]
- Medical School: DMU Medical AI Campus
- Current Year/Level: [Your Current Year]
- Proposed Rotation Dates: [Start Date] to [End Date]
- Department of Interest: [Preferred Department]

I have reviewed the requirements and understand that acceptance is subject to your institution's evaluation process.

Please let me know the next steps in the application process and any additional documentation required.

Thank you for your consideration.

Best regards,
[Your Name]
[Your Contact Information]`;

    const mailtoLink = `mailto:${center.contact_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    
    toast.success('Email client opened with pre-filled application template');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading Clinical Rotation Centers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-medical-primary/10 to-medical-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Stethoscope className="h-10 w-10" />
              International Clinical Rotations
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hands-on clinical experience at top medical institutions across 50+ countries
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
            Back
          </Button>
        </div>

        {/* Important Disclaimer */}
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-amber-800">Important Disclaimer</AlertTitle>
          <AlertDescription className="text-amber-700">
            <strong>Apply at your own risk:</strong> Acceptance for clinical rotations is purely based on the individual clinic/hospital's evaluation process and criteria. DMU is not responsible for rejections and cannot influence the selection process. Students may reapply to different centers if not accepted. Please ensure you meet all requirements before applying.
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {getUniqueCountries().map(country => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by hospital name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {filteredCenters.length} rotation center{filteredCenters.length !== 1 ? 's' : ''}
          {selectedCountry !== 'All' && ` in ${selectedCountry}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {/* Rotation Centers Grid */}
        <div className="grid grid-cols-1 gap-8">
          {filteredCenters.map((center) => (
            <Card key={center.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold mb-2 flex items-center gap-3">
                      <Building2 className="h-6 w-6 text-primary" />
                      {center.name}
                    </CardTitle>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{center.address}, {center.city}, {center.state}, {center.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>DMU Partner since {center.tie_up_since}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white">
                    Active Partner
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Contact Information */}
                    <div>
                      <h4 className="font-semibold mb-3 text-lg flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Academic Contact
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Contact Person:</strong> {center.contact_person_academics}</p>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span>{center.contact_email}</span>
                        </div>
                        {center.contact_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span>{center.contact_phone}</span>
                          </div>
                        )}
                        {center.website_url && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3" />
                            <a 
                              href={center.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              Visit Website
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Departments */}
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Available Departments</h4>
                      <div className="flex flex-wrap gap-1">
                        {(center.departments || []).map((dept, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {dept}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Facilities */}
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Key Facilities</h4>
                      <div className="flex flex-wrap gap-1">
                        {(center.facilities || []).map((facility, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{center.number_of_beds || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">Beds</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-medical-secondary">
                          {center.current_students}/{center.capacity}
                        </p>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Clinical Setup Walkthrough */}
                    <div>
                      <h4 
                        className="font-semibold mb-3 text-lg flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => window.open(`${center.website_url}/gallery`, '_blank')}
                      >
                        <FileText className="h-4 w-4" />
                        Clinical Setup Overview
                        <ExternalLink className="h-3 w-3" />
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {center.clinical_setup_walkthrough}
                      </p>
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs flex items-center gap-1 hover:bg-primary/10"
                          onClick={() => window.open(`${center.website_url}/gallery`, '_blank')}
                        >
                          View Clinical Setup Gallery
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Application Requirements */}
                    {center.application_requirements && center.application_requirements.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Application Requirements</h4>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {center.application_requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-primary rounded-full"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Apply Button */}
                    <div className="pt-4">
                      <Button
                        onClick={() => handleApplyNow(center)}
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                        size="lg"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Apply via Email
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        This will open your email client with a pre-filled application template
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCenters.length === 0 && (
          <div className="text-center py-12">
            <Stethoscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No rotation centers found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCountry !== 'All'
                ? 'Try adjusting your filters or search terms'
                : 'No rotation centers available at the moment'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternationalClinicalRotations;