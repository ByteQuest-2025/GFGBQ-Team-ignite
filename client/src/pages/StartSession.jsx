// client/src/pages/StartSession.jsx
import { useState, useEffect } from 'react';
import { speechManager } from '../utils/speech';

const StartSession = ({ onStartVoting }) => {
  const [officerId, setOfficerId] = useState('');
  const [pollingStation, setPollingStation] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);

  useEffect(() => {
    // Load session info if exists
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
      setSessionInfo(JSON.parse(savedSession));
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!officerId.trim()) {
      newErrors.officerId = 'पोलिंग अधिकारी आईडी आवश्यक है / Officer ID required';
    }
    
    if (!pollingStation.trim()) {
      newErrors.pollingStation = 'पोलिंग स्टेशन नंबर आवश्यक है / Station number required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartSession = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      speechManager.speak('कृपया सभी फ़ील्ड भरें। Please fill all fields.');
      return;
    }

    setIsLoading(true);

    try {
      // Create session object
      const session = {
        officerId: officerId.trim(),
        pollingStation: pollingStation.trim(),
        startTime: new Date().toISOString(),
        votesProcessed: 0
      };

      // Save to localStorage (no backend database)
      localStorage.setItem('currentSession', JSON.stringify(session));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      speechManager.speak('सत्र शुरू हुआ। Session started successfully.');
      
      // Move to voting flow
      onStartVoting(session);
      
    } catch (error) {
      console.error('Session start error:', error);
      setErrors({ submit: 'सत्र शुरू करने में त्रुटि / Error starting session' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = () => {
    if (window.confirm('क्या आप वाकई सत्र समाप्त करना चाहते हैं? / Really end session?')) {
      localStorage.removeItem('currentSession');
      setSessionInfo(null);
      speechManager.speak('सत्र समाप्त हुआ। Session ended.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
            <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            स्व-निर्णय मतदान
          </h1>
          <p className="text-lg text-gray-600">
            Swa-Nirnay Voting System
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Polling Officer Portal
          </p>
        </div>

        {/* Active Session Display */}
        {sessionInfo && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-green-800">सक्रिय सत्र / Active Session</span>
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full animate-pulse">
                LIVE
              </span>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Officer ID:</strong> {sessionInfo.officerId}</p>
              <p><strong>Station:</strong> {sessionInfo.pollingStation}</p>
              <p><strong>Votes:</strong> {sessionInfo.votesProcessed}</p>
            </div>
            <button
              onClick={handleEndSession}
              className="mt-3 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition"
            >
              सत्र समाप्त करें / End Session
            </button>
          </div>
        )}

        {/* Start New Session Form */}
        {!sessionInfo && (
          <form onSubmit={handleStartSession} className="space-y-6">
            
            {/* Officer ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                पोलिंग अधिकारी आईडी
                <span className="text-gray-500 text-xs ml-2">/ Polling Officer ID</span>
              </label>
              <input
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="उदा. / e.g. PO-2024-001"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.officerId 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {errors.officerId && (
                <p className="text-red-500 text-sm mt-1">{errors.officerId}</p>
              )}
            </div>

            {/* Polling Station */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                पोलिंग स्टेशन नंबर
                <span className="text-gray-500 text-xs ml-2">/ Polling Station Number</span>
              </label>
              <input
                type="text"
                value={pollingStation}
                onChange={(e) => setPollingStation(e.target.value)}
                placeholder="उदा. / e.g. PS-123"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.pollingStation 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {errors.pollingStation && (
                <p className="text-red-500 text-sm mt-1">{errors.pollingStation}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-lg font-bold text-lg transition shadow-lg ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  शुरू हो रहा है...
                </span>
              ) : (
                <>
                  मतदान सत्र शुरू करें
                  <span className="block text-sm font-normal mt-1">Start Voting Session</span>
                </>
              )}
            </button>

          </form>
        )}

        {/* Info Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>सुरक्षित और गोपनीय / Secure & Private</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StartSession;