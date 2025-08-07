import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, FileText, Lightbulb, AlertCircle } from 'lucide-react';

const AIMedicalCaseAnalyzer = () => {
  const navigate = useNavigate();
  const [caseText, setCaseText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sampleCases = [
    {
      title: "Chest Pain Case",
      description: "45-year-old male with acute chest pain",
      case: "A 45-year-old male presents to the emergency department with sudden onset of severe chest pain that began 2 hours ago. The pain is described as crushing, radiates to the left arm, and is associated with shortness of breath and nausea. Patient has a history of hypertension and smoking. Vital signs show BP 150/95, HR 110, RR 22, O2 sat 94% on room air."
    },
    {
      title: "Pediatric Fever Case",
      description: "3-year-old with high fever and rash",
      case: "A 3-year-old girl is brought to the clinic by her mother with a 3-day history of high fever (up to 102°F), decreased appetite, and a rash that appeared this morning. The rash is maculopapular, started on the face and spread to the trunk. The child has been irritable and has had decreased fluid intake."
    }
  ];

  const handleAnalyze = async () => {
    if (!caseText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        differentialDiagnosis: [
          { condition: "Acute Myocardial Infarction", probability: "High", reasoning: "Classic presentation with crushing chest pain, radiation to left arm, associated symptoms" },
          { condition: "Unstable Angina", probability: "Moderate", reasoning: "Similar presentation but may be less severe" },
          { condition: "Aortic Dissection", probability: "Low", reasoning: "Consider given sudden onset, but less likely without back pain" }
        ],
        recommendedTests: [
          "12-lead ECG",
          "Cardiac enzymes (Troponin)",
          "Chest X-ray",
          "Basic metabolic panel"
        ],
        immediateActions: [
          "Administer oxygen",
          "Establish IV access",
          "Continuous cardiac monitoring",
          "Pain management"
        ],
        keyFindings: [
          "Crushing chest pain with radiation",
          "Associated autonomic symptoms",
          "Risk factors: HTN, smoking",
          "Elevated vital signs"
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const loadSampleCase = (sampleCase: string) => {
    setCaseText(sampleCase);
    setAnalysis(null);
  };

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
              AI Medical Case Analyzer
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Analyze medical cases with AI-powered diagnostic assistance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Case Input
                </CardTitle>
                <CardDescription>
                  Enter a medical case for AI analysis or select a sample case
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Sample Cases:</h4>
                  <div className="grid gap-2">
                    {sampleCases.map((sample, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start h-auto p-3"
                        onClick={() => loadSampleCase(sample.case)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{sample.title}</div>
                          <div className="text-sm text-muted-foreground">{sample.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Case Description:</label>
                  <Textarea
                    placeholder="Enter patient case details including chief complaint, history, physical examination findings, and any relevant background information..."
                    value={caseText}
                    onChange={(e) => setCaseText(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
                
                <Button 
                  onClick={handleAnalyze}
                  disabled={!caseText.trim() || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 animate-spin" />
                      Analyzing Case...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Analyze Case
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysis ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Differential Diagnosis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.differentialDiagnosis.map((diagnosis: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{diagnosis.condition}</h4>
                            <Badge variant={diagnosis.probability === 'High' ? 'destructive' : diagnosis.probability === 'Moderate' ? 'default' : 'secondary'}>
                              {diagnosis.probability}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{diagnosis.reasoning}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      {analysis.recommendedTests.map((test: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-secondary/50 rounded">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          {test}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Immediate Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      {analysis.immediateActions.map((action: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-destructive/10 rounded">
                          <div className="w-2 h-2 bg-destructive rounded-full"></div>
                          {action}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready for Analysis</h3>
                  <p className="text-muted-foreground">
                    Enter a medical case and click "Analyze Case" to get AI-powered diagnostic insights
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMedicalCaseAnalyzer;