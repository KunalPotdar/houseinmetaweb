// Internationalization (i18n) System for HouseInMeta
// Supports English and French

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.solutions': 'Solutions',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.contact': 'Free Demo',
    
    // Hero Section
    'hero.title1': '3D Real Estates',
    'hero.title2': 'Reveal before Build',
    'hero.description': 'Manifest your dream home with the power of our 3D visualization solutions.',
    'hero.cta': 'Ask for Free Demo',
    'hero.cta2': 'Create Your Experience Here',
    
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
    'solutions.onlineservices.title': '3D Online Services',
    'solutions.onlineservices.desc': 'Transform your 2D floor plans to real life walkthrough experiences on our platform.',
    
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
    'about.facts.experience': '15++ Years of Research',
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
    
    // Contact / Free Demo
    'contact.title': 'Get Your Free 3D Demo Today!',
    'contact.subtitle': 'See your property brought to life in 3D — no commitment, completely free',
    'contact.intro': 'Request your free demo and discover how an immersive 3D experience can transform the way you market and sell properties. Whether you\'re a real estate agency, developer, or individual owner — we\'ll show you exactly what\'s possible.',
    'contact.email': 'Email',
    'contact.location': 'Location',
    'contact.paris': 'Paris, France',
    'contact.available': 'Available Worldwide',
    
    // Common
    'common.tagline': 'Your Home, Forever Yours !',
    'common.learnmore': 'Learn More',
    'common.explore': 'Explore',
    'footer.copyright': '© House in Meta',
    
    // Convert 2D to 3D (Floor Plan Conversion)
    'convert2d.title': 'Dream Home 3D',
    'convert2d.headerTitle': 'Your 2D plan becomes an immersive virtual tour',
    'convert2d.headerSubtitle': 'Upload your plan, choose your package, and receive an interactive 3D experience that your buyers can visit from any device — with no app to install.',
    'convert2d.subtitle': 'Transform Your 2D Floor Plans into Stunning Interactive 3D Models',
    'convert2d.step1': 'Choose Your Package',
    'convert2d.step2': 'Upload Your Plans',
    'convert2d.step3': 'Response from Us',
    'convert2d.step4': 'Experience Your Dream Home',
    'convert2d.uploadTitle': 'Upload Your Floor Plans',
    'convert2d.supportedFormats': 'Supported Formats',
    'convert2d.supportedTypes': 'PDF, DWG, JPG, PNG, ZIP',
    'convert2d.maxFileSize': 'Max file size: 100MB per file',
    'convert2d.projectInfo': 'Project Information',
    'convert2d.projectName': 'Project Name',
    'convert2d.personName': 'Person Name',
    'convert2d.emailId': 'Email ID',
    'convert2d.dragDropText': 'Drag and drop your files here',
    'convert2d.or': 'or',
    'convert2d.chooseFiles': 'Choose Files',
    'convert2d.uploadedFiles': 'Uploaded Files',
    'convert2d.generate': 'Send',
    'convert2d.remove': 'Remove',
    'convert2d.success': 'Floor plan submitted successfully! Check your email for confirmation.',
    'convert2d.error.selectPackage': 'Please select a package',
    'convert2d.error.uploadFiles': 'Please upload at least one floor plan file',
    'convert2d.error.enterName': 'Please enter your name',
    'convert2d.error.enterEmail': 'Please enter your email address',
    'convert2d.error.invalidEmail': 'Please enter a valid email address',
    'convert2d.processing': 'Processing your request...',
    
    // Packages
    'package.quick.name': '3D Quick',
    'package.quick.description': 'Get your floor plan converted to 3D in no time',
    'package.quick.feature1': 'High Quality Axonometric 3D View image',
    'package.quick.feature2': 'Single floor conversion',
    'package.quick.feature3': 'Two Interior 3D Rendered images',
    'package.quick.feature4': '5-day delivery',
    'package.quick.period': 'One-time fee',
    
    'package.pro.name': '3D Pro',
    'package.pro.description': 'Get a detailed understanding of your space with 3D Pro',
    'package.pro.feature1': 'In addition to 3D Quick features:',
    'package.pro.feature2': 'High-quality Interior Rendered images',
    'package.pro.feature3': 'High quality 360° images for immersive experience',
    'package.pro.feature4': 'Two Revisions based on client feedback',
    'package.pro.period': 'One-time fee',
    
    'package.premium.name': '3D Premium',
    'package.premium.description': 'Walk through your space like never before with 3D Premium - Our most popular service',
    'package.premium.feature1': 'In addition to 3D Pro features:',
    'package.premium.feature2': 'A fully interactive 3D model with advanced navigation',
    'package.premium.feature3': '3D files for use in VR/AR applications',
    'package.premium.feature4': '🎤 Online Walkthrough experience, hosted by HouseInMeta',
    'package.premium.feature5': 'Priority support and faster delivery',
    'package.premium.period': 'One-time fee',
    
    'package.selectBtn': 'Select Package'
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.solutions': 'Solutions',
    'nav.projects': 'Projets',
    'nav.blog': 'Blog',
    'nav.about': 'À propos',
    'nav.contact': 'Démo Gratuite',
    
    // Hero Section
    'hero.title1': 'Visite Virtuelle',
    'hero.title2': 'Immobilier',
    'hero.description': 'Entrez chez vous avant la première pierre.',
    'hero.cta': 'Demandez une Démo Gratuite',
    'hero.cta2': 'Créez Votre Expérience Ici',
    
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
    'solutions.exteriors.title': 'Catalogue Maison 3D',
    'solutions.exteriors.desc': 'Transformez des brochures statiques en maisons virtuelles 3D interactives que les agents immobiliers peuvent présenter à tout moment, partout.',
    'solutions.walkthroughs.title': 'Visites Immersives 3D',
    'solutions.walkthroughs.desc': 'Guidez les acheteurs potentiels à travers des espaces intérieurs réalistes avec éclairage et matériaux dynamiques. Parfait pour les visites à distance et les ventes avant construction.',
    'solutions.onlineservices.title': 'Ma Maison en 3D',
    'solutions.onlineservices.desc': 'Transformez vos plans 2D en véritables expériences de visite interactive sur notre plateforme.',
    
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
    'about.facts.experience': '15++ ans de recherche',
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
    
    // Contact / Démo Gratuite
    'contact.title': 'Obtenez Votre Démo 3D Gratuite !',
    'contact.subtitle': 'Découvrez votre bien en 3D — sans engagement, entièrement gratuit',
    'contact.intro': 'Demandez votre démo gratuite et découvrez comment une expérience 3D immersive peut transformer la façon dont vous commercialisez vos biens. Agence immobilière, promoteur ou propriétaire individuel — nous vous montrons ce qui est possible.',
    'contact.email': 'E-mail',
    'contact.location': 'Localisation',
    'contact.paris': 'Paris, France',
    'contact.available': 'Disponible dans le Monde Entier',
    
    // Common
    'common.tagline': 'Votre Maison, Pour Toujours Vôtre !',
    'common.learnmore': 'En Savoir Plus',
    'common.explore': 'Explorer',
    'footer.copyright': '© House in Meta',
    
    // Convert 2D to 3D (Floor Plan Conversion)
    'convert2d.title': 'Maison de Rêve 3D',
    'convert2d.headerTitle': 'Votre plan 2D devient une visite virtuelle immersive',
    'convert2d.headerSubtitle': 'Téléchargez votre plan, choisissez votre forfait et recevez une expérience 3D interactive que vos acheteurs peuvent visiter depuis n\'importe quel appareil — sans application à installer.',
    'convert2d.subtitle': 'Transformez Vos Plans 2D en Magnifiques Modèles 3D Interactifs',
    'convert2d.step1': 'Choisissez Votre Forfait',
    'convert2d.step2': 'Téléchargez Vos Plans',
    'convert2d.step3': 'Réponse de Notre Équipe',
    'convert2d.step4': 'Découvrez Votre Maison de Rêve',
    'convert2d.uploadTitle': 'Téléchargez Vos Plans',
    'convert2d.supportedFormats': 'Formats Acceptés',
    'convert2d.supportedTypes': 'PDF, DWG, JPG, PNG, ZIP',
    'convert2d.maxFileSize': 'Taille maximale: 100 Mo par fichier',
    'convert2d.projectInfo': 'Informations du Projet',
    'convert2d.projectName': 'Nom du Projet',
    'convert2d.personName': 'Nom de la Personne',
    'convert2d.emailId': 'Adresse E-mail',
    'convert2d.dragDropText': 'Faites glisser vos fichiers ici',
    'convert2d.or': 'ou',
    'convert2d.chooseFiles': 'Choisir les Fichiers',
    'convert2d.uploadedFiles': 'Fichiers Téléchargés',
    'convert2d.generate': 'Envoyer',
    'convert2d.remove': 'Supprimer',
    'convert2d.success': 'Plan d\'étage soumis avec succès ! Vérifiez votre e-mail pour la confirmation.',
    'convert2d.error.selectPackage': 'Veuillez sélectionner un forfait',
    'convert2d.error.uploadFiles': 'Veuillez télécharger au moins un fichier de plan',
    'convert2d.error.enterName': 'Veuillez entrer votre nom',
    'convert2d.error.enterEmail': 'Veuillez entrer votre adresse e-mail',
    'convert2d.error.invalidEmail': 'Veuillez entrer une adresse e-mail valide',
    'convert2d.processing': 'Traitement de votre demande...',
    
    // Packages
    'package.quick.name': '3D Rapide',
    'package.quick.description': 'Convertissez votre plan d\'étage en 3D en un instant',
    'package.quick.feature1': 'Image de vue axonométrique 3D de haute qualité',
    'package.quick.feature2': 'Conversion monoétage',
    'package.quick.feature3': 'Deux images 3D d\'intérieur rendues',
    'package.quick.feature4': 'Livraison en 5 jours',
    'package.quick.period': 'Frais uniques',
    
    'package.pro.name': '3D Pro',
    'package.pro.description': 'Comprenez en détail votre espace avec 3D Pro',
    'package.pro.feature1': 'En plus des fonctionnalités 3D Rapide :',
    'package.pro.feature2': 'Images intérieures rendues de haute qualité',
    'package.pro.feature3': 'Images 360° de haute qualité pour une expérience immersive',
    'package.pro.feature4': 'Deux révisions en fonction des commentaires',
    'package.pro.period': 'Frais uniques',
    
    'package.premium.name': '3D Premium',
    'package.premium.description': 'Explorez votre espace comme jamais auparavant avec 3D Premium - Notre service le plus populaire',
    'package.premium.feature1': 'En plus des fonctionnalités 3D Pro :',
    'package.premium.feature2': 'Modèle 3D entièrement interactif avec navigation avancée',
    'package.premium.feature3': 'Fichiers 3D pour applications VR/AR',
    'package.premium.feature4': '🎤 Expérience de visite virtuelle en ligne, hébergée par HouseInMeta',
    'package.premium.feature5': 'Support prioritaire et livraison plus rapide',
    'package.premium.period': 'Frais uniques',
    
    'package.selectBtn': 'Sélectionner le Forfait'
  }
};

