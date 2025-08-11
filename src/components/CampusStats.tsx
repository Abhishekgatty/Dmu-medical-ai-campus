import React from 'react';
import { useNavigate } from "react-router-dom";
import studentsLearning from "@/assets/students-learning.jpg";
import { Pill, MessageCircle, Lightbulb } from 'lucide-react';

export const CampusStats = () => {
  const navigate = useNavigate();
  const stats = [
    { number: "15,000+", label: "Global Students", icon: "🎓" },
    { number: "200+", label: "AI Modules", icon: "🤖" },
    { number: "50+", label: "Countries", icon: "🌍" },
    { number: "95%", label: "Match Rate", icon: "⚕️" }
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url(${studentsLearning})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-section">Leading Medical AI Education Globally</h2>
          <p className="text-campus max-w-3xl mx-auto">
            Our innovative platform combines cutting-edge artificial intelligence with world-class medical education,
            creating the next generation of healthcare professionals.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="campus-card p-6 text-center elegant-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-academic mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="campus-card p-8 text-center" onClick={() => navigate("/smart-medical-terminology-tutor")}>
            <div className="w-16 h-16 neural-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-academic">AI-Powered Learning</h3>
            <p className="text-campus">Personalized curriculum adapted to your learning style using advanced machine learning algorithms.</p>
          </div>

          <div
            className="campus-card p-8 text-center cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => navigate('/clinical-network')}
          >
            <div className="w-16 h-16 academic-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏥</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-academic">Global Clinical Network</h3>
            <p className="text-campus">Access to world-renowned medical institutions and clinical rotation opportunities worldwide.</p>
          </div>

      {/* <div className="campus-card p-8 text-center" onClick={() => navigate("/virtual-learning")}>
  <div className="w-16 h-16 bg-gradient-to-r from-lab-green to-medical-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
    <span className="text-2xl">🔬</span>
  </div>
  <h3 className="text-xl font-semibold mb-3 text-academic">Virtual Learning</h3>
  <p className="text-campus">State-of-the-art virtual laboratories with AI-assisted simulations and real-time feedback.</p>
</div> */}

          <div className="campus-card p-8 text-center" onClick={() => navigate("/symptom-to-diagnosis")}>
            <div className="w-16 h-16 bg-gradient-to-r from-lab-green to-medical-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🩺</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-academic">Clinical Case Studies</h3>
            <p className="text-campus">Interactive case studies with AI-driven scenarios to enhance diagnostic skills.</p>
          </div>

          <div className="campus-card p-8 text-center" onClick={() => navigate("/drug-interaction-ai-explainer")}>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Pill className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-academic">Drug Interaction Analyzer</h3>
            <p className="text-campus">Analyze drug interactions with AI-powered insights and safety recommendations.</p>
          </div>

          <div className="campus-card p-8 text-center" onClick={() => navigate("/ai-virtual-patient-simulator")}>
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-academic">Virtual Patient Simulator</h3>
            <p className="text-campus">Practice clinical skills with AI-powered virtual patient interactions and real-time feedback.</p>
          </div>

          <div className="campus-card p-8 text-center" onClick={() => navigate("/clinical-case-analyzer")}>
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-academic">Medical Case Analyzer</h3>
            <p className="text-campus">Analyze medical cases with AI-powered diagnostic insights and recommendations.</p>
          </div>
        </div>
      </div>
    </section>
  );
};