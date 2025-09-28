// Email Providers Integration Module

class EmailProviderManager {
  constructor() {
    this.providers = {
      gmail: new GmailProvider(),
      yandex: new YandexProvider(),
      outlook: new OutlookProvider(),
      mailru: new MailRuProvider()
    };
    
    this.currentProvider = null;
    this.init();
  }

  init() {
    this.detectProvider();
    if (this.currentProvider) {
      this.currentProvider.initialize();
    }
  }

  detectProvider() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('mail.google.com')) {
      this.currentProvider = this.providers.gmail;
    } else if (hostname.includes('mail.yandex')) {
      this.currentProvider = this.providers.yandex;
    } else if (hostname.includes('outlook')) {
      this.currentProvider = this.providers.outlook;
    } else if (hostname.includes('mail.ru')) {
      this.currentProvider = this.providers.mailru;
    }
  }

  getCurrentProvider() {
    return this.currentProvider;
  }
}

// Base Provider Class
class BaseEmailProvider {
  constructor(name) {
    this.name = name;
    this.selectors = {};
    this.observers = [];
    this.attachedFields = new Set();
  }

  initialize() {
    this.setupObservers();
    this.findAndAttachToFields();
  }

  setupObservers() {
    // Наблюдаем за изменениями в DOM
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldCheck = true;
        }
      });
      
      if (shouldCheck) {
        this.findAndAttachToFields();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.observers.push(observer);
  }

  findAndAttachToFields() {
    const fields = this.findComposeFields();
    
    fields.forEach(field => {
      const fieldId = this.getFieldId(field);
      if (!this.attachedFields.has(fieldId)) {
        this.attachToField(field);
        this.attachedFields.add(fieldId);
      }
    });
  }

  getFieldId(field) {
    return field.id || field.className || field.tagName + '_' + Array.from(field.parentNode.children).indexOf(field);
  }

  attachToField(field) {
    // Создаем событие для уведомления основного скрипта
    const event = new CustomEvent('emailFieldFound', {
      detail: {
        field: field,
        provider: this.name,
        selectors: this.selectors
      }
    });
    
    document.dispatchEvent(event);
  }

  // Методы, которые должны быть переопределены в дочерних классах
  findComposeFields() {
    throw new Error('findComposeFields must be implemented by subclass');
  }

  getSendButton(field) {
    throw new Error('getSendButton must be implemented by subclass');
  }

  getFieldPosition(field) {
    throw new Error('getFieldPosition must be implemented by subclass');
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.attachedFields.clear();
  }
}

// Gmail Provider
class GmailProvider extends BaseEmailProvider {
  constructor() {
    super('gmail');
    this.selectors = {
      composeArea: [
        '[role="textbox"][aria-label*="Message body"]',
        '[role="textbox"][aria-label*="Текст сообщения"]',
        '[contenteditable="true"][aria-label*="Message body"]',
        '[contenteditable="true"][aria-label*="Текст"]',
        '.Am.Al.editable',
        '.editable[contenteditable="true"]'
      ],
      sendButton: [
        '[role="button"][data-tooltip*="Send"]',
        '[role="button"][data-tooltip*="Отправить"]',
        '.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3',
        '[data-tooltip="Send ⌘+Enter"]'
      ],
      composeWindow: [
        '.nH .if',
        '.AD',
        '[role="dialog"]'
      ]
    };
  }

  findComposeFields() {
    const fields = [];
    
    // Ищем поля ввода сообщения
    this.selectors.composeArea.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (this.isValidComposeField(element)) {
          fields.push(element);
        }
      });
    });

    return fields;
  }

  isValidComposeField(element) {
    // Проверяем, что это действительно поле ввода сообщения
    if (!element.isContentEditable && element.tagName !== 'TEXTAREA') {
      return false;
    }

    // Проверяем, что элемент видим
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return false;
    }

    // Проверяем, что это не поле темы или других элементов
    const ariaLabel = element.getAttribute('aria-label') || '';
    if (ariaLabel.includes('Subject') || ariaLabel.includes('Тема')) {
      return false;
    }

    return true;
  }

  getSendButton(field) {
    // Ищем кнопку отправки в том же окне композиции
    const composeWindow = field.closest('.nH .if') || field.closest('.AD') || field.closest('[role="dialog"]');
    
    if (composeWindow) {
      for (const selector of this.selectors.sendButton) {
        const button = composeWindow.querySelector(selector);
        if (button) return button;
      }
    }

    // Если не нашли в окне, ищем глобально
    for (const selector of this.selectors.sendButton) {
      const button = document.querySelector(selector);
      if (button) return button;
    }

    return null;
  }

  getFieldPosition(field) {
    const rect = field.getBoundingClientRect();
    const composeWindow = field.closest('.nH .if') || field.closest('.AD');
    
    return {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      container: composeWindow
    };
  }
}

// Yandex Mail Provider
class YandexProvider extends BaseEmailProvider {
  constructor() {
    super('yandex');
    this.selectors = {
      composeArea: [
        '.cke_editable',
        '[contenteditable="true"]',
        '.mail-Compose-Editor .cke_editable',
        '.composeEditor [contenteditable="true"]'
      ],
      sendButton: [
        '.mail-Compose-SendButton',
        '[data-action="send"]',
        '.ComposeReact-SendButton',
        '.compose-send-button'
      ],
      composeWindow: [
        '.mail-Compose',
        '.ComposeReact',
        '.compose-window'
      ]
    };
  }

  findComposeFields() {
    const fields = [];
    
    this.selectors.composeArea.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (this.isValidComposeField(element)) {
          fields.push(element);
        }
      });
    });

    return fields;
  }

  isValidComposeField(element) {
    if (!element.isContentEditable) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return false;
    }

    // Проверяем, что это не поле темы
    const parent = element.closest('.mail-Compose-Field');
    if (parent && parent.querySelector('.mail-Compose-Field-Label')) {
      const label = parent.querySelector('.mail-Compose-Field-Label').textContent;
      if (label.includes('Тема') || label.includes('Subject')) {
        return false;
      }
    }

    return true;
  }

  getSendButton(field) {
    const composeWindow = field.closest('.mail-Compose') || field.closest('.ComposeReact');
    
    if (composeWindow) {
      for (const selector of this.selectors.sendButton) {
        const button = composeWindow.querySelector(selector);
        if (button) return button;
      }
    }

    return null;
  }

  getFieldPosition(field) {
    const rect = field.getBoundingClientRect();
    
    return {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      container: field.closest('.mail-Compose') || field.closest('.ComposeReact')
    };
  }
}

// Outlook Provider
class OutlookProvider extends BaseEmailProvider {
  constructor() {
    super('outlook');
    this.selectors = {
      composeArea: [
        '[role="textbox"]',
        '.rps_1f32',
        '[contenteditable="true"]',
        '.elementToProof[contenteditable="true"]',
        '#editorParent_1 [contenteditable="true"]'
      ],
      sendButton: [
        '[data-app-id="Send"]',
        '[aria-label*="Send"]',
        '.ms-Button--primary[aria-label*="Send"]',
        'button[title*="Send"]'
      ],
      composeWindow: [
        '.wide-content-host',
        '[role="dialog"]',
        '.ms-Panel'
      ]
    };
  }

  findComposeFields() {
    const fields = [];
    
    this.selectors.composeArea.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (this.isValidComposeField(element)) {
          fields.push(element);
        }
      });
    });

    return fields;
  }

  isValidComposeField(element) {
    if (!element.isContentEditable && element.tagName !== 'TEXTAREA') {
      return false;
    }

    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return false;
    }

    // Проверяем, что это не поле темы
    const ariaLabel = element.getAttribute('aria-label') || '';
    if (ariaLabel.includes('Subject') || ariaLabel.includes('Add a subject')) {
      return false;
    }

    // Проверяем по ID
    const id = element.id || '';
    if (id.includes('subject') || id.includes('Subject')) {
      return false;
    }

    return true;
  }

  getSendButton(field) {
    const composeWindow = field.closest('.wide-content-host') || 
                         field.closest('[role="dialog"]') || 
                         field.closest('.ms-Panel');
    
    if (composeWindow) {
      for (const selector of this.selectors.sendButton) {
        const button = composeWindow.querySelector(selector);
        if (button) return button;
      }
    }

    return null;
  }

  getFieldPosition(field) {
    const rect = field.getBoundingClientRect();
    
    return {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      container: field.closest('.wide-content-host') || field.closest('[role="dialog"]')
    };
  }
}

// Mail.ru Provider
class MailRuProvider extends BaseEmailProvider {
  constructor() {
    super('mailru');
    this.selectors = {
      composeArea: [
        '.cke_editable',
        '[contenteditable="true"]',
        '.compose__editor [contenteditable="true"]',
        '.editor-content[contenteditable="true"]'
      ],
      sendButton: [
        '[data-name="send"]',
        '.button2_send',
        '.compose__send-button',
        '.send-button'
      ],
      composeWindow: [
        '.compose',
        '.compose-window',
        '.letter-compose'
      ]
    };
  }

  findComposeFields() {
    const fields = [];
    
    this.selectors.composeArea.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (this.isValidComposeField(element)) {
          fields.push(element);
        }
      });
    });

    return fields;
  }

  isValidComposeField(element) {
    if (!element.isContentEditable) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return false;
    }

    // Проверяем, что это не поле темы
    const parent = element.closest('.compose__field');
    if (parent && parent.querySelector('.compose__field-label')) {
      const label = parent.querySelector('.compose__field-label').textContent;
      if (label.includes('Тема') || label.includes('Subject')) {
        return false;
      }
    }

    return true;
  }

  getSendButton(field) {
    const composeWindow = field.closest('.compose') || 
                         field.closest('.compose-window') || 
                         field.closest('.letter-compose');
    
    if (composeWindow) {
      for (const selector of this.selectors.sendButton) {
        const button = composeWindow.querySelector(selector);
        if (button) return button;
      }
    }

    return null;
  }

  getFieldPosition(field) {
    const rect = field.getBoundingClientRect();
    
    return {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      container: field.closest('.compose') || field.closest('.compose-window')
    };
  }
}

// Экспортируем менеджер провайдеров
window.EmailProviderManager = EmailProviderManager;
