import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Headphones, 
  Play, 
  Pause, 
  Volume2,
  Mic,
  Send,
  Loader2,
  Radio,
  BookOpen,
  ListMusic,
  Clock
} from 'lucide-react';

interface Podcast {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  thumbnail: string;
}

const AIVoiceLearning = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'podcast' | 'qa'>('podcast');
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  
  // Audio elements refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Sample podcast data
  const podcasts: Podcast[] = [
    {
      id: 'pod-001',
      title: 'Understanding Cardiovascular Disease',
      description: 'A comprehensive overview of cardiovascular disease, risk factors, prevention strategies, and current treatment approaches.',
      duration: '28:45',
      category: 'Cardiology',
      thumbnail: 'bg-gradient-to-br from-red-500 to-pink-500'
    },
    {
      id: 'pod-002',
      title: 'Advances in Neuroimaging',
      description: 'Explore the latest technologies and methodologies in neuroimaging and their applications in diagnosing and treating neurological disorders.',
      duration: '34:12',
      category: 'Neurology',
      thumbnail: 'bg-gradient-to-br from-blue-500 to-purple-500'
    },
    {
      id: 'pod-003',
      title: 'Emerging Infectious Diseases',
      description: 'Discussion on emerging infectious diseases, global health security, and the role of surveillance in preventing outbreaks.',
      duration: '42:18',
      category: 'Infectious Disease',
      thumbnail: 'bg-gradient-to-br from-green-500 to-teal-500'
    },
    {
      id: 'pod-004',
      title: 'Pharmacogenomics: Personalizing Medicine',
      description: 'How genetic variations affect drug response and the future of personalized medicine based on genetic profiles.',
      duration: '36:50',
      category: 'Pharmacology',
      thumbnail: 'bg-gradient-to-br from-yellow-500 to-orange-500'
    },
    {
      id: 'pod-005',
      title: 'Medical Ethics in the AI Era',
      description: 'Ethical considerations in healthcare with the increasing integration of artificial intelligence in medical practice.',
      duration: '45:22',
      category: 'Medical Ethics',
      thumbnail: 'bg-gradient-to-br from-indigo-500 to-blue-500'
    },
    {
      id: 'pod-006',
      title: 'Surgical Innovations: Robotics & Beyond',
      description: 'Latest advances in surgical techniques, focusing on robotic surgery, minimally invasive approaches, and future developments.',
      duration: '39:05',
      category: 'Surgery',
      thumbnail: 'bg-gradient-to-br from-purple-500 to-pink-500'
    }
  ];

  const handlePlayPodcast = (podcast: Podcast) => {
    // In a real app, this would load and play the actual audio file
    setCurrentPodcast(podcast);
    setIsPlaying(true);
    
    if (audioRef.current) {
      // For demo purposes, we're using a placeholder audio
      audioRef.current.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      audioRef.current.play().catch(e => console.error('Audio playback error:', e));
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error('Audio playback error:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMicClick = () => {
    // In a real app, this would start recording the user's question
    setIsRecording(true);
    
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      setIsThinking(true);
      
      // Simulate AI processing
      setTimeout(() => {
        setIsThinking(false);
        setResponse('The cardiovascular system consists of the heart, blood vessels, and blood. It has three main functions: transport of nutrients, oxygen, and hormones to cells throughout the body; removal of metabolic wastes; and regulation of body temperature. The heart acts as the pump that moves blood through the body, with the average adult heart beating 72 times per minute. Would you like me to explain more about any specific part of the cardiovascular system?');
      }, 2000);
    }, 3000);
  };

  const handleTextSubmit = () => {
    if (!userQuestion.trim()) return;
    
    setIsThinking(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsThinking(false);
      setResponse(`Based on your question about ${userQuestion}, I can explain that this is an important concept in medical education. ${userQuestion.length > 20 ? userQuestion.substring(0, 20) : userQuestion} involves several key principles that students often find challenging. First, it's important to understand the underlying mechanisms. Second, clinical applications require careful consideration of patient factors. Would you like me to elaborate on any particular aspect of this topic?`);
      setUserQuestion('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-neural-purple/20 to-campus-gold/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Headphones className="h-10 w-10 text-neural-purple" />
              Voice Podcast & AI Q&A
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Listen to educational podcasts and get voice explanations from our AI teacher
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
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

        {/* Tabs */}
        <Tabs defaultValue="podcast" className="mb-6" onValueChange={(value) => setSelectedTab(value as 'podcast' | 'qa')}>
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="podcast">Medical Podcasts</TabsTrigger>
            <TabsTrigger value="qa">Voice Q&A</TabsTrigger>
          </TabsList>
          
          {/* Podcasts Tab */}
          <TabsContent value="podcast" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {podcasts.map(podcast => (
                <Card key={podcast.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className={`h-32 ${podcast.thumbnail} flex items-center justify-center`}>
                    <Headphones className="h-12 w-12 text-white" />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className="bg-neural-purple/20 text-neural-purple hover:bg-neural-purple/30">
                        {podcast.category}
                      </Badge>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {podcast.duration}
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold mt-2">{podcast.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{podcast.description}</p>
                    <Button 
                      onClick={() => handlePlayPodcast(podcast)}
                      className="w-full bg-gradient-to-r from-neural-purple to-campus-gold text-white hover:from-neural-purple/90 hover:to-campus-gold/90"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Listen Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Voice Q&A Tab */}
          <TabsContent value="qa" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left sidebar - Topics */}
              <div className="col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-neural-purple" />
                      Popular Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start text-left" onClick={() => setUserQuestion('What is the cardiovascular system?')}>
                        Cardiovascular System
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left" onClick={() => setUserQuestion('Explain the respiratory system')}>
                        Respiratory System
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left" onClick={() => setUserQuestion('How does the nervous system work?')}>
                        Nervous System
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left" onClick={() => setUserQuestion('Explain DNA replication')}>
                        DNA Replication
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left" onClick={() => setUserQuestion('What is the immune response?')}>
                        Immune Response
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Q&A area */}
              <div className="col-span-1 lg:col-span-2">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Volume2 className="h-5 w-5 text-neural-purple" />
                      Ask Your Question
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="mb-4 flex space-x-2">
                      <Input
                        placeholder="Type your medical question here..."
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleTextSubmit}
                        className="bg-neural-purple hover:bg-neural-purple/90"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={isRecording ? "destructive" : "outline"}
                        className={isRecording ? "animate-pulse" : ""}
                        onClick={handleMicClick}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 bg-muted rounded-lg p-4 overflow-y-auto">
                      {isRecording && (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto animate-pulse mb-4">
                              <Mic className="h-8 w-8 text-red-500" />
                            </div>
                            <p>Recording your question...</p>
                          </div>
                        </div>
                      )}
                      
                      {isThinking && (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-neural-purple/20 flex items-center justify-center mx-auto mb-4">
                              <Loader2 className="h-8 w-8 text-neural-purple animate-spin" />
                            </div>
                            <p>Generating voice response...</p>
                          </div>
                        </div>
                      )}
                      
                      {!isRecording && !isThinking && !response && (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center max-w-md">
                            <div className="w-16 h-16 rounded-full bg-neural-purple/20 flex items-center justify-center mx-auto mb-4">
                              <Volume2 className="h-8 w-8 text-neural-purple" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">AI Voice Learning Assistant</h3>
                            <p className="text-muted-foreground mb-4">
                              Ask any medical question and receive a detailed voice explanation, as if from a professor.
                            </p>
                            <div className="flex justify-center">
                              <Button 
                                variant="outline"
                                size="sm"
                                className="text-neural-purple"
                                onClick={handleMicClick}
                              >
                                <Mic className="h-4 w-4 mr-2" />
                                Start Voice Question
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {!isRecording && !isThinking && response && (
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neural-purple to-campus-gold flex items-center justify-center">
                              <Volume2 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-medium">AI Teacher Response</h3>
                              <p className="text-xs text-muted-foreground">Voice and text explanation</p>
                            </div>
                          </div>
                          
                          <p className="text-sm mb-4">{response}</p>
                          
                          <div className="flex justify-between items-center">
                            <Button variant="outline" size="sm" className="text-neural-purple">
                              <Play className="h-3 w-3 mr-1" />
                              Play Voice
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setResponse(null)}>
                              Ask Another Question
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Audio Player */}
        {currentPodcast && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${currentPodcast.thumbnail} flex items-center justify-center`}>
                  <Headphones className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{currentPodcast.title}</h3>
                  <p className="text-xs text-muted-foreground">{currentPodcast.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIVoiceLearning;