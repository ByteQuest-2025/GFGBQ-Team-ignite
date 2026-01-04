import React from "react";
import "./AccessibilitySelector.css";

function AccessibilitySelector({ onSelect }) {
  const modes = [
    {
      id: "audio",
      icon: "🔊",
      titleHi: "ऑडियो मोड",
      titleEn: "Audio Mode",
      key: "दबाएँ 1 / Press 1"
    },
    {
      id: "largeText",
      icon: "🔍",
      titleHi: "बड़ा टेक्स्ट",
      titleEn: "Large Text",
      key: "दबाएँ 2 / Press 2"
    },
    {
      id: "voice",
      icon: "🎤",
      titleHi: "आवाज़ कमांड",
      titleEn: "Voice Commands",
      key: "दबाएँ 3 / Press 3"
    },
    {
      id: "keyboard",
      icon: "⌨️",
      titleHi: "कीबोर्ड",
      titleEn: "Keyboard",
      key: "दबाएँ 4 / Press 4"
    }
  ];

  // Handle keyboard press
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;
      if (key === "1") onSelect("audio");
      else if (key === "2") onSelect("largeText");
      else if (key === "3") onSelect("voice");
      else if (key === "4") onSelect("keyboard");
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onSelect]);

  return (
    <div className="accessibility-selector">
      <div className="selector-container">
        <h1 className="title-hi">अपना पसंदीदा मोड चुनें</h1>
        <h2 className="title-en">Select Your Preferred Mode</h2>

        <div className="modes-grid">
          {modes.map((mode) => (
            <button
              key={mode.id}
              className={`mode-card ${mode.id === "audio" ? "highlight" : ""}`}
              onClick={() => onSelect(mode.id)}
            >
              <div className="mode-icon">{mode.icon}</div>
              <div className="mode-title-hi">{mode.titleHi}</div>
              <div className="mode-title-en">{mode.titleEn}</div>
              <div className="mode-key">{mode.key}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AccessibilitySelector;