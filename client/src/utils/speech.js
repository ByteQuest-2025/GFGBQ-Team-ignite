// client/src/utils/speech.js
class SpeechManager {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.isEnabled = false;
    this.queue = [];
    this.initialize();
  }

  initialize() {
    if (this.synth.getVoices().length === 0) {
      this.synth.addEventListener('voiceschanged', () => {
        this.setupVoice();
      });
    } else {
      this.setupVoice();
    }
  }

  setupVoice() {
    const voices = this.synth.getVoices();
    this.voice = 
      voices.find(v => v.lang === 'hi-IN') ||
      voices.find(v => v.lang.includes('hi')) ||
      voices.find(v => v.lang === 'en-IN') ||
      voices.find(v => v.lang.includes('en')) ||
      voices[0];
    console.log('Voice initialized:', this.voice?.name);
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
    this.stop();
  }

  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.isEnabled;
  }

  speak(text, options = {}) {
    if (!this.isEnabled) return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.voice = this.voice;
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      utterance.lang = options.lang || 'en-IN';

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.error('Speech error:', e);
        reject(e);
      };

      this.synth.speak(utterance);
    });
  }

  speakNow(text) {
    if (!this.isEnabled) return;
    
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voice;
    utterance.rate = 0.9;
    utterance.lang = 'en-IN';
    this.synth.speak(utterance);
  }

  stop() {
    this.synth.cancel();
    this.queue = [];
  }

  isSpeaking() {
    return this.synth.speaking;
  }
}

class VoiceCommandsManager {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      this.recognition = null;
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-IN';
    this.recognition.maxAlternatives = 3;
    
    this.isListening = false;
    this.handlers = {};
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.recognition) return;

    this.recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      const confidence = event.results[last][0].confidence;
      
      console.log('Heard:', transcript, 'Confidence:', confidence);
      
      if (confidence > 0.5) {
        this.processCommand(transcript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
      
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        setTimeout(() => {
          if (this.isListening) {
            this.restart();
          }
        }, 100);
      }
    };

    this.recognition.onend = () => {
      console.log('Recognition ended');
      this.isListening = false;
      
      if (this.handlers.onEnd) {
        this.handlers.onEnd();
      }
    };

    this.recognition.onstart = () => {
      console.log('Recognition started');
      this.isListening = true;
    };
  }

  processCommand(transcript) {
    const text = transcript.toLowerCase().trim();
    
    if (this.matchCommand(text, ['next', 'agla'])) {
      this.handlers.next?.();
    }
    else if (this.matchCommand(text, ['previous', 'pichla', 'back'])) {
      this.handlers.previous?.();
    }
    else if (this.matchCommand(text, ['select', 'chunen', 'choose'])) {
      this.handlers.select?.();
    }
    else if (this.matchCommand(text, ['confirm', 'pushti', 'yes'])) {
      this.handlers.confirm?.();
    }
    else if (this.matchCommand(text, ['change', 'badlen', 'no'])) {
      this.handlers.change?.();
    }
    else if (this.matchCommand(text, ['cancel', 'radd', 'stop'])) {
      this.handlers.cancel?.();
    }
    else if (this.matchCommand(text, ['help', 'madad'])) {
      this.handlers.help?.();
    }
    
    const numMatch = text.match(/(\d+)/);
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      if (num >= 1 && num <= 10) {
        this.handlers.selectNumber?.(num);
      }
    }
  }

  matchCommand(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  on(command, handler) {
    this.handlers[command] = handler;
  }

  start() {
    if (!this.recognition) {
      console.warn('Speech recognition not available');
      return false;
    }

    if (this.isListening) {
      console.log('Already listening');
      return true;
    }

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.error('Failed to start recognition:', e);
      return false;
    }
  }

  stop() {
    if (!this.recognition || !this.isListening) return;
    
    try {
      this.recognition.stop();
    } catch (e) {
      console.error('Stop error:', e);
    }
  }

  restart() {
    this.stop();
    setTimeout(() => this.start(), 100);
  }

  toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
    return this.isListening;
  }
}

export const Announcements = {
  welcome: "Welcome to Swa-Nirnay Voting System.",
  modeSelection: "Please select your preferred mode. Press 1 for Audio, 2 for Large Text, 3 for Voice Commands, 4 for Keyboard.",
  instructions: "Use arrow keys to navigate. Press Enter to select. Press Backspace to go back.",
  nextCandidate: "Next candidate",
  previousCandidate: "Previous candidate",
  selected: (name) => `You have selected ${name}.`,
  confirmPrompt: "Press Enter to confirm. Press Backspace to change.",
  confirmed: "Your selection has been confirmed.",
  handoff: (name) => `You have selected ${name}. Please now press the button on the EVM machine.`,
  complete: "Your vote has been successfully recorded. Thank you for participating in democracy.",
  error: "Something went wrong. Please contact the polling officer.",
  help: "Help: Use right arrow for next, left arrow for previous, Enter to select, Backspace to go back."
};

export const speechManager = new SpeechManager();
export const voiceCommands = new VoiceCommandsManager();

export const speak = (text, options) => speechManager.speak(text, options);
export const speakNow = (text) => speechManager.speakNow(text);
export const stopSpeech = () => speechManager.stop();
export const enableSpeech = () => speechManager.enable();
export const disableSpeech = () => speechManager.disable();