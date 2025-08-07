import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const academicPrograms = [
  { name: "MD Program", href: "/courses" },
  { name: "AI Medical Research", href: "/courses" },
  { name: "Global Health", href: "/courses" },
  { name: "Clinical Rotations", href: "/courses" },
  { name: "Continuing Education", href: "/courses" }
];

const campusServices = [
  { name: "Virtual Campus Tour", href: "#" },
  { name: "AI Learning Labs", href: "#" },
  { name: "Student Portal", href: "#" },
  { name: "Career Placement", href: "#" },
  { name: "Financial Aid", href: "#" },
  { name: "Academic Support", href: "#" }
];

const socialLinks = [
  { icon: Facebook, href: "#", name: "Facebook" },
  { icon: Twitter, href: "#", name: "Twitter" },
  { icon: Instagram, href: "#", name: "Instagram" },
  { icon: Linkedin, href: "#", name: "LinkedIn" },
  { icon: Youtube, href: "#", name: "YouTube" }
];

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-b from-medical-primary-dark via-medical-primary to-neural-purple text-white relative overflow-hidden">
      {/* Modern background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-ai-accent/10 via-transparent to-campus-gold/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 neural-gradient rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">DMU</h3>
                <p className="text-ai-accent-light text-sm">Medical AI Campus</p>
              </div>
            </div>
            <p className="text-white/90 leading-relaxed max-w-xs">
              Pioneering the future of medical education through artificial intelligence and global academic excellence.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <button
                  key={social.name}
                  className="w-10 h-10 glass-effect rounded-xl flex items-center justify-center text-white hover:text-ai-accent-glow hover:bg-ai-accent/20 transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Academic Programs */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-ai-accent-light">Academic Programs</h4>
            <ul className="space-y-3">
              {academicPrograms.map((program) => (
                 <li key={program.name}>
                   <button 
                     onClick={() => navigate(program.href)}
                     className="text-white/90 hover:text-ai-accent-glow transition-colors duration-200 hover:underline hover:translate-x-1 inline-block text-left"
                   >
                     {program.name}
                   </button>
                 </li>
              ))}
            </ul>
          </div>

          {/* Campus Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-campus-gold">Campus Services</h4>
            <ul className="space-y-3">
              {campusServices.map((service) => (
                <li key={service.name}>
                  <a 
                    href={service.href}
                    className="text-white/90 hover:text-campus-gold transition-colors duration-200 hover:underline hover:translate-x-1 inline-block"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-ai-accent-light">Global Campus</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 text-ai-accent flex-shrink-0" />
                <div className="text-white/90 text-sm">
                  <p className="font-medium mb-1">Main Campus</p>
                  <p>123 Medical AI Drive<br />Global Education Hub<br />Innovation City, IC 12345</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-ai-accent" />
                <a 
                  href="tel:+1234567890" 
                  className="text-white/90 hover:text-ai-accent transition-colors"
                >
                  +1 (234) 567-8900
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-ai-accent" />
                <a 
                  href="mailto:admissions@dmu.edu" 
                  className="text-white/90 hover:text-ai-accent transition-colors"
                >
                  admissions@dmu.edu
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-ai-accent/30">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-white/90 text-sm">
                © 2024 DMU - Digital Medical University. All rights reserved.
              </p>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-2 h-2 bg-ai-accent rounded-full animate-pulse"></div>
                <span className="text-ai-accent text-xs">Accredited by Global Medical Education Board</span>
              </div>
            </div>
            <div className="flex space-x-8 text-sm">
              <a href="#" className="text-white/80 hover:text-ai-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/80 hover:text-ai-accent transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white/80 hover:text-ai-accent transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};