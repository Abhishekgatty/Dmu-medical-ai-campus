import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { FacultyRegistration } from "./pages/FacultyRegistration";
import { ClinicalPartnership } from "./pages/ClinicalPartnership";
import ClinicalRegistration from "./pages/ClinicalRegistration";
import ClinicalDashboard from "./pages/ClinicalDashboard";
import Payments from "./pages/Payments";
import NotificationsList from "./pages/NotificationsList";
import NotificationAdmin from "./pages/NotificationAdmin";
import Courses from "./pages/Courses";
import ClinicalNetwork from "./pages/ClinicalNetwork";
import InternationalClinicalRotations from "./pages/InternationalClinicalRotations";
import AIEnhancedLearning from "./pages/AIEnhancedLearning";
import AIAgent from "./pages/AIAgent";
import VirtualLearning from "./pages/VirtualLearning";
import AIVoiceLearning from "./pages/AIVoiceLearning";
import SmartAttendance from "./pages/SmartAttendance";
import Exams from "./pages/Exams";
import { StudentEnrollment } from "./pages/StudentEnrollment";
import { StudentPortal } from "./pages/StudentPortal";
import { StudentDashboard } from "./pages/StudentDashboard";
import { FacultyDashboard } from "./pages/FacultyDashboard";
import { FacultyPortal } from "./pages/FacultyPortal";
import NotificationBar from "./components/NotificationBar";
import StudentProfile from "./pages/StudentProfile";
import { FacultyMentorshipHub } from "./pages/FacultyMentorshipHub";
import { StudyGroupNetwork } from "./pages/StudyGroupNetwork";
import Admin from "@/pages/Admin"; // ✅ Correct
import { StudentAcademicDashboard } from "./pages/StudentAcademicDashboard";
import AIResearchPaperAssistant from "./pages/AIResearchPaperAssistant";
import { CampusStats } from "./components/CampusStats";
import AIVirtualPatientSimulator from "./pages/AIVirtualPatientSimulator";
import { StudentPortalFeatures } from "./components/StudentPortalFeatures";
import SmartMedicalTerminologyTutor from "./pages/SmartMedicalTerminologyTutor";
import { FeatureGrid } from "./components/FeatureGrid";
import AdvancedCardiacAnatomy from "./pages/AdvancedCardiacAnatomy";
import AIMedicalCaseAnalyzer from "./pages/AIMedicalCaseAnalyzer";
import DrugInteractionAIExplainer from "./pages/DrugInteractionAIExplainer";
import NeuralNetworkDiagnosisModule from "./pages/NeuralNetworkDiagnosisModule";
import { StudentResourceHub } from "./pages/StudentResourceHub";
import { Symbols } from "recharts";
import SymptomToDiagnosisTrainer from "./pages/SymptomToDiagnosisTrainer";
import { HeroCarousel } from "./components/HeroCarousel";
import AntimicrobialPharmacology from "./pages/Pharmacology_of_Antimicrobials";
import MedicalImagingInterpretationPage from "./pages/MedicalImagingInterpretationPage";
import SurgicalTechniquesVRPage from "./pages/SurgicalTechniquesVRPage";
import MolecularMechanismsPage from "./pages/MolecularMechanismsPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/student-enrollment" element={<StudentEnrollment />} />
            <Route path="/student-portal" element={<StudentPortal />} />
            <Route path="/faculty-portal" element={<FacultyPortal />} />
            <Route path="/faculty-registration" element={<FacultyRegistration />} />
            <Route path="/clinical-registration" element={<ClinicalRegistration />} />

            {/* Protected Routes */}
            <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />

            <Route path="/faculty-dashboard" element={<ProtectedRoute><FacultyDashboard /></ProtectedRoute>} />
            <Route path="/clinical-partnership" element={<ProtectedRoute><ClinicalPartnership /></ProtectedRoute>} />
            <Route path="/clinical-dashboard" element={<ProtectedRoute><ClinicalDashboard /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsList /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute><NotificationAdmin /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/clinical-network" element={<ProtectedRoute><ClinicalNetwork /></ProtectedRoute>} />
            <Route path="/international-clinical-rotations" element={<ProtectedRoute><InternationalClinicalRotations /></ProtectedRoute>} />
            <Route path="/ai-enhanced-learning" element={<ProtectedRoute><AIEnhancedLearning /></ProtectedRoute>} />
            <Route path="/ai-agent" element={<ProtectedRoute><AIAgent /></ProtectedRoute>} />
            <Route path="/virtual-learning" element={<ProtectedRoute><VirtualLearning /></ProtectedRoute>} />
            <Route path="/ai-voice-learning" element={<ProtectedRoute><AIVoiceLearning /></ProtectedRoute>} />
            <Route path="/smart-attendance" element={<ProtectedRoute><SmartAttendance /></ProtectedRoute>} />
            <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
            <Route path="/admin-approvals" element={<Admin />} />
            <Route path="/notification-bar" element={<ProtectedRoute><NotificationBar /></ProtectedRoute>} />
            <Route path="/student-profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="/faculty-mentorship-hub" element={<ProtectedRoute><FacultyMentorshipHub /></ProtectedRoute>} />
            <Route path="/smart-medical-terminology-tutor" element={<ProtectedRoute><SmartMedicalTerminologyTutor /></ProtectedRoute>} />
            <Route path="/student-academic-dashboard" element={<ProtectedRoute><StudentAcademicDashboard /></ProtectedRoute>} />
            <Route path="/ai-research-paper-assistant" element={<ProtectedRoute><AIResearchPaperAssistant /></ProtectedRoute>} />
            <Route path="/campus-stats" element={<ProtectedRoute><CampusStats /></ProtectedRoute>} />
          <Route path="/student-portal-features" element={<ProtectedRoute><StudentPortalFeatures /></ProtectedRoute>} />
            <Route path="/study-group-network" element={<ProtectedRoute><StudyGroupNetwork /></ProtectedRoute>} />
            
              <Route path="/symptom-to-diagnosis" element={<ProtectedRoute><SymptomToDiagnosisTrainer /></ProtectedRoute>} /><Route path="/student-resource-hub" element={<ProtectedRoute><StudentResourceHub /></ProtectedRoute>} />
   <Route path="/drug-interaction-ai-explainer" element={<ProtectedRoute><DrugInteractionAIExplainer /></ProtectedRoute>} />
    <Route path="/ai-virtual-patient-simulator" element={<ProtectedRoute><AIVirtualPatientSimulator /></ProtectedRoute>} />
  <Route path="/clinical-case-analyzer" element={<ProtectedRoute><AIMedicalCaseAnalyzer /></ProtectedRoute>} />

 <Route path="/neural-network-diagnosis" element={<ProtectedRoute><NeuralNetworkDiagnosisModule /></ProtectedRoute>} />
  <Route path="/advanced-cardiac-anatomy" element={<ProtectedRoute><AdvancedCardiacAnatomy /></ProtectedRoute>} />

            
         
            <Route path="/clinical-case-analyzer" element={<ProtectedRoute><AIMedicalCaseAnalyzer /></ProtectedRoute>} />
           

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/antimicrobial-pharmacology" element={<AntimicrobialPharmacology />} />
            <Route path="/medical-imaging-interpretation" element={<MedicalImagingInterpretationPage />} />
              <Route path="/surgical-techniques-vr" element={<SurgicalTechniquesVRPage />} />
                   <Route path="/molecular-mechanisms" element={<MolecularMechanismsPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
