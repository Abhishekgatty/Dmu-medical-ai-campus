import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, Zap, Upload, Download, Play, Pause } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HeaderNew } from '@/components/HeaderNew';

const NeuralNetworkDiagnosisModule = () => {
  const navigate = useNavigate();
  const [selectedDemo, setSelectedDemo] = useState<string>('classification');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [inputData, setInputData] = useState('');

  const demoSamples = {
    classification: {
      title: "Medical Image Classification",
      description: "Classify medical images using convolutional neural networks",
      input: "Upload chest X-ray, MRI, or CT scan",
      sampleData: "Sample: Chest X-ray showing pneumonia patterns",
      results: {
        prediction: "Pneumonia detected",
        confidence: "94.7%",
        heatmap: "Areas of concern highlighted in red",
        recommendations: ["Immediate antibiotic treatment", "Follow-up in 48 hours", "Consider hospitalization"]
      }
    },
    diagnosis: {
      title: "Symptom-Based Diagnosis",
      description: "AI diagnosis based on patient symptoms and medical history",
      input: "Enter patient symptoms and vital signs",
      sampleData: "Chest pain, shortness of breath, elevated troponin",
      results: {
        prediction: "Acute Myocardial Infarction",
        confidence: "89.3%",
        heatmap: "Risk factors analysis",
        recommendations: ["Emergency catheterization", "Aspirin + Clopidogrel", "Continuous monitoring"]
      }
    },
    pathology: {
      title: "Histopathology Analysis",
      description: "Automated analysis of tissue samples for cancer detection",
      input: "Upload histopathology slide image",
      sampleData: "Breast tissue biopsy with cellular abnormalities",
      results: {
        prediction: "Invasive Ductal Carcinoma",
        confidence: "91.2%",
        heatmap: "Malignant cells highlighted",
        recommendations: ["Confirm with IHC staining", "Stage with imaging", "Oncology referral"]
      }
    }
  };

  const runDiagnosis = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setResults(demoSamples[selectedDemo as keyof typeof demoSamples].results);
      setIsProcessing(false);
    }, 3000);
  };

  const networkArchitecture = [
    { layer: "Input Layer", neurons: 784, description: "Medical image pixels / symptom vectors" },
    { layer: "Conv Layer 1", neurons: 32, description: "Feature extraction with 3x3 filters" },
    { layer: "MaxPool 1", neurons: 16, description: "Spatial dimension reduction" },
    { layer: "Conv Layer 2", neurons: 64, description: "Higher-level feature detection" },
    { layer: "MaxPool 2", neurons: 32, description: "Further dimensionality reduction" },
    { layer: "Dense Layer", neurons: 128, description: "Feature combination and analysis" },
    { layer: "Dropout", neurons: 128, description: "Regularization (50% dropout)" },
    { layer: "Output Layer", neurons: 10, description: "Disease classification probabilities" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <HeaderNew />
      <div className="max-w-6xl mx-auto mt-[100px]">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/virtual-learning')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Virtual Learning
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Neural Network Applications in Diagnosis
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Hands-on AI Diagnostics with Real-time Neural Network Visualization
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Course Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="secondary">AI Medicine</Badge>
                  <div className="mt-2">
                    <p className="text-sm"><strong>Instructor:</strong> Dr. Michael Chen</p>
                    <p className="text-sm"><strong>Duration:</strong> 8 weeks</p>
                    <p className="text-sm"><strong>Students:</strong> 38/45</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demo Applications</CardTitle>
                <CardDescription>Select a neural network application to explore</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(demoSamples).map(([key, demo]) => (
                  <Button
                    key={key}
                    variant={selectedDemo === key ? 'default' : 'outline'}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setSelectedDemo(key)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{demo.title}</div>
                      <div className="text-xs text-muted-foreground">{demo.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {networkArchitecture.map((layer, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-secondary/20 rounded text-xs">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">{layer.layer}</div>
                        <div className="text-muted-foreground">{layer.neurons} units</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Demo Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {demoSamples[selectedDemo as keyof typeof demoSamples].title}
                </CardTitle>
                <CardDescription>
                  {demoSamples[selectedDemo as keyof typeof demoSamples].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {demoSamples[selectedDemo as keyof typeof demoSamples].input}
                  </label>
                  
                  {selectedDemo === 'classification' || selectedDemo === 'pathology' ? (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload medical image or use sample data
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Use Sample Data
                      </Button>
                    </div>
                  ) : (
                    <Textarea
                      placeholder="Enter patient symptoms, vital signs, and medical history..."
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      className="min-h-[100px]"
                    />
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={runDiagnosis}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Run AI Diagnosis
                      </div>
                    )}
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sample Data Display */}
                <div className="bg-accent/20 p-3 rounded">
                  <h4 className="text-sm font-medium mb-1">Sample Input:</h4>
                  <p className="text-sm text-muted-foreground">
                    {demoSamples[selectedDemo as keyof typeof demoSamples].sampleData}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Network Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>Neural Network Activity</CardTitle>
                <CardDescription>Real-time visualization of network processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-2 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  {networkArchitecture.map((layer, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs font-medium mb-2">{layer.layer.split(' ')[0]}</div>
                      <div className="space-y-1">
                        {Array.from({ length: Math.min(layer.neurons / 8, 8) }).map((_, nodeIndex) => (
                          <div 
                            key={nodeIndex}
                            className={`w-3 h-3 rounded-full mx-auto transition-all duration-500 ${
                              isProcessing 
                                ? 'bg-primary animate-pulse' 
                                : results 
                                ? 'bg-green-500' 
                                : 'bg-gray-300'
                            }`}
                            style={{
                              animationDelay: `${(index * 100) + (nodeIndex * 50)}ms`
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {layer.neurons}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <Card className="border-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Brain className="h-5 w-5" />
                    AI Diagnosis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Prediction:</h4>
                      <p className="text-lg font-bold text-primary">{results.prediction}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Confidence:</h4>
                      <p className="text-lg font-bold text-green-600">{results.confidence}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Clinical Recommendations:</h4>
                    <div className="space-y-1">
                      {results.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <p className="text-xs text-yellow-800">
                      <strong>Disclaimer:</strong> AI predictions are for educational purposes only. 
                      Always consult with qualified healthcare professionals for actual medical decisions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralNetworkDiagnosisModule;