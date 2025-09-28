class EmailEnhancer {
  constructor() {
    this.isInitialized = false;
    this.toolbars = new Map();
    this.currentEmailField = null;
    this.isRecording = false;
    this.currentLanguage = 'ru';
    this.currentStyle = 'friendly';
    this.translations = {};
    this.providerManager = null;
    this.notificationCounter = 0;

    this.init();
  }

  async init() {
    if (this.isInitialized) return;

    await this.loadTranslations();
    await this.loadSettings();
    this.providerManager = new EmailProviderManager();
    this.setupProviderIntegration();
    this.providerManager.init();
    this.isInitialized = true;

    console.log('Email Enhancer initialized');
  }

  async loadTranslations() {
    const response = await fetch(chrome.runtime.getURL('js/translations.js'));
    const text = await response.text();
    // Извлекаем объект translations из текста скрипта
    const match = text.match(/const translations = ({[\s\S]*?});/);
    if (match && match[1]) {
      this.translations = JSON.parse(match[1]);
    } else {
      console.error('Could not load translations from js/translations.js');
    }
  }

  async loadSettings() {
    const defaults = {
      interfaceLanguage: 'ru',
      currentLanguage: 'ru',
      currentStyle: 'friendly',
      autoFixEnabled: false,
      voiceShortcutsEnabled: true,
      successNotifications: true,
      errorNotifications: true,
      debugMode: false,
      dataCollection: true,
    };
    this.settings = await chrome.storage.local.get(defaults);
    this.currentLanguage = this.settings.currentLanguage;
    this.currentStyle = this.settings.currentStyle;
  }

  setupProviderIntegration() {
    document.addEventListener('emailFieldDetected', (event) => {
      const { field, providerName } = event.detail;
      this.attachToolbar(field, providerName);
    });

    document.addEventListener('emailFieldRemoved', (event) => {
      const { fieldId } = event.detail;
      this.removeToolbar(fieldId);
    });
  }

  attachToolbar(emailField, providerName) {
    const fieldId = emailField.dataset.emailEnhancerId || `enhancer-field-${Date.now()}`;
    emailField.dataset.emailEnhancerId = fieldId;

    if (this.toolbars.has(fieldId)) {
      return;
    }

    const toolbarContainer = this.createToolbarContainer(fieldId);
    this.positionToolbar(toolbarContainer, emailField, providerName);
    this.toolbars.set(fieldId, toolbarContainer);

    // Добавляем обработчик фокуса для обновления currentEmailField
    emailField.addEventListener('focus', () => {
      this.currentEmailField = emailField;
      this.updateToolbarState(fieldId);
    });
    emailField.addEventListener('blur', () => {
      // Можно добавить логику для сброса currentEmailField, если нужно
    });
  }

  removeToolbar(fieldId) {
    const toolbar = this.toolbars.get(fieldId);
    if (toolbar) {
      toolbar.remove();
      this.toolbars.delete(fieldId);
    }
  }

  createToolbarContainer(fieldId) {
    const toolbarContainer = document.createElement('div');
    toolbarContainer.className = 'email-enhancer-toolbar-container';
    toolbarContainer.dataset.fieldId = fieldId;
    toolbarContainer.innerHTML = `
      <div class="email-enhancer-toolbar">
        <button class="enhancer-btn" data-action="voice-input" title="Голосовой ввод">
          ${this.getVoiceIcon()}
        </button>
        <button class="enhancer-btn" data-action="fix-text" title="Исправить текст">
          ${this.getFixIcon()}
        </button>
        <div class="enhancer-dropdown-wrapper">
          <button class="enhancer-btn" data-action="improve-text" title="Улучшить текст с ИИ">
            ${this.getAIIcon()}
          </button>
          <div class="enhancer-dropdown-menu">
            <button class="dropdown-item" data-style="friendly">${this.translate('style_friendly')}</button>
            <button class="dropdown-item" data-style="official">${this.translate('style_official')}</button>
            <button class="dropdown-item" data-style="brief">${this.translate('style_brief')}</button>
            <button class="dropdown-item" data-style="persuasive">${this.translate('style_persuasive')}</button>
            <button class="dropdown-item" data-style="technical">${this.translate('style_technical')}</button>
          </div>
        </div>
        <div class="enhancer-dropdown-wrapper">
          <button class="enhancer-btn" data-action="select-language" title="Выбрать язык">
            ${this.getLanguageIcon()}
          </button>
          <div class="enhancer-dropdown-menu">
            <button class="dropdown-item" data-lang="ru">🇷🇺 ${this.translate('lang_russian')}</button>
            <button class="dropdown-item" data-lang="en">🇺🇸 ${this.translate('lang_english')}</button>
            <button class="dropdown-item" data-lang="es">🇪🇸 ${this.translate('lang_spanish')}</button>
            <button class="dropdown-item" data-lang="pt">🇵🇹 ${this.translate('lang_portuguese')}</button>
            <button class="dropdown-item" data-lang="ar">🇸🇦 ${this.translate('lang_arabic')}</button>
            <button class="dropdown-item" data-lang="fr">🇫🇷 ${this.translate('lang_french')}</button>
          </div>
        </div>
      </div>
    `;

    toolbarContainer.querySelectorAll('.enhancer-btn').forEach(button => {
      button.addEventListener('click', (e) => this.handleAction(e, fieldId));
    });

    toolbarContainer.querySelectorAll('.enhancer-dropdown-menu .dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => this.handleDropdownSelect(e, fieldId));
    });

    return toolbarContainer;
  }

  positionToolbar(toolbarContainer, emailField, providerName) {
    const rect = emailField.getBoundingClientRect();
    const doc = emailField.ownerDocument;
    const body = doc.body;

    // Для Gmail и Outlook, где поле ввода находится внутри iframe
    if (providerName === 'gmail' || providerName === 'outlook') {
      // Внедряем тулбар в тот же документ, что и поле ввода
      doc.body.appendChild(toolbarContainer);
      toolbarContainer.style.position = 'absolute';
      toolbarContainer.style.top = `${emailField.offsetTop + emailField.offsetHeight + 5}px`;
      toolbarContainer.style.left = `${emailField.offsetLeft}px`;
      toolbarContainer.style.zIndex = '1000'; // Убедимся, что тулбар виден
    } else {
      // Для остальных, внедряем в основной документ
      body.appendChild(toolbarContainer);
      toolbarContainer.style.position = 'absolute';
      toolbarContainer.style.top = `${window.scrollY + rect.bottom + 5}px`;
      toolbarContainer.style.left = `${window.scrollX + rect.left}px`;
      toolbarContainer.style.zIndex = '1000';
    }
  }

  updateToolbarState(fieldId) {
    // Логика для обновления состояния кнопок тулбара (например, активности)
    console.log(`Toolbar for field ${fieldId} is now active.`);
  }

  async handleAction(event, fieldId) {
    const button = event.currentTarget;
    const action = button.dataset.action;
    const emailField = this.currentEmailField; // Используем текущее активное поле

    if (!emailField) {
      this.showNotification(this.translate('no_field_selected'), 'warning');
      return;
    }

    const selectedText = emailField.value.substring(emailField.selectionStart, emailField.selectionEnd);
    const fullText = emailField.value;
    let textToProcess = selectedText || fullText;

    this.showLoading(button);

    try {
      let resultText = '';
      switch (action) {
        case 'voice-input':
          // Здесь будет логика голосового ввода
          this.showNotification(this.translate('voice_input_start'), 'info');
          // Имитация получения текста
          resultText = await this.mockApiCall('voice', textToProcess, { lang: this.currentLanguage });
          break;
        case 'fix-text':
          resultText = await this.mockApiCall('fix', textToProcess);
          break;
        case 'improve-text':
          // Dropdown handles style selection
          return; // Не делаем ничего, ждем выбора стиля из выпадающего меню
        case 'select-language':
          // Dropdown handles language selection
          return;
      }

      if (resultText) {
        this.replaceTextInField(emailField, selectedText, fullText, resultText);
        this.showNotification(this.translate('operation_success'), 'success');
      }
    } catch (error) {
      console.error('Error during action:', error);
      this.showNotification(this.translate('operation_error'), 'error');
    } finally {
      this.hideLoading(button);
    }
  }

  async handleDropdownSelect(event, fieldId) {
    const item = event.currentTarget;
    const emailField = this.currentEmailField;

    if (!emailField) {
      this.showNotification(this.translate('no_field_selected'), 'warning');
      return;
    }

    const selectedText = emailField.value.substring(emailField.selectionStart, emailField.selectionEnd);
    const fullText = emailField.value;
    let textToProcess = selectedText || fullText;

    const parentButton = item.closest('.enhancer-dropdown-wrapper').querySelector('.enhancer-btn');
    this.showLoading(parentButton);

    try {
      let resultText = '';
      if (item.dataset.style) {
        this.currentStyle = item.dataset.style;
        resultText = await this.mockApiCall('improve', textToProcess, { style: this.currentStyle });
      } else if (item.dataset.lang) {
        this.currentLanguage = item.dataset.lang;
        this.showNotification(`${this.translate('language_set')}: ${item.textContent}`, 'info');
        // Для смены языка нет прямого изменения текста, только уведомление
      }

      if (resultText) {
        this.replaceTextInField(emailField, selectedText, fullText, resultText);
        this.showNotification(this.translate('operation_success'), 'success');
      }
    } catch (error) {
      console.error('Error during dropdown action:', error);
      this.showNotification(this.translate('operation_error'), 'error');
    } finally {
      this.hideLoading(parentButton);
    }
  }

  replaceTextInField(emailField, selectedText, fullText, newText) {
    if (selectedText) {
      emailField.setRangeText(newText, emailField.selectionStart, emailField.selectionEnd, 'select');
    } else {
      emailField.value = newText;
    }
    emailField.dispatchEvent(new Event('input', { bubbles: true })); // Для срабатывания событий почтовых клиентов
  }

  translate(key, defaultValue = '') {
    return this.translations[this.settings.interfaceLanguage]?.[key] ||
           this.translations['ru']?.[key] ||
           defaultValue;
  }

  // Mock API Call (замените на реальный вызов к app.base44.com)
  async mockApiCall(action, text, options = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        switch (action) {
          case 'voice':
            resolve(`Голосовой ввод на ${options.lang}: ${text}`);
            break;
          case 'fix':
            resolve(text + ' [исправлено]');
            break;
          case 'improve':
            resolve(text + ` [улучшено в стиле: ${options.style}]`);
            break;
          default:
            resolve(text);
        }
      }, 500);
    });
  }

  showLoading(button) {
    const iconSpan = button.querySelector('.email-enhancer-icon');
    if (iconSpan) {
      iconSpan.innerHTML = '<div class="email-enhancer-loading"></div>';
    }
  }

  hideLoading(button) {
    const action = button.dataset.action;
    const iconSpan = button.querySelector('.email-enhancer-icon');
    if (iconSpan) {
      switch (action) {
        case 'voice-input':
          iconSpan.innerHTML = this.getVoiceIcon();
          break;
        case 'fix-text':
          iconSpan.innerHTML = this.getFixIcon();
          break;
        case 'improve-text':
          iconSpan.innerHTML = this.getAIIcon();
          break;
        case 'select-language':
          iconSpan.innerHTML = this.getLanguageIcon();
          break;
      }
    }
  }

  showNotification(message, type = 'info', duration = 3000) {
    const notificationId = `enhancer-notification-${this.notificationCounter++}`;
    const notification = document.createElement('div');
    notification.id = notificationId;
    notification.className = `email-enhancer-notification ${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="close-btn">${this.getCloseIcon()}</button>
    `;

    document.body.appendChild(notification);

    // Прикрепляем обработчик события для кнопки закрытия
    notification.querySelector('.close-btn').addEventListener('click', () => {
      this.closeNotification(notificationId);
    });

    if (duration > 0) {
      setTimeout(() => this.closeNotification(notificationId), duration);
    }
  }

  closeNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    if (notification) {
      notification.classList.add('hide');
      notification.addEventListener('transitionend', () => notification.remove());
    }
  }

  // SVG Icons
  getVoiceIcon() {
    return `<svg class="email-enhancer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 003 3v8a3 3 0 00-3 3 3 3 0 00-3-3V4a3 3 0 003-3z"></path><path d="M19 10v2a7 7 0 01-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
  }

  getFixIcon() {
    return `<svg class="email-enhancer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;
  }

  getAIIcon() {
    return `<svg class="email-enhancer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>`;
  }

  getLanguageIcon() {
    return `<svg class="email-enhancer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path></svg>`;
  }

  getCloseIcon() {
    return `<svg class="email-enhancer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  }

  getSuccessIcon() {
    return `<svg class="email-enhancer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-8.93"></path><path d="M22 4L12 14.01l-3-3"></path></svg>`;
  }

  getErrorIcon() {
    return `<svg class="email-enhancer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  }

  getWarningIcon() {
    return `<svg class="email-enhancer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
  }
}

const emailEnhancer = new EmailEnhancer();
window.emailEnhancer = emailEnhancer;

document.dispatchEvent(new CustomEvent('emailEnhancerLoaded'));

