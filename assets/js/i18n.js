// Internationalization (i18n) System for HouseInMeta
// Supports English, French, and Hindi

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.solutions': 'Solutions',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.title1': '3D Real Estates',
    'hero.title2': 'Reveal before Build',
    'hero.description': 'We offer to manifest your Dream Home with the power of our 3D visualization solutions.',
    'hero.cta': 'Start Your Project',
    
    // Why Section
    'why.title': 'Why House In Meta?',
    'why.introDevelopers': 'For real estate developers, every project is more than just construction — it\'s the art of bringing spaces to life and inspiring buyers\' imagination.',
    'why.introBuyers': 'For Home Buyers, home is biggest investment of their life. We help you experience and explore your dream home before it is built.',
    'why.description': 'At HouseInMeta, we transform your architectural vision into an immersive, web-based 3D experience, enabling clients and investors to explore those properties anytime, anywhere.',
    'why.keyword1': 'Showcase',
    'why.keyword2': 'Engage',
    'why.keyword3': 'Accelerate',
    
    // Solutions
    'solutions.title': 'Our Solutions',
    'solutions.configurator.title': '3D Real Estate Configurator',
    'solutions.configurator.desc': 'Empower clients with real-time 3D configuration tools. Customize materials, colors, and features to visualize their dream space instantly.',
    'solutions.exteriors.title': '3D Exteriors',
    'solutions.exteriors.desc': 'Showcase properties with stunning 3D models and panoramic views. Let clients explore buildings and landscapes from any angle, directly in their browser.',
    'solutions.walkthroughs.title': '3D Immersive Walkthroughs',
    'solutions.walkthroughs.desc': 'Guide potential buyers through lifelike interior spaces with dynamic lighting and materials. Perfect for remote viewings and pre-construction sales.',
    
    // Blog
    'blog.title': 'Discover our Blogs',
    'blog.subtitle': 'Insights and updates from the world of virtual real estate',
    'blog.post1.title': 'The Role of 3D Models and Virtual Tours in Real Estate',
    'blog.post1.desc': 'Discover How 3D models can be leveraged in Real Estate.',
    'blog.post2.title': 'Experience Homeownership: 360° Tours for Global Buyers',
    'blog.post2.desc': 'Explore how 360° Virtual Towers bridges dreams to decision.',
    'blog.post3.title': 'Why Real Estate Developers Should Embrace 3D + 360° Web Visualization',
    'blog.post3.desc': 'The Future of Property Marketing Starts Online and In 3D',
    'blog.readmore': 'Read More',
    
    // Projects
    'projects.title': 'Our Featured Customer Story',
    'projects.subtitle': 'Real results from our immersive 3D solutions',
    'projects.featured.title': 'Premium Property Showcase',
    'projects.featured.desc': 'Interactive 3D exterior and interior customization platform for high-end residential properties.',
    'projects.view': 'View Project',
    
    // About
    'about.title': 'Industry Expertise',
    'about.subtitle': 'Transforming real estate visualization since 2023',
    'about.intro': 'We specialize in creating immersive 3D experiences that revolutionize how properties are showcased online. Our team combines expertise in architectural visualization, WebGL development, and user experience design to deliver solutions that drive engagement and accelerate sales.',
    'about.founded': 'Founded in 2023, we\'ve helped numerous clients transform their traditional showcases into interactive 3D experiences.',
    'about.facts.title': 'Quick Facts',
    'about.facts.experience': '15+ Years Experience',
    'about.facts.skilled': 'Skilled',
    'about.facts.ethics': 'Strong Work ethics',
    'about.facts.quality': 'Quality is Our no. 1 priority',
    'about.careers.title': 'Join Our Team',
    'about.careers.subtitle': 'We\'re looking for talented individuals to help shape the future of real estate visualization. Freelancers and independent creators are welcome!',
    'about.careers.job.title': '3D Creative Artist',
    'about.careers.job.type': 'Full-time / Freelance • Remote',
    'about.careers.job.desc': 'Join our team to create stunning 3D visualizations, immersive walkthroughs, and photorealistic renders for real estate projects.',
    'about.careers.job.skill1': '3D Modeling',
    'about.careers.job.skill2': 'Rendering',
    'about.careers.job.skill3': 'Walkthroughs',
    'about.careers.job.details': 'View Details',
    
    // Contact
    'contact.title': 'Trusted Partner in Your Success !',
    'contact.subtitle': 'Let\'s discuss how 3D visualization can enhance your property marketing',
    'contact.intro': 'Ready to showcase your properties in stunning 3D? Whether you\'re a real estate agency, developer, or individual property owner, we\'ll help you create immersive digital experiences that captivate buyers.',
    'contact.email': 'Email',
    'contact.location': 'Location',
    'contact.paris': 'Paris, France',
    'contact.available': 'Available Worldwide',
    
    // Common
    'common.tagline': 'Your Home, Forever Yours !',
    'common.learnmore': 'Learn More',
    'common.explore': 'Explore',
    'footer.copyright': '© House in Meta'
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.solutions': 'Solutions',
    'nav.projects': 'Projets',
    'nav.blog': 'Blog',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.title1': 'Immobilier 3D',
    'hero.title2': 'Voyez avant de bâtir',
    'hero.description': 'Nous offrons de concrétiser votre maison de rêve avec nos solutions de visualisation 3D.',
    'hero.cta': 'Démarrer Votre Projet',
    
    // Why Section
    'why.title': 'Pourquoi House In Meta ?',
    'why.introDevelopers': 'Pour les promoteurs immobiliers, chaque projet est plus qu\'une simple construction — c\'est l\'art de donner vie aux espaces et d\'inspirer l\'imagination des acheteurs.',
    'why.introBuyers': 'Pour les acheteurs, la maison est le plus grand investissement de leur vie. Nous vous aidons à vivre et explorer la maison de vos rêves avant sa construction.',
    'why.description': 'Chez HouseInMeta, nous transformons votre vision architecturale en une expérience 3D immersive basée sur le Web, permettant aux clients et aux investisseurs d\'explorer vos propriétés à tout moment, n\'importe où.',
    'why.keyword1': 'Présenter',
    'why.keyword2': 'Engager',
    'why.keyword3': 'Accélérer',
    
    // Solutions
    'solutions.title': 'Nos Solutions',
    'solutions.configurator.title': 'Configurateur Immobilier 3D',
    'solutions.configurator.desc': 'Donnez à vos clients des outils de configuration 3D en temps réel. Personnalisez les matériaux, les couleurs et les fonctionnalités pour visualiser instantanément l\'espace de leurs rêves.',
    'solutions.exteriors.title': 'Extérieurs 3D',
    'solutions.exteriors.desc': 'Présentez les propriétés avec de superbes modèles 3D et des vues panoramiques. Laissez les clients explorer les bâtiments et les paysages sous tous les angles, directement dans leur navigateur.',
    'solutions.walkthroughs.title': 'Visites Immersives 3D',
    'solutions.walkthroughs.desc': 'Guidez les acheteurs potentiels à travers des espaces intérieurs réalistes avec éclairage et matériaux dynamiques. Parfait pour les visites à distance et les ventes avant construction.',
    
    // Blog
    'blog.title': 'Découvrez nos Blogs',
    'blog.subtitle': 'Perspectives et actualités du monde de l\'immobilier virtuel',
    'blog.post1.title': 'Le rôle des modèles 3D et des visites virtuelles dans l\'immobilier',
    'blog.post1.desc': 'Découvrez comment les modèles 3D peuvent être exploités dans l\'immobilier.',
    'blog.post2.title': 'Expérience de propriété : Visites 360° pour acheteurs internationaux',
    'blog.post2.desc': 'Explorez comment les visites virtuelles 360° transforment les rêves en décisions.',
    'blog.post3.title': 'Pourquoi les promoteurs immobiliers devraient adopter la visualisation Web 3D + 360°',
    'blog.post3.desc': 'L\'avenir du marketing immobilier commence en ligne et en 3D',
    'blog.readmore': 'Lire la Suite',
    
    // Projects
    'projects.title': 'Notre Histoire Client Vedette',
    'projects.subtitle': 'Résultats réels de nos solutions 3D immersives',
    'projects.featured.title': 'Vitrine de Propriété Premium',
    'projects.featured.desc': 'Plateforme interactive de personnalisation 3D extérieure et intérieure pour propriétés résidentielles haut de gamme.',
    'projects.view': 'Voir le Projet',
    
    // About
    'about.title': 'Expertise Sectorielle',
    'about.subtitle': 'Transformer la visualisation immobilière depuis 2023',
    'about.intro': 'Nous nous spécialisons dans la création d\'expériences 3D immersives qui révolutionnent la façon dont les propriétés sont présentées en ligne. Notre équipe combine expertise en visualisation architecturale, développement WebGL et conception d\'expérience utilisateur pour offrir des solutions qui stimulent l\'engagement et accélèrent les ventes.',
    'about.founded': 'Fondée en 2023, nous avons aidé de nombreux clients à transformer leurs vitrines traditionnelles en expériences 3D interactives.',
    'about.facts.title': 'Faits Rapides',
    'about.facts.experience': '15+ ans d\'expérience',
    'about.facts.skilled': 'Compétent',
    'about.facts.ethics': 'Éthique de travail solide',
    'about.facts.quality': 'La qualité est notre priorité n°1',
    'about.careers.title': 'Rejoignez Notre Équipe',
    'about.careers.subtitle': 'Nous recherchons des personnes talentueuses pour aider à façonner l\'avenir de la visualisation immobilière. Les freelances et créateurs indépendants sont les bienvenus !',
    'about.careers.job.title': 'Artiste Créatif 3D',
    'about.careers.job.type': 'Temps plein / Freelance • À distance',
    'about.careers.job.desc': 'Rejoignez notre équipe pour créer de superbes visualisations 3D, des visites immersives et des rendus photoréalistes pour des projets immobiliers.',
    'about.careers.job.skill1': 'Modélisation 3D',
    'about.careers.job.skill2': 'Rendu',
    'about.careers.job.skill3': 'Visites Virtuelles',
    'about.careers.job.details': 'Voir les Détails',
    
    // Contact
    'contact.title': 'Partenaire de Confiance dans Votre Réussite !',
    'contact.subtitle': 'Discutons de la façon dont la visualisation 3D peut améliorer votre marketing immobilier',
    'contact.intro': 'Prêt à présenter vos propriétés en 3D époustouflant ? Que vous soyez une agence immobilière, un promoteur ou un propriétaire individuel, nous vous aiderons à créer des expériences numériques immersives qui captivent les acheteurs.',
    'contact.email': 'E-mail',
    'contact.location': 'Localisation',
    'contact.paris': 'Paris, France',
    'contact.available': 'Disponible dans le Monde Entier',
    
    // Common
    'common.tagline': 'Votre Maison, Pour Toujours Vôtre !',
    'common.learnmore': 'En Savoir Plus',
    'common.explore': 'Explorer',
    'footer.copyright': '© House in Meta'
  },
  
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.solutions': 'सेवाएँ',
    'nav.projects': 'परियोजनाएं',
    'nav.blog': 'ब्लॉग',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'संपर्क',
    
    // Hero Section
    'hero.title1': '3D रियल एस्टेट',
    'hero.title2': 'बनाने से पहले दिखाएं',
    'hero.description': 'हम अपनी 3D विज़ुअलाइज़ेशन सर्विस के साथ आपके सपनों का घर बनाने का ऑफ़र देते हैं।',
    'hero.cta': 'अपना प्रोजेक्ट शुरू करें',
    
    // Why Section
    'why.title': 'House In Meta क्यों?',
    'why.introDevelopers': 'रियल एस्टेट डेवलपर्स के लिए, हर प्रोजेक्ट सिर्फ निर्माण से अधिक है — यह स्थानों को जीवन देने और खरीदारों की कल्पना को प्रेरित करने की कला है।',
    'why.introBuyers': 'घर खरीदारों के लिए, घर उनके जीवन का सबसे बड़ा निवेश है। हम आपको अपने सपनों के घर का निर्माण से पहले अनुभव और एक्सप्लोर करने में मदद करते हैं।',
    'why.description': 'HouseInMeta में, हम आपकी वास्तुकला दृष्टि को एक इमर्सिव, वेब-आधारित 3D अनुभव में बदलते हैं, जिससे ग्राहक और निवेशक किसी भी समय, कहीं भी आपकी संपत्तियों का पता लगा सकते हैं।',
    'why.keyword1': 'प्रदर्शन',
    'why.keyword2': 'संलग्न',
    'why.keyword3': 'तेज़',
    
    // Solutions
    'solutions.title': 'हमारी सेवाएँ',
    'solutions.configurator.title': '3D रियल एस्टेट कॉन्फ़िगरेटर',
    'solutions.configurator.desc': 'ग्राहकों को रियल-टाइम 3D कॉन्फ़िगरेशन टूल्स के साथ सशक्त बनाएं। सामग्री, रंग और सुविधाओं को कस्टमाइज़ करें ताकि वे तुरंत अपने सपनों की जगह की कल्पना कर सकें।',
    'solutions.exteriors.title': '3D बाहरी',
    'solutions.exteriors.desc': 'शानदार 3D मॉडल और पैनोरमिक दृश्यों के साथ संपत्तियों को प्रदर्शित करें। ग्राहकों को सीधे अपने ब्राउज़र में किसी भी कोण से इमारतों और परिदृश्यों का पता लगाने दें।',
    'solutions.walkthroughs.title': '3D इमर्सिव वॉकथ्रू',
    'solutions.walkthroughs.desc': 'गतिशील प्रकाश और सामग्री के साथ संभावित खरीदारों को जीवंत आंतरिक स्थानों के माध्यम से मार्गदर्शन करें। रिमोट व्यूइंग और प्री-कंस्ट्रक्शन बिक्री के लिए एकदम सही।',
    
    // Blog
    'blog.title': 'हमारे ब्लॉग खोजें',
    'blog.subtitle': 'वर्चुअल रियल एस्टेट की दुनिया से अंतर्दृष्टि और अपडेट',
    'blog.post1.title': 'रियल एस्टेट में 3D मॉडल और वर्चुअल टूर की भूमिका',
    'blog.post1.desc': 'जानें कि 3D मॉडल का रियल एस्टेट में कैसे लाभ उठाया जा सकता है।',
    'blog.post2.title': 'गृह स्वामित्व का अनुभव: वैश्विक खरीदारों के लिए 360° टूर',
    'blog.post2.desc': 'जानें कि 360° वर्चुअल टावर कैसे सपनों को निर्णय से जोड़ते हैं।',
    'blog.post3.title': 'रियल एस्टेट डेवलपर्स को 3D + 360° वेब विज़ुअलाइज़ेशन क्यों अपनाना चाहिए',
    'blog.post3.desc': 'प्रॉपर्टी मार्केटिंग का भविष्य ऑनलाइन और 3D में शुरू होता है',
    'blog.readmore': 'और पढ़ें',
    
    // Projects
    'projects.title': 'हमारी विशेष ग्राहक कहानी',
    'projects.subtitle': 'हमारे इमर्सिव 3D समाधानों के वास्तविक परिणाम',
    'projects.featured.title': 'प्रीमियम प्रॉपर्टी शोकेस',
    'projects.featured.desc': 'उच्च-स्तरीय आवासीय संपत्तियों के लिए इंटरैक्टिव 3D बाहरी और आंतरिक कस्टमाइज़ेशन प्लेटफ़ॉर्म।',
    'projects.view': 'प्रोजेक्ट देखें',
    
    // About
    'about.title': 'उद्योग विशेषज्ञता',
    'about.subtitle': '2023 से रियल एस्टेट विज़ुअलाइज़ेशन को बदलना',
    'about.intro': 'हम इमर्सिव 3D अनुभव बनाने में विशेषज्ञ हैं जो ऑनलाइन संपत्तियों को प्रदर्शित करने के तरीके में क्रांति लाते हैं। हमारी टीम वास्तुकला विज़ुअलाइज़ेशन, WebGL विकास और उपयोगकर्ता अनुभव डिज़ाइन में विशेषज्ञता को जोड़ती है ताकि ऐसे समाधान प्रदान किए जा सकें जो जुड़ाव बढ़ाते हैं और बिक्री को तेज़ करते हैं।',
    'about.founded': '2023 में स्थापित, हमने कई ग्राहकों को उनके पारंपरिक शोकेस को इंटरैक्टिव 3D अनुभवों में बदलने में मदद की है।',
    'about.facts.title': 'त्वरित तथ्य',
    'about.facts.experience': '15+ वर्ष का अनुभव',
    'about.facts.skilled': 'कुशल',
    'about.facts.ethics': 'मजबूत कार्य नैतिकता',
    'about.facts.quality': 'गुणवत्ता हमारी नंबर 1 प्राथमिकता है',
    'about.careers.title': 'हमारी टीम में शामिल हों',
    'about.careers.subtitle': 'हम रियल एस्टेट विज़ुअलाइज़ेशन के भविष्य को आकार देने में मदद करने के लिए प्रतिभाशाली व्यक्तियों की तलाश कर रहे हैं। फ्रीलांसर और स्वतंत्र क्रिएटर्स का स्वागत है!',
    'about.careers.job.title': '3D क्रिएटिव आर्टिस्ट',
    'about.careers.job.type': 'पूर्णकालिक / फ्रीलांस • रिमोट',
    'about.careers.job.desc': 'रियल एस्टेट परियोजनाओं के लिए शानदार 3D विज़ुअलाइज़ेशन, इमर्सिव वॉकथ्रू और फोटोरियलिस्टिक रेंडर बनाने के लिए हमारी टीम में शामिल हों।',
    'about.careers.job.skill1': '3D मॉडलिंग',
    'about.careers.job.skill2': 'रेंडरिंग',
    'about.careers.job.skill3': 'वॉकथ्रू',
    'about.careers.job.details': 'विवरण देखें',
    
    // Contact
    'contact.title': 'आपकी सफलता में विश्वसनीय साझेदार!',
    'contact.subtitle': 'चलिए चर्चा करते हैं कि 3D विज़ुअलाइज़ेशन आपकी प्रॉपर्टी मार्केटिंग को कैसे बढ़ा सकता है',
    'contact.intro': 'शानदार 3D में अपनी संपत्तियों को प्रदर्शित करने के लिए तैयार हैं? चाहे आप एक रियल एस्टेट एजेंसी, डेवलपर, या व्यक्तिगत संपत्ति मालिक हों, हम आपको इमर्सिव डिजिटल अनुभव बनाने में मदद करेंगे जो खरीदारों को आकर्षित करते हैं।',
    'contact.email': 'ईमेल',
    'contact.location': 'स्थान',
    'contact.paris': 'पेरिस, फ्रांस',
    'contact.available': 'विश्वव्यापी उपलब्ध',
    
    // Common
    'common.tagline': 'आपका घर, हमेशा आपका!',
    'common.learnmore': 'और जानें',
    'common.explore': 'एक्सप्लोर करें',
    'footer.copyright': '© House in Meta'
  }
};

