// client/src/utils/speech.js
// Voice assistance system for accessible voting

class SpeechManager {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.isEnabled = false;
    this.queue = [];
    this.initialize();
  }

  // Initialize speech system
  initialize() {
    // Wait for voices to load
    if (this.synth.getVoices().length === 0) {
      this.synth.addEventListener('voiceschanged', () => {
        this.setupVoice();
      });
    } else {
      this.setupVoice();
    }
  }

  // Setup preferred voice (Hindi/English)
  setupVoice() {
    const voices = this.synth.getVoices();
    
    // Priority: Hindi > English > Default
    this.voice = 
      voices.find(v => v.lang === 'hi-IN') ||
      voices.find(v => v.lang.includes('hi')) ||
      voices.find(v => v.lang === 'en-IN') ||
      voices.find(v => v.lang.includes('en')) ||
      voices[0];

    console.log('Voice initialized:', this.voice?.name);
  }

  // Enable/disable speech
  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
    this.stop();
  }

  // Main speak function
  speak(text, options = {}) {
    if (!this.isEnabled) return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.synth.cancel(); // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.voice = this.voice;
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      utterance.lang = options.lang || 'hi-IN';

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.error('Speech error:', e);
        reject(e);
      };

      this.synth.speak(utterance);
    });
  }

  // Immediate speak (doesn't return promise)
  speakNow(text) {
    if (!this.isEnabled) return;
    
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voice;
    utterance.rate = 0.9;
    utterance.lang = 'hi-IN';
    this.synth.speak(utterance);
  }

  // Stop current speech
  stop() {
    this.synth.cancel();
    this.queue = [];
  }

  // Check if currently speaking
  isSpeaking() {
    return this.synth.speaking;
  }
}

/**
 * Voice Commands Manager
 * Handles speech recognition for hands-free voting
 */
class VoiceCommandsManager {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      this.recognition = null;
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'hi-IN';
    this.recognition.maxAlternatives = 3;
    
    this.isListening = false;
    this.handlers = {};
    this.setupEventListeners();
  }

  // Setup recognition event listeners
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
      
      // Auto-restart on certain errors
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
      
      // Auto-restart if we want continuous listening
      if (this.handlers.onEnd) {
        this.handlers.onEnd();
      }
    };

    this.recognition.onstart = () => {
      console.log('Recognition started');
      this.isListening = true;
    };
  }

  // Process voice command
  processCommand(transcript) {
    const text = transcript.toLowerCase().trim();
    
    // Hindi commands
    if (this.matchCommand(text, ['अगला', 'next', 'आगे'])) {
      this.handlers.next?.();
    }
    else if (this.matchCommand(text, ['पिछला', 'previous', 'पीछे', 'back'])) {
      this.handlers.previous?.();
    }
    else if (this.matchCommand(text, ['चुनें', 'select', 'चुन'])) {
      this.handlers.select?.();
    }
    else if (this.matchCommand(text, ['पुष्टि', 'confirm', 'हाँ', 'yes'])) {
      this.handlers.confirm?.();
    }
    else if (this.matchCommand(text, ['बदलें', 'change', 'नहीं', 'no'])) {
      this.handlers.change?.();
    }
    else if (this.matchCommand(text, ['रद्द', 'cancel', 'रोको', 'stop'])) {
      this.handlers.cancel?.();
    }
    else if (this.matchCommand(text, ['मदद', 'help', 'सहायता'])) {
      this.handlers.help?.();
    }
    
    // Number detection (1-10)
    const numMatch = text.match(/(\d+)/);
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      if (num >= 1 && num <= 10) {
        this.handlers.selectNumber?.(num);
      }
    }
    
    // Hindi number words
    const hindiNum = this.convertHindiNumber(text);
    if (hindiNum) {
      this.handlers.selectNumber?.(hindiNum);
    }
  }

  // Match command against multiple keywords
  matchCommand(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  // Convert Hindi number words to digits
  convertHindiNumber(text) {
    const numbers = {
      'एक': 1, 'पहला': 1,
      'दो': 2, 'दूसरा': 2,
      'तीन': 3, 'तीसरा': 3,
      'चार': 4, 'चौथा': 4,
      'पांच': 5, 'पाँचवा': 5,
      'छह': 6, 'छठा': 6,
      'सात': 7, 'सातवां': 7,
      'आठ': 8, 'आठवां': 8,
      'नौ': 9, 'नौवां': 9,
      'दस': 10, 'दसवां': 10
    };
    
    for (const [word, num] of Object.entries(numbers)) {
      if (text.includes(word)) {
        return num;
      }
    }
    return null;
  }

  // Register command handler
  on(command, handler) {
    this.handlers[command] = handler;
  }

  // Start listening
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

  // Stop listening
  stop() {
    if (!this.recognition || !this.isListening) return;
    
    try {
      this.recognition.stop();
    } catch (e) {
      console.error('Stop error:', e);
    }
  }

  // Restart listening
  restart() {
    this.stop();
    setTimeout(() => this.start(), 100);
  }
}

/**
 * Pre-defined announcements for voting flow
 */
export const Announcements = {
  // Welcome screen
  welcome: "स्वागत है। स्वनिर्णय वोट प्रणाली में आपका स्वागत है।",
  
  // Mode selection
  modeSelection: "कृपया अपना पसंदीदा मोड चुनें। ऑडियो मोड के लिए 1 दबाएं। बड़े टेक्स्ट के लिए 2 दबाएं। आवाज़ कमांड के लिए 3 दबाएं।",
  
  // Instructions
  instructions: "उम्मीदवार सुनने के लिए तीर कुंजी का उपयोग करें। चुनने के लिए एंटर दबाएं। वापस जाने के लिए बैकस्पेस दबाएं।",
  
  // Ballot navigation
  nextCandidate: "अगला उम्मीदवार",
  previousCandidate: "पिछला उम्मीदवार",
  
  // Selection
  selected: (name) => `आपने ${name} को चुना है।`,
  
  // Confirmation
  confirmPrompt: "पुष्टि करने के लिए एंटर दबाएं। बदलने के लिए बैकस्पेस दबाएं।",
  confirmed: "आपका चयन पुष्टि हो गया है।",
  
  // Handoff to EVM
  handoff: (name) => `आपने ${name} को चुना है। कृपया अब EVM मशीन पर संबंधित बटन दबाएं।`,
  
  // Session end
  complete: "आपका वोट सफलतापूर्वक दर्ज किया गया। लोकतंत्र में भागीदारी के लिए धन्यवाद।",
  
  // Error messages
  error: "कुछ गलत हुआ। कृपया पोलिंग अधिकारी से संपर्क करें।",
  
  // Help
  help: "मदद के लिए: अगला सुनने के लिए दायां तीर, पिछला के लिए बायां तीर, चुनने के लिए एंटर, वापस के लिए बैकस्पेस।"
};

// Export singleton instances
export const speechManager = new SpeechManager();
export const voiceCommands = new VoiceCommandsManager();

// Export helper functions
export const speak = (text, options) => speechManager.speak(text, options);
export const speakNow = (text) => speechManager.speakNow(text);
export const stopSpeech = () => speechManager.stop();
export const enableSpeech = () => speechManager.enable();
export const disableSpeech = () => speechManager.disable();