import React, { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, User, MessageCircle, Stethoscope, Activity } from 'lucide-react';
import mixpanel from "./mixpanel";
import { HeaderNew } from '@/components/HeaderNew';

const AIVirtualPatientSimulator = () => {

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

  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [userInput, setUserInput] = useState('');
  const [currentStage, setCurrentStage] = useState('initial');

  const virtualPatients = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 45,
      gender: "Female",
      chiefComplaint: "Chest pain",
      scenario: "Emergency Department",
      difficulty: "Intermediate",
      learningObjectives: [
        "Acute coronary syndrome diagnosis",
        "Emergency triage",
        "Risk factor assessment"
      ],
      vitals: {
        bp: "150/95",
        hr: "110",
        rr: "24",
        temp: "98.6°F",
        spo2: "94%"
      },
      background: "45-year-old female with hypertension and diabetes presenting with acute chest pain",
      avatar: "👩‍🦳"
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 8,
      gender: "Male",
      chiefComplaint: "Fever and rash",
      scenario: "Pediatric Clinic",
      difficulty: "Beginner",
      learningObjectives: [
        "Pediatric assessment",
        "Viral vs bacterial infection",
        "Parent communication"
      ],
      vitals: {
        bp: "90/60",
        hr: "130",
        rr: "28",
        temp: "102.1°F",
        spo2: "98%"
      },
      background: "8-year-old male brought by mother with 3-day history of fever and new rash",
      avatar: "👦"
    },
    {
      id: 3,
      name: "Robert Williams",
      age: 72,
      gender: "Male",
      chiefComplaint: "Confusion and falls",
      scenario: "Geriatric Ward",
      difficulty: "Advanced",
      learningObjectives: [
        "Delirium assessment",
        "Geriatric syndromes",
        "Medication review"
      ],
      vitals: {
        bp: "100/70",
        hr: "95",
        rr: "18",
        temp: "99.2°F",
        spo2: "96%"
      },
      background: "72-year-old male with increasing confusion and two falls in the past week",
      avatar: "👴"
    }
  ];

  const startSimulation = (patient: any) => {
    setSelectedPatient(patient);
    setCurrentStage('initial');
    setConversation([
      {
        type: 'system',
        message: `You are now interacting with ${patient.name}, a ${patient.age}-year-old ${patient.gender.toLowerCase()} presenting with ${patient.chiefComplaint}. The patient is in the ${patient.scenario}.`
      },
      {
        type: 'patient',
        message: generatePatientResponse('greeting', patient),
        timestamp: new Date()
      }
    ]);
  };

  const generatePatientResponse = (stage: string, patient: any, userQuestion?: string) => {
    const responses = {
      greeting: {
        1: "Hello doctor... I'm having this terrible chest pain that started about 2 hours ago. It feels like someone is squeezing my chest really tight.",
        2: "Mommy brought me here because I don't feel good. My head hurts and I have these spots on my skin.",
        3: "I... I'm not sure why I'm here. My daughter says I've been acting strange lately. I feel confused."
      },
      history: {
        1: "The pain started suddenly while I was watching TV. It's about 8 out of 10 in severity and goes down my left arm. I also feel nauseous and sweaty.",
        2: "I started feeling sick three days ago with a fever. Mommy says I've been really tired and not eating much. The spots appeared this morning.",
        3: "I can't remember exactly when this started. My daughter says I've fallen twice this week, but I don't remember falling."
      },
      examination: {
        1: "The pain gets worse when I take deep breaths. I have some shortness of breath too. I'm scared something serious is happening to me.",
        2: "My tummy hurts a little and my throat is sore. The spots don't itch but mommy says they're getting bigger.",
        3: "I feel dizzy when I stand up. Sometimes I don't know where I am. The room spins sometimes."
      }
    };

    return responses[stage as keyof typeof responses]?.[patient.id] || "I'm not sure how to respond to that. Could you ask me something else?";
  };

  const handleSendMessage = () => {
    if (!userInput.trim() || !selectedPatient) return;

    const newMessage = {
      type: 'doctor',
      message: userInput,
      timestamp: new Date()
    };

    // Simulate patient response based on the question
    const patientResponse = {
      type: 'patient',
      message: generatePatientResponse(currentStage, selectedPatient, userInput),
      timestamp: new Date()
    };

    setConversation([...conversation, newMessage, patientResponse]);
    setUserInput('');
  };

  const performExamination = (type: string) => {
    const examResults = {
      cardiovascular: {
        1: "Heart rate irregular, S3 gallop present, no murmurs. Peripheral edema noted.",
        2: "Heart rate regular, no murmurs. Capillary refill <2 seconds.",
        3: "Heart rate regular but weak pulse. No murmurs detected."
      },
      respiratory: {
        1: "Bilateral crackles in lower lobes, decreased air entry on left side.",
        2: "Clear breath sounds bilaterally, no wheeze or stridor.",
        3: "Breath sounds diminished bilaterally, respiratory effort adequate."
      },
      neurological: {
        1: "Alert and oriented x3, no focal neurological deficits.",
        2: "Cranial nerves intact, age-appropriate responses, slightly irritable.",
        3: "Confused, oriented to person only, mild tremor noted in hands."
      }
    };

    const result = examResults[type as keyof typeof examResults]?.[selectedPatient.id] || "Examination complete.";
    
    const examMessage = {
      type: 'system',
      message: `Physical Examination - ${type.charAt(0).toUpperCase() + type.slice(1)}: ${result}`,
      timestamp: new Date()
    };

    setConversation([...conversation, examMessage]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <HeaderNew />
      <div className="max-w-6xl mx-auto mt-[100px]">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              AI Virtual Patient Simulator
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Practice clinical skills with AI-powered virtual patient interactions
            </p>
          </div>
        </div>

        {!selectedPatient ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {virtualPatients.map((patient) => (
              <Card key={patient.id} className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{patient.avatar}</div>
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <CardDescription>
                        {patient.age} years old • {patient.gender}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm"><strong>Chief Complaint:</strong> {patient.chiefComplaint}</p>
                    <p className="text-sm"><strong>Setting:</strong> {patient.scenario}</p>
                  </div>
                  
                  <div>
                    <Badge variant={patient.difficulty === 'Beginner' ? 'secondary' : patient.difficulty === 'Intermediate' ? 'default' : 'destructive'}>
                      {patient.difficulty}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Learning Objectives:</h4>
                    <div className="space-y-1">
                      {patient.learningObjectives.map((objective, index) => (
                        <div key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                          <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                          {objective}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => startSimulation(patient)}
                    className="w-full"
                  >
                    Start Simulation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Patient Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{selectedPatient.avatar}</div>
                    <div>
                      <h3 className="font-medium">{selectedPatient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedPatient.age} years old • {selectedPatient.gender}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Chief Complaint:</h4>
                    <p className="text-sm">{selectedPatient.chiefComplaint}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Background:</h4>
                    <p className="text-sm text-muted-foreground">{selectedPatient.background}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Vital Signs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-secondary/20 rounded">
                      <div className="text-sm font-medium">BP</div>
                      <div className="text-xs">{selectedPatient.vitals.bp}</div>
                    </div>
                    <div className="text-center p-2 bg-secondary/20 rounded">
                      <div className="text-sm font-medium">HR</div>
                      <div className="text-xs">{selectedPatient.vitals.hr}</div>
                    </div>
                    <div className="text-center p-2 bg-secondary/20 rounded">
                      <div className="text-sm font-medium">RR</div>
                      <div className="text-xs">{selectedPatient.vitals.rr}</div>
                    </div>
                    <div className="text-center p-2 bg-secondary/20 rounded">
                      <div className="text-sm font-medium">Temp</div>
                      <div className="text-xs">{selectedPatient.vitals.temp}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Physical Examination
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => performExamination('cardiovascular')}
                  >
                    Cardiovascular
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => performExamination('respiratory')}
                  >
                    Respiratory
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => performExamination('neurological')}
                  >
                    Neurological
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Conversation */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Patient Interaction
                  </CardTitle>
                  <CardDescription>
                    Conduct your clinical interview and assessment
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 space-y-4 overflow-y-auto mb-4 p-4 bg-secondary/10 rounded">
                    {conversation.map((msg, index) => (
                      <div key={index} className={`flex ${msg.type === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          msg.type === 'doctor' 
                            ? 'bg-primary text-primary-foreground' 
                            : msg.type === 'patient'
                            ? 'bg-secondary'
                            : 'bg-accent text-accent-foreground'
                        }`}>
                          <div className="text-sm">
                            {msg.type === 'system' && (
                              <div className="flex items-center gap-2 mb-1">
                                <Brain className="h-3 w-3" />
                                <span className="text-xs font-medium">System</span>
                              </div>
                            )}
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask the patient a question or give instructions..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!userInput.trim()}>
                      Send
                    </Button>
                  </div>

                  <div className="mt-4 flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedPatient(null)}
                    >
                      End Simulation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIVirtualPatientSimulator;