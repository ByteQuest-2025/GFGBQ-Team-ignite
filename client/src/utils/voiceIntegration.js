// client/src/utils/voiceIntegration.js
import { speechManager, voiceCommands, Announcements } from './speech';
import { keyboardNav, contrastManager, textSizeManager } from './accessibility';

export const VoiceIntegration = {
  
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

  cleanup() {
    speechManager.stop();
    voiceCommands.stop();
    keyboardNav.disable();
  },

  announceScreen(screenName, additionalInfo = '') {
    const announcements = {
      'mode-selection': 'Mode selection screen.',
      'instructions': 'Instructions screen.',
      'ballot': 'Ballot screen.',
      'confirmation': 'Confirmation screen.',
      'handoff': 'EVM handoff.',
      'complete': 'Vote complete.'
    };

    const message = announcements[screenName] || screenName;
    speechManager.speak(`${message} ${additionalInfo}`);
  },

  announceCandidate(candidate, index) {
    const message = `Candidate number ${index + 1}. Name: ${candidate.name}. Party: ${candidate.party}.`;
    speechManager.speak(message);
  },

  announceNavigation(type = 'basic') {
    const instructions = {
      'basic': 'Use arrow keys to navigate, press Enter to select.',
      'ballot': 'Up-down arrows for candidates, number keys for direct selection.',
      'confirmation': 'Press Enter to confirm, Backspace to change.',
      'voice': 'Say next, select, confirm.'
    };

    speechManager.speak(instructions[type] || instructions.basic);
  },

  setupVoiceCommands(callbacks) {
    voiceCommands.on('next', callbacks.onNext || (() => {}));
    voiceCommands.on('previous', callbacks.onPrevious || (() => {}));
    voiceCommands.on('select', callbacks.onSelect || (() => {}));
    voiceCommands.on('confirm', callbacks.onConfirm || (() => {}));
    voiceCommands.on('back', callbacks.onBack || (() => {}));
    voiceCommands.on('number', callbacks.onNumber || (() => {}));
  },

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

  toggleFeature(feature) {
    const features = {
      'contrast': () => {
        contrastManager.toggle();
        const enabled = contrastManager.isEnabled();
        speechManager.speak(enabled ? 'High contrast enabled.' : 'High contrast disabled.');
      },
      'large-text': () => {
        const size = textSizeManager.toggle();
        speechManager.speak(`Text size ${size}.`);
      },
      'speech': () => {
        speechManager.toggle();
        const enabled = speechManager.isEnabled;
        speechManager.speak(enabled ? 'Audio enabled.' : 'Audio disabled.');
      },
      'voice-commands': () => {
        voiceCommands.toggle();
        const enabled = voiceCommands.isListening;
        speechManager.speak(enabled ? 'Voice commands enabled.' : 'Voice commands disabled.');
      }
    };

    if (features[feature]) {
      features[feature]();
    }
  },

  getState() {
    return {
      speech: speechManager.isEnabled,
      voiceCommands: voiceCommands.isListening,
      highContrast: contrastManager.isEnabled(),
      textSize: textSizeManager.getSize(),
      keyboardNav: keyboardNav.isActive
    };
  },

  emergencyStop() {
    speechManager.stop();
    voiceCommands.stop();
    speechManager.speak('All voice features stopped.');
  },

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

  announceError(errorType, message) {
    const prefix = errorType === 'error' ? 'Error.' : 'Warning.';
    speechManager.speak(`${prefix} ${message}`);
  },

  announceSuccess(message) {
    speechManager.speak(`Success. ${message}`);
  }
};

export const speak = (text) => speechManager.speak(text);
export const stopSpeaking = () => speechManager.stop();
export const enableVoiceCommands = () => voiceCommands.start();
export const disableVoiceCommands = () => voiceCommands.stop();
export const announceStep = (step) => VoiceIntegration.announceScreen(step);

export default VoiceIntegration;