// Email Enhancer Translations System

class TranslationManager {
  constructor() {
    this.currentLanguage = 'ru';
    this.translations = {
      ru: {
        // Основные элементы интерфейса
        settings_title: 'Настройки Email Enhancer',
        settings_description: 'Настройте расширение под свои потребности',
        
        // Подписка
        subscription_info: 'Информация о подписке',
        upgrade_subscription: 'Обновить подписку',
        subscription_active: 'Активна',
        subscription_expired: 'Истекла',
        subscription_expiring: 'Истекает',
        trial_period: 'Пробный период',
        premium_plan: 'Премиум план',
        days_left: 'дней осталось',
        
        // Языковые настройки
        language_settings: 'Языковые настройки',
        interface_language: 'Язык интерфейса',
        interface_language_desc: 'Выберите язык для отображения интерфейса расширения',
        default_text_language: 'Язык текста по умолчанию',
        default_text_language_desc: 'Язык, который будет использоваться для обработки текста по умолчанию',
        
        // Настройки функций
        function_settings: 'Настройки функций',
        default_improvement_style: 'Стиль улучшения по умолчанию',
        default_improvement_style_desc: 'Стиль, который будет применяться при улучшении текста по умолчанию',
        auto_fix_enabled: 'Автоматическое исправление',
        auto_fix_enabled_desc: 'Автоматически исправлять очевидные ошибки при вводе текста',
        voice_shortcuts_enabled: 'Голосовые команды',
        voice_shortcuts_enabled_desc: 'Включить голосовые команды для быстрого доступа к функциям',
        
        // Стили
        style_friendly: 'Дружелюбный',
        style_official: 'Официальный',
        style_brief: 'Краткий',
        style_persuasive: 'Убеждающий',
        style_technical: 'Технический',
        
        // Уведомления
        notification_settings: 'Настройки уведомлений',
        show_success_notifications: 'Уведомления об успехе',
        show_success_notifications_desc: 'Показывать уведомления при успешном выполнении операций',
        show_error_notifications: 'Уведомления об ошибках',
        show_error_notifications_desc: 'Показывать уведомления при возникновении ошибок',
        
        // Дополнительные настройки
        advanced_settings: 'Дополнительные настройки',
        debug_mode: 'Режим отладки',
        debug_mode_desc: 'Включить подробное логирование для диагностики проблем',
        data_collection: 'Сбор данных для улучшения',
        data_collection_desc: 'Разрешить анонимный сбор данных для улучшения качества сервиса',
        
        // Кнопки
        save_settings: 'Сохранить настройки',
        reset_settings: 'Сбросить к умолчанию',
        export_settings: 'Экспорт настроек',
        import_settings: 'Импорт настроек',
        
        // О расширении
        about_extension: 'О расширении',
        version: 'Версия',
        developer: 'Разработчик',
        support: 'Поддержка',
        
        // Функции тулбара
        voice_record: 'Запись голоса',
        fix_text: 'Исправить текст',
        improve_text: 'Улучшить текст',
        settings: 'Настройки',
        select_language: 'Выберите язык',
        
        // Статусы
        recording: 'Запись...',
        processing: 'Обработка...',
        text_fixed: 'Текст исправлен',
        text_improved: 'Текст улучшен',
        settings_saved: 'Настройки сохранены',
        settings_reset: 'Настройки сброшены',
        
        // Ошибки
        microphone_error: 'Ошибка доступа к микрофону',
        api_error: 'Ошибка API',
        no_text_selected: 'Нет текста для обработки',
        subscription_expired_error: 'Подписка истекла'
      },
      
      en: {
        // Main interface elements
        settings_title: 'Email Enhancer Settings',
        settings_description: 'Configure the extension to your needs',
        
        // Subscription
        subscription_info: 'Subscription Information',
        upgrade_subscription: 'Upgrade Subscription',
        subscription_active: 'Active',
        subscription_expired: 'Expired',
        subscription_expiring: 'Expiring',
        trial_period: 'Trial Period',
        premium_plan: 'Premium Plan',
        days_left: 'days left',
        
        // Language settings
        language_settings: 'Language Settings',
        interface_language: 'Interface Language',
        interface_language_desc: 'Choose the language for the extension interface',
        default_text_language: 'Default Text Language',
        default_text_language_desc: 'Language to be used for text processing by default',
        
        // Function settings
        function_settings: 'Function Settings',
        default_improvement_style: 'Default Improvement Style',
        default_improvement_style_desc: 'Style to be applied when improving text by default',
        auto_fix_enabled: 'Auto Fix',
        auto_fix_enabled_desc: 'Automatically fix obvious errors while typing',
        voice_shortcuts_enabled: 'Voice Commands',
        voice_shortcuts_enabled_desc: 'Enable voice commands for quick access to functions',
        
        // Styles
        style_friendly: 'Friendly',
        style_official: 'Official',
        style_brief: 'Brief',
        style_persuasive: 'Persuasive',
        style_technical: 'Technical',
        
        // Notifications
        notification_settings: 'Notification Settings',
        show_success_notifications: 'Success Notifications',
        show_success_notifications_desc: 'Show notifications when operations complete successfully',
        show_error_notifications: 'Error Notifications',
        show_error_notifications_desc: 'Show notifications when errors occur',
        
        // Advanced settings
        advanced_settings: 'Advanced Settings',
        debug_mode: 'Debug Mode',
        debug_mode_desc: 'Enable detailed logging for troubleshooting',
        data_collection: 'Data Collection for Improvement',
        data_collection_desc: 'Allow anonymous data collection to improve service quality',
        
        // Buttons
        save_settings: 'Save Settings',
        reset_settings: 'Reset to Default',
        export_settings: 'Export Settings',
        import_settings: 'Import Settings',
        
        // About extension
        about_extension: 'About Extension',
        version: 'Version',
        developer: 'Developer',
        support: 'Support',
        
        // Toolbar functions
        voice_record: 'Voice Record',
        fix_text: 'Fix Text',
        improve_text: 'Improve Text',
        settings: 'Settings',
        select_language: 'Select Language',
        
        // Statuses
        recording: 'Recording...',
        processing: 'Processing...',
        text_fixed: 'Text Fixed',
        text_improved: 'Text Improved',
        settings_saved: 'Settings Saved',
        settings_reset: 'Settings Reset',
        
        // Errors
        microphone_error: 'Microphone Access Error',
        api_error: 'API Error',
        no_text_selected: 'No Text to Process',
        subscription_expired_error: 'Subscription Expired'
      },
      
      es: {
        // Elementos principales de la interfaz
        settings_title: 'Configuración de Email Enhancer',
        settings_description: 'Configure la extensión según sus necesidades',
        
        // Suscripción
        subscription_info: 'Información de Suscripción',
        upgrade_subscription: 'Actualizar Suscripción',
        subscription_active: 'Activa',
        subscription_expired: 'Expirada',
        subscription_expiring: 'Expirando',
        trial_period: 'Período de Prueba',
        premium_plan: 'Plan Premium',
        days_left: 'días restantes',
        
        // Configuración de idioma
        language_settings: 'Configuración de Idioma',
        interface_language: 'Idioma de la Interfaz',
        interface_language_desc: 'Elija el idioma para la interfaz de la extensión',
        default_text_language: 'Idioma de Texto Predeterminado',
        default_text_language_desc: 'Idioma que se utilizará para el procesamiento de texto por defecto',
        
        // Configuración de funciones
        function_settings: 'Configuración de Funciones',
        default_improvement_style: 'Estilo de Mejora Predeterminado',
        default_improvement_style_desc: 'Estilo que se aplicará al mejorar texto por defecto',
        auto_fix_enabled: 'Corrección Automática',
        auto_fix_enabled_desc: 'Corregir automáticamente errores obvios al escribir',
        voice_shortcuts_enabled: 'Comandos de Voz',
        voice_shortcuts_enabled_desc: 'Habilitar comandos de voz para acceso rápido a funciones',
        
        // Estilos
        style_friendly: 'Amigable',
        style_official: 'Oficial',
        style_brief: 'Breve',
        style_persuasive: 'Persuasivo',
        style_technical: 'Técnico',
        
        // Notificaciones
        notification_settings: 'Configuración de Notificaciones',
        show_success_notifications: 'Notificaciones de Éxito',
        show_success_notifications_desc: 'Mostrar notificaciones cuando las operaciones se completen exitosamente',
        show_error_notifications: 'Notificaciones de Error',
        show_error_notifications_desc: 'Mostrar notificaciones cuando ocurran errores',
        
        // Configuración avanzada
        advanced_settings: 'Configuración Avanzada',
        debug_mode: 'Modo de Depuración',
        debug_mode_desc: 'Habilitar registro detallado para solución de problemas',
        data_collection: 'Recopilación de Datos para Mejora',
        data_collection_desc: 'Permitir recopilación anónima de datos para mejorar la calidad del servicio',
        
        // Botones
        save_settings: 'Guardar Configuración',
        reset_settings: 'Restablecer por Defecto',
        export_settings: 'Exportar Configuración',
        import_settings: 'Importar Configuración',
        
        // Acerca de la extensión
        about_extension: 'Acerca de la Extensión',
        version: 'Versión',
        developer: 'Desarrollador',
        support: 'Soporte',
        
        // Funciones de la barra de herramientas
        voice_record: 'Grabación de Voz',
        fix_text: 'Corregir Texto',
        improve_text: 'Mejorar Texto',
        settings: 'Configuración',
        select_language: 'Seleccionar Idioma',
        
        // Estados
        recording: 'Grabando...',
        processing: 'Procesando...',
        text_fixed: 'Texto Corregido',
        text_improved: 'Texto Mejorado',
        settings_saved: 'Configuración Guardada',
        settings_reset: 'Configuración Restablecida',
        
        // Errores
        microphone_error: 'Error de Acceso al Micrófono',
        api_error: 'Error de API',
        no_text_selected: 'No Hay Texto para Procesar',
        subscription_expired_error: 'Suscripción Expirada'
      },
      
      pt: {
        // Elementos principais da interface
        settings_title: 'Configurações do Email Enhancer',
        settings_description: 'Configure a extensão de acordo com suas necessidades',
        
        // Assinatura
        subscription_info: 'Informações da Assinatura',
        upgrade_subscription: 'Atualizar Assinatura',
        subscription_active: 'Ativa',
        subscription_expired: 'Expirada',
        subscription_expiring: 'Expirando',
        trial_period: 'Período de Teste',
        premium_plan: 'Plano Premium',
        days_left: 'dias restantes',
        
        // Configurações de idioma
        language_settings: 'Configurações de Idioma',
        interface_language: 'Idioma da Interface',
        interface_language_desc: 'Escolha o idioma para a interface da extensão',
        default_text_language: 'Idioma de Texto Padrão',
        default_text_language_desc: 'Idioma que será usado para processamento de texto por padrão',
        
        // Configurações de função
        function_settings: 'Configurações de Função',
        default_improvement_style: 'Estilo de Melhoria Padrão',
        default_improvement_style_desc: 'Estilo que será aplicado ao melhorar texto por padrão',
        auto_fix_enabled: 'Correção Automática',
        auto_fix_enabled_desc: 'Corrigir automaticamente erros óbvios ao digitar',
        voice_shortcuts_enabled: 'Comandos de Voz',
        voice_shortcuts_enabled_desc: 'Habilitar comandos de voz para acesso rápido às funções',
        
        // Estilos
        style_friendly: 'Amigável',
        style_official: 'Oficial',
        style_brief: 'Breve',
        style_persuasive: 'Persuasivo',
        style_technical: 'Técnico',
        
        // Notificações
        notification_settings: 'Configurações de Notificação',
        show_success_notifications: 'Notificações de Sucesso',
        show_success_notifications_desc: 'Mostrar notificações quando operações forem concluídas com sucesso',
        show_error_notifications: 'Notificações de Erro',
        show_error_notifications_desc: 'Mostrar notificações quando ocorrerem erros',
        
        // Configurações avançadas
        advanced_settings: 'Configurações Avançadas',
        debug_mode: 'Modo de Depuração',
        debug_mode_desc: 'Habilitar registro detalhado para solução de problemas',
        data_collection: 'Coleta de Dados para Melhoria',
        data_collection_desc: 'Permitir coleta anônima de dados para melhorar a qualidade do serviço',
        
        // Botões
        save_settings: 'Salvar Configurações',
        reset_settings: 'Redefinir para Padrão',
        export_settings: 'Exportar Configurações',
        import_settings: 'Importar Configurações',
        
        // Sobre a extensão
        about_extension: 'Sobre a Extensão',
        version: 'Versão',
        developer: 'Desenvolvedor',
        support: 'Suporte',
        
        // Funções da barra de ferramentas
        voice_record: 'Gravação de Voz',
        fix_text: 'Corrigir Texto',
        improve_text: 'Melhorar Texto',
        settings: 'Configurações',
        select_language: 'Selecionar Idioma',
        
        // Status
        recording: 'Gravando...',
        processing: 'Processando...',
        text_fixed: 'Texto Corrigido',
        text_improved: 'Texto Melhorado',
        settings_saved: 'Configurações Salvas',
        settings_reset: 'Configurações Redefinidas',
        
        // Erros
        microphone_error: 'Erro de Acesso ao Microfone',
        api_error: 'Erro de API',
        no_text_selected: 'Nenhum Texto para Processar',
        subscription_expired_error: 'Assinatura Expirada'
      },
      
      ar: {
        // عناصر الواجهة الرئيسية
        settings_title: 'إعدادات محسن البريد الإلكتروني',
        settings_description: 'قم بتكوين الإضافة حسب احتياجاتك',
        
        // الاشتراك
        subscription_info: 'معلومات الاشتراك',
        upgrade_subscription: 'ترقية الاشتراك',
        subscription_active: 'نشط',
        subscription_expired: 'منتهي الصلاحية',
        subscription_expiring: 'ينتهي قريباً',
        trial_period: 'فترة تجريبية',
        premium_plan: 'خطة مميزة',
        days_left: 'أيام متبقية',
        
        // إعدادات اللغة
        language_settings: 'إعدادات اللغة',
        interface_language: 'لغة الواجهة',
        interface_language_desc: 'اختر لغة واجهة الإضافة',
        default_text_language: 'لغة النص الافتراضية',
        default_text_language_desc: 'اللغة التي ستستخدم لمعالجة النص افتراضياً',
        
        // إعدادات الوظائف
        function_settings: 'إعدادات الوظائف',
        default_improvement_style: 'نمط التحسين الافتراضي',
        default_improvement_style_desc: 'النمط الذي سيطبق عند تحسين النص افتراضياً',
        auto_fix_enabled: 'التصحيح التلقائي',
        auto_fix_enabled_desc: 'تصحيح الأخطاء الواضحة تلقائياً أثناء الكتابة',
        voice_shortcuts_enabled: 'الأوامر الصوتية',
        voice_shortcuts_enabled_desc: 'تفعيل الأوامر الصوتية للوصول السريع للوظائف',
        
        // الأنماط
        style_friendly: 'ودود',
        style_official: 'رسمي',
        style_brief: 'مختصر',
        style_persuasive: 'مقنع',
        style_technical: 'تقني',
        
        // الإشعارات
        notification_settings: 'إعدادات الإشعارات',
        show_success_notifications: 'إشعارات النجاح',
        show_success_notifications_desc: 'إظهار إشعارات عند إتمام العمليات بنجاح',
        show_error_notifications: 'إشعارات الأخطاء',
        show_error_notifications_desc: 'إظهار إشعارات عند حدوث أخطاء',
        
        // الإعدادات المتقدمة
        advanced_settings: 'الإعدادات المتقدمة',
        debug_mode: 'وضع التشخيص',
        debug_mode_desc: 'تفعيل التسجيل المفصل لحل المشاكل',
        data_collection: 'جمع البيانات للتحسين',
        data_collection_desc: 'السماح بجمع البيانات المجهولة لتحسين جودة الخدمة',
        
        // الأزرار
        save_settings: 'حفظ الإعدادات',
        reset_settings: 'إعادة تعيين للافتراضي',
        export_settings: 'تصدير الإعدادات',
        import_settings: 'استيراد الإعدادات',
        
        // حول الإضافة
        about_extension: 'حول الإضافة',
        version: 'الإصدار',
        developer: 'المطور',
        support: 'الدعم',
        
        // وظائف شريط الأدوات
        voice_record: 'تسجيل صوتي',
        fix_text: 'تصحيح النص',
        improve_text: 'تحسين النص',
        settings: 'الإعدادات',
        select_language: 'اختر اللغة',
        
        // الحالات
        recording: 'جاري التسجيل...',
        processing: 'جاري المعالجة...',
        text_fixed: 'تم تصحيح النص',
        text_improved: 'تم تحسين النص',
        settings_saved: 'تم حفظ الإعدادات',
        settings_reset: 'تم إعادة تعيين الإعدادات',
        
        // الأخطاء
        microphone_error: 'خطأ في الوصول للميكروفون',
        api_error: 'خطأ في واجهة البرمجة',
        no_text_selected: 'لا يوجد نص للمعالجة',
        subscription_expired_error: 'انتهت صلاحية الاشتراك'
      },
      
      fr: {
        // Éléments principaux de l'interface
        settings_title: 'Paramètres d\'Email Enhancer',
        settings_description: 'Configurez l\'extension selon vos besoins',
        
        // Abonnement
        subscription_info: 'Informations d\'Abonnement',
        upgrade_subscription: 'Mettre à Niveau l\'Abonnement',
        subscription_active: 'Actif',
        subscription_expired: 'Expiré',
        subscription_expiring: 'Expire Bientôt',
        trial_period: 'Période d\'Essai',
        premium_plan: 'Plan Premium',
        days_left: 'jours restants',
        
        // Paramètres de langue
        language_settings: 'Paramètres de Langue',
        interface_language: 'Langue de l\'Interface',
        interface_language_desc: 'Choisissez la langue pour l\'interface de l\'extension',
        default_text_language: 'Langue de Texte par Défaut',
        default_text_language_desc: 'Langue qui sera utilisée pour le traitement de texte par défaut',
        
        // Paramètres de fonction
        function_settings: 'Paramètres de Fonction',
        default_improvement_style: 'Style d\'Amélioration par Défaut',
        default_improvement_style_desc: 'Style qui sera appliqué lors de l\'amélioration de texte par défaut',
        auto_fix_enabled: 'Correction Automatique',
        auto_fix_enabled_desc: 'Corriger automatiquement les erreurs évidentes lors de la saisie',
        voice_shortcuts_enabled: 'Commandes Vocales',
        voice_shortcuts_enabled_desc: 'Activer les commandes vocales pour un accès rapide aux fonctions',
        
        // Styles
        style_friendly: 'Amical',
        style_official: 'Officiel',
        style_brief: 'Bref',
        style_persuasive: 'Persuasif',
        style_technical: 'Technique',
        
        // Notifications
        notification_settings: 'Paramètres de Notification',
        show_success_notifications: 'Notifications de Succès',
        show_success_notifications_desc: 'Afficher les notifications lorsque les opérations se terminent avec succès',
        show_error_notifications: 'Notifications d\'Erreur',
        show_error_notifications_desc: 'Afficher les notifications lorsque des erreurs se produisent',
        
        // Paramètres avancés
        advanced_settings: 'Paramètres Avancés',
        debug_mode: 'Mode de Débogage',
        debug_mode_desc: 'Activer la journalisation détaillée pour le dépannage',
        data_collection: 'Collecte de Données pour Amélioration',
        data_collection_desc: 'Permettre la collecte anonyme de données pour améliorer la qualité du service',
        
        // Boutons
        save_settings: 'Enregistrer les Paramètres',
        reset_settings: 'Réinitialiser par Défaut',
        export_settings: 'Exporter les Paramètres',
        import_settings: 'Importer les Paramètres',
        
        // À propos de l'extension
        about_extension: 'À Propos de l\'Extension',
        version: 'Version',
        developer: 'Développeur',
        support: 'Support',
        
        // Fonctions de la barre d'outils
        voice_record: 'Enregistrement Vocal',
        fix_text: 'Corriger le Texte',
        improve_text: 'Améliorer le Texte',
        settings: 'Paramètres',
        select_language: 'Sélectionner la Langue',
        
        // États
        recording: 'Enregistrement...',
        processing: 'Traitement...',
        text_fixed: 'Texte Corrigé',
        text_improved: 'Texte Amélioré',
        settings_saved: 'Paramètres Enregistrés',
        settings_reset: 'Paramètres Réinitialisés',
        
        // Erreurs
        microphone_error: 'Erreur d\'Accès au Microphone',
        api_error: 'Erreur API',
        no_text_selected: 'Aucun Texte à Traiter',
        subscription_expired_error: 'Abonnement Expiré'
      }
    };
    
    this.init();
  }

