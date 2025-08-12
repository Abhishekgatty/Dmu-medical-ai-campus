import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Brain, MessageSquare } from 'lucide-react';
import { HeaderNew } from '@/components/HeaderNew';

const PharmacologyAntimicrobialsPage = () => {
  const navigate = useNavigate();

  const moduleInfo = {
    id: 'mod-003',
    title: 'Pharmacology of Antimicrobials',
    instructor: 'Dr. Elena Rodriguez',
    duration: '5 weeks',
    schedule: 'Fridays, 1:00 PM',
    category: 'Pharmacology',
    description:
      'Study of antimicrobial agents, mechanisms of action, resistance patterns, and clinical applications.',
    topics: [
      'Antibiotics Classes',
      'Mechanisms of Resistance',
      'Clinical Applications',
      'Adverse Effects',
    ],
    enrolledStudents: 35,
    maxStudents: 40,
    progress: 0,
  };

  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = () => {
    if (!question.trim()) return;
    setLoading(true);
    setAiResponse('');

    // Simulated AI delay
    setTimeout(() => {
      // Basic simulated AI logic (replace with API later)
      if (question.toLowerCase().includes('resistance')) {
        setAiResponse(
          'Antimicrobial resistance occurs when microorganisms adapt to survive exposure to a drug. Common mechanisms include enzymatic degradation, target modification, and efflux pumps.'
        );
      } else if (question.toLowerCase().includes('side effect')) {
        setAiResponse(
          'Common side effects of antibiotics can include gastrointestinal upset, allergic reactions, and, in rare cases, organ toxicity.'
        );
      } else {
        setAiResponse(
          'That’s an excellent question! In pharmacology of antimicrobials, responses depend on the specific drug, pathogen, and clinical scenario. You might want to consult current clinical guidelines for precise recommendations.'
        );
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <HeaderNew />
      <div className="max-w-4xl mx-auto space-y-6 mt-[100px]">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {/* Module Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{moduleInfo.title}</CardTitle>
            <CardDescription>{moduleInfo.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><strong>Instructor:</strong> {moduleInfo.instructor}</p>
            <p><strong>Duration:</strong> {moduleInfo.duration}</p>
            <p><strong>Schedule:</strong> {moduleInfo.schedule}</p>
            <p><strong>Category:</strong> {moduleInfo.category}</p>
            <p><strong>Enrolled:</strong> {moduleInfo.enrolledStudents}/{moduleInfo.maxStudents}</p>

            <div>
              <strong>Topics Covered:</strong>
              <ul className="list-disc ml-5 mt-2 text-sm text-muted-foreground">
                {moduleInfo.topics.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* AI Helper */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" /> Antimicrobial AI Assistant
            </CardTitle>
            <CardDescription>
              Ask about antimicrobial mechanisms, resistance, or side effects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask the AI something..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askAI()}
              />
              <Button onClick={askAI} disabled={loading}>
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>

            {loading && <p className="text-sm text-muted-foreground">Thinking...</p>}

            {aiResponse && (
              <div className="bg-secondary/20 p-3 rounded text-sm text-foreground">
                {aiResponse}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PharmacologyAntimicrobialsPage;
