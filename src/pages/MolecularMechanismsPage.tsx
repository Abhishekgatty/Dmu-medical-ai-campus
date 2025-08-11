import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FlaskConical, Loader2, Dna } from 'lucide-react';
import { HeaderNew } from "@/components/HeaderNew";

const MolecularMechanismsPage = () => {
  const navigate = useNavigate();

  const moduleInfo = {
    id: 'mod-006',
    title: 'Molecular Mechanisms of Disease',
    instructor: 'Dr. Robert Kim',
    duration: '10 weeks',
    schedule: 'Wednesdays & Fridays, 3:00 PM',
    category: 'Pathology',
    description:
      'Explore the molecular and cellular basis of disease processes with interactive molecular modeling.',
    topics: ['Cell Injury Mechanisms', 'Inflammation Pathways', 'Neoplasia', 'Genetic Disorders'],
    enrolledStudents: 40,
    maxStudents: 45,
    progress: 0,
  };

  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string>("");

  const pathways = [
    'Apoptosis Pathway',
    'Inflammatory Cascade',
    'Oncogene Activation',
    'DNA Repair Mechanism',
  ];

  const simulatePathway = (pathway: string) => {
    setSelectedPathway(pathway);
    setLoading(true);
    setExplanation("");

    // Simulate AI explanation generation
    setTimeout(() => {
      setExplanation(
        `In the ${pathway}, molecular signals trigger specific cascades that alter cell behavior. AI analysis predicts high relevance in cancer and autoimmune diseases.`
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-6">
        <HeaderNew/>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Back */}
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

        {/* Pathway Simulator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" /> Molecular Pathway Explorer
            </CardTitle>
            <CardDescription>
              Select a disease-related molecular pathway to see AI-driven insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedPathway && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pathways.map((path) => (
                  <Button key={path} onClick={() => simulatePathway(path)}>
                    <Dna className="h-4 w-4 mr-2" /> {path}
                  </Button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing molecular interactions...
              </div>
            )}

            {!loading && explanation && (
              <div className="p-4 bg-secondary/20 rounded space-y-3">
                <h4 className="font-semibold text-lg">{selectedPathway} — AI Insights</h4>
                <p>{explanation}</p>
                <Button variant="secondary" onClick={() => setSelectedPathway(null)}>
                  Explore Another Pathway
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MolecularMechanismsPage;
