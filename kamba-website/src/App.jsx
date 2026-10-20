import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { SiteHeader } from './components/ui/SiteHeader.jsx';
import { BrandMark } from './components/ui/BrandMark.jsx';
import { Loader } from './components/ui/Loader.jsx';
import { ScrollProgress } from './components/ui/ScrollProgress.jsx';
import { MagneticCursor } from './components/cursor/MagneticCursor.jsx';
import { Hero } from './components/sections/Hero.jsx';
import { GlobeSection } from './components/sections/GlobeSection.jsx';
import { PainSection } from './components/sections/PainSection.jsx';
import { GameSection } from './components/sections/GameSection.jsx';
import { FeaturesSection } from './components/sections/FeaturesSection.jsx';
import { AppSection } from './components/sections/AppSection.jsx';
import { WaitlistSection } from './components/sections/WaitlistSection.jsx';
import { FaqSection } from './components/sections/FaqSection.jsx';

export default function App() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [loaderVisible, setLoaderVisible] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(prefersReducedMotion);
    return () => delete document.documentElement.dataset.reducedMotion;
  }, [prefersReducedMotion]);

  useEffect(() => {
    let settled = false;
    let minimumTimer;
    let safetyTimer;
    const startedAt = performance.now();
    const finish = () => {
      if (settled) return;
      settled = true;
      const remaining = Math.max(0, 1500 - (performance.now() - startedAt));
      minimumTimer = window.setTimeout(() => setLoaderVisible(false), remaining);
    };
    const onLoad = () => finish();
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', onLoad, { once: true });
    safetyTimer = window.setTimeout(finish, 2600);
    return () => {
      window.removeEventListener('load', onLoad);
      window.clearTimeout(minimumTimer);
      window.clearTimeout(safetyTimer);
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    let lenis;
    let gsap;
    let update;
    const isMobile = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
    if (prefersReducedMotion || isMobile) return undefined;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')])
      .then(([gsapModule, triggerModule, lenisModule]) => {
        if (disposed) return;
        gsap = gsapModule.gsap ?? gsapModule.default;
        const ScrollTrigger = triggerModule.ScrollTrigger ?? triggerModule.default;
        const Lenis = lenisModule.default ?? lenisModule.Lenis;
        if (!gsap || !ScrollTrigger || !Lenis) return;
        gsap.registerPlugin(ScrollTrigger);
        lenis = new Lenis({
          duration: 1.4,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          syncTouch: false,
          touchMultiplier: 1.5,
        });
        lenis.on('scroll', ScrollTrigger.update);
        update = (time) => lenis?.raf(time * 1000);
        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);
        window.__kambaScrollTrigger = ScrollTrigger;
      })
      .catch((error) => console.error('Kamba smooth-scroll enhancement could not start:', error));

    return () => {
      disposed = true;
      if (gsap && update) gsap.ticker.remove(update);
      lenis?.destroy();
      if (window.__kambaScrollTrigger) {
        window.__kambaScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        delete window.__kambaScrollTrigger;
      }
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ScrollProgress />
      <MagneticCursor />
      <Loader visible={loaderVisible} />
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <GlobeSection />
        <PainSection />
        <GameSection />
        <FeaturesSection />
        <AppSection />
        <WaitlistSection />
        <FaqSection />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <a className="footer-brand" href="#top" aria-label="Kamba — back to top">
            <BrandMark size="small" />
            <span>Kamba</span>
          </a>
          <p>Local discovery, built for the people who make a place feel like home.</p>
          <span className="footer-note">Pre-launch · Nigeria</span>
        </div>
      </footer>
    </>
  );
}
