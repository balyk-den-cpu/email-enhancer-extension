// Email Enhancer Popup Script

class PopupManager {
  constructor() {
    this.settings = {};
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.updateUI();
    this.checkSubscriptionStatus();
  }

  async loadSettings() {
    this.settings = await chrome.storage.local.get([
      'interfaceLanguage',
      'currentLanguage',
      'subscriptionStatus',
      'subscriptionExpiry',
      'plan'
    ]);

    // Устанавливаем значения по умолчанию
    this.settings = {
      interfaceLanguage: 'ru',
      currentLanguage: 'ru',
      subscriptionStatus: 'trial',
      subscriptionExpiry: Date.now() + (7 * 24 * 60 * 60 * 1000),
      plan: 'trial',
      ...this.settings
    };
  }

  setupEventListeners() {
    // Открытие Gmail
    document.getElementById('open-gmail').addEventListener('click', () => {
      this.openGmail();
    });

    // Открытие настроек
    document.getElementById('open-settings').addEventListener('click', () => {
      this.openSettings();
    });

    // Тест голоса
    document.getElementById('test-voice').addEventListener('click', () => {
      this.testVoice();
    });

    // Обновление подписки
    document.getElementById('upgrade-subscription').addEventListener('click', () => {
      this.upgradeSubscription();
    });

    // Выбор языка
    document.getElementById('language-selector').addEventListener('click', () => {
      this.showLanguageSelector();
    });

    // Ссылки в футере
    document.getElementById('help-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.openHelp();
    });