  async init() {
    // Загружаем сохраненный язык интерфейса
    const stored = await chrome.storage.local.get(['interfaceLanguage']);
    this.currentLanguage = stored.interfaceLanguage || this.detectBrowserLanguage();
    
    // Применяем переводы
    this.applyTranslations();
  }

  detectBrowserLanguage() {
    const browserLang = navigator.language.split('-')[0];
    return this.translations[browserLang] ? browserLang : 'en';
  }

  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      this.applyTranslations();
      
      // Сохраняем выбранный язык
      chrome.storage.local.set({ interfaceLanguage: language });
    }
  }

  translate(key, defaultText = '') {
    const translation = this.translations[this.currentLanguage];
    return translation && translation[key] ? translation[key] : (defaultText || key);
  }

  applyTranslations() {
    // Применяем переводы ко всем элементам с атрибутом data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.translate(key);
      
      if (element.tagName === 'INPUT' && element.type === 'text') {
        element.placeholder = translation;
      } else if (element.tagName === 'OPTION') {
        element.textContent = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Обновляем направление текста для арабского языка
    if (this.currentLanguage === 'ar') {
      document.body.dir = 'rtl';
      document.body.style.fontFamily = 'Tahoma, Arial, sans-serif';
    } else {
      document.body.dir = 'ltr';
      document.body.style.fontFamily = '';
    }
  }

  // Метод для получения всех доступных языков
  getAvailableLanguages() {
    return Object.keys(this.translations).map(code => ({
      code,
      name: this.getLanguageName(code),
      flag: this.getLanguageFlag(code)
    }));
  }

  getLanguageName(code) {
    const names = {
      ru: 'Русский',
      en: 'English',
      es: 'Español',
      pt: 'Português',
      ar: 'العربية',
      fr: 'Français'
    };
    return names[code] || code;
  }

  getLanguageFlag(code) {
    const flags = {
      ru: '🇷🇺',
      en: '🇺🇸',
      es: '🇪🇸',
      pt: '🇵🇹',
      ar: '🇸🇦',
      fr: '🇫🇷'
    };
    return flags[code] || '🌐';
  }
}

// Создаем глобальный экземпляр менеджера переводов
window.translationManager = new TranslationManager();
