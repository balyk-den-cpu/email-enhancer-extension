# API Integration Guide - Email Enhancer

## 🔗 Интеграция с https://app.base44.com

Данный документ описывает, как интегрировать Email Enhancer с API сервиса base44.com для получения полной функциональности.

## 📋 Обзор API эндпоинтов

### Базовый URL
```
https://app.base44.com/api/v1
```

### Аутентификация
Все запросы должны содержать заголовок авторизации:
```
Authorization: Bearer YOUR_API_TOKEN
```

## 🎤 Голосовой ввод

### POST /transcribe
Преобразование аудио в текст

**Параметры запроса:**
```javascript
{
  "audio": "base64_encoded_audio_data",
  "language": "ru|en|es|pt|ar|fr",
  "format": "webm|mp3|wav"
}
```

**Ответ:**
```javascript
{
  "success": true,
  "text": "Распознанный текст",
  "confidence": 0.95,
  "language_detected": "ru"
}
```

**Интеграция в background.js:**
```javascript
async function transcribeAudio(audioBlob, language) {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  formData.append('language', language);
  
  const response = await fetch('https://app.base44.com/api/v1/transcribe', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${await getApiToken()}`
    },
    body: formData
  });
  
  return await response.json();
}
```

## ✅ Исправление текста

### POST /fix-text
Автоматическое исправление ошибок в тексте

**Параметры запроса:**
```javascript
{
  "text": "Текст с ошибками",
  "language": "ru|en|es|pt|ar|fr",
  "fix_types": ["spelling", "grammar", "punctuation", "formatting"]
}
```

**Ответ:**
```javascript
{
  "success": true,
  "original_text": "Исходный текст",
  "fixed_text": "Исправленный текст",
  "corrections": [
    {
      "type": "spelling",
      "original": "ошибка",
      "corrected": "ошибка",
      "position": 10
    }
  ]
}
```

**Интеграция в background.js:**
```javascript
async function fixText(text, language) {
  const response = await fetch('https://app.base44.com/api/v1/fix-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getApiToken()}`
    },
    body: JSON.stringify({
      text: text,
      language: language,
      fix_types: ['spelling', 'grammar', 'punctuation', 'formatting']
    })
  });
  
  return await response.json();
}
```

## 🤖 AI-улучшение текста

### POST /improve-text
Улучшение текста с помощью AI

**Параметры запроса:**
```javascript
{
  "text": "Исходный текст",
  "language": "ru|en|es|pt|ar|fr",
  "style": "friendly|official|brief|persuasive|technical",
  "context": "email|letter|message",
  "preserve_meaning": true
}
```

**Ответ:**
```javascript
{
  "success": true,
  "original_text": "Исходный текст",
  "improved_text": "Улучшенный текст",
  "improvements": [
    {
      "type": "style",
      "description": "Сделан более дружелюбным тон"
    }
  ]
}
```

**Интеграция в background.js:**
```javascript
async function improveText(text, language, style) {
  const response = await fetch('https://app.base44.com/api/v1/improve-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getApiToken()}`
    },
    body: JSON.stringify({
      text: text,
      language: language,
      style: style,
      context: 'email',
      preserve_meaning: true
    })
  });
  
  return await response.json();
}
```

## 👤 Управление подпиской

### GET /subscription/status
Проверка статуса подписки пользователя

**Ответ:**
```javascript
{
  "success": true,
  "subscription": {
    "plan": "trial|premium|enterprise",
    "status": "active|expired|cancelled",
    "expires_at": "2024-12-31T23:59:59Z",
    "features": {
      "voice_transcription": true,
      "text_improvement": true,
      "unlimited_requests": false,
      "priority_support": false
    },
    "usage": {
      "requests_used": 150,
      "requests_limit": 1000,
      "reset_date": "2024-01-01T00:00:00Z"
    }
  }
}
```

### POST /subscription/upgrade
Обновление подписки

**Параметры запроса:**
```javascript
{
  "plan": "premium|enterprise",
  "billing_period": "monthly|yearly"
}
```

## 🔧 Обновление background.js

Добавьте следующие функции в `background.js`:

```javascript
// Получение API токена
async function getApiToken() {
  const result = await chrome.storage.local.get(['apiToken']);
  return result.apiToken || null;
}

// Сохранение API токена
async function setApiToken(token) {
  await chrome.storage.local.set({ apiToken: token });
}

// Обработчик сообщений от content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'transcribe':
      handleTranscribe(request.data)
        .then(sendResponse)
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'fixText':
      handleFixText(request.data)
        .then(sendResponse)
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'improveText':
      handleImproveText(request.data)
        .then(sendResponse)
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'checkSubscription':
      handleCheckSubscription()
        .then(sendResponse)
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
  }
});

// Обработчики API вызовов
async function handleTranscribe(data) {
  const { audioBlob, language } = data;
  return await transcribeAudio(audioBlob, language);
}

async function handleFixText(data) {
  const { text, language } = data;
  return await fixText(text, language);
}

async function handleImproveText(data) {
  const { text, language, style } = data;
  return await improveText(text, language, style);
}

async function handleCheckSubscription() {
  const response = await fetch('https://app.base44.com/api/v1/subscription/status', {
    headers: {
      'Authorization': `Bearer ${await getApiToken()}`
    }
  });
  
  return await response.json();
}
```

## 🔧 Обновление content.js

Обновите методы в `content.js` для использования API:

```javascript
async function callAPI(action, text, options = {}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: action,
      data: {
        text: text,
        language: this.currentLanguage,
        ...options
      }
    }, (response) => {
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.error || 'API call failed'));
      }
    });
  });
}

// Обновленный метод записи голоса
async function startRecording(button, emailField) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.isRecording = true;
    button.classList.add('recording');
    
    // Создаем MediaRecorder
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      
      try {
        const response = await chrome.runtime.sendMessage({
          action: 'transcribe',
          data: {
            audioBlob: audioBlob,
            language: this.currentLanguage
          }
        });
        
        if (response.success) {
          this.insertText(response.text, emailField);
          this.showNotification('Голос успешно распознан', 'success');
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        console.error('Transcription error:', error);
        this.showNotification('Ошибка распознавания голоса', 'error');
      }
    };
    
    // Сохраняем ссылку для остановки
    this.currentRecorder = mediaRecorder;
    mediaRecorder.start();
    
  } catch (error) {
    console.error('Microphone access error:', error);
    this.showNotification('Ошибка доступа к микрофону', 'error');
  }
}

async function stopRecording(button) {
  if (this.currentRecorder && this.isRecording) {
    this.currentRecorder.stop();
    this.currentRecorder = null;
  }
  
  this.isRecording = false;
  button.classList.remove('recording');
}
```

## 🔐 Настройка аутентификации

Добавьте в `options.html` поле для ввода API токена:

```html
<div class="setting-group">
  <label for="api-token">API Token:</label>
  <input type="password" id="api-token" placeholder="Введите ваш API токен">
  <button id="save-token">Сохранить</button>
</div>
```

И соответствующий JavaScript в `options.js`:

```javascript
// Сохранение API токена
document.getElementById('save-token').addEventListener('click', async () => {
  const token = document.getElementById('api-token').value;
  if (token) {
    await chrome.storage.local.set({ apiToken: token });
    showNotification('API токен сохранен', 'success');
  }
});

// Загрузка сохраненного токена
async function loadApiToken() {
  const result = await chrome.storage.local.get(['apiToken']);
  if (result.apiToken) {
    document.getElementById('api-token').value = result.apiToken;
  }
}
```

## 📊 Обработка ошибок

Добавьте обработку различных типов ошибок API:

```javascript
function handleApiError(error, action) {
  let message = 'Произошла ошибка';
  
  switch (error.code) {
    case 401:
      message = 'Неверный API токен';
      break;
    case 403:
      message = 'Доступ запрещен. Проверьте подписку';
      break;
    case 429:
      message = 'Превышен лимит запросов';
      break;
    case 500:
      message = 'Ошибка сервера. Попробуйте позже';
      break;
    default:
      message = error.message || 'Неизвестная ошибка';
  }
  
  this.showNotification(message, 'error');
}
```

## 🚀 Тестирование интеграции

1. Получите API токен от base44.com
2. Введите токен в настройках расширения
3. Протестируйте каждую функцию на тестовой странице
4. Проверьте работу в реальных почтовых клиентах

## 📈 Мониторинг использования

Добавьте отслеживание использования API:

```javascript
async function trackApiUsage(action, success) {
  const usage = await chrome.storage.local.get(['apiUsage']) || {};
  const today = new Date().toISOString().split('T')[0];
  
  if (!usage[today]) {
    usage[today] = {};
  }
  
  if (!usage[today][action]) {
    usage[today][action] = { success: 0, error: 0 };
  }
  
  usage[today][action][success ? 'success' : 'error']++;
  
  await chrome.storage.local.set({ apiUsage: usage });
}
```

---

После интеграции с API все функции Email Enhancer будут полностью работоспособны и готовы к использованию в продакшене.
