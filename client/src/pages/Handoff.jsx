// client/src/pages/Handoff.jsx
import { useState, useEffect } from 'react';
import { speechManager } from '../utils/speech';

const Handoff = ({ selectedCandidate, mode, onComplete }) => {
  const [countdown, setCountdown] = useState(10);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Announce handoff instructions
    const message = `आपने ${selectedCandidate.name}, ${selectedCandidate.party} को चुना है। 
                     अब कृपया ईवीएम मशीन पर नीला बटन दबाएं। 
                     You have selected ${selectedCandidate.name}, ${selectedCandidate.party}. 
                     Please press the blue button on EVM machine now.`;
    
    if (mode === 'audio' || mode === 'voice') {
      speechManager.speak(message);
    }

    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      speechManager.stop();
    };
  }, [selectedCandidate, mode, onComplete]);

  // Simulate EVM button press with keyboard
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'b' || e.key === 'B' || e.key === 'Enter') {
        speechManager.speak('वोट सफलतापूर्वक दर्ज। धन्यवाद। Vote recorded successfully. Thank you.');
        setTimeout(() => onComplete(), 2000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 border-4 border-green-500">
        
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 bg-green-100 rounded-full mb-4 animate-pulse">
            <svg className="w-20 h-20 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            वोट चयन पूर्ण
          </h1>
          <p className="text-xl text-gray-600">
            Vote Selection Complete
          </p>
        </div>

        {/* Selected Candidate Display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-blue-300">
          <div className="text-center">
            <div className="text-6xl mb-4">{selectedCandidate.symbol}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {selectedCandidate.name}
            </h2>
            <p className="text-xl text-gray-600 mb-1">
              {selectedCandidate.party}
            </p>
          </div>
        </div>

        {/* Instructions Box */}
        <div className="bg-yellow-50 border-4 border-yellow-400 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                अब ईवीएम पर बटन दबाएं
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                Now Press the Button on EVM Machine
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-2xl">👉</span>
                  <span>नीला बटन दबाएं / Press the BLUE button</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <span>बटन दबाने पर बीप सुनाई देगी / You will hear a beep</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span>लाल LED जलेगी / Red LED will light up</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* EVM Visual Representation */}
        <div className="bg-gray-100 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full shadow-lg flex items-center justify-center mb-2 animate-bounce">
                <span className="text-white text-4xl font-bold">B</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">नीला बटन<br/>BLUE BUTTON</p>
            </div>
            <div className="text-6xl text-gray-400">→</div>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full shadow-lg mb-2 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-red-200'}`}>
              </div>
              <p className="text-sm font-semibold text-gray-700">LED संकेतक<br/>LED INDICATOR</p>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            अगली स्क्रीन में जा रहे हैं / Moving to next screen in
          </p>
          <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-4xl font-bold py-4 px-8 rounded-full">
            {countdown}s
          </div>
        </div>

        {/* Demo Mode Hint */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Demo Mode: Press 'B' or 'Enter' to simulate EVM button</p>
        </div>

      </div>
    </div>
  );
};

export default Handoff;