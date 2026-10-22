import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Static HTML keeps the translated product content available without JavaScript.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://www.houseinmeta.com';
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, value) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), value); };
const esc = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const locales = [
  { lang: 'fr', name: 'Français', file: 'pages/solutions/maquette-3d.html', title: 'Maquette orbitale 3D pour l’immobilier', description: 'Explorez votre programme immobilier avec une maquette orbitale 3D interactive : vues aériennes, parcours piéton, sélection des logements et visite virtuelle.', question: 'Qu’est-ce qu’une maquette orbitale 3D ?', answer: 'Une maquette orbitale 3D est une représentation interactive d’un programme immobilier. Elle permet de découvrir les bâtiments et leur environnement depuis plusieurs points de vue, puis de passer à la sélection d’un logement et à sa visite virtuelle. Elle aide les promoteurs à présenter un projet avant sa construction, notamment en VEFA.', demo: 'Explorer la démonstration', contact: 'Parlons de votre projet', home: 'Accueil', sections: [ ['Explorer le programme et son environnement', 'La vue aérienne permet de comprendre l’implantation des bâtiments, les espaces paysagers et les accès. Le parcours piéton présente les façades et les cheminements à hauteur humaine.'], ['Passer du bâtiment au logement', 'Le parcours relie la découverte du programme à la sélection du bâtiment, de l’étage et du logement. Les plans et les vues intérieures aident les acheteurs à comprendre l’agencement.'], ['Accompagner la commercialisation en VEFA', 'Une maquette 3D interactive donne un support visuel aux échanges entre promoteurs, équipes commerciales et acquéreurs. Découvrez le projet Parc de Lac pour explorer un exemple concret dans votre navigateur.'] ] },
  { lang: 'en', name: 'English', file: 'pages/solutions/3d-model.html', title: 'Orbital 3D model for real estate', description: 'Explore an interactive 3D property model with aerial views, pedestrian navigation, building and floor selection, and virtual apartment tours.', question: 'What is an orbital 3D property model?', answer: 'An orbital 3D model is an interactive representation of a property development. Buyers can view buildings and their surroundings from different viewpoints, then explore individual homes and virtual interiors. Also called an interactive 3D property model, it helps developers present homes before construction.', demo: 'Explore the live demo', contact: 'Discuss your project', home: 'Home', sections: [ ['Explore the development and its surroundings', 'Aerial views explain the arrangement of buildings, landscaped spaces and access routes. Pedestrian navigation brings the experience down to street level to explore façades and paths.'], ['Move from the building to the home', 'The journey connects development exploration with building, floor and apartment selection. Floor plans and interior views help buyers understand layouts and imagine life inside.'], ['Support off-plan property sales', 'An interactive 3D property model gives developers, sales teams and buyers a shared visual reference before construction. Explore the Parc de Lac demonstration to see a working example in your browser.'] ] },
  { lang: 'es', name: 'Español', file: 'es/maqueta-3d-interactiva.html', title: 'Maqueta 3D interactiva para proyectos inmobiliarios', description: 'Presente su promoción con una maqueta 3D interactiva: vistas aéreas, recorrido a pie, selección de viviendas y visitas virtuales en el navegador.', question: '¿Qué es una maqueta orbital 3D?', answer: 'Una maqueta orbital 3D es una representación interactiva de una promoción inmobiliaria. Permite observar los edificios y su entorno desde distintos puntos de vista y descubrir las viviendas y sus interiores. Ayuda a presentar un proyecto antes de su construcción.', demo: 'Explorar la demostración', contact: 'Hablemos de su proyecto', home: 'Inicio', sections: [ ['Explore la promoción y su entorno', 'Las vistas aéreas muestran la distribución de los edificios, las zonas ajardinadas y los accesos. El recorrido peatonal permite descubrir las fachadas y los caminos a nivel de calle.'], ['Del edificio a la vivienda', 'El recorrido conecta la vista general con la selección del edificio, la planta y la vivienda. Los planos y las vistas interiores ayudan a comprender la distribución de cada espacio.'], ['Apoye la venta de viviendas sobre plano', 'La maqueta 3D ofrece una referencia visual para promotores, equipos comerciales y compradores. Explore la demostración Parc de Lac en su navegador para descubrir un ejemplo real de esta experiencia.'] ] },
  { lang: 'de', name: 'Deutsch', file: 'de/interaktives-3d-immobilienmodell.html', title: 'Interaktives 3D-Immobilienmodell mit Orbitansicht', description: 'Präsentieren Sie Ihr Bauprojekt als interaktives 3D-Modell mit Luftansichten, Fußgängerperspektive, Wohnungsauswahl und virtueller Besichtigung.', question: 'Was ist ein 3D-Immobilienmodell mit Orbitansicht?', answer: 'Ein interaktives 3D-Immobilienmodell zeigt ein Bauprojekt und seine Umgebung aus verschiedenen Blickwinkeln. Interessenten können Gebäude erkunden und anschließend einzelne Wohnungen und Innenräume entdecken. So lässt sich ein Projekt bereits vor dem Bau anschaulich präsentieren.', demo: 'Demo erkunden', contact: 'Projekt besprechen', home: 'Startseite', sections: [ ['Bauprojekt und Umgebung erkunden', 'Luftansichten zeigen die Anordnung der Gebäude, Grünflächen und Zugänge. In der Fußgängerperspektive lassen sich Fassaden und Wege auf Straßenhöhe entdecken.'], ['Vom Gebäude zur Wohnung', 'Der Rundgang verbindet die Projektübersicht mit der Auswahl von Gebäude, Etage und Wohnung. Grundrisse und Innenansichten helfen Interessenten, die Raumaufteilung zu verstehen.'], ['Immobilien vor Baubeginn präsentieren', 'Das interaktive 3D-Modell bietet Bauträgern, Vertriebsteams und Kaufinteressenten eine gemeinsame visuelle Grundlage. Erkunden Sie die Demo Parc de Lac direkt im Browser und entdecken Sie ein konkretes Beispiel.'] ] },
  { lang: 'it', name: 'Italiano', file: 'it/modello-3d-immobiliare-interattivo.html', title: 'Modello 3D interattivo per progetti immobiliari', description: 'Esplora un modello 3D orbitale con viste aeree, percorsi pedonali, selezione degli appartamenti e visite virtuali direttamente nel browser.', question: 'Che cos’è un modello 3D orbitale immobiliare?', answer: 'Un modello 3D orbitale è una rappresentazione interattiva di un progetto immobiliare. Consente di osservare gli edifici e il contesto da diversi punti di vista, per poi esplorare le singole abitazioni e gli interni. Aiuta a presentare il progetto prima della costruzione.', demo: 'Esplora la demo', contact: 'Parliamo del tuo progetto', home: 'Pagina iniziale', sections: [ ['Esplora il progetto e il contesto', 'Le viste aeree mostrano la disposizione degli edifici, le aree verdi e gli accessi. Il percorso pedonale permette di scoprire facciate e camminamenti a livello della strada.'], ['Dall’edificio all’appartamento', 'Il percorso collega la panoramica del progetto alla selezione dell’edificio, del piano e dell’abitazione. Le planimetrie e le viste interne aiutano a comprendere la distribuzione degli spazi.'], ['Presenta gli immobili prima della costruzione', 'Il modello 3D interattivo offre un riferimento visivo a promotori, team commerciali e acquirenti. Esplora la dimostrazione Parc de Lac nel browser per scoprire un esempio concreto dell’esperienza.'] ] },
  { lang: 'pt', name: 'Português', file: 'pt/maquete-3d-interativa.html', title: 'Maquete 3D interativa para empreendimentos imobiliários', description: 'Explore uma maquete 3D orbital com vistas aéreas, percurso pedonal, seleção de apartamentos e visitas virtuais diretamente no navegador.', question: 'O que é uma maquete 3D orbital?', answer: 'Uma maquete 3D orbital é uma representação interativa de um empreendimento imobiliário. Permite observar os edifícios e a envolvente a partir de vários pontos de vista, seguindo depois para as habitações e os interiores. Ajuda a apresentar um projeto antes da construção.', demo: 'Explorar a demonstração', contact: 'Fale sobre o seu projeto', home: 'Início', sections: [ ['Explore o empreendimento e a envolvente', 'As vistas aéreas mostram a disposição dos edifícios, os espaços verdes e os acessos. O percurso pedonal permite descobrir fachadas e caminhos ao nível da rua.'], ['Do edifício ao apartamento', 'O percurso liga a visão geral do empreendimento à seleção do edifício, do piso e da habitação. As plantas e as vistas interiores ajudam a compreender a organização dos espaços.'], ['Apresente imóveis antes da construção', 'A maquete 3D interativa oferece uma referência visual a promotores, equipas comerciais e compradores. Explore a demonstração Parc de Lac no navegador para descobrir um exemplo concreto desta experiência.'] ] },
  { lang: 'hi', name: 'हिन्दी', file: 'hi/interactive-3d-property-model.html', title: 'रियल एस्टेट के लिए इंटरैक्टिव 3D मॉडल', description: 'हवाई दृश्यों, सड़क के स्तर पर भ्रमण, अपार्टमेंट चयन और वर्चुअल टूर के साथ अपने आवासीय प्रोजेक्ट का इंटरैक्टिव 3D मॉडल ब्राउज़र में देखें।', question: 'ऑर्बिटल 3D प्रॉपर्टी मॉडल क्या है?', answer: 'ऑर्बिटल 3D मॉडल किसी रियल एस्टेट प्रोजेक्ट का इंटरैक्टिव रूप है। खरीदार इमारतों और आसपास के क्षेत्र को अलग-अलग कोणों से देख सकते हैं, फिर घरों और उनके अंदरूनी हिस्सों को जान सकते हैं। इससे निर्माण से पहले प्रोजेक्ट प्रस्तुत करने में मदद मिलती है।', demo: 'डेमो देखें', contact: 'अपने प्रोजेक्ट पर बात करें', home: 'मुखपृष्ठ', sections: [ ['प्रोजेक्ट और आसपास का क्षेत्र देखें', 'हवाई दृश्य इमारतों, हरित क्षेत्रों और प्रवेश मार्गों की स्थिति समझाते हैं। पैदल भ्रमण के दृश्य सड़क के स्तर से इमारतों और रास्तों को देखने देते हैं।'], ['इमारत से अपार्टमेंट तक', 'प्रोजेक्ट के समग्र दृश्य से इमारत, मंज़िल और घर के चयन तक पहुँचें। फ़्लोर प्लान और अंदरूनी दृश्य खरीदारों को कमरों की व्यवस्था समझने में मदद करते हैं।'], ['निर्माण से पहले प्रॉपर्टी प्रस्तुत करें', 'इंटरैक्टिव 3D मॉडल डेवलपर्स, बिक्री टीमों और खरीदारों के लिए एक साझा दृश्य आधार देता है। इस अनुभव का उदाहरण देखने के लिए Parc de Lac का डेमो सीधे ब्राउज़र में खोलें।'] ] },
  { lang: 'zh-Hans', name: '简体中文', file: 'zh/interactive-3d-property-model.html', title: '房地产交互式3D模型与环绕展示', description: '通过交互式3D楼盘模型，体验鸟瞰视角、街道漫游、楼栋与楼层选择及公寓虚拟参观，直接在浏览器中了解房地产项目。', question: '什么是房地产环绕式3D模型？', answer: '环绕式3D模型是房地产项目的交互式展示。购房者可以从不同角度查看建筑及周边环境，再进一步探索住宅与室内空间。这种体验帮助开发商在施工前向客户清晰展示项目。', demo: '体验在线演示', contact: '咨询您的项目', home: '首页', sections: [ ['探索楼盘及周边环境', '鸟瞰视角呈现建筑布局、绿化空间与出入口。街道漫游则让购房者以行人视角了解建筑外立面与步行路线。'], ['从楼栋深入到住宅', '从项目整体展示进入楼栋、楼层及住宅选择。户型图和室内视图帮助购房者理解空间布局，想象未来的居住生活。'], ['支持期房项目展示', '交互式3D模型为开发商、销售团队与购房者提供共同的视觉参考。您可以直接在浏览器中探索 Parc de Lac 演示，了解实际项目的展示体验。'] ] },
  { lang: 'ja', name: '日本語', file: 'ja/interactive-3d-property-model.html', title: '不動産向けインタラクティブ3Dモデル', description: '鳥瞰表示、歩行者視点、棟・階・住戸の選択、バーチャル内覧を備えた不動産3Dモデルをブラウザーで体験できます。', question: '不動産のオービタル3Dモデルとは？', answer: 'オービタル3Dモデルは、不動産開発プロジェクトをさまざまな角度から確認できるインタラクティブな表現です。建物と周辺環境を見渡した後、住戸や室内を探索できます。完成前の物件を購入検討者に紹介する際に役立ちます。', demo: 'デモを体験する', contact: 'プロジェクトについて相談する', home: 'ホーム', sections: [ ['建物と周辺環境を探索', '鳥瞰表示では建物の配置、緑地、出入口を確認できます。歩行者視点に切り替えると、道路の高さから外観や通路を探索できます。'], ['建物から住戸へ', 'プロジェクトの全体像から棟、階、住戸の選択へ進めます。間取り図と室内ビューによって、購入検討者が空間の構成を理解しやすくなります。'], ['完成前の物件紹介をサポート', 'インタラクティブ3Dモデルは、開発事業者、営業担当者、購入検討者の間で共通の視覚資料として活用できます。Parc de Lac のデモをブラウザーで開き、具体的な体験をご確認ください。'] ] }
];
const url = l => `${origin}/${l.file}`;
const alternates = locales.map(l => `<link rel="alternate" hreflang="${l.lang}" href="${url(l)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${url(locales[1])}">`;
const languageNav = current => `<nav class="product-languages" aria-label="${current.lang === 'fr' ? 'Langues' : current.lang === 'en' ? 'Languages' : esc(current.name)}">${locales.map(l => `<a href="/${l.file}" lang="${l.lang}" hreflang="${l.lang}"${l === current ? ' aria-current="page"' : ''}>${l.name}</a>`).join('\n')}</nav>`;
const structured = l => JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url(l)}#webpage`, url: url(l), name: l.title, description: l.description, inLanguage: l.lang, mainEntity: { '@type': 'Service', name: l.title, description: l.description, serviceType: 'Interactive 3D real estate visualization', provider: { '@type': 'Organization', name: 'HouseInMeta', url: origin } } });
const head = l => `<link rel="canonical" href="${url(l)}">\n${alternates}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(l.title)} | HouseInMeta">
<meta property="og:description" content="${esc(l.description)}">
<meta property="og:url" content="${url(l)}">
<meta property="og:image" content="${origin}/assets/images/projects/parc-de-lac-overview.png">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${structured(l)}</script>`;

