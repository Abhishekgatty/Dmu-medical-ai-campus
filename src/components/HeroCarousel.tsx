import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Global AI-Powered Medical Education",
    subtitle: "Revolutionary learning platform combining artificial intelligence with world-class medical training",
    stats: "500+ AI Modules | 50+ Countries | 10,000+ Students"
  },
  {
    title: "Hybrid Campus + Digital Learning", 
    subtitle: "State-of-the-art facilities integrated with immersive digital experiences",
    stats: "Virtual Labs | Smart Classrooms | Holographic Anatomy"
  },
  {
    title: "Join the Future of Medicine",
    subtitle: "Transform healthcare through advanced AI education and global clinical excellence",
    stats: "95% Match Rate | 200+ Clinical Sites | AI Certification"
  }
];

export const HeroCarousel = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-80 md:h-96 overflow-hidden rounded-3xl campus-card campus-shadow">
      {/* Content slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-center text-white px-8 max-w-4xl">
            <h2 className="heading-large mb-6 drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="text-xl md:text-2xl mb-6 opacity-95 drop-shadow-md leading-relaxed">
              {slide.subtitle}
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm md:text-base opacity-90">
              <div className="glass-effect px-4 py-2 rounded-full">
                {slide.stats}
              </div>
            </div>
            
            {/* Call to action */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="academic-gradient px-8 py-3 text-lg font-semibold elegant-hover" onClick={() => navigate('/virtual-learning')}>
                <Play className="w-5 h-5 mr-2" />
                Take Virtual Tour
              </Button>
              <Button 
                variant="outline" 
                className="glass-effect border-white/30 text-white px-8 py-3 hover:bg-white/20"
                onClick={() => navigate('/courses')}
              >
                View Programs
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-6 top-1/2 -translate-y-1/2 glass-effect text-white hover:bg-white/20 p-3"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-6 top-1/2 -translate-y-1/2 glass-effect text-white hover:bg-white/20 p-3"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Progress indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-ai-accent shadow-ai-glow" 
                : "bg-white/40 hover:bg-white/60"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};