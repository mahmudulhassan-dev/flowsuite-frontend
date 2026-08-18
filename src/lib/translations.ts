export type TranslationKey =
  | 'announcement'
  | 'explore_panel'
  | 'hero_badge'
  | 'hero_title'
  | 'hero_desc'
  | 'get_started'
  | 'view_demo'
  | 'products_menu'
  | 'ai_suite_menu'
  | 'affiliate_menu'
  | 'terms_menu'
  | 'privacy_menu'
  | 'launch_app'
  | 'dashboard'
  | 'social_publisher'
  | 'unified_inbox'
  | 'ai_agent_studio'
  | 'asset_manager'
  | 'marketing_suite'
  | 'crm_contacts'
  | 'billing_wallet'
  | 'platform_settings'
  | 'active_workspaces'
  | 'uptime_sla'
  | 'ai_tokens'
  | 'social_channels'
  | 'about'
  | 'contact'
  | 'careers'
  | 'press'
  | 'status'
  | 'changelog'
  | 'download'
  | 'download_desc'
  | 'download_windows'
  | 'download_macos'
  | 'download_android'
  | 'download_ios'
  | 'anti_spam'
  | 'refund_policy'
  | 'cookie_policy'
  | 'gdpr_compliance'
  | 'ccpa_compliance'
  | 'security_policy'
  | 'dpa'
  | 'sla'
  | 'acceptable_use'
  | 'features_section_title'
  | 'features_section_desc'
  | 'copyright';