for (const l of locales) {
  if (['fr', 'en'].includes(l.lang)) {
    let html = read(l.file);
    html = html.replace(/<title>.*?<\/title>/, `<title>${esc(l.title)} | HouseInMeta</title>`).replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(l.description)}">`);
    // Replace generated regions so rebuilding never duplicates metadata or content.
    html = html.replace(/\n<!-- product-seo:start -->[\s\S]*?<!-- product-seo:end -->/g, '');
    html = html.replace('</head>', `\n<!-- product-seo:start -->\n${head(l)}\n<!-- product-seo:end -->\n</head>`);
    html = html.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${esc(l.title)}</h1>`);
    html = html.replace('</main>', `\n<!-- product-seo:start -->\n<section class="shell model-journey"><h2>${esc(l.question)}</h2><p class="lead">${esc(l.answer)}</p>${languageNav(l)}</section>\n<!-- product-seo:end -->\n</main>`);
    write(l.file, html);
  } else {
    write(l.file, `<!doctype html>
<html lang="${l.lang}"${l.lang === 'ar' ? ' dir="rtl"' : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(l.title)} | HouseInMeta</title>
<meta name="description" content="${esc(l.description)}">
${head(l)}
<link rel="stylesheet" href="/assets/css/premium.css">
<link rel="stylesheet" href="/assets/css/product-languages.css">
<link rel="icon" href="/assets/images/favicon.ico">
</head>
<body>
<header class="site-header"><div class="shell header-inner"><a class="wordmark" href="/en/"><img src="/assets/images/HouseInMeta-newlogo.png" alt="HouseInMeta" width="2172" height="724"></a><a class="text-link" href="#contact">${esc(l.contact)} ↗</a></div></header>
<main id="main">
<section class="shell model-intro"><p class="eyebrow">HouseInMeta</p><h1>${esc(l.title)}</h1><p class="lead">${esc(l.description)}</p><div class="button-row"><a class="button" href="/clients/ParcDeLac/parc.html">${esc(l.demo)} ↗</a><a class="text-link" href="#contact">${esc(l.contact)} →</a></div></section>
<section class="shell model-journey"><h2>${esc(l.question)}</h2><p class="lead">${esc(l.answer)}</p>
<figure class="journey-figure"><img src="/assets/images/projects/parc-de-lac-overview.png" alt="${esc(l.title)} — Parc de Lac" width="1074" height="805" decoding="async" fetchpriority="high"></figure>
${l.sections.map(([title, copy]) => `<article class="product-detail"><h2>${esc(title)}</h2><p>${esc(copy)}</p></article>`).join('\n')}
</section>
<section id="contact" class="shell closing-cta"><h2>${esc(l.contact)}</h2><a class="button button-light" href="mailto:houseinmeta@gmail.com">houseinmeta@gmail.com ↗</a></section>
</main>
<footer class="shell site-footer"><span>© 2026 HouseInMeta</span>${languageNav(l)}</footer>
</body>
</html>
`);
  }
}

// Homepages retain their existing design and link to the translated product family.
for (const [file, lang, homepage, other] of [['index.html', 'en', '/', '/fr/'], ['en/index.html', 'en', '/', '/fr/'], ['fr/index.html', 'fr', '/fr/', '/']]) {
  let html = read(file);
  const product = locales.find(l => l.lang === lang);
  const l = lang === 'en' ? { ...product, title: '3D property experiences for real estate developers', description: 'Interactive 3D models and virtual tours for real estate developers in the UK, USA, English-speaking Europe, Dubai and India. Showcase developments before construction.' } : product;
  html = html.replace(/<title>.*?<\/title>/, `<title>${esc(l.title)} | HouseInMeta</title>`);
  html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(l.description)}">`);
  for (const prop of ['og:description', 'twitter:description']) html = html.replace(new RegExp(`<meta property="${prop}"[^>]*>`), `<meta property="${prop}" content="${esc(l.description)}">`);
  // Describe the actual platform; avoid agency claims and FAQs absent from the page.
  html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  const graph = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': `${origin}/#organization`, name: 'HouseInMeta', url: `${origin}/`, logo: `${origin}/assets/images/HouseInMeta-newlogo.png`, email: 'houseinmeta@gmail.com' },
    { '@type': 'WebSite', '@id': `${origin}/#website`, name: 'HouseInMeta', url: `${origin}/`, inLanguage: ['en', 'fr'], publisher: { '@id': `${origin}/#organization` } },
    { '@type': 'WebPage', '@id': `${origin}${homepage}#webpage`, url: `${origin}${homepage}`, name: l.title, description: l.description, inLanguage: lang, isPartOf: { '@id': `${origin}/#website` }, about: { '@type': 'Service', name: l.title, provider: { '@id': `${origin}/#organization` } } }
  ] };
  for (const prop of ['og:title', 'twitter:title']) html = html.replace(new RegExp(`<meta property="${prop}"[^>]*>`), `<meta property="${prop}" content="${esc(l.title)} | HouseInMeta">`);
  html = html.replace(/<meta property="og:locale"[^>]*>/, `<meta property="og:locale" content="${lang === 'fr' ? 'fr_FR' : 'en_GB'}">`).replace(/<meta property="og:locale:alternate"[^>]*>/, `<meta property="og:locale:alternate" content="${lang === 'fr' ? 'en_GB' : 'fr_FR'}">`);
  html = html.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${origin}${homepage}">`);
  html = html.replace(/\n<!-- home-seo:start -->[\s\S]*?<!-- home-seo:end -->/g, '');
  html = html.replace('</head>', `\n<!-- home-seo:start -->\n<link rel="canonical" href="${origin}${homepage}">\n<link rel="alternate" hreflang="${lang}" href="${origin}${homepage}">\n<link rel="alternate" hreflang="${lang === 'fr' ? 'en' : 'fr'}" href="${origin}${other}">\n<link rel="alternate" hreflang="x-default" href="${origin}/">\n<script type="application/ld+json">${JSON.stringify(graph)}</script>\n<!-- home-seo:end -->\n</head>`);
  html = html.replace('<div>\n<a href="/contact.html">', `<!-- home-seo:start -->\n${languageNav(l).replace(' aria-current="page"', '')}\n<!-- home-seo:end -->\n<div>\n<a href="/contact.html">`);
  write(file, html);
}

// Share the language selector styling with the existing product and home pages.
for (const file of ['index.html', 'en/index.html', 'fr/index.html', ...locales.slice(0, 2).map(l => l.file)]) {
  let html = read(file);
  if (!html.includes('href="/assets/css/product-languages.css"')) html = html.replace('</head>', '<link rel="stylesheet" href="/assets/css/product-languages.css">\n</head>');
  write(file, html);
}

const pages = ['/', '/fr/', ...locales.map(l => `/${l.file}`), '/contact.html'];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `  <url><loc>${origin}${p}</loc></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Built ${locales.length} localized product pages and sitemap (${pages.length} URLs).`);
