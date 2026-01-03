// client/src/utils/voiceIntegration.js
// Integration helper for voice assistance features

import { speechManager, voiceCommands, Announcements } from './speech';
import { keyboardNav, contrastManager, textSizeManager } from './accessibility';

export const VoiceIntegration = {
  
  // Initialize voice system for a specific mode
  initialize(mode) {
    switch(mode) {
      case 'audio':
        speechManager.enable();
        keyboardNav.enable();
        break;
      
      case 'voice':
        speechManager.enable();
        voiceCommands.start();
        keyboardNav.enable();
        break;
      
      case 'keyboard':
        keyboardNav.enable();
        break;
      
      case 'large-text':
        textSizeManager.setSize('xlarge');
        keyboardNav.enable();
        break;
      
      default:
        keyboardNav.enable();
    }
  },

  // Cleanup when component unmounts
  cleanup() {
    speechManager.stop();
    voiceCommands.stop();
    keyboardNav.disable();
  },

  // Announce current screen
  announceScreen(screenName, additionalInfo = '') {
    const announcements = {
      'mode-selection': 'मोड चयन स्क्रीन। Mode selection screen.',
      'instructions': 'निर्देश स्क्रीन। Instructions screen.',
      'ballot': 'मतपत्र स्क्रीन। Ballot screen.',
      'confirmation': 'पुष्टि स्क्रीन। Confirmation screen.',
      'handoff': 'ईवीएम हैंडओफ़। EVM handoff.',
      'complete': 'वोट पूर्ण। Vote complete.'
    };

    const message = announcements[screenName] || screenName;
    speechManager.speak(`${message} ${additionalInfo}`);
  },

  // Announce candidate details
  announceCandidate(candidate, index) {
    const message = `
      उम्मीदवार संख्या ${index + 1}।
      नाम: ${candidate.name}।
      पार्टी: ${candidate.party}।
      प्रतीक: ${candidate.symbol}।
      Candidate number ${index + 1}.
      Name: ${candidate.name}.
      Party: ${candidate.party}.
    `;
    speechManager.speak(message);
  },

  // Announce navigation instructions
  announceNavigation(type = 'basic') {
    const instructions = {
      'basic': 'तीर कुंजियों से नेविगेट करें, एंटर दबाकर चुनें। Use arrow keys to navigate, press Enter to select.',
      'ballot': 'ऊपर-नीचे तीर से उम्मीदवार चुनें, संख्या कुंजी से सीधे चयन करें। Up-down arrows for candidates, number keys for direct selection.',
      'confirmation': 'एंटर दबाकर पुष्टि करें, बैकस्पेस दबाकर बदलें। Press Enter to confirm, Backspace to change.',
      'voice': 'अगला, चुनें, पुष्टि करें, बोलें। Say next, select, confirm.'
    };

    speechManager.speak(instructions[type] || instructions.basic);
  },

  // Handle voice command for specific action
  setupVoiceCommands(callbacks) {
    voiceCommands.on('next', callbacks.onNext || (() => {}));
    voiceCommands.on('previous', callbacks.onPrevious || (() => {}));
    voiceCommands.on('select', callbacks.onSelect || (() => {}));
    voiceCommands.on('confirm', callbacks.onConfirm || (() => {}));
    voiceCommands.on('back', callbacks.onBack || (() => {}));
    voiceCommands.on('number', callbacks.onNumber || (() => {}));
  },

  // Setup keyboard shortcuts for specific screen
  setupKeyboardShortcuts(screenType, callbacks) {
    const shortcuts = {
      'ballot': {
        'ArrowUp': callbacks.onPrevious,
        'ArrowDown': callbacks.onNext,
        'Enter': callbacks.onSelect,
        'Space': callbacks.onSelect,
        '1-9': callbacks.onNumber
      },
      'confirmation': {
        'Enter': callbacks.onConfirm,
        'Backspace': callbacks.onBack,
        'Escape': callbacks.onBack
      },
      'mode-selection': {
        '1-4': callbacks.onModeSelect,
        'h': callbacks.onHighContrast
      }
    };

    return keyboardNav.setup(shortcuts[screenType] || shortcuts.ballot);
  },

  // Toggle accessibility features
  toggleFeature(feature) {
    const features = {
      'contrast': () => {
        contrastManager.toggle();
        const enabled = contrastManager.isEnabled();
        speechManager.speak(
          enabled 
            ? 'उच्च कंट्रास्ट सक्षम। High contrast enabled.' 
            : 'उच्च कंट्रास्ट अक्षम। High contrast disabled.'
        );
      },
      'large-text': () => {
        const size = textSizeManager.toggle();
        speechManager.speak(`टेक्स्ट आकार ${size}। Text size ${size}.`);
      },
      'speech': () => {
        speechManager.toggle();
        const enabled = speechManager.isEnabled();
        speechManager.speak(
          enabled 
            ? 'ऑडियो सक्षम। Audio enabled.' 
            : 'ऑडियो अक्षम। Audio disabled.'
        );
      },
      'voice-commands': () => {
        voiceCommands.toggle();
        const enabled = voiceCommands.isListening();
        speechManager.speak(
          enabled 
            ? 'वॉयस कमांड सक्षम। Voice commands enabled.' 
            : 'वॉयस कमांड अक्षम। Voice commands disabled.'
        );
      }
    };

    if (features[feature]) {
      features[feature]();
    }
  },

  // Get current accessibility state
  getState() {
    return {
      speech: speechManager.isEnabled(),
      voiceCommands: voiceCommands.isListening(),
      highContrast: contrastManager.isEnabled(),
      textSize: textSizeManager.getSize(),
      keyboardNav: keyboardNav.isEnabled()
    };
  },

  // Emergency stop all voice features
  emergencyStop() {
    speechManager.stop();
    voiceCommands.stop();
    speechManager.speak('सभी वॉयस सुविधाएं रोक दी गईं। All voice features stopped.');
  },

  // Read entire screen content (for screen readers)
  readScreenContent(content) {
    if (Array.isArray(content)) {
      content.forEach((item, index) => {
        setTimeout(() => {
          speechManager.speak(item);
        }, index * 2000);
      });
    } else {
      speechManager.speak(content);
    }
  },

  // Announce error or warning
  announceError(errorType, message) {
    const prefix = errorType === 'error' ? 'त्रुटि। Error.' : 'चेतावनी। Warning.';
    speechManager.speak(`${prefix} ${message}`);
  },

  // Announce success
  announceSuccess(message) {
    speechManager.speak(`सफलता। Success. ${message}`);
  }
};

// Quick access functions
export const speak = (text) => speechManager.speak(text);
export const stopSpeaking = () => speechManager.stop();
export const enableVoiceCommands = () => voiceCommands.start();
export const disableVoiceCommands = () => voiceCommands.stop();
export const announceStep = (step) => VoiceIntegration.announceScreen(step);

export default VoiceIntegration;