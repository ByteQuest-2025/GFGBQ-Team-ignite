// client/src/components/VoiceTestDemo.jsx
// Demo component for testing all voice assistance features

import { useState, useEffect } from 'react';
import VoiceIntegration from '../utils/voiceIntegration';
import { speechManager, voiceCommands } from '../utils/speech';

const VoiceTestDemo = () => {
  const [mode, setMode] = useState('audio');
  const [status, setStatus] = useState({
    speech: false,
    voiceCommands: false,
    listening: false
  });
  const [lastCommand, setLastCommand] = useState('None');
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    // Initialize voice system
    VoiceIntegration.initialize(mode);

    // Setup voice command listeners
    voiceCommands.on('next', () => handleCommand('Next'));
    voiceCommands.on('select', () => handleCommand('Select'));
    voiceCommands.on('confirm', () => handleCommand('Confirm'));
    voiceCommands.on('back', () => handleCommand('Back'));
    voiceCommands.on('number', (num) => handleCommand(`Number ${num}`));

    return () => VoiceIntegration.cleanup();
  }, [mode]);

  const handleCommand = (command) => {
    setLastCommand(command);
    addTestResult(`✅ Voice command detected: ${command}`);
    VoiceIntegration.announceSuccess(`Command ${command} received`);
  };

  const addTestResult = (result) => {
    setTestResults(prev => [...prev, { time: new Date().toLocaleTimeString(), result }]);
  };

  const testSpeech = () => {
    speechManager.speak('यह एक परीक्षण है। This is a test.');
    addTestResult('🔊 Testing speech output');
  };

  const testVoiceCommands = () => {
    if (!status.voiceCommands) {
      voiceCommands.start();
      setStatus(prev => ({ ...prev, voiceCommands: true, listening: true }));
      speechManager.speak('वॉयस कमांड सक्रिय। Voice commands active. Try saying next, select, or a number.');
      addTestResult('🎤 Voice commands started');
    } else {
      voiceCommands.stop();
      setStatus(prev => ({ ...prev, voiceCommands: false, listening: false }));
      addTestResult('🎤 Voice commands stopped');
    }
  };

  const testKeyboard = () => {
    addTestResult('⌨️ Keyboard navigation test - Press Arrow keys, Enter, or 1-9');
    speechManager.speak('कीबोर्ड परीक्षण। तीर कुंजियां दबाएं। Keyboard test. Press arrow keys.');
  };

  const testAnnouncements = () => {
    VoiceIntegration.announceScreen('ballot', 'यह एक परीक्षण घोषणा है। This is a test announcement.');
    addTestResult('📢 Screen announcement test');
  };

  const testCandidate = () => {
    const testCandidate = {
      name: 'राहुल शर्मा',
      party: 'टेस्ट पार्टी',
      symbol: '🌟'
    };
    VoiceIntegration.announceCandidate(testCandidate, 0);
    addTestResult('👤 Candidate announcement test');
  };

  const testEmergencyStop = () => {
    VoiceIntegration.emergencyStop();
    addTestResult('🛑 Emergency stop activated');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎤 Voice Assistance Test Demo
          </h1>
          <p className="text-xl text-gray-600">
            Kirti's Voice Features Testing Interface
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column - Tests */}
          <div className="space-y-6">
            
            {/* Mode Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Select Mode
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {['audio', 'voice', 'keyboard', 'large-text'].map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`py-3 px-4 rounded-lg font-semibold transition ${
                      mode === m
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Test Controls
              </h2>
              <div className="space-y-3">
                <button
                  onClick={testSpeech}
                  className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
                >
                  🔊 Test Speech Output
                </button>
                
                <button
                  onClick={testVoiceCommands}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                    status.voiceCommands
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  {status.voiceCommands ? '🛑 Stop' : '🎤 Start'} Voice Commands
                </button>
                
                <button
                  onClick={testKeyboard}
                  className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
                >
                  ⌨️ Test Keyboard Nav
                </button>
                
                <button
                  onClick={testAnnouncements}
                  className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition"
                >
                  📢 Test Announcements
                </button>
                
                <button
                  onClick={testCandidate}
                  className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition"
                >
                  👤 Test Candidate Announce
                </button>
                
                <button
                  onClick={testEmergencyStop}
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                >
                  🛑 Emergency Stop All
                </button>
              </div>
            </div>

            {/* Status Display */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                System Status
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-semibold">Current Mode:</span>
                  <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                    {mode.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-semibold">Voice Commands:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    status.voiceCommands ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {status.voiceCommands ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-semibold">Last Command:</span>
                  <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm">
                    {lastCommand}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Test Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Test Results
              </h2>
              <button
                onClick={() => setTestResults([])}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold"
              >
                Clear
              </button>
            </div>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {testResults.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No tests run yet. Click buttons to start testing.
                </div>
              ) : (
                testResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {result.time}
                      </span>
                      <span className="text-sm text-gray-700">
                        {result.result}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
          <h3 className="text-xl font-bold text-blue-800 mb-3">
            📝 Testing Instructions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p className="font-semibold mb-2">Voice Commands to Try:</p>
              <ul className="space-y-1 pl-4">
                <li>• Say "अगला" or "next"</li>
                <li>• Say "चुनें" or "select"</li>
                <li>• Say "पुष्टि" or "confirm"</li>
                <li>• Say "पिछला" or "back"</li>
                <li>• Say numbers "एक" to "नौ" (1-9)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Keyboard Shortcuts:</p>
              <ul className="space-y-1 pl-4">
                <li>• Arrow keys for navigation</li>
                <li>• Enter to select</li>
                <li>• Space to select</li>
                <li>• Number keys 1-9</li>
                <li>• Backspace to go back</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VoiceTestDemo;