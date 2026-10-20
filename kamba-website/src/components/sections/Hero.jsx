import { useEffect, useRef } from 'react';
import { AnimatedText } from '../ui/AnimatedText.jsx';
import { BlurImage } from '../ui/BlurImage.jsx';
import { MagneticButton } from '../ui/MagneticButton.jsx';
import { ViewportLazy } from '../ui/ViewportLazy.jsx';

export function Hero() {
  const heroRef = useRef(null);
  const bagRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let context;
    const mobile = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (mobile || reduced) return undefined;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !heroRef.current) return;
      const gsap = gsapModule.gsap ?? gsapModule.default;
      const ScrollTrigger = triggerModule.ScrollTrigger ?? triggerModule.default;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.fromTo('.hero-word',
          { opacity: 0, y: 44, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12, ease: 'power4.out', delay: 0.18 },
        );
        gsap.fromTo('.hero-copy, .hero-actions, .hero-note',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.7 },
        );
        gsap.to(bagRef.current, {
          y: -50,
          scale: 0.78,
          rotateZ: -6,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 0.8 },
        });
        gsap.to('.hero-content', {
          y: -90,
          opacity: 0.32,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom 40%', scrub: 0.8 },
        });
      }, heroRef);
    }).catch((error) => console.error('Hero motion enhancement unavailable:', error));
    return () => { cancelled = true; context?.revert(); };
  }, []);

  return (
    <section className="hero-section" id="top" ref={heroRef} aria-labelledby="hero-title">
      <ViewportLazy scene="particles" className="hero-particles" />
      <div className="hero-ambient" aria-hidden="true" />
      <div className="container hero-layout">
        <div className="hero-content">
          <p className="eyebrow hero-launch">LAUNCHING 2026 · NIGERIA</p>
          <h1 className="hero-title" id="hero-title" aria-label="Your store. Your customers. Your area.">
            <span className="hero-line"><AnimatedText className="hero-word">Your store.</AnimatedText></span>
            <span className="hero-line hero-line--green"><AnimatedText className="hero-word">Your customers.</AnimatedText></span>
            <span className="hero-line"><AnimatedText className="hero-word">Your area.</AnimatedText></span>
          </h1>
          <p className="hero-copy">
            Kamba is being built for Nigerian student and neighborhood sellers who want to be found by people nearby.
          </p>
        <div className="hero-actions">
          <MagneticButton href="#waitlist" className="hero-primary">
            Join the Waitlist <span aria-hidden="true">↗</span>
            </MagneticButton>
            <MagneticButton href="#story" variant="glass" className="hero-secondary">
              See how it works <span aria-hidden="true">↓</span>
            </MagneticButton>
          </div>
          <p className="hero-note"><span className="hero-note-dot" /> Building in Umuahia, for sellers across Nigeria.</p>
        </div>
        <div className="hero-art" ref={bagRef} data-cursor="model">
          <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
          <div className="hero-bag-glow" aria-hidden="true" />
          <BlurImage
            className="hero-bag-image"
            src="/images/emerald-market-bag.webp"
            alt="Glossy emerald shopping bag illustration created for the Kamba local marketplace launch."
            loading="eager"
            fetchPriority="high"
          />
          <div className="floating-note floating-note--one"><span className="floating-note-index">01</span><span>Nearby discovery</span></div>
          <div className="floating-note floating-note--two"><span className="floating-note-index">02</span><span>Your own store page</span></div>
          <div className="floating-note floating-note--three"><span className="floating-note-index">03</span><span>Free to join</span></div>
          <span className="hero-art-caption">Local commerce, closer.</span>
        </div>
      </div>
      <a className="hero-scroll-hint" href="#story"><span className="scroll-hint-line" /> Scroll to explore</a>
      <div className="hero-bottom-meta container"><span>05°31′N 07°31′E</span><span>UMUAHIA · ABIA STATE</span><span>MADE FOR LOCAL COMMERCE</span></div>
    </section>
  );
}
