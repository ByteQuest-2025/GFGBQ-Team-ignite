import { useState } from "react";
import StartSession from "./pages/StartSession";
import AccessibilitySelector from "./components/AccessibilitySelector";
import VoiceVoting from "./components/VoiceVoting";
import Handoff from "./pages/Handoff";

// Sample candidates data for the demo
const CANDIDATES = [
  { id: 1, name: "Rajesh Kumar", party: "Progress Party", symbol: "🌞" },
  { id: 2, name: "Priya Sharma", party: "Future India", symbol: "🦁" },
  { id: 3, name: "Amit Patel", party: "Janata Voice", symbol: "🚜" },
  { id: 4, name: "Sneha Gupta", party: "Green Earth", symbol: "🌳" }
];

function App() {
  const [step, setStep] = useState("start");
  const [session, setSession] = useState(null);
  const [mode, setMode] = useState("audio");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleStartSession = (sessionData) => {
    setSession(sessionData);
    setStep("mode");
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setStep("voting");
  };

  const handleVoteConfirm = (candidate) => {
    setSelectedCandidate(candidate);
    setStep("handoff");
  };

  const handleHandoffComplete = () => {
    // Reset for next voter, keeping session active
    setSelectedCandidate(null);
    setMode("audio");
    setStep("mode");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {step === "start" && (
        <StartSession onStartVoting={handleStartSession} />
      )}

      {step === "mode" && (
        <AccessibilitySelector onModeSelect={handleModeSelect} />
      )}

      {step === "voting" && (
        <VoiceVoting
          candidates={CANDIDATES}
          mode={mode}
          onVoteConfirm={handleVoteConfirm}
          onBack={() => setStep("mode")}
        />
      )}

      {step === "handoff" && selectedCandidate && (
        <Handoff
          selectedCandidate={selectedCandidate}
          mode={mode}
          onComplete={handleHandoffComplete}
        />
      )}
    </div>
  );
}

export default App;
