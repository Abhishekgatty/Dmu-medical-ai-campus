import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  ExternalLink
} from 'lucide-react';

interface ClinicalCenter {
  id: string;
  name: string;
  country: string;
  city: string;
  address: string;
  contact_email?: string;
  contact_phone?: string;
  head_name?: string;
  departments?: string[];
  facilities?: string[];
  specialties?: string[];
  number_of_beds?: number;
  capacity: number;
  current_students: number;
  created_at: string;
}

const ClinicalNetwork = () => {
  const navigate = useNavigate();
  const [centers, setCenters] = useState<ClinicalCenter[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<ClinicalCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');

  // Sample data for demonstration
  const sampleCenters: ClinicalCenter[] = [
    {
      id: '1',
      name: 'Mayo Clinic',
      country: 'United States',
      city: 'Rochester, MN',
      address: '200 First St SW, Rochester, MN 55905',
      contact_email: 'partnerships@mayo.edu',
      contact_phone: '+1-507-284-2511',
      head_name: 'Dr. Sarah Johnson',
      departments: ['Cardiology', 'Oncology', 'Neurology', 'Surgery'],
      facilities: ['ICU', 'Emergency Department', 'Research Labs', 'Simulation Center'],
      specialties: ['Heart Surgery', 'Cancer Treatment', 'Neurological Disorders'],
      number_of_beds: 1265,
      capacity: 50,
      current_students: 42,
      created_at: '2019-03-15T00:00:00.000Z'
    },
    {
      id: '2',
      name: 'All Institute of Medical Sciences (AIIMS)',
      country: 'India',
      city: 'New Delhi',
      address: 'Ansari Nagar, New Delhi, Delhi 110029',
      contact_email: 'international@aiims.ac.in',
      contact_phone: '+91-11-2659-3333',
      head_name: 'Dr. Rajesh Kumar',
      departments: ['Internal Medicine', 'Pediatrics', 'Gynecology', 'Orthopedics'],
      facilities: ['Teaching Hospital', 'Research Institute', 'Trauma Center'],
      specialties: ['Medical Education', 'Research', 'Patient Care'],
      number_of_beds: 2478,
      capacity: 75,
      current_students: 68,
      created_at: '2018-08-20T00:00:00.000Z'
    },
    {
      id: '3',
      name: 'Royal London Hospital',
      country: 'United Kingdom',
      city: 'London',
      address: 'Whitechapel Rd, Whitechapel, London E1 1BB',
      contact_email: 'education@bartshealth.nhs.uk',
      contact_phone: '+44-20-7377-7000',
      head_name: 'Dr. Margaret Thompson',
      departments: ['Emergency Medicine', 'Surgery', 'Radiology', 'Pathology'],
      facilities: ['Major Trauma Center', 'Helicopter Landing Pad', 'Advanced Imaging'],
      specialties: ['Emergency Care', 'Trauma Surgery', 'Medical Imaging'],
      number_of_beds: 845,
      capacity: 40,
      current_students: 35,
      created_at: '2020-01-10T00:00:00.000Z'
    },
    {
      id: '4',
      name: 'Toronto General Hospital',
      country: 'Canada',
      city: 'Toronto, ON',
      address: '200 Elizabeth St, Toronto, ON M5G 2C4',
      contact_email: 'education@uhn.ca',
      contact_phone: '+1-416-340-4800',
      head_name: 'Dr. Michael Chen',
      departments: ['Transplant Surgery', 'Cardiology', 'Infectious Diseases'],
      facilities: ['Organ Transplant Center', 'Cardiac Surgery', 'Research Labs'],
      specialties: ['Organ Transplantation', 'Heart Surgery', 'Clinical Research'],
      number_of_beds: 471,
      capacity: 30,
      current_students: 28,
      created_at: '2019-11-05T00:00:00.000Z'
    },
    {
      id: '5',
      name: 'Hospital Universitario La Paz',
      country: 'Spain',
      city: 'Madrid',
      address: 'Paseo de la Castellana, 261, 28046 Madrid',
      contact_email: 'internacional@hulp.es',
      contact_phone: '+34-91-727-7000',
      head_name: 'Dr. Carmen Rodriguez',
      departments: ['Pediatrics', 'Neonatology', 'Maternal Medicine', 'Surgery'],
      facilities: ['Children Hospital', 'Maternity Ward', 'NICU'],
      specialties: ['Pediatric Care', 'Maternal Health', 'Neonatal Medicine'],
      number_of_beds: 1368,
      capacity: 45,
      current_students: 41,
      created_at: '2017-09-12T00:00:00.000Z'
    }
  ];

  useEffect(() => {
    fetchClinicalCenters();
  }, []);

  useEffect(() => {
    filterCenters();
  }, [centers, searchQuery, selectedCountry]);

  const fetchClinicalCenters = async () => {
    try {
      setLoading(true);
      // Try to fetch from database
      const { data: dbCenters, error } = await supabase
        .from('clinical_centers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clinical centers:', error);
      }

      // Transform database data to match expected structure
      const transformedDbCenters = (dbCenters || []).map(center => ({
        ...center,
        departments: center.departments || [],
        facilities: center.facilities || [],
        specialties: center.specialties || []
      }));

      // Use sample data for demonstration
      const allCenters = [...sampleCenters, ...transformedDbCenters];
      setCenters(allCenters);
    } catch (error) {
      console.error('Error:', error);
      setCenters(sampleCenters);
      toast.error('Failed to load clinical centers');
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

  const getYearOfAttachment = (createdAt: string) => {
    return new Date(createdAt).getFullYear();
  };

  const getUniqueCountries = () => {
    const countries = centers.map(center => center.country);
    return ['All', ...Array.from(new Set(countries))];
  };

  const generateWebsiteUrl = (centerName: string) => {
    // Generate a sample website URL based on center name
    const slug = centerName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `https://${slug}.org`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading Clinical Network...</p>
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
              <Building2 className="h-10 w-10" />
              Global Clinical Network
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our worldwide network of prestigious medical institutions and clinical partners providing world-class training opportunities
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
          Showing {filteredCenters.length} clinical center{filteredCenters.length !== 1 ? 's' : ''}
          {selectedCountry !== 'All' && ` in ${selectedCountry}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {/* Clinical Centers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCenters.map((center) => (
            <Card key={center.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold mb-2 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      {center.name}
                    </CardTitle>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{center.city}, {center.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>DMU Partner since {getYearOfAttachment(center.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white">
                    Active Partner
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                {/* Address */}
                <div>
                  <h4 className="font-medium mb-2 text-sm">Address</h4>
                  <p className="text-sm text-muted-foreground">{center.address}</p>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {center.contact_email && (
                    <div>
                      <h4 className="font-medium mb-1 text-sm flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Contact Email
                      </h4>
                      <p className="text-sm text-muted-foreground">{center.contact_email}</p>
                    </div>
                  )}
                  {center.contact_phone && (
                    <div>
                      <h4 className="font-medium mb-1 text-sm flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Phone
                      </h4>
                      <p className="text-sm text-muted-foreground">{center.contact_phone}</p>
                    </div>
                  )}
                </div>

                {/* Head of Department */}
                {center.head_name && (
                  <div>
                    <h4 className="font-medium mb-1 text-sm">Head of Partnership</h4>
                    <p className="text-sm text-muted-foreground">{center.head_name}</p>
                  </div>
                )}

                {/* Departments */}
                <div>
                  <h4 className="font-medium mb-2 text-sm">Departments</h4>
                  <div className="flex flex-wrap gap-1">
                    {(center.departments || []).slice(0, 4).map((dept, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {dept}
                      </Badge>
                    ))}
                    {(center.departments || []).length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{(center.departments || []).length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <h4 className="font-medium mb-2 text-sm">Key Facilities</h4>
                  <div className="flex flex-wrap gap-1">
                    {(center.facilities || []).slice(0, 3).map((facility, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                    {(center.facilities || []).length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{(center.facilities || []).length - 3} more
                      </Badge>
                    )}
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

                {/* Website Link */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2"
                    onClick={() => window.open(generateWebsiteUrl(center.name), '_blank')}
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCenters.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No clinical centers found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCountry !== 'All'
                ? 'Try adjusting your filters or search terms'
                : 'No clinical centers available at the moment'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalNetwork;