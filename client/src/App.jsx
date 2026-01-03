import { useState } from "react";

function App() {
  const [step, setStep] = useState("start");

  return (
    <div className="app-container">
      {step === "start" && (
        <div className="panel">
          <h1>🗳️ Swa-Nirnay</h1>
          <p>
            An assistive voting interface designed to help specially-abled
            citizens vote independently and confidently.
          </p>
          <button onClick={() => setStep("mode")}>
            Start Voting Assistance
          </button>
        </div>
      )}

      {step === "mode" && (
        <div className="panel">
          <h2>Select Accessibility Mode</h2>
          <button onClick={() => setStep("instructions")}>
            Audio + Visual Assistance
          </button>
          <button onClick={() => setStep("instructions")}>
            Visual Assistance Only
          </button>
        </div>
      )}

      {step === "instructions" && (
        <div className="panel">
          <h2>Instructions</h2>
          <p>
            You will now be guided through the list of candidates.  
            No vote is stored. Final voting happens only on the official EVM.
          </p>
          <button onClick={() => setStep("handoff")}>
            Continue
          </button>
        </div>
      )}

      {step === "handoff" && (
        <div className="panel">
          <h2>Handoff to Official Machine</h2>
          <p>
            Please press the corresponding button on the official EVM
            to cast your vote.
          </p>
          <button onClick={() => setStep("start")}>
            End Session
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