    document.getElementById('feedback-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.openFeedback();
    });
  }

  updateUI() {
    // Обновляем информацию о версии
    const manifest = chrome.runtime.getManifest();
    document.getElementById('version-info').textContent = `v${manifest.version}`;

    // Обновляем текущий язык
    this.updateCurrentLanguage();

    // Применяем переводы
    if (window.translationManager) {
      window.translationManager.setLanguage(this.settings.interfaceLanguage);
    }
  }

  updateCurrentLanguage() {
    const languageInfo = this.getLanguageInfo(this.settings.currentLanguage);
    document.getElementById('current-flag').textContent = languageInfo.flag;
    document.getElementById('current-language').textContent = languageInfo.name;
  }

  getLanguageInfo(code) {
    const languages = {
      ru: { name: 'Русский', flag: '🇷🇺' },
      en: { name: 'English', flag: '🇺🇸' },
      es: { name: 'Español', flag: '🇪🇸' },
      pt: { name: 'Português', flag: '🇵🇹' },
      ar: { name: 'العربية', flag: '🇸🇦' },
      fr: { name: 'Français', flag: '🇫🇷' }
    };
    return languages[code] || { name: code, flag: '🌐' };
  }

  async checkSubscriptionStatus() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'checkSubscription'
      });

      if (response.success) {
        this.updateSubscriptionInfo(response.data);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Используем локальные данные
      const daysLeft = Math.max(0, Math.ceil((this.settings.subscriptionExpiry - Date.now()) / (24 * 60 * 60 * 1000)));
      this.updateSubscriptionInfo({
        status: this.settings.subscriptionStatus,
        daysLeft: daysLeft,
        plan: this.settings.plan
      });
    }
  }

  updateSubscriptionInfo(subscriptionData) {
    const planBadge = document.getElementById('plan-badge');
    const daysRemaining = document.getElementById('days-remaining');

    // Обновляем план
    planBadge.className = 'status-badge';
    if (subscriptionData.plan === 'trial') {
      planBadge.textContent = window.translationManager ? 
        window.translationManager.translate('trial_period') : 'Пробный период';
      planBadge.classList.add('trial');
    } else if (subscriptionData.plan === 'premium') {
      planBadge.textContent = window.translationManager ? 
        window.translationManager.translate('premium_plan') : 'Премиум план';
      planBadge.classList.add('active');
    }

    // Обновляем дни
    daysRemaining.textContent = subscriptionData.daysLeft;

    // Меняем цвет в зависимости от статуса
    if (subscriptionData.daysLeft <= 0) {
      planBadge.className = 'status-badge expired';
      daysRemaining.style.color = '#d93025';
    } else if (subscriptionData.daysLeft <= 3) {
      daysRemaining.style.color = '#ea4335';
    } else {
      daysRemaining.style.color = '#333';
    }
  }

  async openGmail() {
    try {
      // Проверяем, есть ли уже открытая вкладка Gmail
      const tabs = await chrome.tabs.query({ url: '*://mail.google.com/*' });
      
      if (tabs.length > 0) {
        // Переключаемся на существующую вкладку
        await chrome.tabs.update(tabs[0].id, { active: true });
        await chrome.windows.update(tabs[0].windowId, { focused: true });
      } else {
        // Открываем новую вкладку
        await chrome.tabs.create({ url: 'https://mail.google.com' });
      }
      
      window.close();
    } catch (error) {
      console.error('Error opening Gmail:', error);
    }
  }

  openSettings() {
    chrome.runtime.openOptionsPage();
    window.close();
  }

  async testVoice() {
    try {
      // Проверяем доступ к микрофону
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Показываем уведомление об успехе
      this.showNotification('Микрофон работает!', 'success');
      
      // Останавливаем поток
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error) {
      console.error('Microphone test failed:', error);
      this.showNotification('Ошибка доступа к микрофону', 'error');
    }
  }

  upgradeSubscription() {
    chrome.tabs.create({
      url: 'https://app.base44.com/subscription/upgrade'
    });
    window.close();
  }

  showLanguageSelector() {
    // Создаем модальное окно для выбора языка
    const modal = document.createElement('div');
    modal.className = 'language-modal';
    modal.innerHTML = this.getLanguageModalHTML();
    
    document.body.appendChild(modal);
    
    // Добавляем обработчики событий
    this.setupLanguageModalEvents(modal);
    
    // Показываем модальное окно
    setTimeout(() => modal.classList.add('show'), 10);
  }

  getLanguageModalHTML() {
    const languages = [
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'pt', name: 'Português', flag: '🇵🇹' },
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ];

    const languageItems = languages.map(lang => `
      <div class="language-item" data-language="${lang.code}">
        <span class="language-flag">${lang.flag}</span>
        <span class="language-name">${lang.name}</span>
        ${this.settings.currentLanguage === lang.code ? '<span class="checkmark">✓</span>' : ''}
      </div>
    `).join('');

    return `
      <div class="language-modal-overlay">
        <div class="language-modal-content">
          <div class="language-modal-header">
            <h3>Выберите язык</h3>
            <button class="close-btn">&times;</button>
          </div>
          <div class="language-list">
            ${languageItems}
          </div>
        </div>
      </div>
      <style>
        .language-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .language-modal.show {
          opacity: 1;
        }
        .language-modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .language-modal-content {
          background: white;
          border-radius: 8px;
          width: 280px;
          max-height: 400px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        .language-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #e1e5e9;
        }
        .language-modal-header h3 {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #5f6368;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .close-btn:hover {
          color: #333;
        }
        .language-list {
          max-height: 300px;
          overflow-y: auto;
        }
        .language-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .language-item:hover {
          background: #f8f9fa;
        }
        .language-item .language-flag {
          font-size: 18px;
        }
        .language-item .language-name {
          flex: 1;
          font-size: 14px;
        }
        .language-item .checkmark {
          color: #1a73e8;
          font-weight: bold;
        }
      </style>
    `;
  }

  setupLanguageModalEvents(modal) {
    // Закрытие модального окна
    const closeBtn = modal.querySelector('.close-btn');
    const overlay = modal.querySelector('.language-modal-overlay');
    
    closeBtn.addEventListener('click', () => this.closeLanguageModal(modal));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeLanguageModal(modal);
      }
    });

    // Выбор языка
    const languageItems = modal.querySelectorAll('.language-item');
    languageItems.forEach(item => {
      item.addEventListener('click', () => {
        const language = item.dataset.language;
        this.selectLanguage(language);
        this.closeLanguageModal(modal);
      });
    });
  }

  closeLanguageModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  }

  async selectLanguage(language) {
    this.settings.currentLanguage = language;
    await chrome.storage.local.set({ currentLanguage: language });
    
    // Обновляем UI
    this.updateCurrentLanguage();
    
    // Показываем уведомление
    const languageInfo = this.getLanguageInfo(language);
    this.showNotification(`Язык изменен на ${languageInfo.name}`, 'success');
  }

  openHelp() {
    chrome.tabs.create({
      url: 'https://app.base44.com/help'
    });
    window.close();
  }

  openFeedback() {
    chrome.tabs.create({
      url: 'https://app.base44.com/feedback'
    });
    window.close();
  }

  showNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `popup-notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      right: 20px;
      padding: 12px 16px;
      background: ${type === 'success' ? '#e6f4ea' : '#fce8e6'};
      color: ${type === 'success' ? '#137333' : '#d93025'};
      border: 1px solid ${type === 'success' ? '#34a853' : '#ea4335'};
      border-radius: 8px;
      font-size: 14px;
      z-index: 10001;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Скрываем уведомление
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-10px)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});
