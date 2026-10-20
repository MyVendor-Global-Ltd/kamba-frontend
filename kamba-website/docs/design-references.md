# Kamba website design research

## Evidence and capture notes

The reference review happened before website source code was started. Playwright Chromium used a 1440 × 900 desktop viewport and captured screenshots at each successive viewport-height scroll stop through the end of each page. Nine of the ten live websites loaded, producing 144 screenshots; the tenth, Velwax, failed DNS resolution. The capture manifest is [`design-references/capture-index.json`](design-references/capture-index.json), and all captures are in [`design-references/screenshots/`](design-references/screenshots/). The screenshot filenames end in a two-digit scroll-step number.

The reference pages were observed as public websites, not reproduced. A screenshot is evidence of that browser session only; it does not establish a site's keyboard, screen-reader, performance, or mobile behavior. Linear's first captured viewport rendered only its navigation and an otherwise blank area, so that particular hero state is not treated as evidence of Linear's design.

## Ten website references

1. **Velwax** — [velwax.llc](https://velwax.llc/). The URL could not be resolved by DNS in the browser or direct HTTP checks. No visual, cursor, particle, 3D, responsive, or motion claims are made about this source. No screenshot was possible. [1]

2. **Linear** — [linear.app](https://linear.app/). The live page uses a restrained dark shell and high-contrast product storytelling. Detailed product-interface imagery carries the explanation, followed by feature narratives and customer proof; this is a useful model for editorial pacing, not a reason to copy Linear's UI. Twelve viewport-step captures were saved; the first is blank below the nav in this browser session. [2]

3. **Stripe** — [stripe.com](https://stripe.com/). The hero states a concrete outcome, supports it with brief copy and clear actions, then moves into modular product demonstrations and proof. The first viewport's vivid gradient is a strong example of a contained expressive visual against a clean information hierarchy. Seventeen viewport-step captures were saved. [3]

4. **Framer** — [framer.com](https://www.framer.com/). Its public product story progresses from a concise hero and demo into capability sections and proof. Framer's materials describe fade, slide, scale, blur, viewport/scroll triggers and state transitions as communication; Kamba should borrow that restraint and responsive reflow rather than turn every element into a motion effect. Twelve viewport-step captures were saved. [4]

5. **Apple iPhone** — [apple.com/iphone](https://www.apple.com/iphone/). Its product-first storytelling uses oversized concise headlines, large art-directed device imagery and sharply separated feature sections. This informs Kamba's pacing and product reveal, but its retail and product context is not Kamba's marketplace context. Twenty viewport-step captures were saved. [5]

6. **Paper + Land** — [live site](https://paperandland.com/) · [Awwwards entry](https://www.awwwards.com/sites/paper-land). The Awwwards entry records an Honorable Mention and lists several CSS 3D product/card and scroll-animation elements. The live shop opens with high-impact color and product-focused composition. Eleven viewport-step captures were saved. [6]

7. **Faster Displays** — [live product page](https://fasterdisplays.com/exhibitor) · [Awwwards entry](https://www.awwwards.com/sites/faster-displays). The entry describes scroll-linked 3D interactions that explain sustainability and product benefits, plus product morphing. This is useful for tying motion to product explanation rather than using it as decoration. Thirty-three viewport-step captures were saved. [7]

8. **TORCH** — [live site](https://torchsensors.webflow.io/) · [Awwwards entry](https://www.awwwards.com/sites/torch). The entry documents 3D scroll interaction on a product page. The live source displayed a preparation/loading state during research, so its 3D behavior could not be reliably confirmed from the text view. Sixteen viewport-step captures were saved. [8]

9. **Alphane Labs** — [live site](https://solutions.alphanelabs.com/) · [Awwwards entry](https://www.awwwards.com/sites/alphane-labs). The entry lists hero scroll animation, product-page scrolling and an interactive explainer; the live page describes a technical analyzer product. The useful lesson is a scroll narrative that progressively explains a complex offering. Fifteen viewport-step captures were saved. [9]

10. **Tabasco — The Root of a Legacy** — [live site](https://tabasco.abdurrahimali.com/) · [Awwwards entry](https://www.awwwards.com/sites/tabasco-the-root-of-a-legacy). The Awwwards entry describes a WebGL scrollytelling sequence for pepper ripening, barrel aging and product reveal, including a mobile rendition. The live page was client-rendered and the text extractor returned very little, so the entry description is the source for those interaction details. Eight viewport-step captures were saved. [10]

A further Awwwards example, [Propel's scroll-3D inspiration entry](https://www.awwwards.com/inspiration/scroll-3d-animation), labels the interaction with scroll, animation, 3D and navigation tags and exposes desktop/mobile screenshot entries. The live Propel URL exposed only a work-email prompt, so it is not counted among the ten sites above. [11]

## Pinterest search

The four requested searches were run: “claymorphism 3D web design 2025”, “neomorphism dark UI premium”, “scroll driven 3D website animation”, and “magnetic cursor web effect”. Pinterest pages were intermittently sign-in gated and often returned generic pin placeholders instead of usable pin metadata. The following ten URLs were surfaced as candidate references, not ten independently verified designs:

- [Candidate 1](https://www.pinterest.com/pin/611152611982822698/) — opened; described a warm claymorphism landing-page concept.
- [Candidate 2](https://www.pinterest.com/pin/466685580154302556/) — opened; sparse page content.
- [Candidate 3](https://www.pinterest.com/pin/74450200082915776/) — opened; titled “Dark Mode Neumorphism”, with dark/green controls on black.
- [Candidate 4](https://in.pinterest.com/pin/64880050876410830/) — surfaced in search; individual contents not confirmed.
- [Candidate 5](https://www.pinterest.com/pin/615867317825936937/) — surfaced in search; individual contents not confirmed.
- [Candidate 6](https://www.pinterest.com/pin/1084593522737644825/) — surfaced in search; individual contents not confirmed.
- [Candidate 7](https://www.pinterest.com/pin/scrolling-car-website-concept--125186064629283253/) — surfaced in search; individual contents not confirmed.
- [Candidate 8](https://in.pinterest.com/pin/atlys-3d-scrolldriven-animation-premium-onboarding-story-video--196610339985508135/) — opened; title indicates a scroll-driven 3D onboarding-story concept, but the animation itself was not available for inspection.
- [Candidate 9](https://www.pinterest.com/pin/codefree-scrolling-animations-and-microinteractions-with-webydo--25895766584423932/) — surfaced in search; individual contents not confirmed.
- [Candidate 10](https://www.pinterest.com/pin/awesome-3d-animation-javascript-tutorial--385972630572716944/) — surfaced in search; individual contents not confirmed.

Accordingly, the ten website references above satisfy the documented-reference set; the Pinterest list is a transparent record of ten candidate URLs, not a claim that all ten pins were visually validated. [12] [13] [14] [15] [16] [17] [18] [19] [20] [21]

## Direction selected for Kamba

Use a cinematic but legible charcoal-and-emerald identity. Make the hero explain the local marketplace in direct language, then give a short sequence of seller/buyer pain points, the interactive four-round vendor game, concrete product benefits, a phone reveal and a founding waitlist action. The key reference lesson is contrast between strong art direction and clear information: use large typography and one prominent visual at a time, not a wall of generic cards.

Desktop may use a magnetic cursor, a restrained particle treatment and a few scroll-linked reveals where they explain Kamba. On touch devices, replace the particle grid with a static gradient, omit heavy 3D, preserve interaction meaning while reducing motion complexity, and honor `prefers-reduced-motion`. The app preview and generated decorative visuals must not imply that app-store distribution or real transactions are live.

Use semantic H1/H2/H3 structure, keyboard-operable controls, visible focus, meaningful image alternatives, accessible contrast and reduced-motion behavior. Avoid emojis and claims unsupported by real product data. In particular, the brief's example waitlist/order counters must not be shown as real: the project currently has zero users and no connected waitlist backend. Any signup UI must disclose whether a real endpoint is configured.

## References

[1]: https://velwax.llc/ "Velwax"
[2]: https://linear.app/ "Linear"
[3]: https://stripe.com/ "Stripe"
[4]: https://www.framer.com/ "Framer"
[5]: https://www.apple.com/iphone/ "Apple iPhone"
[6]: https://www.awwwards.com/sites/paper-land "Paper + Land — Awwwards entry"
[7]: https://www.awwwards.com/sites/faster-displays "Faster Displays — Awwwards entry"
[8]: https://www.awwwards.com/sites/torch "TORCH — Awwwards entry"
[9]: https://www.awwwards.com/sites/alphane-labs "Alphane Labs — Awwwards entry"
[10]: https://www.awwwards.com/sites/tabasco-the-root-of-a-legacy "Tabasco — Awwwards entry"
[11]: https://www.awwwards.com/inspiration/scroll-3d-animation "Awwwards — Propel scroll 3D inspiration"
[12]: https://www.pinterest.com/pin/611152611982822698/ "Pinterest claymorphism candidate"
[13]: https://www.pinterest.com/pin/466685580154302556/ "Pinterest dark UI candidate"
[14]: https://www.pinterest.com/pin/74450200082915776/ "Pinterest Dark Mode Neumorphism pin"
[15]: https://in.pinterest.com/pin/64880050876410830/ "Pinterest design candidate"
[16]: https://www.pinterest.com/pin/615867317825936937/ "Pinterest design candidate"
[17]: https://www.pinterest.com/pin/1084593522737644825/ "Pinterest design candidate"
[18]: https://www.pinterest.com/pin/scrolling-car-website-concept--125186064629283253/ "Pinterest scrolling vehicle concept"
[19]: https://in.pinterest.com/pin/atlys-3d-scrolldriven-animation-premium-onboarding-story-video--196610339985508135/ "Pinterest Atlys 3D scroll story candidate"
[20]: https://www.pinterest.com/pin/codefree-scrolling-animations-and-microinteractions-with-webydo--25895766584423932/ "Pinterest Webydo scrolling animation candidate"
[21]: https://www.pinterest.com/pin/awesome-3d-animation-javascript-tutorial--385972630572716944/ "Pinterest 3D animation tutorial candidate"