// Language state
let currentLang = localStorage.getItem('houseInMetaLang') || 'en';

// Toggle language function
function toggleLanguage() {
  if (currentLang === 'en') {
    currentLang = 'fr';
  } else if (currentLang === 'fr') {
    currentLang = 'hi';
  } else {
    currentLang = 'en';
  }
  localStorage.setItem('houseInMetaLang', currentLang);
  updatePageLanguage();
}

// Update all translatable elements
function updatePageLanguage() {
  // Update HTML lang attribute
  document.documentElement.lang = currentLang;
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = translations[currentLang][key];
    
    if (translation) {
      // Handle different element types
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    }
  });
  
  // Update language toggle button
  updateLanguageButton();
}

// Update language button appearance
function updateLanguageButton() {
  const langBtn = document.getElementById('langToggle');
  if (!langBtn) return;
  
  if (currentLang === 'en') {
    langBtn.innerHTML = '<span class="lang-flag">🇫🇷</span> <span class="lang-code">FR</span>';
    langBtn.setAttribute('aria-label', 'Passer au français');
  } else if (currentLang === 'fr') {
    langBtn.innerHTML = '<span class="lang-flag">🇮🇳</span> <span class="lang-code">HI</span>';
    langBtn.setAttribute('aria-label', 'हिंदी में बदलें');
  } else {
    langBtn.innerHTML = '<span class="lang-flag">🇬🇧</span> <span class="lang-code">EN</span>';
    langBtn.setAttribute('aria-label', 'Switch to English');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updatePageLanguage();
});

// Export for use in other scripts if needed
if (typeof window !== 'undefined') {
  window.i18n = {
    toggleLanguage,
    updatePageLanguage,
    getCurrentLang: () => currentLang,
    translate: (key) => translations[currentLang][key] || key
  };
}
