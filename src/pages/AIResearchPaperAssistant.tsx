import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, FileText, Search, Download, BookOpen } from 'lucide-react';

const AIResearchPaperAssistant = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const samplePapers = [
    {
      id: 1,
      title: "Machine Learning in Medical Diagnosis: A Systematic Review",
      authors: ["Smith, J.", "Johnson, A.", "Williams, R."],
      journal: "Journal of Medical AI",
      year: 2024,
      doi: "10.1234/jmai.2024.001",
      abstract: "This systematic review examines the current applications of machine learning in medical diagnosis across various specialties. We analyzed 150 studies published between 2020-2024, focusing on accuracy, implementation challenges, and clinical outcomes. Results show significant improvements in diagnostic accuracy, particularly in radiology and pathology.",
      keyFindings: [
        "ML models achieved 94% accuracy in radiological diagnosis",
        "Reduced diagnostic time by 40% on average",
        "Improved early detection of rare diseases by 65%"
      ],
      methodology: "Systematic review following PRISMA guidelines",
      implications: "Machine learning shows promise for clinical implementation with proper validation"
    },
    {
      id: 2,
      title: "CRISPR-Cas9 Gene Therapy in Sickle Cell Disease: Clinical Trial Results",
      authors: ["Chen, L.", "Rodriguez, M.", "Thompson, K."],
      journal: "New England Journal of Medicine",
      year: 2024,
      doi: "10.1056/nejm.2024.002",
      abstract: "We present results from a Phase II clinical trial of CRISPR-Cas9 gene therapy for sickle cell disease. 45 patients received autologous hematopoietic stem cell transplantation after ex vivo gene editing. Primary endpoint was reduction in vaso-occlusive crises at 12 months.",
      keyFindings: [
        "87% reduction in vaso-occlusive crises",
        "Sustained increase in fetal hemoglobin levels",
        "No serious adverse events related to gene editing"
      ],
      methodology: "Phase II randomized controlled trial",
      implications: "CRISPR-Cas9 shows potential as curative treatment for sickle cell disease"
    }
  ];

  const analyzeWithAI = async () => {
    if (!selectedPaper) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setSummary({
        executiveSummary: "This research demonstrates significant advancement in the field with robust methodology and compelling results.",
        strengths: [
          "Large sample size with diverse patient population",
          "Rigorous statistical analysis using appropriate methods",
          "Clear clinical relevance and practical implications",
          "Well-controlled study design minimizing bias"
        ],
        limitations: [
          "Single-center study may limit generalizability",
          "Relatively short follow-up period",
          "Cost-effectiveness analysis not performed"
        ],
        clinicalSignificance: "High - findings likely to influence clinical practice guidelines",
        futureResearch: [
          "Multi-center validation studies needed",
          "Long-term safety and efficacy data required",
          "Economic impact assessment recommended"
        ],
        keyQuestions: [
          "How do these results compare to current standard of care?",
          "What are the implementation challenges in different healthcare settings?",
          "Are there specific patient populations that would benefit most?"
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const searchPapers = () => {
    // Simulate search functionality
    console.log('Searching for:', searchQuery);
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
              AI Research Paper Assistant
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Analyze and summarize medical research papers with AI assistance
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Medical Literature
              </CardTitle>
              <CardDescription>
                Find relevant research papers or select from sample papers below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Search for research papers, topics, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={searchPapers}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Paper Selection */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Available Papers
                  </CardTitle>
                  <CardDescription>
                    Select a paper to analyze with AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {samplePapers.map((paper) => (
                    <Card 
                      key={paper.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedPaper?.id === paper.id ? 'border-primary' : 'hover:border-secondary'
                      }`}
                      onClick={() => setSelectedPaper(paper)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2 line-clamp-2">{paper.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {paper.authors.join(', ')} • {paper.journal} • {paper.year}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            DOI: {paper.doi}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {selectedPaper && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Paper Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Abstract:</h4>
                      <p className="text-sm text-muted-foreground">{selectedPaper.abstract}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Key Findings:</h4>
                      <div className="space-y-1">
                        {selectedPaper.keyFindings.map((finding: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            {finding}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={analyzeWithAI}
                      disabled={isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 animate-spin" />
                          Analyzing with AI...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          Analyze with AI
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* AI Analysis Results */}
            <div className="space-y-6">
              {summary ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        AI Analysis Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{summary.executiveSummary}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {summary.strengths.map((strength: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            {strength}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Limitations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {summary.limitations.map((limitation: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                            {limitation}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Clinical Significance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="mb-2">
                        {summary.clinicalSignificance}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Future Research Directions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {summary.futureResearch.map((direction: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            {direction}
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
                      Select a research paper and click "Analyze with AI" to get detailed insights
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResearchPaperAssistant;