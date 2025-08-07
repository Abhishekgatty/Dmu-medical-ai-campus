import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Bot, 
  Brain, 
  Sparkles, 
  MessageSquare, 
  Send,
  RefreshCw,
  Loader2
} from 'lucide-react';

const AIAgent = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {role: 'assistant', content: 'Hello! I am MEDORBIS.AI, your medical education assistant. How can I help you with your studies today?'}
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message to conversation
    setConversation(prev => [...prev, {role: 'user', content: userInput}]);
    setIsLoading(true);
    
    // Simulate AI response (would be replaced with actual API call)
    setTimeout(() => {
      let response = '';
      
      // Simple keyword-based responses for demonstration
      if (userInput.toLowerCase().includes('anatomy')) {
        response = 'Human anatomy is the study of the structures of the human body. Would you like to learn about a specific system, such as cardiovascular, respiratory, or nervous system?';
      } else if (userInput.toLowerCase().includes('pathology')) {
        response = 'Pathology is the study of disease. It involves understanding how diseases develop and affect the body. Is there a specific disease process you would like to explore?';
      } else if (userInput.toLowerCase().includes('diagnosis')) {
        response = 'Medical diagnosis involves analyzing symptoms, medical history, examination findings, and test results to determine the cause of a patient\'s condition. Would you like to practice with a case study?';
      } else {
        response = 'That\'s an interesting medical topic. I can provide information, answer questions, or help you work through case studies. What specific aspect would you like to explore?';
      }
      
      setConversation(prev => [...prev, {role: 'assistant', content: response}]);
      setIsLoading(false);
      setUserInput('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-ai-accent/20 to-neural-purple/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Bot className="h-10 w-10 text-ai-accent" />
              MEDORBIS.AI Agent
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your AI-powered medical education assistant
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/ai-enhanced-learning')}
            variant="outline"
            className="flex items-center gap-2 hover:bg-primary hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to AI Enhanced Learning
          </Button>
        </div>

        {/* AI Assistant Card */}
        <Card className="border-ai-accent/30 min-h-[500px] flex flex-col">
          <CardHeader className="bg-gradient-to-r from-ai-accent/10 to-neural-purple/10 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ai-accent to-neural-purple flex items-center justify-center mr-3">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-ai-accent">MEDORBIS.AI</CardTitle>
                <p className="text-xs text-muted-foreground">Advanced Medical Education Assistant</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-auto" 
                onClick={() => setConversation([{role: 'assistant', content: 'Hello! I am MEDORBIS.AI, your medical education assistant. How can I help you with your studies today?'}])}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Conversation Area */}
            <div className="flex-1 p-4 overflow-y-auto max-h-[400px]">
              {conversation.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${message.role === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'}`}
                >
                  <div 
                    className={`p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="mr-auto max-w-[80%] mb-4">
                  <div className="p-3 rounded-lg bg-muted flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>MEDORBIS.AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask a medical question..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-ai-accent hover:bg-ai-accent/90"
                  disabled={isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Tip: Ask about anatomy, pathology, diagnosis, or try a case study.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center mb-2">
              <Sparkles className="h-5 w-5 mr-2 text-ai-accent" />
              <h3 className="font-semibold">Intelligent Learning</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Personalized responses based on your knowledge level and learning needs.
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center mb-2">
              <MessageSquare className="h-5 w-5 mr-2 text-ai-accent" />
              <h3 className="font-semibold">Case Simulations</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Practice with realistic patient scenarios and receive detailed feedback.
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center mb-2">
              <Brain className="h-5 w-5 mr-2 text-ai-accent" />
              <h3 className="font-semibold">Deep Knowledge</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Access comprehensive medical information across specialties and topics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;