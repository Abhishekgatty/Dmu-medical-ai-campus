import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bot, Headphones, Users, ExternalLink, Sparkles, Brain, BookOpen } from 'lucide-react';
import { HeaderNew } from '@/components/HeaderNew';

const AIEnhancedLearning = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
     <HeaderNew/>
      <div className="bg-gradient-to-r from-ai-accent/20 to-neural-purple/20 py-16 mt-[81px]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Sparkles className="h-10 w-10 text-ai-accent" />
              AI-Enhanced Learning
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Personalized medical education powered by machine learning algorithms and neural networks
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* MEDORBIS.AI Agent */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-ai-accent/30 hover:border-ai-accent">
            <CardHeader className="pb-2">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-ai-accent to-neural-purple flex items-center justify-center mb-4">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-ai-accent">MEDORBIS.AI Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Our advanced AI medical assistant that provides instant guidance, answers complex medical queries, and simulates patient scenarios for enhanced learning.
              </p>
              <div className="flex flex-col space-y-2">
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-ai-accent"></span>
                    Real-time medical concept explanations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-ai-accent"></span>
                    Interactive case studies with feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-ai-accent"></span>
                    Personalized learning recommendations
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/ai-agent')}
                  className="w-full bg-gradient-to-r from-ai-accent to-neural-purple text-white hover:from-ai-accent/90 hover:to-neural-purple/90"
                >
                  Access MEDORBIS.AI
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Virtual Learning */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-ai-accent/30 hover:border-ai-accent">
            <CardHeader className="pb-2">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-medical-primary to-medical-secondary flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-medical-primary">Virtual Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Attend interactive virtual classes with AI-enhanced content and expert faculty. Select modules, track progress, and engage in collaborative learning environments.
              </p>
              <div className="flex flex-col space-y-2">
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-medical-primary"></span>
                    Select from diverse teaching modules
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-medical-primary"></span>
                    Live and recorded sessions available
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-medical-primary"></span>
                    Interactive learning activities and assessments
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/virtual-learning')}
                  className="w-full bg-gradient-to-r from-medical-primary to-medical-secondary text-white hover:from-medical-primary/90 hover:to-medical-secondary/90"
                >
                  Explore Virtual Classes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Voice Podcast & AI Q&A */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-ai-accent/30 hover:border-ai-accent">
            <CardHeader className="pb-2">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neural-purple to-campus-gold flex items-center justify-center mb-4">
                <Headphones className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-neural-purple">Voice Podcast & AI Q&A</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Listen to medical educational podcasts and interact with our AI that explains concepts with natural teacher-like voice responses to your questions.
              </p>
              <div className="flex flex-col space-y-2">
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-neural-purple"></span>
                    AI-powered voice explanations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-neural-purple"></span>
                    Topic-specific educational podcasts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-neural-purple"></span>
                    Ask questions and receive detailed voice responses
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/ai-voice-learning')}
                  className="w-full bg-gradient-to-r from-neural-purple to-campus-gold text-white hover:from-neural-purple/90 hover:to-campus-gold/90"
                >
                  Try Voice Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <div className="campus-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-academic">Experience the Future of Medical Education</h3>
            <p className="text-campus mb-6">
              Our AI-Enhanced Learning platform combines cutting-edge artificial intelligence with expert medical education to provide a personalized, engaging, and effective learning experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEnhancedLearning;