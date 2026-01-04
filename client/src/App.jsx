import { useState } from "react";
import AccessibilitySelector from "./components/AccessibilitySelector";
import Instructions from "./pages/Instructions";
import ModeSelection from "./pages/ModeSelection";
import StartSession from "./pages/StartSession";
import Handoff from "./pages/Handoff";
import Ballot from "./components/Ballot";
import Confirmation from "./components/Confirmation";

function App() {
  const [step, setStep] = useState("accessibility"); // Start with accessibility
  const [accessibilityMode, setAccessibilityMode] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleAccessibilitySelect = (mode) => {
    setAccessibilityMode(mode);
    setStep("instructions");
  };

  const handleInstructionsContinue = () => {
    setStep("modeSelection");
  };

  const handleModeSelect = (mode) => {
    setStep("startSession");
  };

  const handleStartSession = () => {
    setStep("ballot");
  };

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
    setStep("confirmation");
  };

  const handleConfirmVote = () => {
    setStep("handoff");
  };

  const handleBackToBallot = () => {
    setSelectedCandidate(null);
    setStep("ballot");
  };

  const handleEndSession = () => {
    setStep("accessibility");
    setAccessibilityMode(null);
    setSelectedCandidate(null);
  };

  return (
    <div className="app-container">
      {step === "accessibility" && (
        <AccessibilitySelector onSelect={handleAccessibilitySelect} />
      )}

      {step === "instructions" && (
        <Instructions 
          onContinue={handleInstructionsContinue}
          accessibilityMode={accessibilityMode}
        />
      )}

      {step === "modeSelection" && (
        <ModeSelection onModeSelect={handleModeSelect} />
      )}

      {step === "startSession" && (
        <StartSession onStart={handleStartSession} />
      )}

      {step === "ballot" && (
        <Ballot 
          onCandidateSelect={handleCandidateSelect}
          accessibilityMode={accessibilityMode}
        />
      )}

      {step === "confirmation" && (
        <Confirmation
          candidate={selectedCandidate}
          onConfirm={handleConfirmVote}
          onBack={handleBackToBallot}
        />
      )}

      {step === "handoff" && (
        <Handoff onEndSession={handleEndSession} />
      )}
    </div>
  );
}

export default App;