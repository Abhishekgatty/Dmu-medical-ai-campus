import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, Target, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import mixpanel from "./mixpanel";

const SymptomToDiagnosisTrainer = () => {

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

 
  const { toast } = useToast();

  const navigate = useNavigate();
  const [currentCase, setCurrentCase] = useState<any>(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);

  const cases = [
    {
      id: 1,
      symptoms: [
        "Severe chest pain (8/10)",
        "Pain radiating to left arm",
        "Shortness of breath",
        "Nausea and vomiting",
        "Diaphoresis"
      ],
      patientInfo: {
        age: 55,
        gender: "Male",
        history: ["Hypertension", "Diabetes", "Smoking"]
      },
      vitalSigns: {
        bp: "160/100",
        hr: "110",
        rr: "24",
        temp: "98.6°F"
      },
      correctDiagnosis: "Myocardial Infarction",
      options: [
        "Myocardial Infarction",
        "Angina Pectoris",
        "Gastroesophageal Reflux",
        "Panic Attack"
      ],
      explanation: "Classic presentation of MI with crushing chest pain, radiation, and associated symptoms in a high-risk patient."
    },
    {
      id: 2,
      symptoms: [
        "High fever (102°F)",
        "Severe headache",
        "Neck stiffness",
        "Photophobia",
        "Altered mental status"
      ],
      patientInfo: {
        age: 22,
        gender: "Female",
        history: ["No significant past medical history"]
      },
      vitalSigns: {
        bp: "120/80",
        hr: "120",
        rr: "22",
        temp: "102°F"
      },
      correctDiagnosis: "Bacterial Meningitis",
      options: [
        "Bacterial Meningitis",
        "Viral Meningitis",
        "Tension Headache",
        "Migraine"
      ],
      explanation: "Classic triad of fever, neck stiffness, and altered mental status suggests bacterial meningitis."
    },
    {
      id: 3,
      symptoms: [
        "Sudden severe abdominal pain",
        "Pain in right lower quadrant",
        "Nausea and vomiting",
        "Low-grade fever",
        "Rebound tenderness"
      ],
      patientInfo: {
        age: 28,
        gender: "Male",
        history: ["No significant past medical history"]
      },
      vitalSigns: {
        bp: "130/85",
        hr: "95",
        rr: "18",
        temp: "100.4°F"
      },
      correctDiagnosis: "Acute Appendicitis",
      options: [
        "Acute Appendicitis",
        "Gastroenteritis",
        "Kidney Stone",
        "Inflammatory Bowel Disease"
      ],
      explanation: "Right lower quadrant pain with rebound tenderness and fever is classic for appendicitis."
    }
  ];

  const generateNewCase = () => {
    const randomCase = cases[Math.floor(Math.random() * cases.length)];
    setCurrentCase(randomCase);
    setSelectedDiagnosis('');
    setFeedback(null);
    setTimeLeft(60);
    setIsActive(true);
  };

  const submitDiagnosis = () => {
    if (!selectedDiagnosis || !currentCase) return;

    setIsActive(false);
    const isCorrect = selectedDiagnosis === currentCase.correctDiagnosis;
    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1
    };
    setScore(newScore);

    setFeedback({
      isCorrect,
      correctAnswer: currentCase.correctDiagnosis,
      explanation: currentCase.explanation,
      timeUsed: 60 - timeLeft
    });
  };

  React.useEffect(() => {
    generateNewCase();
  }, []);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      submitDiagnosis();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-6xl mx-auto">
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
              Symptom-to-Diagnosis AI Trainer
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Practice diagnostic skills with AI-powered case scenarios
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{score.correct}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{score.total}</div>
              <div className="text-sm text-muted-foreground">Total Cases</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">
                {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-destructive' : 'text-primary'}`}>
                {timeLeft}s
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Clock className="h-3 w-3" />
                Time Left
              </div>
            </CardContent>
          </Card>
        </div>

        {currentCase && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Case Presentation */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Patient Presentation
                  </CardTitle>
                  <CardDescription>
                    Case #{currentCase.id} - Analyze the symptoms and make a diagnosis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Patient Information:</h4>
                    <div className="bg-secondary/20 p-3 rounded-lg">
                      <p><strong>Age:</strong> {currentCase.patientInfo.age} years</p>
                      <p><strong>Gender:</strong> {currentCase.patientInfo.gender}</p>
                      <p><strong>Medical History:</strong> {currentCase.patientInfo.history.join(', ')}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Vital Signs:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-secondary/20 p-2 rounded text-sm">
                        <strong>BP:</strong> {currentCase.vitalSigns.bp}
                      </div>
                      <div className="bg-secondary/20 p-2 rounded text-sm">
                        <strong>HR:</strong> {currentCase.vitalSigns.hr} bpm
                      </div>
                      <div className="bg-secondary/20 p-2 rounded text-sm">
                        <strong>RR:</strong> {currentCase.vitalSigns.rr} /min
                      </div>
                      <div className="bg-secondary/20 p-2 rounded text-sm">
                        <strong>Temp:</strong> {currentCase.vitalSigns.temp}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Chief Complaint & Symptoms:</h4>
                    <div className="space-y-2">
                      {currentCase.symptoms.map((symptom: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-destructive rounded-full"></div>
                          <span className="text-sm">{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Diagnosis Selection */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Select Your Diagnosis
                  </CardTitle>
                  <CardDescription>
                    Choose the most likely diagnosis based on the presentation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {currentCase.options.map((option: string, index: number) => (
                      <Button
                        key={index}
                        variant={selectedDiagnosis === option ? 'default' : 'outline'}
                        className="w-full justify-start h-auto p-4"
                        onClick={() => setSelectedDiagnosis(option)}
                        disabled={!!feedback}
                      >
                        <div className="text-left">
                          <div className="font-medium">{option}</div>
                        </div>
                      </Button>
                    ))}
                  </div>

                  <Button 
                    onClick={submitDiagnosis}
                    disabled={!selectedDiagnosis || !!feedback}
                    className="w-full"
                  >
                    Submit Diagnosis
                  </Button>
                </CardContent>
              </Card>

              {feedback && (
                <Card className={`border-2 ${feedback.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {feedback.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`font-medium ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {feedback.isCorrect ? 'Correct Diagnosis!' : 'Incorrect Diagnosis'}
                      </span>
                    </div>

                    {!feedback.isCorrect && (
                      <div className="mb-3">
                        <p className="text-sm">
                          <strong>Correct Answer:</strong> {feedback.correctAnswer}
                        </p>
                      </div>
                    )}

                    <div className="mb-3">
                      <h4 className="font-medium mb-1">Explanation:</h4>
                      <p className="text-sm text-muted-foreground">{feedback.explanation}</p>
                    </div>

                    <div className="mb-4">
                      <Badge variant="outline">
                        Time taken: {feedback.timeUsed} seconds
                      </Badge>
                    </div>

                    <Button 
                      onClick={generateNewCase}
                      className="w-full"
                    >
                      Next Case
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomToDiagnosisTrainer;