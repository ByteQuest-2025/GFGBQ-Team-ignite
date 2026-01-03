// client/src/components/VoiceVoting.jsx
// Voice-controlled voting interface

import React, { useState, useEffect } from 'react';
import { speechManager, voiceCommands, Announcements } from '../utils/speech';
import { keyboardNav, setupKeyboardNavigation } from '../utils/accessibility';

const VoiceVoting = ({ 
  candidates = [],
  mode = 'audio',
  onVoteConfirm,
  onBack
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (candidates.length === 0) return;

    speechManager.enable();
    speechManager.speak(Announcements.instructions).then(() => {
      announceCandidate(0);
    });

    if (mode === 'audio' || mode === 'keyboard') {
      setupKeyboard();
    }

    if (mode === 'voice') {
      setupVoiceCommands();
    }

    return () => {
      cleanup();
    };
  }, [candidates, mode]);

  const setupKeyboard = () => {
    setupKeyboardNavigation(candidates.length, {
      next: handleNext,
      previous: handlePrevious,
      select: handleSelect,
      back: handleBack,
      selectNumber: handleNumberSelect,
      confirm: handleConfirm
    });
  };

  const setupVoiceCommands = () => {
    voiceCommands.on('next', handleNext);
    voiceCommands.on('previous', handlePrevious);
    voiceCommands.on('select', handleSelect);
    voiceCommands.on('confirm', handleConfirm);
    voiceCommands.on('change', () => setShowConfirmation(false));
    voiceCommands.on('selectNumber', handleNumberSelect);

    const started = voiceCommands.start();
    setIsListening(started);
  };

  const cleanup = () => {
    speechManager.stop();
    voiceCommands.stop();
    keyboardNav.destroy();
  };

  const announceCandidate = (index) => {
    if (index >= 0 && index < candidates.length) {
      const candidate = candidates[index];
      speechManager.speakNow(
        `उम्मीदवार ${index + 1}: ${candidate.name}, ${candidate.party || 'स्वतंत्र'}`
      );
    }
  };

  const handleNext = () => {
    const newIndex = Math.min(currentIndex + 1, candidates.length - 1);
    setCurrentIndex(newIndex);
    announceCandidate(newIndex);
    keyboardNav.setFocus(newIndex);
  };

  const handlePrevious = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    announceCandidate(newIndex);
    keyboardNav.setFocus(newIndex);
  };

  const handleSelect = () => {
    const candidate = candidates[currentIndex];
    setSelectedCandidate(candidate);
    setShowConfirmation(true);
    speechManager.speakNow(Announcements.selected(candidate.name));
    setTimeout(() => {
      speechManager.speakNow(Announcements.confirmPrompt);
    }, 1500);
  };

  const handleNumberSelect = (num) => {
    const index = num - 1;
    if (index >= 0 && index < candidates.length) {
      setCurrentIndex(index);
      announceCandidate(index);
      keyboardNav.setFocus(index);
    }
  };

  const handleConfirm = () => {
    if (selectedCandidate && showConfirmation) {
      speechManager.speakNow(Announcements.confirmed);
      setTimeout(() => {
        onVoteConfirm?.(selectedCandidate);
      }, 1000);
    }
  };

  const handleBack = () => {
    if (showConfirmation) {
      setShowConfirmation(false);
      setSelectedCandidate(null);
      speechManager.speakNow('चयन रद्द किया गया। कृपया फिर से चुनें।');
    } else {
      onBack?.();
    }
  };

  if (candidates.length === 0) {
    return (
      <div className="voice-voting loading">
        <div className="loader">उम्मीदवार लोड हो रहे हैं...</div>
      </div>
    );
  }

  return (
    <div className={`voice-voting ${mode}`}>
      <div className="voting-container">
        <div className="status-bar">
          {mode === 'audio' && (
            <div className="status-indicator">
              <span className="icon">🔊</span>
              <span>ऑडियो मोड सक्रिय</span>
            </div>
          )}
          {mode === 'voice' && (
            <div className="status-indicator">
              <span className="icon">🎤</span>
              <span>{isListening ? 'सुन रहा है...' : 'आवाज़ मोड'}</span>
            </div>
          )}
          {mode === 'keyboard' && (
            <div className="status-indicator">
              <span className="icon">⌨️</span>
              <span>कीबोर्ड नेविगेशन</span>
            </div>
          )}
        </div>

        {!showConfirmation ? (
          <div className="ballot-section">
            <h1 className="heading">उम्मीदवार सूची / Candidate List</h1>
            
            <div className="instructions">
              <p>⬆️⬇️ तीर कुंजी से चुनें / Use Arrow Keys</p>
              <p>↵ Enter से पुष्टि करें / Press Enter to Select</p>
              <p>1-{candidates.length} नंबर दबाएं / Press Number Keys</p>
            </div>

            <div className="candidates-list">
              {candidates.map((candidate, index) => (
                <div
                  key={candidate.id || index}
                  className={`candidate-card ${
                    currentIndex === index ? 'focused' : ''
                  } ${selectedCandidate?.id === candidate.id ? 'selected' : ''}`}
                  data-keyboard-nav
                  onClick={() => {
                    setCurrentIndex(index);
                    handleSelect();
                  }}
                  role="button"
                  tabIndex={currentIndex === index ? 0 : -1}
                  aria-label={`उम्मीदवार ${index + 1}: ${candidate.name}, ${candidate.party || 'स्वतंत्र'}`}
                >
                  <div className="candidate-number">{index + 1}</div>
                  <div className="candidate-info">
                    <h2 className="candidate-name">{candidate.name}</h2>
                    <p className="candidate-party">{candidate.party || 'स्वतंत्र / Independent'}</p>
                    {candidate.symbol && (
                      <div className="candidate-symbol">{candidate.symbol}</div>
                    )}
                  </div>
                  {currentIndex === index && (
                    <div className="focus-indicator">◀</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="confirmation-section">
            <div className="confirmation-card">
              <div className="confirmation-icon">✓</div>
              <h1>पुष्टि करें / Confirm</h1>
              
              <div className="selected-candidate">
                <h2>{selectedCandidate.name}</h2>
                <p>{selectedCandidate.party || 'स्वतंत्र / Independent'}</p>
                {selectedCandidate.symbol && (
                  <div className="symbol-large">{selectedCandidate.symbol}</div>
                )}
              </div>

              <div className="confirmation-actions">
                <button
                  className="confirm-btn"
                  onClick={handleConfirm}
                  autoFocus
                >
                  ✓ पुष्टि करें / Confirm (Enter)
                </button>
                <button
                  className="change-btn"
                  onClick={handleBack}
                >
                  ↺ बदलें / Change (Backspace)
                </button>
              </div>

              <p className="voice-hint">
                {mode === 'voice' && '🎤 कहें "पुष्टि" या "बदलें" / Say "confirm" or "change"'}
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .voice-voting {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .voting-container {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .status-bar {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #667eea;
          color: white;
          border-radius: 50px;
          font-weight: 600;
        }

        .status-indicator .icon {
          font-size: 1.5rem;
        }

        .heading {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #2d3748;
        }

        .instructions {
          background: #f7fafc;
          border-left: 4px solid #667eea;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .instructions p {
          margin: 0.5rem 0;
          color: #4a5568;
          font-size: 0.95rem;
        }

        .candidates-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .candidate-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f7fafc;
          border: 3px solid transparent;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .candidate-card:hover {
          border-color: #667eea;
          transform: translateX(5px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .candidate-card.focused {
          border-color: #667eea;
          background: #edf2f7;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
        }

        .candidate-card.selected {
          background: #667eea;
          color: white;
        }

        .candidate-card.selected .candidate-name,
        .candidate-card.selected .candidate-party {
          color: white;
        }

        .candidate-number {
          font-size: 2rem;
          font-weight: bold;
          color: #667eea;
          min-width: 50px;
          text-align: center;
        }

        .candidate-card.selected .candidate-number {
          color: white;
        }

        .candidate-info {
          flex: 1;
        }

        .candidate-name {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #2d3748;
        }

        .candidate-party {
          font-size: 1rem;
          color: #718096;
        }

        .candidate-symbol {
          font-size: 1.5rem;
          margin-top: 0.5rem;
        }

        .focus-indicator {
          font-size: 2rem;
          color: #667eea;
          animation: pulse 1s infinite;
        }

        .candidate-card.selected .focus-indicator {
          color: white;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        .confirmation-section {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }

        .confirmation-card {
          text-align: center;
          padding: 3rem;
          background: #f7fafc;
          border-radius: 20px;
          max-width: 500px;
        }

        .confirmation-icon {
          font-size: 5rem;
          color: #48bb78;
          margin-bottom: 1rem;
        }

        .confirmation-card h1 {
          font-size: 2rem;
          color: #2d3748;
          margin-bottom: 2rem;
        }

        .selected-candidate {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          margin-bottom: 2rem;
          border: 3px solid #667eea;
        }

        .selected-candidate h2 {
          font-size: 1.8rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .selected-candidate p {
          font-size: 1.2rem;
          color: #718096;
        }

        .symbol-large {
          font-size: 3rem;
          margin-top: 1rem;
        }

        .confirmation-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .confirm-btn,
        .change-btn {
          flex: 1;
          padding: 1rem;
          font-size: 1.1rem;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .confirm-btn {
          background: #48bb78;
          color: white;
        }

        .confirm-btn:hover,
        .confirm-btn:focus {
          background: #38a169;
          transform: scale(1.05);
          outline: none;
        }

        .change-btn {
          background: #fc8181;
          color: white;
        }

        .change-btn:hover,
        .change-btn:focus {
          background: #f56565;
          transform: scale(1.05);
          outline: none;
        }

        .voice-hint {
          margin-top: 1rem;
          color: #718096;
          font-size: 0.9rem;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .loader {
          font-size: 1.5rem;
          color: white;
          text-align: center;
        }

        @media (max-width: 768px) {
          .voting-container {
            padding: 1rem;
          }

          .candidate-card {
            padding: 1rem;
          }

          .candidate-name {
            font-size: 1.2rem;
          }

          .confirmation-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default VoiceVoting;