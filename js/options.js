
// Email Enhancer Options Page Script

class OptionsManager {
  constructor() {
    this.settings = {};
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.updateUI();
    this.checkSubscriptionStatus();
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('welcome') === 'true') {
      this.showWelcomeMessage();
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
      subscriptionStatus: 'trial',
      subscriptionExpiry: Date.now() + (7 * 24 * 60 * 60 * 1000),
      plan: 'trial',
    };
    this.settings = await chrome.storage.local.get(defaults);
  }

  setupEventListeners() {
    document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
    document.getElementById('reset-settings').addEventListener('click', () => this.resetSettings());
    document.getElementById('export-settings').addEventListener('click', () => this.exportSettings());
    document.getElementById('import-settings').addEventListener('click', () => this.importSettings());
    document.getElementById('upgrade-btn').addEventListener('click', () => this.upgradeSubscription());

    document.getElementById('interface-language').addEventListener('change', (e) => {
      const newLanguage = e.target.value;
      window.translationManager.setLanguage(newLanguage);
      this.settings.interfaceLanguage = newLanguage;
      this.markAsChanged();
    });

    this.setupFormChangeListeners();
  }

  setupFormChangeListeners() {
    const inputs = document.querySelectorAll('select, input[type="checkbox"]');
    inputs.forEach(input => {
      if (input.id !== 'interface-language') { // Already handled
        input.addEventListener('change', () => this.markAsChanged());
      }
    });
  }

  markAsChanged() {
    const saveButton = document.getElementById('save-settings');
    saveButton.textContent = window.translationManager.translate('save_settings') + ' *';
    saveButton.classList.add('changed');
  }

  updateUI() {
    document.getElementById('interface-language').value = this.settings.interfaceLanguage;
    document.getElementById('default-text-language').value = this.settings.currentLanguage;
    document.getElementById('default-style').value = this.settings.currentStyle;
    document.getElementById('auto-fix-enabled').checked = this.settings.autoFixEnabled;
    document.getElementById('voice-shortcuts-enabled').checked = this.settings.voiceShortcutsEnabled;
    document.getElementById('success-notifications').checked = this.settings.successNotifications;
    document.getElementById('error-notifications').checked = this.settings.errorNotifications;
    document.getElementById('debug-mode').checked = this.settings.debugMode;
    document.getElementById('data-collection').checked = this.settings.dataCollection;

    const manifest = chrome.runtime.getManifest();
    document.getElementById('extension-version').textContent = manifest.version;
  }

  async checkSubscriptionStatus() {
     // Mock implementation
     this.updateSubscriptionInfo({
        status: this.settings.subscriptionStatus,
        daysLeft: Math.max(0, Math.ceil((this.settings.subscriptionExpiry - Date.now()) / (24 * 60 * 60 * 1000))),
        plan: this.settings.plan
      });
  }

  updateSubscriptionInfo(subscriptionData) {
    const planElement = document.getElementById('subscription-plan');
    const detailsElement = document.getElementById('subscription-details');
    const badgeElement = document.getElementById('subscription-badge');

    planElement.textContent = window.translationManager.translate(subscriptionData.plan === 'trial' ? 'trial_period' : 'premium_plan');
    detailsElement.textContent = subscriptionData.daysLeft > 0 ? `${window.translationManager.translate('days_left')}: ${subscriptionData.daysLeft}` : window.translationManager.translate('subscription_expired');

    badgeElement.className = 'subscription-badge';
    if (subscriptionData.status === 'active' && subscriptionData.daysLeft > 7) {
      badgeElement.textContent = window.translationManager.translate('subscription_active');
      badgeElement.classList.add('active');
    } else if (subscriptionData.daysLeft > 0) {
      badgeElement.textContent = window.translationManager.translate('subscription_expiring');
      badgeElement.classList.add('expiring');
    } else {
      badgeElement.textContent = window.translationManager.translate('subscription_expired');
      badgeElement.classList.add('expired');
    }
  }

  async saveSettings() {
    const newSettings = {
      interfaceLanguage: document.getElementById('interface-language').value,
      currentLanguage: document.getElementById('default-text-language').value,
      currentStyle: document.getElementById('default-style').value,
      autoFixEnabled: document.getElementById('auto-fix-enabled').checked,
      voiceShortcutsEnabled: document.getElementById('voice-shortcuts-enabled').checked,
      successNotifications: document.getElementById('success-notifications').checked,
      errorNotifications: document.getElementById('error-notifications').checked,
      debugMode: document.getElementById('debug-mode').checked,
      dataCollection: document.getElementById('data-collection').checked
    };

    await chrome.storage.local.set(newSettings);
    this.settings = { ...this.settings, ...newSettings };
    this.showSaveStatus('success', window.translationManager.translate('settings_saved'));
    
    const saveButton = document.getElementById('save-settings');
    saveButton.textContent = window.translationManager.translate('save_settings');
    saveButton.classList.remove('changed');
  }

  async resetSettings() {
    if (confirm(window.translationManager.translate('confirm_reset', 'Вы уверены, что хотите сбросить все настройки?'))) {
      const defaultSettings = {
        interfaceLanguage: 'ru',
        currentLanguage: 'ru',
        currentStyle: 'friendly',
        autoFixEnabled: false,
        voiceShortcutsEnabled: true,
        successNotifications: true,
        errorNotifications: true,
        debugMode: false,
        dataCollection: true
      };
      await chrome.storage.local.set(defaultSettings);
      this.settings = { ...this.settings, ...defaultSettings };
      this.updateUI();
      window.translationManager.setLanguage(defaultSettings.interfaceLanguage);
      this.showSaveStatus('success', window.translationManager.translate('settings_reset'));
    }
  }

  exportSettings() {
    const exportData = { version: chrome.runtime.getManifest().version, timestamp: new Date().toISOString(), settings: this.settings };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-enhancer-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showSaveStatus('success', 'Настройки экспортированы');
  }

  importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const importData = JSON.parse(text);
        if (importData.settings) {
          await chrome.storage.local.set(importData.settings);
          this.settings = { ...this.settings, ...importData.settings };
          this.updateUI();
          if (importData.settings.interfaceLanguage) {
            window.translationManager.setLanguage(importData.settings.interfaceLanguage);
          }
          this.showSaveStatus('success', 'Настройки импортированы');
        } else { throw new Error('Неверный формат файла'); }
      } catch (error) {
        this.showSaveStatus('error', 'Ошибка импорта настроек');
      }
    };
    input.click();
  }

  upgradeSubscription() {
    chrome.tabs.create({ url: 'https://app.base44.com/subscription/upgrade' });
  }

  showSaveStatus(type, message) {
    const statusElement = document.getElementById('save-status');
    const messageElement = document.getElementById('save-message');
    statusElement.className = `save-status ${type} show`;
    messageElement.textContent = message;
    setTimeout(() => { statusElement.classList.remove('show'); }, 3000);
  }

  showWelcomeMessage() {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.id = 'welcome-message';
    welcomeDiv.className = 'welcome-overlay';
    welcomeDiv.innerHTML = `
      <div class="welcome-content">
        <h2 data-i18n="welcome_title">Добро пожаловать в Email Enhancer!</h2>
        <p data-i18n="welcome_text">Спасибо за установку расширения. Настройте его под свои потребности.</p>
        <button class="btn btn-primary" id="welcome-close-btn" data-i18n="understand">Понятно</button>
      </div>
    `;
    document.body.appendChild(welcomeDiv);

    document.getElementById('welcome-close-btn').addEventListener('click', () => {
      welcomeDiv.remove();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.optionsManager = new OptionsManager();
});


