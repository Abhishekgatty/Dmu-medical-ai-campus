import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Brain, Activity } from 'lucide-react';

const MedicalImagingInterpretationPage = () => {
  const navigate = useNavigate();

  const moduleInfo = {
    id: 'mod-004',
    title: 'Medical Imaging Interpretation',
    instructor: 'Dr. James Wilson',
    duration: '7 weeks',
    schedule: 'Tuesdays & Fridays, 9:00 AM',
    category: 'Radiology',
    description:
      'Develop skills in interpreting various medical imaging modalities with AI-assisted analysis techniques.',
    topics: ['X-ray Interpretation', 'CT Scan Analysis', 'MRI Fundamentals', 'Ultrasound Basics'],
    enrolledStudents: 30,
    maxStudents: 35,
    progress: 0,
  };

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiFindings, setAiFindings] = useState<{ feature: string; confidence: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(URL.createObjectURL(file));
      setAiFindings([]);
    }
  };

  const runAIAnalysis = () => {
    if (!uploadedImage) return;
    setLoading(true);
    setAiFindings([]);

    // Simulated AI results
    setTimeout(() => {
      const fakeFindings = [
        { feature: 'Possible lung consolidation', confidence: 92 },
        { feature: 'No signs of pneumothorax', confidence: 88 },
        { feature: 'Slight cardiomegaly', confidence: 75 },
      ];
      setAiFindings(fakeFindings);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
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

        {/* AI Image Upload & Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" /> AI Imaging Analysis Lab
            </CardTitle>
            <CardDescription>
              Upload a medical image and let the AI simulate detection of key features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="upload-scan"
            />
            <label
              htmlFor="upload-scan"
              className="flex items-center justify-center gap-2 border-2 border-dashed p-4 rounded-lg cursor-pointer hover:bg-secondary/10"
            >
              <Upload className="h-4 w-4" /> Click to upload scan image
            </label>

            {/* Preview */}
            {uploadedImage && (
              <div className="mt-4">
                <img
                  src={uploadedImage}
                  alt="Uploaded Scan"
                  className="rounded-lg max-h-80 object-contain border"
                />
              </div>
            )}

            {/* AI Analysis Button */}
            {uploadedImage && (
              <Button onClick={runAIAnalysis} disabled={loading} className="mt-4 flex gap-2">
                <Activity className="h-4 w-4" /> Run AI Analysis
              </Button>
            )}

            {/* Loading */}
            {loading && <p className="text-sm text-muted-foreground">Analyzing image...</p>}

            {/* Results */}
            {aiFindings.length > 0 && (
              <div className="mt-4 bg-secondary/20 p-4 rounded">
                <h4 className="font-semibold mb-2">AI Findings:</h4>
                <ul className="space-y-1 text-sm">
                  {aiFindings.map((finding, idx) => (
                    <li key={idx}>
                      {finding.feature} — <span className="text-primary">{finding.confidence}% confidence</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalImagingInterpretationPage;
