import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, Book, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

const SmartMedicalTerminologyTutor = () => {
  const navigate = useNavigate();
  const [currentTerm, setCurrentTerm] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [difficulty, setDifficulty] = useState('beginner');

  const medicalTerms = {
    beginner: [
      {
        term: "Hypertension",
        definition: "High blood pressure",
        etymology: "Hyper (above) + Tension (pressure)",
        examples: ["Essential hypertension", "Secondary hypertension"],
        relatedTerms: ["Hypotension", "Normotensive"]
      },
      {
        term: "Tachycardia",
        definition: "Rapid heart rate",
        etymology: "Tachy (fast) + Cardia (heart)",
        examples: ["Sinus tachycardia", "Ventricular tachycardia"],
        relatedTerms: ["Bradycardia", "Arrhythmia"]
      }
    ],
    intermediate: [
      {
        term: "Pneumothorax",
        definition: "Collapsed lung due to air in pleural space",
        etymology: "Pneumo (air/lung) + Thorax (chest)",
        examples: ["Spontaneous pneumothorax", "Tension pneumothorax"],
        relatedTerms: ["Pleural effusion", "Hemothorax"]
      },
      {
        term: "Myocardial infarction",
        definition: "Heart attack due to blocked blood flow",
        etymology: "Myo (muscle) + Cardial (heart) + Infarction (tissue death)",
        examples: ["STEMI", "NSTEMI"],
        relatedTerms: ["Angina", "Cardiomyopathy"]
      }
    ],
    advanced: [
      {
        term: "Thrombocytopenia",
        definition: "Low platelet count",
        etymology: "Thrombo (clot) + Cyto (cell) + Penia (deficiency)",
        examples: ["ITP", "Drug-induced thrombocytopenia"],
        relatedTerms: ["Thrombocytosis", "Pancytopenia"]
      }
    ]
  };

  const generateNewTerm = () => {
    const terms = medicalTerms[difficulty as keyof typeof medicalTerms];
    const randomTerm = terms[Math.floor(Math.random() * terms.length)];
    setCurrentTerm(randomTerm);
    setUserAnswer('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (!currentTerm || !userAnswer.trim()) return;

    const isCorrect = userAnswer.toLowerCase().includes(currentTerm.definition.toLowerCase().split(' ')[0]);
    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1
    };
    setScore(newScore);

    setFeedback({
      isCorrect,
      explanation: isCorrect 
        ? "Excellent! You got it right!" 
        : `Not quite. The correct definition is: ${currentTerm.definition}`,
      etymology: currentTerm.etymology,
      examples: currentTerm.examples,
      relatedTerms: currentTerm.relatedTerms
    });
  };

  const nextTerm = () => {
    generateNewTerm();
  };

  React.useEffect(() => {
    generateNewTerm();
  }, [difficulty]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-4xl mx-auto">
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
              Smart Medical Terminology Tutor
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Master medical terminology with AI-powered learning
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{score.correct}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{score.total}</div>
              <div className="text-sm text-muted-foreground">Total Attempts</div>
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
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Difficulty Level
                </CardTitle>
                <div className="flex gap-2">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDifficulty(level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
          </Card>

          {currentTerm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Define This Term
                </CardTitle>
                <CardDescription>
                  What does this medical term mean?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {currentTerm.term}
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Definition:</label>
                    <Input
                      placeholder="Enter your definition here..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim()}
                      className="flex-1"
                    >
                      Check Answer
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={nextTerm}
                    >
                      Skip
                    </Button>
                  </div>
                </div>

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
                          {feedback.explanation}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            Etymology:
                          </h4>
                          <p className="text-sm text-muted-foreground">{feedback.etymology}</p>
                        </div>

                        <div>
                          <h4 className="font-medium">Examples:</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {feedback.examples.map((example: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">Related Terms:</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {feedback.relatedTerms.map((term: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {term}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={nextTerm}
                        className="w-full mt-4"
                      >
                        Next Term
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartMedicalTerminologyTutor;