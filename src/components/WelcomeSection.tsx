import { useEffect, useState } from "react";

export const WelcomeSection = () => {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Welcome to DMU – Where Artificial Intelligence meets Global Medical Excellence.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Floating academic elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-ai-accent/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-neural-purple/10 rounded-full blur-2xl"></div>
      
      <div className="text-center">
        <div className="inline-block glass-effect px-8 py-3 rounded-full mb-8">
          <span className="text-ai-accent font-semibold flex items-center">
            🧠 AI-Powered Medical Education
          </span>
        </div>
        
        <div className="relative">
          <h1 className="heading-large mb-8">
            <span className="block text-academic mb-4">Welcome to DMU</span>
            <span className="inline-block overflow-hidden whitespace-nowrap border-r-4 border-ai-accent animate-blink text-academic drop-shadow-lg">
              {displayedText.replace('Welcome to DMU – ', '')}
            </span>
          </h1>
        </div>
        
        <div className="mt-12 flex justify-center">
          <div className="w-40 h-2 academic-gradient rounded-full shadow-lg"></div>
        </div>

        {/* Campus highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="campus-card p-6 text-center elegant-hover">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-academic mb-2">Precision Learning</h3>
            <p className="text-sm text-campus">AI adapts to your learning style</p>
          </div>
          <div className="campus-card p-6 text-center elegant-hover">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-semibold text-academic mb-2">Global Network</h3>
            <p className="text-sm text-campus">Connect with medical professionals worldwide</p>
          </div>
          <div className="campus-card p-6 text-center elegant-hover">
            <div className="text-3xl mb-3">🔬</div>
            <h3 className="font-semibold text-academic mb-2">Advanced Labs</h3>
            <p className="text-sm text-campus">Virtual reality medical simulations</p>
          </div>
        </div>
      </div>
    </div>
  );
};