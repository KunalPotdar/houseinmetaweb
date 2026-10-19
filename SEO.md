# Multilingual search visibility

The primary French query is **maquette orbitale 3D**. The French and English homepages link to a family of nine product pages. The existing detailed French and English product pages keep their URLs and demonstrations.

| Language | Target phrase | Product URL |
| --- | --- | --- |
| French | maquette orbitale 3D | /pages/solutions/maquette-3d.html |
| English | orbital 3D model; interactive 3D property model | /pages/solutions/3d-model.html |
| Spanish | maqueta 3D interactiva inmobiliaria | /es/maqueta-3d-interactiva.html |
| German | interaktives 3D-Immobilienmodell | /de/interaktives-3d-immobilienmodell.html |
| Italian | modello 3D immobiliare interattivo | /it/modello-3d-immobiliare-interattivo.html |
| Portuguese | maquete 3D interativa | /pt/maquete-3d-interativa.html |
| Hindi | इंटरैक्टिव 3D प्रॉपर्टी मॉडल | /hi/interactive-3d-property-model.html |
| Simplified Chinese | 房地产交互式3D模型 | /zh/interactive-3d-property-model.html |
| Japanese | 不動産 インタラクティブ3Dモデル | /ja/interactive-3d-property-model.html |

These phrases are initial translations for the product category, not verified search-volume findings. Nine languages are the initial scope, rather than an exhaustive definition of “all major languages”. Review translations with native speakers and refine the wording using actual search-query data by market. The seven new pages contain translated product explanations; the linked live demonstration keeps its existing interface language. Their contact action opens email directly, while the established French and English pages keep their contact flow.

## Updating the pages

Edit the locale content and metadata in `scripts/build-seo.mjs`, then run:

```sh
node scripts/build-seo.mjs
node scripts/check-seo.mjs
```

The build updates the existing French/English product headings and metadata and regenerates the other seven product pages, language links, robots.txt and sitemap.xml. Edit existing French/English journey content in their HTML files. Generated pages use the existing premium design. All translated copy is in static HTML; indexing does not depend on JavaScript.

The sitemap covers the two homepages, nine product pages and contact page. It deliberately omits interactive viewer URLs and does not claim to inventory all blog or portfolio content. robots.txt permits crawling; it does not secure backend files or private data.

## After deployment

1. Deploy the changed HTML, CSS, robots.txt and sitemap.xml using the normal website publishing process. Local changes alone do not update search results.
2. Verify the domain in Google Search Console and Bing Webmaster Tools. Submit `https://www.houseinmeta.com/sitemap.xml` in both.
3. Inspect the French product URL in Search Console, confirm it is accessible and request indexing. Check the other language pages after publication.
4. Track impressions, clicks and average position by query, language page and country. Use observed queries to choose the next translations and improve content.
5. Add original project case studies, real demonstration screenshots and relevant links from clients or industry publications. Review mobile loading speed with PageSpeed Insights on the deployed site.

Top rankings cannot be guaranteed. Search engines decide indexing and ranking, and these changes do not establish a ranking timeline. The local validation checks metadata, JSON-LD, local link targets and language annotation consistency; it does not verify live deployment, search demand, translation quality or indexing.

Reference: [Google multilingual site guidance](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) and [localized page annotations](https://developers.google.com/search/docs/specialty/international/localized-versions).
