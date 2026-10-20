import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { BlurImage } from '../ui/BlurImage.jsx';

const moments = [
  { title: 'Your WhatsApp status disappears in 24 hours.', kicker: 'The feed moves on', art: 'status', detail: 'A good product should not vanish before the next customer sees it.' },
  { title: 'Being good at what you do is not the same as being easy to find.', kicker: 'Discovery takes a better home', art: 'market', detail: 'Local businesses need a place people can return to.' },
  { title: 'A first-time buyer needs more than a disappearing post.', kicker: 'Trust starts with context', art: 'trust', detail: 'A clear store page can make the first conversation feel less like a guess.' },
  { title: 'A payment chat should not leave either side guessing.', kicker: 'A clearer path matters', art: 'payment', detail: 'Kamba is being designed around more understandable buying journeys.' },
  { title: 'Posting all day is not the same as building a store.', kicker: 'Your work deserves a shelf', art: 'phone', detail: 'Keep the attention on what you make and the people who need it.' },
  { title: 'Local demand is closer than a crowded feed makes it feel.', kicker: 'The next customer may be nearby', art: 'nodes', detail: 'Kamba starts with the place your business already calls home.' },
];

function MomentArt({ moment }) {
  if (moment.art === 'market') {
    return <BlurImage className="moment-photo" src="/images/neighborhood-market-scene.webp" alt="Stylized neighborhood market scene created for Kamba." loading="lazy" />;
  }
  if (moment.art === 'phone') {
    return <BlurImage className="moment-photo moment-photo--phone" src="/images/kamba-phone-mockup.webp" alt="Illustrative phone mockup for the upcoming Kamba marketplace app." loading="lazy" />;
  }
  if (moment.art === 'nodes') {
    return <BlurImage className="moment-photo" src="/images/local-connection-nodes.webp" alt="Abstract node network representing local buyers and sellers." loading="lazy" />;
  }
  return (
    <div className={`moment-object moment-object--${moment.art}`} aria-hidden="true">
      {moment.art === 'status' && <><div className="social-post"><span className="post-avatar" /><i /><i /><div className="post-photo" /></div><span className="post-clock">24:00:00</span><span className="post-fade-line" /></>}
      {moment.art === 'trust' && <><div className="trust-ring"><span>PROFILE</span><b>?</b></div><span className="trust-line trust-line--one" /><span className="trust-line trust-line--two" /></>}
      {moment.art === 'payment' && <><div className="payment-node">Buyer</div><span className="payment-track"><i /></span><div className="payment-node payment-node--end">Seller</div><span className="payment-label">A clearer path · planned</span></>}
    </div>
  );
}

export function PainSection() {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    if (reduced || window.matchMedia('(max-width: 760px), (pointer: coarse)').matches) return undefined;
    let context;
    let disposed = false;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (disposed || !sectionRef.current) return;
      const gsap = gsapModule.gsap ?? gsapModule.default;
      const ScrollTrigger = triggerModule.ScrollTrigger ?? triggerModule.default;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const track = sectionRef.current.querySelector('.pain-track');
        const panels = gsap.utils.toArray('.pain-panel', sectionRef.current);
        const trackTween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: track,
            start: 'top top',
            end: () => `+=${Math.max(0, track.scrollWidth - window.innerWidth)}`,
            scrub: 0.8,
            pin: track,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const active = Math.min(panels.length, Math.floor(self.progress * panels.length) + 1);
              const counter = sectionRef.current?.querySelector('.pain-global-counter');
              if (counter) counter.textContent = `${String(active).padStart(2, '0')} / 06`;
              panels.forEach((panel, index) => {
                const itemCounter = panel.querySelector('.pain-count');
                if (itemCounter) itemCounter.dataset.active = String(index + 1 === active);
              });
            },
          },
        });
        panels.forEach((panel) => {
          gsap.fromTo(panel.querySelector('.pain-copy'),
            { opacity: 0.45, y: 24, filter: 'blur(4px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power3.inOut', scrollTrigger: { trigger: panel, containerAnimation: trackTween, start: 'left 72%', end: 'left 28%', scrub: true } },
          );
        });
        ScrollTrigger.refresh();
      }, sectionRef);
    }).catch((error) => console.error('Pain-story scroll enhancement unavailable:', error));
    return () => {
      disposed = true;
      context?.revert();
    };
  }, [reduced]);

  return (
    <section className="pain-section" ref={sectionRef} aria-labelledby="pain-title">
      <div className="pain-intro container">
        <p className="eyebrow">What local sellers already know</p>
        <h2 className="section-title" id="pain-title">Good work deserves<br /><span className="text-green">to be remembered.</span></h2>
        <p className="section-copy">Six everyday friction points. One idea: give the relationship a place to live beyond the scroll.</p>
        <span className="pain-global-counter" aria-live="polite">01 / 06</span>
      </div>
      <div className="pain-track">
        {moments.map((moment, index) => (
          <article className={`pain-panel pain-panel--${index + 1}`} key={moment.title} aria-label={`Moment ${index + 1} of 6`}>
            <div className="pain-panel-inner">
              <div className="pain-copy" data-cursor="read">
                <p className="section-kicker">{moment.kicker}</p>
                <h3>{moment.title}</h3>
                <p>{moment.detail}</p>
              </div>
              <div className="pain-art"><MomentArt moment={moment} /></div>
              <span className="pain-count" data-active={String(index === 0)}>{String(index + 1).padStart(2, '0')} <i>/</i> 06</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
