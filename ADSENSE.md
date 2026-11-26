# AdSense and privacy setup

The site preserves its existing visual design. The official asynchronous AdSense publisher snippet is installed once in the head of each of the five blog articles in `pages/blog/`, and nowhere else. It can make requests to Google when a blog page opens; actual ad display depends on account settings and eligibility. A certified advertising consent message has not yet been confirmed. Complete the account setup below before deploying these snippets for consent-dependent advertising. Analytics loads only after a separate opt-in at `/privacy-policy.html#cookies`. That control is **not** an advertising CMP and does not create TCF consent.

The homepage retains the existing publisher ID as a verification meta tag. `ads.txt` uses the same ID (`pub-3386025353566002`); compare it with the entry in your AdSense account before deployment. No AdSense account settings were changed by this repository update.

## Before enabling advertising

1. In AdSense **Privacy & messaging**, create and publish the European regulations message for `www.houseinmeta.com`, or install a Google-certified CMP. Include the required disclosures, provider list, refusal options and a persistent way to reopen advertising choices. Use the provider's actual generated integration instructions. Do not substitute the site's analytics controls for this step.
2. Verify consent behavior from the EEA, UK and Switzerland, including no choice, refusal, acceptance, withdrawal and a returning visit. Check that the CMP starts correctly without relying on a script that only loads after consent (a consent bootstrapping deadlock).
3. Review the five articles in `pages/blog/` before serving ads. Their snippets are already installed. Keep `404.html`, contact/privacy pages, careers, homepages, short translated landing pages, portfolios and all `clients/` and standalone viewers ad-free under the site's current policy. This is a conservative site decision, not a claim that Google prohibits every marketing or interactive page.
4. Configure Auto ads page exclusions in AdSense as well. Preview desktop and mobile placements. Exclude navigation, forms, article buttons and interactive content. Excluded areas do not necessarily exclude overlay formats; check those separately. Do not click live ads while testing.
5. The privacy page now describes blog-only AdSense integration. Name/link the actual participating providers, or their list in the published consent message. Offer advertising withdrawal separately from analytics preferences. Do not enable consent-dependent ads until these disclosures and controls match the implementation.
6. Check AdSense's Policy Center and ads.txt status after deploying. Verify that robots.txt permits the AdSense crawler and that public pages return their intended status codes. Approval and revenue are not guaranteed by these changes.

The publisher check enforces exactly one official snippet per blog article, the correct publisher ID, and no advertising scripts on other pages. It does not verify external CMP settings or live consent behavior. Add tests for the real CMP integration when configured; do not restore site-wide scripts.

## Analytics and disclosures

- `assets/js/privacy.js` loads GA4 on the three homepage files and careers page only after an explicit local choice. The privacy page itself does not load analytics. With no choice, expired consent, disabled JavaScript or unreadable storage, it makes no Google Analytics request.
- Choices expire after 180 days and can be changed on the privacy page. Revocation clears accessible first-party GA cookies and reloads other open tabs to discard already-loaded analytics. It cannot retract data already sent.
- Google Signals and ad personalization are disabled in the analytics configuration. Query strings, fragments and referrer URLs are excluded from the configured page view. In GA4, review Enhanced Measurement and disable automatic form interactions, outbound clicks and other collection that could include personal information. Verify the actual outgoing events before launch.
- Confirm the legal entity/controller details, real business address, data recipients, retention periods, international transfer arrangements and GA4 retention configuration. The previous placeholder address, presumed DPO, provider examples, fixed retention promises and blanket compliance claims were removed because they were not supported by the repository. Supply verified details where needed; this page is not a substitute for a review of your actual data practices.
- The policy describes the marketing website. Separately review the app at `app.houseinmeta.com` before accepting uploads, accounts or payments there.
- Existing articles should receive a human accuracy and image-rights review; generated translations should receive native-language review. Do not invent author credentials, project results, testimonials or statistics to make pages seem more authoritative.

## Local validation

```sh
node scripts/check-seo.mjs
node scripts/check-publisher.mjs
node --test scripts/privacy.test.mjs
```

No design stylesheets were replaced. The only new styles are scoped to the two analytics preference buttons on the existing privacy page.

References checked on 26 November 2026:

- [Google Publisher Policies](https://support.google.com/adsense/answer/10502938?hl=en)
- [Required privacy disclosures](https://support.google.com/adsense/answer/1348695?hl=en)
- [Certified CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en)
- [Auto ads page exclusions](https://support.google.com/adsense/answer/9262311?hl=en)
- [ads.txt guide](https://support.google.com/adsense/answer/12171612?hl=en)