// Language state — /en path = English, otherwise default to French
let currentLang = (function() {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/en')) return 'en';
  return localStorage.getItem('houseInMetaLang') || 'fr';
})();

// Toggle language function
function toggleLanguage() {
  if (window.location.pathname.startsWith('/en')) {
    window.location.href = '/';
  } else {
    window.location.href = '/en';
  }
}

// Change language function for dropdown
function changeLanguage(lang) {
  const onEnPath = window.location.pathname.startsWith('/en');
  if (lang === 'en' && !onEnPath) {
    window.location.href = '/en';
  } else if (lang === 'fr' && onEnPath) {
    window.location.href = '/';
  } else {
    currentLang = lang;
    localStorage.setItem('houseInMetaLang', currentLang);
    updatePageLanguage();
  }
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
  
  // Update language dropdown
  updateLanguageDropdown();
  
  // Re-render packages with new language translations
  if (typeof renderPackages === 'function') {
    renderPackages();
  }
}

// Update language dropdown selection
function updateLanguageDropdown() {
  const langDropdown = document.getElementById('langToggle');
  if (!langDropdown) return;
  
  langDropdown.value = currentLang;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updatePageLanguage();
});

// Export for use in other scripts if needed
if (typeof window !== 'undefined') {
  window.i18n = {
    toggleLanguage,
    changeLanguage,
    updatePageLanguage,
    getCurrentLang: () => currentLang,
    translate: (key) => translations[currentLang][key] || key,
    t: (key) => translations[currentLang][key] || key
  };
}
