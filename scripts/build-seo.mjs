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
  { lang: 'fr', name: 'Français', file: 'pages/solutions/maquette-3d.html', title: 'Transformer un plan 2D en appartement 3D et visite VEFA', description: 'Transformez un plan d’appartement 2D en 3D. Visualisez l’agencement, la lumière, le mobilier et les finitions avant un achat VEFA ou une livraison sur plan.', question: 'Comment transformer un plan 2D en appartement 3D ?', answer: 'HouseInMeta transforme un plan d’appartement approuvé en expérience 3D interactive. Explorez l’agencement, les circulations, le mobilier et les finitions avant la construction, puis vérifiez les surfaces et spécifications sur les documents officiels VEFA.', demo: 'Explorer la démonstration', contact: 'Parlons de votre projet', home: 'Accueil', sections: [ ['Explorer le programme et son environnement', 'La vue aérienne permet de comprendre l’implantation des bâtiments, les espaces paysagers et les accès. Le parcours piéton présente les façades et les cheminements à hauteur humaine.'], ['Passer du plan au logement', 'Transformez un plan PDF ou une image approuvée en représentation 3D pour explorer les pièces, les circulations et les vues intérieures avant la livraison.'], ['Préparer un achat ou aménagement VEFA', 'Une visite virtuelle aide à discuter du mobilier, des teintes et des finitions. Les surfaces, détails techniques et la lumière doivent être vérifiés sur les documents officiels.'] ] },
  { lang: 'en', name: 'English', file: 'pages/solutions/3d-model.html', title: '2D to 3D condo and apartment walkthrough visualiser', description: 'Convert a builder or blueprint floor plan into a pre-construction condo or off-plan apartment walkthrough. Explore layouts, sunlight, furniture and finishes in 3D.', question: 'How do you create a 3D apartment walkthrough from a floor plan?', answer: 'HouseInMeta turns approved 2D apartment, condo or flat floor plans into browser-based 3D experiences. Buyers can review room layouts, circulation, furniture placement, finishes and illustrative sunlight before construction or renovation.', demo: 'Explore the live demo', contact: 'Discuss your project', home: 'Home', sections: [ ['Convert a floor plan into 3D', 'Upload or provide an approved apartment plan to create an interactive spatial representation, including 2 BHK or 3 BHK layouts for suitable projects.'], ['Explore before construction', 'Move through a virtual apartment, compare layouts and review room proportions. Sunlight views are illustrative and should be checked against official plans and local conditions.'], ['Plan furniture and finishes', 'Preview furniture layout options and interior finishes before renovation or purchase. Confirm dimensions, building specifications and Vastu requirements separately where relevant.'] ] },
  { lang: 'es', name: 'Español', file: 'es/maqueta-3d-interactiva.html', title: 'Convertir plano 2D a 3D y recorrido virtual de piso', description: 'Convierta un plano de piso o apartamento 2D en una maqueta 3D interactiva y explore la distribución, mobiliario y acabados en el navegador.', question: '¿Cómo convertir un plano 2D a 3D?', answer: 'HouseInMeta transforma planos aprobados de pisos y apartamentos en una representación 3D interactiva. Explore habitaciones, recorridos, mobiliario y acabados antes de la compra o construcción; las dimensiones finales deben verificarse en la documentación oficial.', demo: 'Explorar la demostración', contact: 'Hablemos de su proyecto', home: 'Inicio', sections: [ ['Convertir el plano de una vivienda', 'Proporcione una imagen o plano digital aprobado para crear una visualización espacial del piso y revisar la distribución antes de comprar sobre plano.'], ['Recorrer el piso virtualmente', 'Explore el apartamento desde el navegador y entienda cómo se conectan las habitaciones. Es útil para compradores que todavía no pueden visitar una vivienda en construcción.'], ['Comparar mobiliario y acabados', 'Pruebe opciones de distribución y acabados como propuesta de diseño. Confirme medidas, orientaciones y especificaciones con el promotor.'] ] },
  { lang: 'de', name: 'Deutsch', file: 'de/interaktives-3d-immobilienmodell.html', title: '2D Grundriss in 3D umwandeln und Wohnung visualisieren', description: 'Verwandeln Sie einen 2D-Grundriss in eine interaktive 3D-Wohnung. Visualisieren Sie Neubauwohnungen, Raumaufteilung, Möblierung und virtuelle Rundgänge vor dem Kauf.', question: 'Wie kann ich einen 2D-Grundriss in 3D umwandeln?', answer: 'HouseInMeta verwandelt einen freigegebenen 2D-Grundriss in eine interaktive 3D-Darstellung einer Wohnung. Käufer können Raumaufteilung, Möblierung, Innenausstattung und illustrative Lichtverhältnisse vor dem Bau oder Kauf ansehen.', demo: 'Demo erkunden', contact: 'Projekt besprechen', home: 'Startseite', sections: [ ['Grundriss in 3D visualisieren', 'Stellen Sie einen klaren oder digitalen Grundriss bereit, um eine räumliche 3D-Darstellung zu erstellen. Das hilft bei Neubauwohnungen und Wohnungen in der Bauphase.'], ['Wohnung virtuell erkunden', 'Bewegen Sie sich durch die Wohnräume und verstehen Sie Verbindungen, Proportionen und Wege. Die simulierte Sonneneinstrahlung ist illustrativ und keine technische Lichtanalyse.'], ['Möblierung und Ausstattung vergleichen', 'Prüfen Sie Möbelpositionen, Bodenbeläge und Wandfarben in einer virtuellen Variante. Bestätigen Sie Maße und Ausstattungsoptionen mit dem Bauträger.'] ] },
  { lang: 'it', name: 'Italiano', file: 'it/modello-3d-immobiliare-interattivo.html', title: 'Modello 3D interattivo per progetti immobiliari', description: 'Esplora un modello 3D orbitale con viste aeree, percorsi pedonali, selezione degli appartamenti e visite virtuali direttamente nel browser.', question: 'Che cos’è un modello 3D orbitale immobiliare?', answer: 'Un modello 3D orbitale è una rappresentazione interattiva di un progetto immobiliare. Consente di osservare gli edifici e il contesto da diversi punti di vista, per poi esplorare le singole abitazioni e gli interni. Aiuta a presentare il progetto prima della costruzione.', demo: 'Esplora la demo', contact: 'Parliamo del tuo progetto', home: 'Pagina iniziale', sections: [ ['Esplora il progetto e il contesto', 'Le viste aeree mostrano la disposizione degli edifici, le aree verdi e gli accessi. Il percorso pedonale permette di scoprire facciate e camminamenti a livello della strada.'], ['Dall’edificio all’appartamento', 'Il percorso collega la panoramica del progetto alla selezione dell’edificio, del piano e dell’abitazione. Le planimetrie e le viste interne aiutano a comprendere la distribuzione degli spazi.'], ['Presenta gli immobili prima della costruzione', 'Il modello 3D interattivo offre un riferimento visivo a promotori, team commerciali e acquirenti. Esplora la dimostrazione Parc de Lac nel browser per scoprire un esempio concreto dell’esperienza.'] ] },
  { lang: 'pt', name: 'Português', file: 'pt/maquete-3d-interativa.html', title: 'Maquete 3D interativa para empreendimentos imobiliários', description: 'Explore uma maquete 3D orbital com vistas aéreas, percurso pedonal, seleção de apartamentos e visitas virtuais diretamente no navegador.', question: 'O que é uma maquete 3D orbital?', answer: 'Uma maquete 3D orbital é uma representação interativa de um empreendimento imobiliário. Permite observar os edifícios e a envolvente a partir de vários pontos de vista, seguindo depois para as habitações e os interiores. Ajuda a apresentar um projeto antes da construção.', demo: 'Explorar a demonstração', contact: 'Fale sobre o seu projeto', home: 'Início', sections: [ ['Explore o empreendimento e a envolvente', 'As vistas aéreas mostram a disposição dos edifícios, os espaços verdes e os acessos. O percurso pedonal permite descobrir fachadas e caminhos ao nível da rua.'], ['Do edifício ao apartamento', 'O percurso liga a visão geral do empreendimento à seleção do edifício, do piso e da habitação. As plantas e as vistas interiores ajudam a compreender a organização dos espaços.'], ['Apresente imóveis antes da construção', 'A maquete 3D interativa oferece uma referência visual a promotores, equipas comerciais e compradores. Explore a demonstração Parc de Lac no navegador para descobrir um exemplo concreto desta experiência.'] ] },
  { lang: 'hi', name: 'हिन्दी', file: 'hi/interactive-3d-property-model.html', title: '2 BHK फ़्लोर प्लान को ऑनलाइन 3D वॉकथ्रू में बदलें', description: '2 BHK या निर्माणाधीन फ़्लैट का बिल्डर फ़्लोर प्लान ऑनलाइन 3D वॉकथ्रू में देखें। कमरे, फ़र्नीचर लेआउट, फिनिश और वास्तु विकल्पों की जानकारी लें।', question: 'बिल्डर के फ़्लोर प्लान को 3D में कैसे बदलें?', answer: 'HouseInMeta स्वीकृत 2D फ़्लोर प्लान को ब्राउज़र में चलने वाले 3D फ्लैट विज़ुअल में बदलने में मदद करता है। खरीदार 2 BHK लेआउट, कमरे, फ़र्नीचर प्लेसमेंट और अंदरूनी फिनिश निर्माण से पहले देख सकते हैं। वास्तु और वास्तु नियमों की पुष्टि योग्य वास्तु सलाहकार से अलग से करें।', demo: 'डेमो देखें', contact: 'अपने प्रोजेक्ट पर बात करें', home: 'मुखपृष्ठ', sections: [ ['फ़्लोर प्लान से 3D मॉडल', 'स्वीकृत 2D फ़्लोर प्लान या बिल्डर प्लान दें ताकि कमरे और प्रवेश, रसोई, बालकनी तथा रास्तों का 3D दृश्य तैयार किया जा सके।'], ['निर्माणाधीन फ़्लैट का वर्चुअल टूर', 'ब्राउज़र में फ़्लैट का वॉकथ्रू देखें और खुले स्थान, कमरे की दूरी तथा बैठने की व्यवस्था समझें। यह आधिकारिक आयामों का विकल्प नहीं है।'], ['फ़र्नीचर और फ़िनिश व्यवस्थित करें', 'फर्नीचर, flooring और wall finish के विकल्पों की तस्वीरें देखें। Vastu के दिशा-निर्देश या संरचनात्मक बदलावों की पुष्टि वास्तु विशेषज्ञ या वास्तुशिल्पी से कराएँ।'] ] },
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
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3386025353566002"
     crossorigin="anonymous"></script>
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
  const l = lang === 'en' ? { ...product, title: '3D floor plans and walkthroughs for home buyers & renovators', description: 'Visualize future homes and renovations in 3D. HouseInMeta helps home buyers, renovators, architects and interior designers explore floor plans, layouts, sunlight and finishes before making a decision.' } : product;
  html = html.replace(/<title>.*?<\/title>/, `<title>${esc(l.title)} | HouseInMeta</title>`);
  html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(l.description)}">`);
  for (const prop of ['og:description']) html = html.replace(new RegExp(`<meta property="${prop}"[^>]*>`), `<meta property="${prop}" content="${esc(l.description)}">`);
  html = html.replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(l.description)}">`);
  // Describe the actual platform; avoid agency claims and FAQs absent from the page.
  html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  const graph = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': `${origin}/#organization`, name: 'HouseInMeta', url: `${origin}/`, logo: `${origin}/assets/images/HouseInMeta-newlogo.png`, email: 'houseinmeta@gmail.com' },
    { '@type': 'WebSite', '@id': `${origin}/#website`, name: 'HouseInMeta', url: `${origin}/`, inLanguage: ['en', 'fr'], publisher: { '@id': `${origin}/#organization` } },
    { '@type': 'WebPage', '@id': `${origin}${homepage}#webpage`, url: `${origin}${homepage}`, name: l.title, description: l.description, inLanguage: lang, isPartOf: { '@id': `${origin}/#website` }, about: { '@type': 'Service', name: l.title, provider: { '@id': `${origin}/#organization` } } }
  ] };
  html = html.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(l.title)} | HouseInMeta">`);
  html = html.replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(l.title)} | HouseInMeta">`);
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

const blogPages = fs.readdirSync(path.join(root, 'pages/blog')).filter(file => file.endsWith('.html')).map(file => `/pages/blog/${file}`);
const pages = ['/', '/fr/', ...locales.map(l => `/${l.file}`), '/contact.html', ...blogPages];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `  <url><loc>${origin}${p}</loc></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Built ${locales.length} localized product pages and sitemap (${pages.length} URLs).`);
