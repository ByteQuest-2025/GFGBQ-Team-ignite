// client/src/utils/accessibility.js
// Keyboard navigation and accessibility features

class KeyboardNavigator {
  constructor() {
    this.handlers = {};
    this.isActive = false;
    this.focusIndex = 0;
    this.itemCount = 0;
    this.focusableElements = [];
  }

  init(itemCount, options = {}) {
    this.itemCount = itemCount;
    this.focusIndex = 0;
    this.isActive = true;
    
    this.updateFocusableElements();
    
    if (options.autoFocus !== false) {
      this.setFocus(0);
    }
    
    console.log(`Keyboard navigation initialized with ${itemCount} items`);
  }

  updateFocusableElements() {
    this.focusableElements = Array.from(
      document.querySelectorAll('[data-keyboard-nav]')
    );
  }

  attach() {
    if (this.isActive) {
      console.warn('Keyboard navigation already attached');
      return;
    }
    
    document.addEventListener('keydown', this.handleKeyDown);
    this.isActive = true;
    console.log('Keyboard navigation attached');
  }

  detach() {
    if (!this.isActive) return;
    
    document.removeEventListener('keydown', this.handleKeyDown);
    this.isActive = false;
    console.log('Keyboard navigation detached');
  }

  handleKeyDown = (event) => {
    const preventDefaultKeys = [
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'Enter', 'Space', 'Escape', 'Backspace', 'Tab'
    ];

    if (preventDefaultKeys.includes(event.key)) {
      event.preventDefault();
    }

    switch(event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        this.next();
        this.handlers.next?.();
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        this.previous();
        this.handlers.previous?.();
        break;

      case 'Enter':
      case ' ':
        this.handlers.select?.(this.focusIndex);
        break;

      case 'Backspace':
      case 'Escape':
        this.handlers.back?.();
        break;

      case 'Tab':
        if (event.shiftKey) {
          this.previous();
        } else {
          this.next();
        }
        break;

      case 'Home':
        this.setFocus(0);
        break;

      case 'End':
        this.setFocus(this.itemCount - 1);
        break;

      case '1': case '2': case '3': case '4': case '5':
      case '6': case '7': case '8': case '9': case '0':
        const num = event.key === '0' ? 10 : parseInt(event.key);
        this.selectByNumber(num);
        break;

      case 'h':
      case 'H':
        if (!event.ctrlKey) {
          this.handlers.help?.();
        }
        break;

      case 'c':
      case 'C':
        if (!event.ctrlKey) {
          this.handlers.confirm?.();
        }
        break;
    }
  }

  next() {
    if (this.focusIndex < this.itemCount - 1) {
      this.setFocus(this.focusIndex + 1);
      return true;
    }
    return false;
  }

  previous() {
    if (this.focusIndex > 0) {
      this.setFocus(this.focusIndex - 1);
      return true;
    }
    return false;
  }

  setFocus(index) {
    if (index < 0 || index >= this.itemCount) {
      console.warn('Focus index out of bounds:', index);
      return;
    }

    this.focusIndex = index;
    
    this.updateVisualFocus();
    
    this.scrollToFocused();
    
    this.handlers.focusChange?.(index);
  }

  updateVisualFocus() {
    const elements = document.querySelectorAll('[data-keyboard-nav]');
    
    elements.forEach((el, i) => {
      if (i === this.focusIndex) {
        el.classList.add('keyboard-focused');
        el.setAttribute('aria-current', 'true');
        el.setAttribute('tabindex', '0');
      } else {
        el.classList.remove('keyboard-focused');
        el.removeAttribute('aria-current');
        el.setAttribute('tabindex', '-1');
      }
    });
  }

  scrollToFocused() {
    const elements = document.querySelectorAll('[data-keyboard-nav]');
    const focused = elements[this.focusIndex];
    
    if (focused) {
      focused.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }

  selectByNumber(num) {
    const index = num - 1;
    
    if (index >= 0 && index < this.itemCount) {
      this.setFocus(index);
      this.handlers.selectNumber?.(num, index);
    }
  }

  on(event, handler) {
    this.handlers[event] = handler;
  }

  getFocusIndex() {
    return this.focusIndex;
  }

  reset() {
    this.focusIndex = 0;
    this.itemCount = 0;
    this.updateVisualFocus();
  }

  destroy() {
    this.detach();
    this.handlers = {};
    this.focusIndex = 0;
    this.itemCount = 0;
    this.focusableElements = [];
  }
}

class ContrastManager {
  constructor() {
    this.isEnabled = false;
    this.currentTheme = 'normal';
  }

  enable() {
    document.body.classList.add('high-contrast');
    this.isEnabled = true;
    localStorage.setItem('highContrast', 'true');
  }

  disable() {
    document.body.classList.remove('high-contrast');
    this.isEnabled = false;
    localStorage.setItem('highContrast', 'false');
  }

  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.isEnabled;
  }

  loadPreference() {
    const saved = localStorage.getItem('highContrast');
    if (saved === 'true') {
      this.enable();
    }
  }
}

class TextSizeManager {
  constructor() {
    this.sizes = ['normal', 'large', 'xlarge'];
    this.currentSize = 'normal';
  }

  setSize(size) {
    if (!this.sizes.includes(size)) {
      console.warn('Invalid text size:', size);
      return;
    }

    this.sizes.forEach(s => {
      document.body.classList.remove(`text-${s}`);
    });

    document.body.classList.add(`text-${size}`);
    this.currentSize = size;
    localStorage.setItem('textSize', size);
  }

  increase() {
    const currentIndex = this.sizes.indexOf(this.currentSize);
    if (currentIndex < this.sizes.length - 1) {
      this.setSize(this.sizes[currentIndex + 1]);
    }
  }

  decrease() {
    const currentIndex = this.sizes.indexOf(this.currentSize);
    if (currentIndex > 0) {
      this.setSize(this.sizes[currentIndex - 1]);
    }
  }

  loadPreference() {
    const saved = localStorage.getItem('textSize');
    if (saved && this.sizes.includes(saved)) {
      this.setSize(saved);
    }
  }
}

class FocusTrap {
  constructor(container) {
    this.container = container;
    this.firstFocusable = null;
    this.lastFocusable = null;
  }

  activate() {
    const focusable = this.container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    this.firstFocusable = focusable[0];
    this.lastFocusable = focusable[focusable.length - 1];

    this.container.addEventListener('keydown', this.handleKeyDown);
    this.firstFocusable?.focus();
  }

  deactivate() {
    this.container.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusable) {
        this.lastFocusable?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === this.lastFocusable) {
        this.firstFocusable?.focus();
        e.preventDefault();
      }
    }
  }
}

export const keyboardNav = new KeyboardNavigator();
export const contrastManager = new ContrastManager();
export const textSizeManager = new TextSizeManager();

export { FocusTrap };

export const setupKeyboardNavigation = (itemCount, handlers) => {
  keyboardNav.init(itemCount);
  
  Object.entries(handlers).forEach(([event, handler]) => {
    keyboardNav.on(event, handler);
  });
  
  keyboardNav.attach();
  return keyboardNav;
};

export const loadAccessibilityPreferences = () => {
  contrastManager.loadPreference();
  textSizeManager.loadPreference();
};