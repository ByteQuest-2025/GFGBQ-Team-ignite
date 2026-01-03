// Example flow in App.jsx or parent component:

import AccessibilitySelector from './components/AccessibilitySelector';
import VoiceVoting from './components/VoiceVoting';

const [mode, setMode] = useState(null);
const [step, setStep] = useState('mode-selection');

const candidates = [
  { id: 1, name: 'राजेश कुमार', party: 'पार्टी A', symbol: '🪷' },
  { id: 2, name: 'प्रिया शर्मा', party: 'पार्टी B', symbol: '🦁' },
  { id: 3, name: 'अमित पटेल', party: 'स्वतंत्र', symbol: '✋' }
];

{step === 'mode-selection' && (
  <AccessibilitySelector 
    onModeSelect={(selectedMode) => {
      setMode(selectedMode);
      setStep('voting');
    }}
  />
)}

{step === 'voting' && (
  <VoiceVoting
    candidates={candidates}
    mode={mode}
    onVoteConfirm={(candidate) => {
      // Move to handoff screen
      setStep('handoff');
    }}
    onBack={() => setStep('mode-selection')}
  />
)}