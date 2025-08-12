import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  GraduationCap, 
  Clock, 
  Search, 
  Filter,
  BookOpen,
  Award,
  Users,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { HeaderNew } from '@/components/HeaderNew';

interface Course {
  id: string;
  name: string;
  code: string;
  duration: string;
  category: string;
  specializations: string[];
  description: string;
  image?: string;
}

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Predefined courses data
  const predefinedCourses: Course[] = [
    {
      id: '1',
      name: 'Bachelor of Science in Nursing',
      code: 'BSC-NUR',
      duration: '4 Years',
      category: 'Nursing',
      specializations: ['General Nursing', 'Critical Care', 'Community Health'],
      description: 'Comprehensive nursing program integrating AI-powered patient care simulation, evidence-based practice, and global healthcare standards. Students gain hands-on experience through virtual reality training, AI-assisted diagnosis tools, and international clinical rotations in partnership with leading hospitals worldwide.',
      image: 'photo-1581091226825-a6a2a5aee158'
    },
    {
      id: '2',
      name: 'Diploma in Nursing',
      code: 'DIP-NUR',
      duration: '3 Years + 1 Year Internship',
      category: 'Nursing',
      specializations: ['General Nursing', 'Midwifery', 'Geriatric Care'],
      description: 'Accelerated nursing diploma with AI-enhanced clinical training and mandatory internship. Features cutting-edge simulation labs, machine learning-based patient monitoring systems, and personalized learning algorithms that adapt to each student\'s progress and learning style.',
      image: 'photo-1461749280684-dccba630e2f6'
    },
    {
      id: '3',
      name: 'Master of Science in Nursing',
      code: 'MSC-NUR',
      duration: '2 Years',
      category: 'Nursing',
      specializations: ['Pediatric Nursing', 'Psychiatric Nursing', 'Oncology Nursing', 'Cardiac Nursing'],
      description: 'Advanced nursing specialization program with AI-integrated research methodologies and specialized clinical practice. Incorporates predictive analytics for patient outcomes, AI-powered diagnostic support systems, and advanced telehealth technologies for remote patient monitoring and care.',
      image: 'photo-1486312338219-ce68d2c6f44d'
    },
    {
      id: '4',
      name: 'Allied Health Sciences',
      code: 'AHS',
      duration: '3 Years + 1 Year Internship',
      category: 'Allied Health',
      specializations: ['Medical Imaging Technology (MIT)', 'Medical Laboratory Technology (MLT)', 'Radiology', 'Physiotherapy Assistant'],
      description: 'Comprehensive allied health program featuring AI-powered diagnostic tools, automated laboratory systems, and smart medical imaging technologies. Students learn to operate advanced AI-driven medical equipment and contribute to precision medicine through data-driven healthcare solutions.',
      image: 'photo-1487058792275-0ad4aaf24ca7'
    },
    {
      id: '5',
      name: 'Bachelor/Master of Physiotherapy',
      code: 'BPT-MPT',
      duration: 'BPT: 4.5 Years | MPT: 2 Years',
      category: 'Physiotherapy',
      specializations: ['Sports Physiotherapy', 'Neurological Rehabilitation', 'Orthopedic Therapy', 'Pediatric Physiotherapy'],
      description: 'Revolutionary physiotherapy program integrating AI-powered movement analysis, robotic rehabilitation systems, and personalized treatment protocols. Features virtual reality therapy sessions, biomechanical assessment tools, and machine learning algorithms for optimal recovery planning.',
      image: 'photo-1498050108023-c5249f4df085'
    },
    {
      id: '6',
      name: 'Bachelor of Medicine & Surgery',
      code: 'MBBS',
      duration: '5.5 Years + 1 Year Internship',
      category: 'Medicine',
      specializations: ['Internal Medicine', 'Surgery', 'Pediatrics', 'Radiology'],
      description: 'Comprehensive medical degree program with AI-enhanced diagnostic training, surgical simulation, and clinical decision support systems. Includes virtual patient encounters, AI-powered differential diagnosis tools, and integration with electronic health records for evidence-based practice.',
      image: 'photo-1483058712412-4245e9b90334'
    },
    {
      id: '7',
      name: 'Bachelor of Dental Surgery',
      code: 'BDS',
      duration: '5 Years + 1 Year Internship',
      category: 'Dentistry',
      specializations: ['Oral Surgery', 'Orthodontics', 'Periodontics', 'Pediatric Dentistry'],
      description: 'Advanced dental education program featuring AI-assisted diagnosis, 3D printing technologies, and digital dentistry techniques. Incorporates automated treatment planning, smart dental imaging systems, and machine learning algorithms for precision dental care and patient management.',
      image: 'photo-1519389950473-47ba0277781c'
    }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, selectedCategory, searchKeyword]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // First try to fetch from database
      const { data: dbCourses, error } = await supabase
        .from('courses')
        .select('*');

      if (error) {
        console.error('Error fetching courses:', error);
      }

      // Combine database courses with predefined courses
      const allCourses = [
        ...predefinedCourses,
        ...(dbCourses || []).map(course => ({
          ...course,
          specializations: [],
          category: 'General',
          image: 'photo-1581090464777-f3220bbe1b8b'
        }))
      ];

      setCourses(allCourses);
    } catch (error) {
      console.error('Error:', error);
      setCourses(predefinedCourses);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Filter by search keyword
    if (searchKeyword) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        course.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        course.specializations.some(spec => 
          spec.toLowerCase().includes(searchKeyword.toLowerCase())
        )
      );
    }

    setFilteredCourses(filtered);
  };

  const handleApplyNow = async (course: Course) => {
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please log in to apply for courses');
        navigate('/student-enrollment');
        return;
      }

      // Check if user already has an enrollment
      const { data: enrollment, error } = await supabase
        .from('student_enrollments')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking enrollment:', error);
        toast.error('Error checking enrollment status');
        return;
      }

      if (enrollment) {
        if (enrollment.status === 'approved') {
          // Navigate to student dashboard
          toast.success('Redirecting to your student dashboard...');
          navigate('/student-dashboard');
        } else {
          // Navigate to student portal
          toast.info('Redirecting to your application status...');
          navigate('/student-portal');
        }
      } else {
        // Navigate to enrollment form
        navigate('/student-enrollment', { state: { selectedCourse: course } });
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/student-enrollment');
    }
  };

  const categories = ['All', 'Nursing', 'Medicine', 'Dentistry', 'Physiotherapy', 'Allied Health'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading Courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <HeaderNew />
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 mt-[81px]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <GraduationCap className="h-10 w-10" />
            Our Courses
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our AI-integrated healthcare education programs designed to prepare you for the future of medicine
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Global Curriculum Standards</span>
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by course name or specialization..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchKeyword && ` matching "${searchKeyword}"`}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                {/* Course image */}
                <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  {course.image && (
                    <img
                      src={`https://images.unsplash.com/${course.image}?w=400&h=200&fit=crop`}
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                    AI-Integrated
                  </Badge>
                </div>

                <CardTitle className="flex items-start justify-between text-lg">
                  <div>
                    <h3 className="font-bold mb-1">{course.name}</h3>
                    <p className="text-sm text-muted-foreground font-normal">{course.code}</p>
                  </div>
                </CardTitle>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{course.duration}</span>
                </div>

                {course.specializations.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <BookOpen className="h-3 w-3" />
                      Specializations:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {course.specializations.slice(0, 3).map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {course.specializations.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{course.specializations.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>Small Batches</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      <span>Global Recognition</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleApplyNow(course)}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              {searchKeyword || selectedCategory !== 'All'
                ? 'Try adjusting your filters or search terms'
                : 'No courses available at the moment'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;