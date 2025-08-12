import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Info, Volume2, RotateCcw } from 'lucide-react';
import * as THREE from 'three';
import { HeaderNew } from '@/components/HeaderNew';

// 3D Heart Component
const Heart3D = ({ onPartClick }: { onPartClick: (part: string) => void }) => {
  const heartRef = useRef<THREE.Group>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  useFrame((state) => {
    if (heartRef.current) {
      heartRef.current.rotation.y += 0.002;
    }
  });

  const createHeartShape = () => {
    const heartShape = new THREE.Shape();
    heartShape.moveTo(25, 25);
    heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);
    return heartShape;
  };

  const heartParts = [
    { name: 'Left Atrium', position: [-0.8, 1, 0] as [number, number, number], color: '#ff6b6b', size: [0.6, 0.5, 0.4] as [number, number, number] },
    { name: 'Right Atrium', position: [0.8, 1, 0] as [number, number, number], color: '#4ecdc4', size: [0.6, 0.5, 0.4] as [number, number, number] },
    { name: 'Left Ventricle', position: [-0.5, -0.5, 0] as [number, number, number], color: '#45b7d1', size: [0.8, 1, 0.6] as [number, number, number] },
    { name: 'Right Ventricle', position: [0.5, -0.5, 0] as [number, number, number], color: '#96ceb4', size: [0.7, 0.9, 0.5] as [number, number, number] },
  ];

  return (
    <group ref={heartRef}>
      {heartParts.map((part, index) => (
        <mesh
          key={index}
          position={part.position}
          onClick={() => onPartClick(part.name)}
          onPointerOver={() => setHoveredPart(part.name)}
          onPointerOut={() => setHoveredPart(null)}
        >
          <boxGeometry args={part.size} />
          <meshStandardMaterial 
            color={hoveredPart === part.name ? '#ffffff' : part.color}
            transparent
            opacity={0.8}
          />
          {hoveredPart === part.name && (
            <Html position={[0, part.size[1]/2 + 0.3, 0]}>
              <div className="bg-black text-white p-2 rounded text-sm pointer-events-none">
                {part.name}
              </div>
            </Html>
          )}
        </mesh>
      ))}
      
      {/* Heart vessels */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
      
      <mesh position={[0.3, 1.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
};

const AdvancedCardiacAnatomy = () => {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const heartPartInfo = {
    'Left Atrium': {
      description: 'The left atrium receives oxygenated blood from the lungs via the pulmonary veins.',
      function: 'Receives oxygenated blood and pumps it to the left ventricle',
      pressure: '8-12 mmHg',
      volume: '50-60 ml'
    },
    'Right Atrium': {
      description: 'The right atrium receives deoxygenated blood from the body via the vena cavae.',
      function: 'Receives deoxygenated blood and pumps it to the right ventricle',
      pressure: '2-6 mmHg',
      volume: '50-60 ml'
    },
    'Left Ventricle': {
      description: 'The left ventricle is the strongest chamber, pumping blood to the entire body.',
      function: 'Pumps oxygenated blood to the systemic circulation',
      pressure: '120/8 mmHg',
      volume: '120-130 ml'
    },
    'Right Ventricle': {
      description: 'The right ventricle pumps deoxygenated blood to the lungs.',
      function: 'Pumps deoxygenated blood to the pulmonary circulation',
      pressure: '25/4 mmHg',
      volume: '120-130 ml'
    }
  };

  const handlePartClick = (partName: string) => {
    setSelectedPart(partName);
  };

  const resetView = () => {
    setSelectedPart(null);
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control audio narration
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
     <HeaderNew  />
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
              Advanced Cardiac Anatomy
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Interactive 3D Heart Model with AI-Enhanced Learning
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Model Section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  3D Heart Model
                </CardTitle>
                <CardDescription>
                  Click on different parts of the heart to learn more
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full p-4">
                <div className="w-full h-[500px] bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden">
                  <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <pointLight position={[-10, -10, -5]} intensity={0.5} />
                    <Heart3D onPartClick={handlePartClick} />
                    <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
                  </Canvas>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button onClick={resetView} variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset View
                  </Button>
                  <Button onClick={toggleAudio} variant="outline" size="sm">
                    <Volume2 className="h-4 w-4 mr-2" />
                    {isPlaying ? 'Stop' : 'Play'} Audio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Course Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="secondary">Anatomy</Badge>
                  <div className="mt-2">
                    <p className="text-sm"><strong>Instructor:</strong> Dr. Sarah Johnson</p>
                    <p className="text-sm"><strong>Duration:</strong> 6 weeks</p>
                    <p className="text-sm"><strong>Students:</strong> 42/50</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Topics Covered:</h4>
                  <div className="space-y-1">
                    {['Heart Chambers', 'Valvular Anatomy', 'Coronary Circulation', 'Conduction System'].map((topic, index) => (
                      <Badge key={index} variant="outline" className="mr-1 mb-1">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedPart && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">{selectedPart}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{heartPartInfo[selectedPart as keyof typeof heartPartInfo]?.description}</p>
                  
                  <div>
                    <h5 className="font-medium text-sm">Function:</h5>
                    <p className="text-xs text-muted-foreground">
                      {heartPartInfo[selectedPart as keyof typeof heartPartInfo]?.function}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <strong>Pressure:</strong><br />
                      {heartPartInfo[selectedPart as keyof typeof heartPartInfo]?.pressure}
                    </div>
                    <div>
                      <strong>Volume:</strong><br />
                      {heartPartInfo[selectedPart as keyof typeof heartPartInfo]?.volume}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Module Progress</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Complete the interactive session to unlock the next module
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCardiacAnatomy;