// client/src/components/AccessibilitySelector.jsx
// Mode selection component for voters

import React, { useState, useEffect } from 'react';
import { speechManager, Announcements } from '../utils/speech';
import { contrastManager, textSizeManager } from '../utils/accessibility';

const AccessibilitySelector = ({ onModeSelect }) => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [textSize, setTextSize] = useState('normal');

  useEffect(() => {
    speechManager.enable();
    speechManager.speak(Announcements.modeSelection);

    const handleKeyPress = (e) => {
      if (e.key >= '1' && e.key <= '4') {
        const modes = ['audio', 'large-text', 'voice', 'keyboard'];
        handleModeSelection(modes[parseInt(e.key) - 1]);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleModeSelection = (mode) => {
    setSelectedMode(mode);

    switch(mode) {
      case 'audio':
        speechManager.enable();
        speechManager.speakNow('ऑडियो मोड चुना गया');
        break;
      case 'large-text':
        textSizeManager.setSize('xlarge');
        setTextSize('xlarge');
        speechManager.speakNow('बड़े टेक्स्ट मोड चुना गया');
        break;
      case 'voice':
        speechManager.enable();
        speechManager.speakNow('आवाज़ कमांड मोड चुना गया');
        break;
      case 'keyboard':
        speechManager.speakNow('कीबोर्ड नेविगेशन मोड चुना गया');
        break;
    }

    setTimeout(() => {
      onModeSelect?.(mode);
    }, 1500);
  };

  const toggleContrast = () => {
    const enabled = contrastManager.toggle();
    setIsHighContrast(enabled);
    speechManager.speakNow(enabled ? 'हाई कंट्रास्ट चालू' : 'हाई कंट्रास्ट बंद');
  };

  return (
    <div className={`accessibility-selector ${isHighContrast ? 'high-contrast' : ''} text-${textSize}`}>
      <div className="selector-container">
        <h1 className="main-heading">
          अपना पसंदीदा मोड चुनें
        </h1>
        <p className="subtitle">
          Select Your Preferred Mode
        </p>

        <div className="mode-grid">
          <button
            className={`mode-card ${selectedMode === 'audio' ? 'selected' : ''}`}
            onClick={() => handleModeSelection('audio')}
            data-keyboard-nav
            aria-label="ऑडियो मोड - Audio Mode"
          >
            <div className="icon">🔊</div>
            <h2>ऑडियो मोड</h2>
            <p>Audio Mode</p>
            <span className="shortcut">दबाएं 1 / Press 1</span>
          </button>

          <button
            className={`mode-card ${selectedMode === 'large-text' ? 'selected' : ''}`}
            onClick={() => handleModeSelection('large-text')}
            data-keyboard-nav
            aria-label="बड़े टेक्स्ट मोड - Large Text Mode"
          >
            <div className="icon">🔍</div>
            <h2>बड़ा टेक्स्ट</h2>
            <p>Large Text</p>
            <span className="shortcut">दबाएं 2 / Press 2</span>
          </button>

          <button
            className={`mode-card ${selectedMode === 'voice' ? 'selected' : ''}`}
            onClick={() => handleModeSelection('voice')}
            data-keyboard-nav
            aria-label="आवाज़ कमांड - Voice Commands"
          >
            <div className="icon">🎤</div>
            <h2>आवाज़ कमांड</h2>
            <p>Voice Commands</p>
            <span className="shortcut">दबाएं 3 / Press 3</span>
          </button>

          <button
            className={`mode-card ${selectedMode === 'keyboard' ? 'selected' : ''}`}
            onClick={() => handleModeSelection('keyboard')}
            data-keyboard-nav
            aria-label="कीबोर्ड नेविगेशन - Keyboard Navigation"
          >
            <div className="icon">⌨️</div>
            <h2>कीबोर्ड</h2>
            <p>Keyboard</p>
            <span className="shortcut">दबाएं 4 / Press 4</span>
          </button>
        </div>

        <div className="additional-options">
          <button
            className={`toggle-btn ${isHighContrast ? 'active' : ''}`}
            onClick={toggleContrast}
            aria-label="High Contrast Toggle"
          >
            {isHighContrast ? '🌙' : '☀️'} High Contrast
          </button>
        </div>

        <div className="help-text">
          <p>मदद के लिए H दबाएं / Press H for Help</p>
        </div>
      </div>

      <style jsx>{`
        .accessibility-selector {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .selector-container {
          max-width: 900px;
          width: 100%;
          background: white;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .main-heading {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: #2d3748;
        }

        .subtitle {
          text-align: center;
          font-size: 1.2rem;
          color: #718096;
          margin-bottom: 3rem;
        }

        .mode-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .mode-card {
          background: #f7fafc;
          border: 3px solid transparent;
          border-radius: 15px;
          padding: 2rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .mode-card:hover,
        .mode-card:focus {
          transform: translateY(-5px);
          border-color: #667eea;
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
          outline: none;
        }

        .mode-card.selected {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .mode-card.selected h2,
        .mode-card.selected p {
          color: white;
        }

        .keyboard-focused {
          border-color: #f6ad55;
          box-shadow: 0 0 0 4px rgba(246, 173, 85, 0.4);
        }

        .icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .mode-card h2 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: #2d3748;
        }

        .mode-card p {
          font-size: 0.95rem;
          color: #718096;
          margin-bottom: 1rem;
        }

        .shortcut {
          display: block;
          font-size: 0.85rem;
          color: #a0aec0;
          font-weight: 500;
        }

        .mode-card.selected .shortcut {
          color: rgba(255,255,255,0.8);
        }

        .additional-options {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .toggle-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .toggle-btn:hover,
        .toggle-btn:focus {
          border-color: #667eea;
          background: #f7fafc;
          outline: none;
        }

        .toggle-btn.active {
          background: #2d3748;
          color: white;
          border-color: #2d3748;
        }

        .help-text {
          text-align: center;
          margin-top: 2rem;
          color: #718096;
          font-size: 0.9rem;
        }

        .text-large {
          font-size: 120%;
        }

        .text-xlarge {
          font-size: 140%;
        }

        .text-xlarge .main-heading {
          font-size: 3.5rem;
        }

        .text-xlarge .mode-card h2 {
          font-size: 1.8rem;
        }

        .high-contrast {
          background: #000;
        }

        .high-contrast .selector-container {
          background: #000;
          color: #fff;
          border: 3px solid #fff;
        }

        .high-contrast .main-heading,
        .high-contrast .mode-card h2 {
          color: #fff;
        }

        .high-contrast .subtitle,
        .high-contrast .mode-card p,
        .high-contrast .help-text {
          color: #d1d5db;
        }

        .high-contrast .mode-card {
          background: #1a1a1a;
          border-color: #fff;
        }

        .high-contrast .mode-card:hover,
        .high-contrast .mode-card:focus {
          background: #2d2d2d;
          border-color: #fbbf24;
        }

        .high-contrast .mode-card.selected {
          background: #fbbf24;
          color: #000;
          border-color: #fbbf24;
        }

        .high-contrast .mode-card.selected h2,
        .high-contrast .mode-card.selected p {
          color: #000;
        }

        @media (max-width: 768px) {
          .mode-grid {
            grid-template-columns: 1fr;
          }

          .main-heading {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AccessibilitySelector;