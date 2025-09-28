// Email Enhancer Background Script

class EmailEnhancerBackground {
  constructor() {
    this.apiBaseUrl = 'https://app.base44.com';
    this.init();
  }

  init() {
    // Обработка установки расширения
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstall(details);
    });

    // Обработка сообщений от content scripts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Указывает, что ответ будет асинхронным
    });

    // Обработка обновления вкладок
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    console.log('Email Enhancer Background Script initialized');
  }

  async handleInstall(details) {
    if (details.reason === 'install') {
      // Первая установка - устанавливаем настройки по умолчанию
      await this.setDefaultSettings();
      
      // Открываем страницу приветствия
      chrome.tabs.create({
        url: chrome.runtime.getURL('options.html?welcome=true')
      });
    } else if (details.reason === 'update') {
      // Обновление расширения
      console.log('Extension updated to version', chrome.runtime.getManifest().version);
    }
  }

  async setDefaultSettings() {
    const defaultSettings = {
      currentLanguage: 'ru',
      currentStyle: 'friendly',
      interfaceLanguage: 'ru',
      subscriptionStatus: 'trial',
      subscriptionExpiry: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 дней пробного периода
      apiKey: null,
      userId: null
    };

    await chrome.storage.local.set(defaultSettings);
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.action) {
        case 'transcribeAudio':
          const transcription = await this.transcribeAudio(message.audioData, message.language);
          sendResponse({ success: true, data: transcription });
          break;

        case 'fixText':
          const fixedText = await this.fixText(message.text, message.language);
          sendResponse({ success: true, data: fixedText });
          break;

        case 'improveText':
          const improvedText = await this.improveText(message.text, message.style, message.language);
          sendResponse({ success: true, data: improvedText });
          break;

        case 'checkSubscription':
          const subscriptionStatus = await this.checkSubscription();
          sendResponse({ success: true, data: subscriptionStatus });
          break;

        case 'updateSettings':
          await this.updateSettings(message.settings);
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  handleTabUpdate(tabId, changeInfo, tab) {
    // Проверяем, является ли вкладка почтовым клиентом
    if (changeInfo.status === 'complete' && this.isEmailProvider(tab.url)) {
      // Можем выполнить дополнительную инициализацию если нужно
      console.log('Email provider tab loaded:', tab.url);
    }
  }

  isEmailProvider(url) {
    if (!url) return false;
    
    const emailProviders = [
      'mail.google.com',
      'mail.yandex.ru',
      'mail.yandex.com',
      'outlook.live.com',
      'outlook.office.com',
      'e.mail.ru'
    ];

    return emailProviders.some(provider => url.includes(provider));
  }

  async transcribeAudio(audioData, language = 'ru') {
    try {
      const settings = await chrome.storage.local.get(['apiKey', 'userId']);
      
      const response = await fetch(`${this.apiBaseUrl}/api/transcribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`,
          'X-User-ID': settings.userId
        },
        body: JSON.stringify({
          audioData: audioData,
          language: language,
          format: 'webm'
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      return result.transcription;
    } catch (error) {
      console.error('Transcription error:', error);
      // Fallback для демонстрации
      return 'Это пример транскрипции голосового сообщения.';
    }
  }

  async fixText(text, language = 'ru') {
    try {
      const settings = await chrome.storage.local.get(['apiKey', 'userId']);
      
      const response = await fetch(`${this.apiBaseUrl}/api/fix-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`,
          'X-User-ID': settings.userId
        },
        body: JSON.stringify({
          text: text,
          language: language,
          corrections: ['grammar', 'spelling', 'punctuation', 'formatting']
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      return result.correctedText;
    } catch (error) {
      console.error('Text fixing error:', error);
      // Fallback для демонстрации
      return this.simulateTextFix(text);
    }
  }

  async improveText(text, style = 'friendly', language = 'ru') {
    try {
      const settings = await chrome.storage.local.get(['apiKey', 'userId']);
      
      const response = await fetch(`${this.apiBaseUrl}/api/improve-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`,
          'X-User-ID': settings.userId
        },
        body: JSON.stringify({
          text: text,
          style: style,
          language: language,
          preserveLength: false
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      return result.improvedText;
    } catch (error) {
      console.error('Text improvement error:', error);
      // Fallback для демонстрации
      return this.simulateTextImprovement(text, style);
    }
  }

  async checkSubscription() {
    try {
      const settings = await chrome.storage.local.get(['apiKey', 'userId', 'subscriptionStatus', 'subscriptionExpiry']);
      
      if (!settings.apiKey) {
        return {
          status: 'no_subscription',
          daysLeft: 0,
          plan: 'none'
        };
      }

      const response = await fetch(`${this.apiBaseUrl}/api/subscription/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'X-User-ID': settings.userId
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      
      // Обновляем локальные настройки
      await chrome.storage.local.set({
        subscriptionStatus: result.status,
        subscriptionExpiry: result.expiryDate,
        plan: result.plan
      });

      return result;
    } catch (error) {
      console.error('Subscription check error:', error);
      // Fallback - используем локальные данные
      const settings = await chrome.storage.local.get(['subscriptionStatus', 'subscriptionExpiry']);
      const daysLeft = Math.max(0, Math.ceil((settings.subscriptionExpiry - Date.now()) / (24 * 60 * 60 * 1000)));
      
      return {
        status: settings.subscriptionStatus || 'trial',
        daysLeft: daysLeft,
        plan: daysLeft > 0 ? 'trial' : 'expired'
      };
    }
  }

  async updateSettings(newSettings) {
    const currentSettings = await chrome.storage.local.get();
    const updatedSettings = { ...currentSettings, ...newSettings };
    await chrome.storage.local.set(updatedSettings);
    
    // Уведомляем все активные content scripts об изменении настроек
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (this.isEmailProvider(tab.url)) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'settingsUpdated',
            settings: updatedSettings
          });
        } catch (error) {
          // Игнорируем ошибки для вкладок без content script
        }
      }
    }
  }

  // Вспомогательные методы для демонстрации (fallback)
  simulateTextFix(text) {
    // Простая имитация исправления текста
    return text
      .replace(/\s+/g, ' ') // Убираем лишние пробелы
      .replace(/([.!?])\s*([a-zа-я])/g, '$1 $2') // Пробелы после знаков препинания
      .replace(/([a-zа-я])([.!?])/g, '$1$2') // Убираем пробелы перед знаками препинания
      .trim();
  }

  simulateTextImprovement(text, style) {
    const styleModifiers = {
      friendly: ' 😊',
      official: ' (официально)',
      brief: ' (кратко)',
      persuasive: ' (убедительно)',
      technical: ' (технически)'
    };

    return text + (styleModifiers[style] || '');
  }

  // Методы для работы с аудио
  async startAudioRecording() {
    // Здесь будет логика начала записи аудио
    return new Promise((resolve) => {
      // Имитация начала записи
      setTimeout(() => {
        resolve({ success: true, recordingId: Date.now() });
      }, 100);
    });
  }

  async stopAudioRecording(recordingId) {
    // Здесь будет логика остановки записи и получения аудио данных
    return new Promise((resolve) => {
      // Имитация получения аудио данных
      setTimeout(() => {
        resolve({
          success: true,
          audioData: 'base64_encoded_audio_data',
          duration: 3000
        });
      }, 100);
    });
  }
}

// Инициализация background script
new EmailEnhancerBackground();
