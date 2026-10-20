import { useEffect, useRef, useState } from 'react';
import { BlurImage } from '../ui/BlurImage.jsx';

const screens = [
  { label: '01 · OPEN', title: 'A good find starts close.', body: 'A quiet hello to a more local kind of shopping.' },
  { label: '02 · BROWSE', title: 'See what’s around you.', body: 'Discover products and people in your area.' },
  { label: '03 · STORE', title: 'Meet the person behind it.', body: 'A seller page designed to keep the details together.' },
];

export function AppSection() {
  const sectionRef = useRef(null);
  const [screen, setScreen] = useState(1);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return undefined;
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = element.getBoundingClientRect();
        const max = Math.max(1, element.offsetHeight - window.innerHeight);
        const progress = Math.max(0, Math.min(0.999, -rect.top / max));
        setScreen(Math.min(2, Math.floor(progress * 3)));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="app-section" id="app-preview" ref={sectionRef} aria-labelledby="app-title">
      <div className="app-sticky">
        <div className="container app-layout">
          <div className="app-copy">
            <p className="eyebrow">A new way to look around</p>
            <h2 className="section-title" id="app-title">A local marketplace,<br /><span className="text-green">in your pocket.</span></h2>
            <p className="section-copy">Kamba is still being built. Here’s a visual preview of the kind of browse-and-discover experience we’re working toward.</p>
            <div className="app-screen-copy" aria-live="polite">
              <span className="feature-index">{screens[screen].label}</span>
              <h3>{screens[screen].title}</h3>
              <p>{screens[screen].body}</p>
            </div>
            <div className="app-store-actions" aria-label="App store availability">
              <div className="app-store-badge" role="note"><span className="store-badge-mark" aria-hidden="true">A</span><span><small>Download on the</small><b>App Store</b><em>Coming Soon</em></span></div>
              <div className="app-store-badge" role="note"><span className="play-badge-mark" aria-hidden="true">▷</span><span><small>GET IT ON</small><b>Google Play</b><em>Coming Soon</em></span></div>
            </div>
            <p className="app-preview-disclaimer">Screens shown are illustrative, not a live app or store listing.</p>
          </div>
          <div className="phone-stage" data-screen={screen}>
            <div className="phone-halo" aria-hidden="true" />
            <div className="phone-frame">
              <BlurImage className="phone-art-image" src="/images/kamba-phone-mockup.webp" alt="Generated Kamba marketplace phone mockup shown as illustrative launch artwork." loading="lazy" />
              <div className={`phone-ui phone-ui--${screen}`} aria-hidden="true">
                <div className="phone-status"><span>9:41</span><span>•••</span></div>
                {screen === 0 && <div className="phone-splash"><span className="phone-logo-mark">K</span><b>Kamba</b><small>Local looks good on you.</small></div>}
                {screen === 1 && <div className="phone-browse"><span className="phone-ui-kicker">NEAR YOUR AREA</span><b>Good finds,<br />closer by.</b><div className="phone-search-line" /><div className="phone-product-lines"><i /><i /><i /></div></div>}
                {screen === 2 && <div className="phone-store"><span className="phone-store-cover" /><span className="phone-store-avatar">K</span><b>Made nearby</b><small>Local seller · preview</small><div className="phone-product-lines"><i /><i /><i /></div></div>}
                <div className="phone-tabs"><i /><i /><i /><i /></div>
              </div>
            </div>
            <span className="phone-floating-label phone-floating-label--top">DISCOVER NEAR YOU</span>
            <span className="phone-floating-label phone-floating-label--bottom">A FUTURE APP PREVIEW</span>
          </div>
        </div>
      </div>
    </section>
  );
}
