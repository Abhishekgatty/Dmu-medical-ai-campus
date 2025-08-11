import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Target, Loader2, Stethoscope } from 'lucide-react';

const SurgicalTechniquesVRPage = () => {
  const navigate = useNavigate();

  const moduleInfo = {
    id: 'mod-005',
    title: 'Surgical Techniques in Virtual Reality',
    instructor: 'Dr. Priya Sharma',
    duration: '9 weeks',
    schedule: 'Mondays & Thursdays, 11:00 AM',
    category: 'Surgery',
    description:
      'Practice surgical procedures in an immersive VR environment with haptic feedback and AI guidance.',
    topics: ['Basic Surgical Skills', 'Laparoscopic Techniques', 'Suturing Methods', 'Emergency Procedures'],
    enrolledStudents: 25,
    maxStudents: 30,
    progress: 0,
  };

  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const procedureOptions: Record<string, string[]> = {
    'Appendectomy': [
      'Make a small incision in the lower right abdomen.',
      'Locate and isolate the appendix.',
      'Ligate the mesoappendix.',
      'Remove the appendix and close incision.',
    ],
    'Laparoscopic Cholecystectomy': [
      'Insert trocars into the abdominal cavity.',
      'Locate and clip the cystic duct and artery.',
      'Remove the gallbladder.',
      'Inspect and close the incisions.',
    ],
    'Emergency Suturing': [
      'Clean and disinfect the wound.',
      'Align wound edges.',
      'Use interrupted sutures to close.',
      'Apply dressing.',
    ],
  };

  const startProcedure = (procedure: string) => {
    setLoading(true);
    setSelectedProcedure(procedure);
    setCurrentStep(0);
    setSteps([]);

    setTimeout(() => {
      setSteps(procedureOptions[procedure]);
      setLoading(false);
    }, 1500);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
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

        {/* Procedure Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" /> VR Surgery Simulator
            </CardTitle>
            <CardDescription>
              Choose a surgical procedure and follow AI-guided steps in real time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedProcedure && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(procedureOptions).map(proc => (
                  <Button key={proc} onClick={() => startProcedure(proc)}>
                    <Play className="h-4 w-4 mr-2" /> {proc}
                  </Button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading VR procedure...
              </div>
            )}

            {/* Step-by-step Guidance */}
            {selectedProcedure && !loading && steps.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">{selectedProcedure} — Step {currentStep + 1} of {steps.length}</h4>
                <p className="bg-secondary/20 p-3 rounded">{steps[currentStep]}</p>

                {currentStep < steps.length - 1 ? (
                  <Button onClick={nextStep} className="flex gap-2">
                    <Target className="h-4 w-4" /> Next Step
                  </Button>
                ) : (
                  <p className="text-green-600 font-semibold">✅ Procedure Complete!</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SurgicalTechniquesVRPage;
