import { useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroCarousel } from "@/components/HeroCarousel";
import { WelcomeSection } from "@/components/WelcomeSection";
import { CampusStats } from "@/components/CampusStats";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Footer } from "@/components/Footer";
import NotificationBar from "@/components/NotificationBar";
import medicalCampusHero from "@/assets/medical-campus-hero.jpg";
import aiLabBackground from "@/assets/ai-lab-background.jpg";
import mixpanel from "./mixpanel";
import { useLocation } from "react-router-dom"; 


const Index = () => {

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

  useEffect(() => {
    // Smooth scrolling for the page
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Medical Campus Background */}
      <section 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(21, 57, 120, 0.85), rgba(14, 165, 183, 0.75), rgba(89, 28, 135, 0.70)), url(${medicalCampusHero})`
        }}
      >
        {/* Elegant overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-medical-primary/10 via-transparent to-neural-purple/10"></div>
        
        <Header />
        <NotificationBar />
        
        <div className="absolute inset-0 flex items-center justify-center px-6 pt-32">
          <div className="max-w-6xl mx-auto w-full">
            <HeroCarousel />
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute bottom-20 left-10 hidden lg:block">
          <div className="glass-effect p-4 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-ai-accent rounded-full animate-pulse"></div>
              <span className="text-white text-sm">Live Virtual Labs Active</span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-20 right-10 hidden lg:block">
          <div className="glass-effect p-4 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-campus-gold rounded-full animate-pulse"></div>
              <span className="text-white text-sm">Global Students Online: 2,847</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="glass-effect w-8 h-12 rounded-full flex justify-center items-start pt-3">
            <div className="w-1 h-3 bg-ai-accent rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Welcome Section with AI Lab Background */}
      <section 
        className="relative py-20 px-6"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.90)), url(${aiLabBackground})`
        }}
      >
        <WelcomeSection />
      </section>

      {/* Campus Stats */}
      <CampusStats />

      {/* Feature Grid */}
      <FeatureGrid />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;