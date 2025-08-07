import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, Pill, AlertTriangle, CheckCircle, Search, Plus, X } from 'lucide-react';

const DrugInteractionAIExplainer = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState<string[]>([]);
  const [currentMed, setCurrentMed] = useState('');
  const [interactions, setInteractions] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const commonMedications = [
    'Aspirin', 'Metformin', 'Lisinopril', 'Atorvastatin', 'Levothyroxine',
    'Amlodipine', 'Metoprolol', 'Losartan', 'Simvastatin', 'Hydrochlorothiazide',
    'Warfarin', 'Omeprazole', 'Gabapentin', 'Sertraline', 'Fluoxetine'
  ];

  const addMedication = (med: string) => {
    if (med && !medications.includes(med)) {
      setMedications([...medications, med]);
      setCurrentMed('');
    }
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const analyzeDrugInteractions = async () => {
    if (medications.length < 2) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setInteractions({
        summary: {
          totalInteractions: 3,
          majorInteractions: 1,
          moderateInteractions: 1,
          minorInteractions: 1
        },
        interactions: [
          {
            drugs: ['Warfarin', 'Aspirin'],
            severity: 'Major',
            type: 'Pharmacodynamic',
            effect: 'Increased bleeding risk',
            mechanism: 'Both drugs affect blood coagulation through different pathways, leading to additive anticoagulant effects',
            clinicalSignificance: 'High risk of serious bleeding complications',
            management: 'Avoid combination if possible. If necessary, monitor INR closely and watch for signs of bleeding',
            alternatives: ['Consider replacing aspirin with gastroprotective therapy or lower dose']
          },
          {
            drugs: ['Lisinopril', 'Hydrochlorothiazide'],
            severity: 'Moderate',
            type: 'Pharmacodynamic',
            effect: 'Enhanced hypotensive effect',
            mechanism: 'ACE inhibitor and thiazide diuretic work synergistically to lower blood pressure',
            clinicalSignificance: 'May cause excessive blood pressure reduction',
            management: 'Monitor blood pressure regularly. Adjust doses as needed',
            alternatives: ['This combination is often therapeutic - monitor and adjust doses']
          },
          {
            drugs: ['Omeprazole', 'Metformin'],
            severity: 'Minor',
            type: 'Pharmacokinetic',
            effect: 'Slightly reduced metformin absorption',
            mechanism: 'PPI may alter gastric pH affecting metformin absorption',
            clinicalSignificance: 'Minimal clinical impact on glucose control',
            management: 'No specific action required. Monitor glucose levels as usual',
            alternatives: ['Continue current therapy with routine monitoring']
          }
        ],
        recommendations: [
          'Review all medications with healthcare provider',
          'Consider therapeutic drug monitoring for warfarin',
          'Monitor for signs of bleeding (bruising, nosebleeds, unusual fatigue)',
          'Regular blood pressure monitoring recommended',
          'Keep medication list updated and share with all healthcare providers'
        ],
        contraindications: [
          'Patients with history of GI bleeding should avoid warfarin + aspirin combination',
          'Elderly patients may be more susceptible to drug interactions'
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'major': return 'destructive';
      case 'moderate': return 'default';
      case 'minor': return 'secondary';
      default: return 'outline';
    }
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
              Drug Interaction AI Explainer
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Analyze drug interactions with AI-powered explanations and safety recommendations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Medication List
                </CardTitle>
                <CardDescription>
                  Add medications to check for potential interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter medication name..."
                    value={currentMed}
                    onChange={(e) => setCurrentMed(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addMedication(currentMed)}
                  />
                  <Button 
                    onClick={() => addMedication(currentMed)}
                    disabled={!currentMed.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Common Medications:</h4>
                  <div className="flex flex-wrap gap-1">
                    {commonMedications.map((med) => (
                      <Button
                        key={med}
                        variant="outline"
                        size="sm"
                        onClick={() => addMedication(med)}
                        disabled={medications.includes(med)}
                        className="text-xs h-7"
                      >
                        {med}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Selected Medications:</h4>
                  <div className="space-y-2">
                    {medications.map((med, index) => (
                      <div key={index} className="flex items-center justify-between bg-secondary/20 p-2 rounded">
                        <span className="text-sm">{med}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {medications.length === 0 && (
                      <p className="text-sm text-muted-foreground">No medications added yet</p>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={analyzeDrugInteractions}
                  disabled={medications.length < 2 || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 animate-spin" />
                      Analyzing Interactions...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Check Interactions
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {interactions ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Interaction Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-destructive/10 rounded">
                        <div className="text-2xl font-bold text-destructive">{interactions.summary.majorInteractions}</div>
                        <div className="text-sm">Major</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-500/10 rounded">
                        <div className="text-2xl font-bold text-yellow-600">{interactions.summary.moderateInteractions}</div>
                        <div className="text-sm">Moderate</div>
                      </div>
                      <div className="text-center p-3 bg-secondary/50 rounded">
                        <div className="text-2xl font-bold">{interactions.summary.minorInteractions}</div>
                        <div className="text-sm">Minor</div>
                      </div>
                      <div className="text-center p-3 bg-primary/10 rounded">
                        <div className="text-2xl font-bold text-primary">{interactions.summary.totalInteractions}</div>
                        <div className="text-sm">Total</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {interactions.interactions.map((interaction: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {interaction.drugs.join(' + ')}
                          </CardTitle>
                          <Badge variant={getSeverityColor(interaction.severity)}>
                            {interaction.severity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Effect:
                          </h4>
                          <p className="text-sm text-muted-foreground">{interaction.effect}</p>
                        </div>

                        <div>
                          <h4 className="font-medium">Mechanism:</h4>
                          <p className="text-sm text-muted-foreground">{interaction.mechanism}</p>
                        </div>

                        <div>
                          <h4 className="font-medium">Clinical Significance:</h4>
                          <p className="text-sm text-muted-foreground">{interaction.clinicalSignificance}</p>
                        </div>

                        <div>
                          <h4 className="font-medium">Management:</h4>
                          <p className="text-sm text-muted-foreground">{interaction.management}</p>
                        </div>

                        <div>
                          <Badge variant="outline" className="text-xs">
                            {interaction.type} Interaction
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {interactions.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          {rec}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Pill className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to Check Interactions</h3>
                  <p className="text-muted-foreground">
                    Add at least 2 medications to analyze potential drug interactions
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

export default DrugInteractionAIExplainer;