export const translations: Record<TranslationKey, Record<string, string>> = {
  announcement: {
    en: "FlowSuite 2.0 Released — 99.99% Uptime Guarantee, Meta Official API & Local bKash/Nagad Billing!",
    bn: "ফ্লোসুইট ২.০ রিলিজ হয়েছে — ৯৯.৯৯% আপটাইম গ্যারান্টি, মেটা অফিসিয়াল এপিআই এবং বিকাশ/নগদ পেমেন্ট!",
    ar: "إطلاق FlowSuite 2.0 - ضمان جهوزية بنسبة 99.99٪ ، وواجهة برمجة تطبيقات Meta الرسمية وفوترة bKash / Nagad المحلية!",
    ur: "FlowSuite 2.0 ریلیز ہو گیا — 99.99% اپ ٹائم گارنٹی، میٹا آفیشل API اور لوکل bKash/Nagad بلنگ!",
    hi: "FlowSuite 2.0 रिलीज़ हुआ — 99.99% अपटाइम गारंटी, मेटा आधिकारिक API और स्थानीय bKash/Nagad बिलिंग!",
    es: "¡Lanzamiento de FlowSuite 2.0: garantía de tiempo de actividad del 99.99 %, API oficial de Meta y facturación local de bKash/Nagad!",
    fr: "Sortie de FlowSuite 2.0 — Garantie de disponibilité de 99,99 %, API officielle Meta et facturation locale bKash/Nagad !",
    de: "FlowSuite 2.0 veröffentlicht – 99,99 % Uptime-Garantie, offizielle Meta-API & lokale bKash/Nagad-Abrechnung!",
    zh: "FlowSuite 2.0 发布 — 99.99% 在线时间保证、Meta 官方 API 和本地 bKash/Nagad 计费！",
    ja: "FlowSuite 2.0 リリース — 99.99% の稼働率保証、Meta 公式 API、およびローカル bKash/Nagad 決済！"
  },
  explore_panel: {
    en: "Explore User Panel",
    bn: "ইউজার প্যানেল ঘুরে দেখুন",
    ar: "استكشف لوحة المستخدم",
    ur: "صارف پینل دریافت کریں۔",
    hi: "उपयोगकर्ता पैनल का अन्वेषण करें",
    es: "Explorar el panel de usuario",
    fr: "Explorer le panneau utilisateur",
    de: "Benutzer-Panel erkunden",
    zh: "探索用户控制面板",
    ja: "ユーザーパネルを探索する"
  },
  hero_badge: {
    en: "Next-Gen Enterprise AI Social & CRM Platform",
    bn: "পরবর্তী প্রজন্মের এআই সোশ্যাল ও সিআরএম প্ল্যাটফর্ম",
    ar: "جيل جديد من منصة التواصل الاجتماعي و CRM بالذكاء الاصطناعي للمؤسسات",
    ur: "اگلی نسل کا انٹرپرائز AI سوشل اور CRM پلیٹ فارم",
    hi: "अगली पीढ़ी का एंटरप्राइज एआई सोशल और सीआरएम प्लेटफॉर्म",
    es: "Plataforma de CRM y redes sociales con IA empresarial de próxima generación",
    fr: "Plateforme CRM et réseaux sociaux IA d'entreprise de nouvelle génération",
    de: "Enterprise-KI-Social- & CRM-Plattform der nächsten Generation",
    zh: "下一代企业级 AI 社交与 CRM 平台",
    ja: "次世代エンタープライズ向け AI ソーシャル＆CRM プラットフォーム"
  },
  hero_title: {
    en: "Automate Social Media, AI Agents & Omnichannel Unified Live Chat",
    bn: "সোশ্যাল মিডিয়া, এআই এজেন্ট এবং অমনিচ্যানেল লাইভ চ্যাট অটোমেট করুন",
    ar: "أتمتة وسائل التواصل الاجتماعي ووكلاء الذكاء الاصطناعي والدردشة الحية الموحدة لجميع القنوات",
    ur: "سوشل میڈیا، AI ایجنٹس اور اومنی چینل یونیفائیڈ لائیو چیٹ کو خودکار بنائیں",
    hi: "सोशल मीडिया, एआई एजेंट और ओम्नीचैनल एकीकृत लाइव चैट को स्वचालित करें",
    es: "Automatice las redes sociales, los agentes de IA y el chat en vivo unificado omnicanal",
    fr: "Automatisez les réseaux sociaux, les agents d'IA et le chat en direct unifié omnicanal",
    de: "Automatisieren Sie soziale Medien, KI-Agenten und Omnichannel-Unified-Live-Chat",
    zh: "自动化社交媒体、AI 代理和全渠道统一实时聊天",
    ja: "ソーシャルメディア、AI エージェント、全チャネル統一ライブチャットを自動化"
  },
  hero_desc: {
    en: "FlowSuite empowers agencies and growing enterprises to schedule multi-platform social posts, engage leads across WhatsApp & Facebook Messenger, and deploy embeddable AI Live Chat widgets to any website.",
    bn: "ফ্লোসুইট এজেন্সি এবং ক্রমবর্ধমান ব্যবসাগুলোকে একাধিক প্ল্যাটফর্মে সোশ্যাল পোস্ট শিডিউল করতে, হোয়াটসঅ্যাপ এবং ফেসবুক মেসেঞ্জারে লিড যুক্ত করতে এবং যেকোনো ওয়েবসাইটে এআই লাইভ চ্যাট উইজেট যুক্ত করতে সাহায্য করে।",
    ar: "تمكن FlowSuite الوكالات والمؤسسات المتنامية من جدولة منشورات اجتماعية متعددة المنصات ، وإشراك العملاء المحتملين عبر WhatsApp و Facebook Messenger ، ونشر أدوات دردشة حية مدعومة بالذكاء الاصطناعي قابلة للتضمين في أي موقع ويب.",
    ur: "FlowSuite ایجنسیوں اور بڑھتے ہوئے اداروں کو متعدد پلیٹ فارمز پر سوشل پوسٹس شیڈول کرنے، واٹس ایپ اور فیس بک میسنجر پر لیڈز کو شامل کرنے، اور کسی بھی ویب سائٹ پر ایمبیڈ ایبل AI لائیو چیٹ ویجٹ لگانے کی طاقت دیتا ہے۔",
    hi: "FlowSuite एजेंसियों और बढ़ते उद्यमों को बहु-प्लेटफ़ॉर्म सोशल पोस्ट शेड्यूल करने, व्हाट्सएप और फेसबुक मैसेंजर पर लीड संलग्न करने और किसी भी वेबसाइट पर एम्बेड करने योग्य एआई लाइव चैट विजेट तैनात करने का अधिकार देता है।",
    es: "FlowSuite permite a las agencias y empresas en crecimiento programar publicaciones sociales multiplataforma, captar clientes potenciales a través de WhatsApp y Facebook Messenger e implementar widgets de chat en vivo con IA integrables en cualquier sitio web.",
    fr: "FlowSuite permet aux agences und aux entreprises en croissance de planifier des publications sociales multiplateformes, d'engager des prospects via WhatsApp et Facebook Messenger et de déployer des widgets de chat en direct IA intégrables sur n'importe quel site Web.",
    de: "FlowSuite ermöglicht es Agenturen und wachsenden Unternehmen, plattformübergreifende Social-Media-Beiträge zu planen, Leads über WhatsApp und Facebook Messenger zu gewinnen und einbettbare KI-Live-Chat-Widgets auf jeder Website bereitzustellen.",
    zh: "FlowSuite 赋能代理机构和成长型企业规划多平台社交发帖，在 WhatsApp 和 Facebook Messenger 上互动潜在客户，并将可嵌入的 AI 实时聊天挂件部署到任何网站。",
    ja: "FlowSuite は、代理店や成長企業が複数プラットフォームへのソーシャル投稿をスケジュールし、WhatsApp や Facebook Messenger でリードを獲得し、あらゆるウェブサイトに埋め込み可能な AI ライブチャットウィジェットを導入できるようにします。"
  },
  get_started: {
    en: "Get Started Free",
    bn: "বিনামূল্যে শুরু করুন",
    ar: "ابدأ مجانًا",
    ur: "مفت میں شروع کریں۔",
    hi: "मुफ़्त में शुरू करें",
    es: "Comenzar gratis",
    fr: "Commencer gratuitement",
    de: "Kostenlos starten",
    zh: "免费开始使用",
    ja: "無料で始める"
  },
  view_demo: {
    en: "View Live Chat Demo",
    bn: "লাইভ চ্যাট ডেমো দেখুন",
    ar: "شاهد عرض الدردشة الحية",
    ur: "لائیو چیٹ ڈیمو دیکھیں",
    hi: "लाइव चैट डेमो देखें",
    es: "Ver demo de chat en vivo",
    fr: "Voir la démo du chat en direct",
    de: "Live-Chat-Demo ansehen",
    zh: "查看实时聊天演示",
    ja: "ライブチャットのデモを見る"
  },
  products_menu: {
    en: "Products & Tools",
    bn: "প্রোডাক্ট ও টুলস",
    ar: "المنتجات والأدوات",
    ur: "مصنوعات اور ٹولز",
    hi: "उत्पाद और उपकरण",
    es: "Productos y herramientas",
    fr: "Produits & Outils",
    de: "Produkte & Tools",
    zh: "产品与工具",
    ja: "製品とツール"
  },
  ai_suite_menu: {
    en: "AI Suite",
    bn: "এআই সুইট",
    ar: "حزمة الذكاء الاصطناعي",
    ur: "AI سوٹ",
    hi: "एआई सुइट",
    es: "Suite de IA",
    fr: "Suite d'IA",
    de: "KI-Suite",
    zh: "AI 套件",
    ja: "AI スイート"
  },
  affiliate_menu: {
    en: "Affiliates (30% MRR)",
    bn: "অ্যাফিলিয়েট (৩০% এমআরআর)",
    ar: "التسويق بالعمولة (30٪ MRR)",
    ur: "ملحق (30% MRR)",
    hi: "संबद्ध (30% एमआरआर)",
    es: "Afiliados (30% MRR)",
    fr: "Affiliation (30 % MRR)",
    de: "Affiliates (30 % MRR)",
    zh: "联盟营销 (30% MRR)",
    ja: "アフィリエイト (30% MRR)"
  },
  terms_menu: {
    en: "Terms & SLA",
    bn: "টার্মস ও এসএলএ",
    ar: "الشروط واتفاقية مستوى الخدمة",
    ur: "شرائط اور SLA",
    hi: "नियम और एसएलए",
    es: "Términos y SLA",
    fr: "Conditions & SLA",
    de: "Nutzungsbedingungen & SLA",
    zh: "条款与服务等级协议",
    ja: "規約と SLA"
  },
  privacy_menu: {
    en: "Privacy & GDPR",
    bn: "প্রাইভেসি ও জিডিপিআর",
    ar: "الخصوصية و GDPR",
    ur: "رازداری اور GDPR",
    hi: "गोपनीयता और जीडीपीआर",
    es: "Privacidad y GDPR",
    fr: "Confidentialité & RGPD",
    de: "Datenschutz & DSGVO",
    zh: "隐私与 GDPR",
    ja: "プライバシーと GDPR"
  },
  launch_app: {
    en: "Launch App Panel",
    bn: "অ্যাপ প্যানেল চালু করুন",
    ar: "تشغيل لوحة التطبيق",
    ur: "ایپ پینل لانچ کریں۔",
    hi: "ऐप पैनल लॉन्च करें",
    es: "Iniciar panel de aplicación",
    fr: "Lancer le panneau d'application",
    de: "App-Panel starten",
    zh: "打开应用控制台",
    ja: "アプリパネルを起動"
  },
  dashboard: {
    en: "Dashboard",
    bn: "ড্যাশবোর্ড",
    ar: "لوحة القيادة",
    ur: "ڈیش بورڈ",
    hi: "डैशबोर्ड",
    es: "Tablero",
    fr: "Tableau de bord",
    de: "Dashboard",
    zh: "仪表板",
    ja: "ダッシュボード"
  },
  social_publisher: {
    en: "Social Publisher",
    bn: "সোশ্যাল পাবলিশার",
    ar: "الناشر الاجتماعي",
    ur: "سوشل پبلشر",
    hi: "सोशल पब्लिशर",
    es: "Publicador social",
    fr: "Publication sociale",
    de: "Social Publisher",
    zh: "社交发布器",
    ja: "ソーシャルパブリッシャー"
  },
  unified_inbox: {
    en: "Unified Inbox",
    bn: "ইউনিফাইড ইনবক্স",
    ar: "البريد الوارد الموحد",
    ur: "یونیفائیڈ ان باکس",
    hi: "एकीकृत इनबॉक्स",
    es: "Bandeja de entrada unificada",
    fr: "Boîte de réception unifiée",
    de: "Unified Inbox",
    zh: "统一 inbox",
    ja: "統合インボックス"
  },
  ai_agent_studio: {
    en: "AI Agent Studio",
    bn: "এআই এজেন্ট স্টুডিও",
    ar: "استوديو وكيل الذكاء الاصطناعي",
    ur: "AI ایجنٹ اسٹوڈیو",
    hi: "एआई एजेंट स्टूडियो",
    es: "Estudio de agentes de IA",
    fr: "Studio d'agents IA",
    de: "KI-Agentenstudio",
    zh: "AI 代理工作室",
    ja: "AI エージェントスタジオ"
  },
  asset_manager: {
    en: "Asset Manager",
    bn: "অ্যাসেট ম্যানেজার",
    ar: "مدير الأصول",
    ur: "اثاثہ مینیجر",
    hi: "एसेट मैनेजर",
    es: "Gestor de activos",
    fr: "Gestionnaire d'actifs",
    de: "Asset-Manager",
    zh: "资源管理器",
    ja: "アセットマネージャー"
  },
  marketing_suite: {
    en: "Marketing Suite",
    bn: "মার্কেটিং সুইট",
    ar: "حزمة التسويق",
    ur: "مارکیٹنگ سوٹ",
    hi: "मार्केटिंग सुइट",
    es: "Suite de marketing",
    fr: "Suite marketing",
    de: "Marketing-Suite",
    zh: "营销套件",
    ja: "マーケティングスイート"
  },
  crm_contacts: {
    en: "CRM & Contacts",
    bn: "সিআরএম ও কন্টাক্টস",
    ar: "إدارة علاقات العملاء وجهات الاتصال",
    ur: "CRM اور رابطے",
    hi: "सीआरएम और संपर्क",
    es: "CRM y contactos",
    fr: "CRM & Contacts",
    de: "CRM & Kontakte",
    zh: "CRM 与联系人",
    ja: "CRM と連絡先"
  },
  billing_wallet: {
    en: "Billing & Wallet",
    bn: "বিলিং ও ওয়ালেট",
    ar: "الفوترة والمحفظة",
    ur: "بلنگ اور والیٹ",
    hi: "बिलिंग और वॉलेट",
    es: "Facturación y cartera",
    fr: "Facturation & Portefeuille",
    de: "Abrechnung & Brieftasche",
    zh: "计费与钱包",
    ja: "請求とウォレット"
  },
  platform_settings: {
    en: "Platform Settings",
    bn: "প্ল্যাটফর্ম সেটিংস",
    ar: "إعدادات المنصة",
    ur: "پلیٹ فارم کی ترتیبات",
    hi: "प्लेटफ़ॉर्म सेटिंग्स",
    es: "Configuración de la plataforma",
    fr: "Paramètres de la plateforme",
    de: "Plattform-Einstellungen",
    zh: "平台设置",
    ja: "プラットフォーム設定"
  },
  active_workspaces: {
    en: "Active Workspaces",
    bn: "সক্রিয় ওয়ার্কস্পেস",
    ar: "مساحات العمل النشطة",
    ur: "فعال ورک اسپیسز",
    hi: "सक्रिय कार्यस्थान",
    es: "Espacios de trabajo activos",
    fr: "Espaces de travail actifs",
    de: "Aktive Arbeitsbereiche",
    zh: "活跃工作区",
    ja: "アクティブなワークスペース"
  },
  uptime_sla: {
    en: "Uptime SLA",
    bn: "আপটাইম এসএলএ",
    ar: "اتفاقية مستوى الخدمة للتشغيل",
    ur: "اپ ٹائم SLA",
    hi: "अपटाइम एसएलए",
    es: "SLA de tiempo de actividad",
    fr: "SLA de disponibilité",
    de: "Uptime SLA",
    zh: "在线等级协议",
    ja: "稼働率 SLA"
  },
  ai_tokens: {
    en: "AI Tokens Processed",
    bn: "প্রসেসড এআই টোকেন",
    ar: "رموز الذكاء الاصطناعي المعالجة",
    ur: "پروسیس شدہ AI ٹوکنز",
    hi: "संसाधित एआई टोकन",
    es: "Tokens de IA procesados",
    fr: "Jetons IA traités",
    de: "Verarbeitete KI-Tokens",
    zh: "已处理 AI Token",
    ja: "処理された AI トークン"
  },
  social_channels: {
    en: "Social Channels",
    bn: "সোশ্যাল চ্যানেলসমূহ",
    ar: "القنوات الاجتماعية",
    ur: "سوشل چینلز",
    hi: "सोशल चैनल",
    es: "Canales sociales",
    fr: "Canaux sociaux",
    de: "Soziale Kanäle",
    zh: "社交渠道",
    ja: "ソーシャルチャネル"
  },
  about: {
    en: "About Us",
    bn: "আমাদের সম্পর্কে",
    ar: "معلومات عنا",
    ur: "ہمارے بارے میں",
    hi: "हमारे बारे में",
    es: "Sobre nosotros",
    fr: "À propos de nous",
    de: "Über uns",
    zh: "关于我们",
    ja: "会社概要"
  },
  contact: {
    en: "Contact Us",
    bn: "যোগাযোগ",
    ar: "اتصل بنا",
    ur: "ہم سے رابطہ کریں۔",
    hi: "संपर्क करें",
    es: "Contacto",
    fr: "Contactez-nous",
    de: "Kontakt",
    zh: "联系我们",
    ja: "お問い合わせ"
  },
  careers: {
    en: "Careers",
    bn: "ক্যারিয়ার",
    ar: "وظائف",
    ur: "ملازمتیں",
    hi: "कैरियर",
    es: "Empleo",
    fr: "Carrières",
    de: "Karriere",
    zh: "招贤纳士",
    ja: "採用情報"
  },
  press: {
    en: "Press Kit",
    bn: "প্রেস কিট",
    ar: "مجموعة الصحافة",
    ur: "پریس کٹ",
    hi: "प्रेस किट",
    es: "Kit de prensa",
    fr: "Dossier de presse",
    de: "Pressemappe",
    zh: "媒体资源包",
    ja: "プレスキット"
  },
  status: {
    en: "System Status",
    bn: "সিস্টেম স্ট্যাটাস",
    ar: "حالة النظام",
    ur: "سسٹم کی حیثیت",
    hi: "सिस्टम की स्थिति",
    es: "Estado del sistema",
    fr: "État du système",
    de: "Systemstatus",
    zh: "系统状态",
    ja: "システムステータス"
  },
  changelog: {
    en: "Changelog",
    bn: "চেঞ্জলগ",
    ar: "سجل التغييرات",
    ur: "تبدیلی کا لاگ",
    hi: "बदलावों का विवरण",
    es: "Historial de cambios",
    fr: "Journal des modifications",
    de: "Changelog",
    zh: "更新日志",
    ja: "変更履歴"
  },
  download: {
    en: "App Download",
    bn: "অ্যাপ ডাউনলোড",
    ar: "تحميل التطبيق",
    ur: "ایپ ڈاؤن لوڈ کریں۔",
    hi: "ऐप डाउनलोड",
    es: "Descargar aplicación",
    fr: "Télécharger l'application",
    de: "App-Download",
    zh: "软件下载",
    ja: "アプリダウンロード"
  },
  download_desc: {
    en: "Download the official FlowSuite application for desktop and mobile environments.",
    bn: "ডেস্কটপ এবং মোবাইল পরিবেশের জন্য অফিসিয়াল ফ্লোসুইট অ্যাপ্লিকেশন ডাউনলোড করুন।",
    ar: "قم بتنزيل تطبيق FlowSuite الرسمي لبيئات سطح المكتب والأجهزة المحمولة.",
    ur: "ڈیسک ٹاپ اور موبائل ماحول کے لیے آفیشل FlowSuite ایپلیکیشن ڈاؤن لوڈ کریں۔",
    hi: "डेस्कटॉप और मोबाइल वातावरण के लिए आधिकारिक FlowSuite एप्लिकेशन डाउनलोड करें।",
    es: "Descargue la aplicación oficial FlowSuite para entornos de escritorio y móviles.",
    fr: "Téléchargez l'application officielle FlowSuite pour les environnements de bureau et mobiles.",
    de: "Laden Sie die offizielle FlowSuite-Anwendung für Desktop- und Mobilumgebungen herunter.",
    zh: "下载适用于桌面和移动环境的官方 FlowSuite 应用程序。",
    ja: "デスクトップおよびモバイル環境向けの公式 FlowSuite アプリケーションをダウンロードします。"
  },
  download_windows: {
    en: "Download for Windows",
    bn: "উইন্ডোজের জন্য ডাউনলোড",
    ar: "تحميل لويندوز",
    ur: "ونڈوز کے لیے ڈاؤن لوڈ کریں۔",
    hi: "विंडोज के लिए डाउनलोड करें",
    es: "Descargar para Windows",
    fr: "Télécharger pour Windows",
    de: "Für Windows herunterladen",
    zh: "下载 Windows 版",
    ja: "Windows 版をダウンロード"
  },
  download_macos: {
    en: "Download for macOS",
    bn: "ম্যাকওএসের জন্য ডাউনলোড",
    ar: "تحميل لماك",
    ur: "macOS کے لیے ڈاؤن لوڈ کریں۔",
    hi: "macOS के लिए डाउनलोड करें",
    es: "Descargar para macOS",
    fr: "Télécharger pour macOS",
    de: "Für macOS herunterladen",
    zh: "下载 macOS 版",
    ja: "macOS 版をダウンロード"
  },
  download_android: {
    en: "Download Android APK",
    bn: "অ্যান্ড্রয়েড এপিকে ডাউনলোড",
    ar: "تحميل أندرويد APK",
    ur: "اینڈرائیڈ APK ڈاؤن لوڈ کریں۔",
    hi: "एंड्रॉइड एपीके डाउनलोड करें",
    es: "Descargar APK de Android",
    fr: "Télécharger l'APK Android",
    de: "Android APK herunterladen",
    zh: "下载 Android APK",
    ja: "Android APK をダウンロード"
  },
  download_ios: {
    en: "Install on iOS (App Store)",
    bn: "আইওএসে ইনস্টল (অ্যাপ স্টোর)",
    ar: "تثبيت على iOS (متجر التطبيقات)",
    ur: "iOS پر انسٹال کریں (ایپ اسٹور)",
    hi: "iOS पर इंस्टॉल करें (ऐप स्टोर)",
    es: "Instalar en iOS (App Store)",
    fr: "Installer sur iOS (App Store)",
    de: "Auf iOS installieren (App Store)",
    zh: "在 iOS 安装 (App Store)",
    ja: "iOS にインストール (App Store)"
  },
  anti_spam: {
    en: "Anti-Spam Policy",
    bn: "অ্যান্টি-স্প্যাম নীতি",
    ar: "سياسة مكافحة البريد العشوائي",
    ur: "اینٹی سپیم پالیسی",
    hi: "एंटी-स्पैम नीति",
    es: "Política antispam",
    fr: "Politique anti-spam",
    de: "Anti-Spam-Richtlinie",
    zh: "反垃圾邮件政策",
    ja: "スパム防止ポリシー"
  },
  refund_policy: {
    en: "Refund Policy",
    bn: "রিফান্ড পলিসি",
    ar: "سياسة الاسترجاع",
    ur: "رقم واپسی کی پالیسی",
    hi: "वापसी नीति",
    es: "Política de reembolso",
    fr: "Politique de remboursement",
    de: "Rückerstattungsrichtlinie",
    zh: "退款政策",
    ja: "返金ポリシー"
  },
  cookie_policy: {
    en: "Cookie Policy",
    bn: "কুকি পলিসি",
    ar: "سياسة ملفات الارتباط",
    ur: "کوکی پالیسی",
    hi: "कुकी नीति",
    es: "Política de cookies",
    fr: "Politique relative aux cookies",
    de: "Cookie-Richtlinie",
    zh: "Cookie 政策",
    ja: "クッキーポリシー"
  },
  gdpr_compliance: {
    en: "GDPR Compliance",
    bn: "জিডিপিআর কমপ্লায়েন্স",
    ar: "امتثال GDPR",
    ur: "GDPR تعمیل",
    hi: "जीडीपीआर अनुपालन",
    es: "Cumplimiento de GDPR",
    fr: "Conformité RGPD",
    de: "DSGVO-Konformität",
    zh: "GDPR 合规性",
    ja: "GDPR 準拠"
  },
  ccpa_compliance: {
    en: "CCPA Compliance",
    bn: "সিসিপিএ কমপ্লায়েন্স",
    ar: "امتثال CCPA",
    ur: "CCPA تعمیل",
    hi: "सीसीपीए अनुपालन",
    es: "Cumplimiento de CCPA",
    fr: "Conformité CCPA",
    de: "CCPA-Konformität",
    zh: "CCPA 合规性",
    ja: "CCPA 準拠"
  },
  security_policy: {
    en: "Security Policy",
    bn: "সিকিউরিটি পলিসি",
    ar: "سياسة الأمن",
    ur: "سیکیورٹی پالیسی",
    hi: "सुरक्षा नीति",
    es: "Política de seguridad",
    fr: "Politique de sécurité",
    de: "Sicherheitsrichtlinie",
    zh: "安全政策",
    ja: "セキュリティポリシー"
  },
  dpa: {
    en: "Data Processing Agreement (DPA)",
    bn: "ডাটা প্রসেসিং এগ্রিমেন্ট (DPA)",
    ar: "اتفاقية معالجة البيانات (DPA)",
    ur: "ڈیٹا پروسیسنگ معاہدہ (DPA)",
    hi: "डेटा प्रोसेसिंग समझौता (DPA)",
    es: "Acuerdo de procesamiento de datos (DPA)",
    fr: "Accord de traitement des données (DPA)",
    de: "Datenverarbeitungsvertrag (DPA)",
    zh: "数据处理协议 (DPA)",
    ja: "データ処理合意書 (DPA)"
  },
  sla: {
    en: "Service Level Agreement (SLA)",
    bn: "সার্ভিস লেভেল এগ্রিমেন্ট (SLA)",
    ar: "اتفاقية مستوى الخدمة (SLA)",
    ur: "سروس لیول معاہدہ (SLA)",
    hi: "सेवा स्तर समझौता (SLA)",
    es: "Acuerdo de nivel de servicio (SLA)",
    fr: "Accord de niveau de service (SLA)",
    de: "Service-Level-Agreement (SLA)",
    zh: "服务等级协议 (SLA)",
    ja: "サービス品質保証契約 (SLA)"
  },
  acceptable_use: {
    en: "Acceptable Use Policy",
    bn: "গ্রহণযোগ্য ব্যবহার নীতি",
    ar: "سياسة الاستخدام المقبول",
    ur: "قابل قبول استعمال کی پالیسی",
    hi: "स्वीकार्य उपयोग नीति",
    es: "Política de uso aceptable",
    fr: "Politique d'utilisation acceptable",
    de: "Richtlinie zur akzeptablen Nutzung",
    zh: "可接受使用政策",
    ja: "利用許諾方針"
  },
  features_section_title: {
    en: "Everything You Need to Scale Omnichannel SaaS",
    bn: "অমনিচ্যানেল SaaS স্কেল করার জন্য প্রয়োজনীয় সবকিছুই এখানে আছে",
    ar: "كل ما تحتاجه لتوسيع نطاق SaaS متعدد القنوات",
    ur: "اومنی چینل SaaS کو اسکیل کرنے کے لیے آپ کو ہر چیز کی ضرورت ہے۔",
    hi: "सर्वव्यापी चैनल SaaS को स्केल करने के लिए आपको जो कुछ भी चाहिए",
    es: "Todo lo que necesita para escalar SaaS omnicanal",
    fr: "Tout ce dont vous avez besoin pour faire évoluer votre SaaS omnicanal",
    de: "Alles, was Sie zur Skalierung von Omnichannel-SaaS benötigen",
    zh: "扩展全渠道 SaaS 所需的一切",
    ja: "マルチチャネル SaaS のスケールに必要なすべてを提供"
  },
  features_section_desc: {
    en: "Unified inbox messaging, automated social scheduling, AI agent copywriters, and CRM pipelines built into one platform.",
    bn: "ইউনিফাইড ইনবক্স মেসেজিং, অটোমেটেড সোশ্যাল শিডিউলিং, এআই এজেন্ট কপিরাইটার এবং সিআরএম পাইপলাইন — সবই একটি প্ল্যাটফর্মে।",
    ar: "الرسائل الموحدة في البريد الوارد ، والجدولة الاجتماعية المؤتمتة ، ووكلاء كتابة النصوص بالذكاء الاصطناعي ، وخطوط أنابيب CRM المبنية في منصة واحدة.",
    ur: "یونیفائیڈ ان باکس میسجنگ، خودکار سوشل شیڈولنگ، AI ایجنٹ کاپی رائٹرز، اور CRM پائپ لائنز سبھی ایک پلیٹ فارم میں شامل ہیں۔",
    hi: "एकीकृत इनबॉक्स संदेश, स्वचालित सामाजिक शेड्यूलिंग, एआई एजेंट कॉपीराइटर, और सीआरएम पाइपलाइन एक ही मंच में निर्मित।",
    es: "Mensajería unificada en la bandeja de entrada, programación social automatizada, redactores de agentes de IA y canales de CRM integrados en una sola plataforma.",
    fr: "Messagerie unifiée dans la boîte de réception, planification sociale automatisée, rédacteurs d'agents IA et pipelines CRM intégrés dans une seule plateforme.",
    de: "Einheitliche Posteingangsnachrichten, automatisierte soziale Planung, KI-Agenten-Texter und CRM-Pipelines in einer Plattform integriert.",
    zh: "统一收件箱消息、自动化社交排程、AI 代理撰稿人和 CRM 管道，都集成在一个平台中。",
    ja: "統合インボックス、自動ソーシャルスケジュール、AI ライター、CRM パイプラインが 1 つのプラットフォームに集約。"
  },
  copyright: {
    en: "© 2026 FlowSuite. All Rights Reserved.",
    bn: "© ২০২৬ ফ্লোসুইট। সর্বস্বত্ব সংরক্ষিত।",
    ar: "© 2026 FlowSuite. كل الحقوق محفوظة.",
    ur: "© 2026 FlowSuite. جملہ حقوق محفوظ ہیں۔",
    hi: "© 2026 FlowSuite. सर्वाधिकार सुरक्षित।",
    es: "© 2026 FlowSuite. Todos los derechos reservados.",
    fr: "© 2026 FlowSuite. Tous droits réservés.",
    de: "© 2026 FlowSuite. Alle Rechte vorbehalten.",
    zh: "© 2026 FlowSuite. 保留所有权利。",
    ja: "© 2026 FlowSuite. All Rights Reserved."
  }
};
