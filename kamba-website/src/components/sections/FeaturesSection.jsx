import { GlowCard } from '../ui/GlowCard.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { ConnectionNodes } from '../3d/ConnectionNodes.jsx';
import { BlurImage } from '../ui/BlurImage.jsx';

function StoreMockup() {
  return (
    <div className="store-mockup" aria-label="Illustrative future seller storefront preview">
      <div className="store-mockup-top"><span className="store-avatar">K</span><span className="store-name"><b>Made nearby</b><small>Seller storefront · preview</small></span><span className="store-status">PLANNED</span></div>
      <div className="store-mockup-banner"><span>YOUR NEXT GOOD FIND<br /><b>could be closer.</b></span><span className="store-banner-mark">K</span></div>
      <div className="store-mockup-bottom"><span>Thoughtful goods, made in your area.</span><span className="store-dots"><i /><i /><i /></span></div>
    </div>
  );
}

function LocationMap() {
  return (
    <div className="location-visual" aria-hidden="true">
      <div className="map-grid" />
      <svg viewBox="0 0 360 220" role="presentation">
        <path d="M22 166C73 136 90 79 146 97S221 180 281 116 322 75 342 55" fill="none" stroke="url(#map-line)" strokeWidth="2" strokeDasharray="4 8" />
        <defs><linearGradient id="map-line"><stop stopColor="#2db845" stopOpacity=".16"/><stop offset=".5" stopColor="#62f17d"/><stop offset="1" stopColor="#f5a623" stopOpacity=".4"/></linearGradient></defs>
        {[[22,166,'NEARBY'],[146,97,'YOUR AREA'],[281,116,'LOCAL'],[342,55,'NEXT']].map(([x,y,label]) => (
          <g key={label}><circle cx={x} cy={y} r="18" fill="#2db845" opacity=".12"/><circle cx={x} cy={y} r="5" fill="#62f17d"/><text x={x + 11} y={y - 10} fill="#d5f7dc" fontSize="9" fontFamily="monospace">{label}</text></g>
        ))}
      </svg>
      <span className="location-chip">DISCOVER AROUND YOU</span>
    </div>
  );
}

function PaymentPath() {
  return (
    <div className="payment-visual" aria-hidden="true">
      <div className="payment-flow-node"><span>01</span><b>Choose</b></div>
      <span className="payment-flow-line"><i /></span>
      <div className="payment-flow-node payment-flow-node--active"><span>02</span><b>Connect</b></div>
      <span className="payment-flow-line payment-flow-line--gold"><i /></span>
      <div className="payment-flow-node"><span>03</span><b>Complete</b></div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className="features-section" id="features" aria-labelledby="features-title">
      <div className="container">
        <SectionHeading
          eyebrow="A home for local commerce"
          id="features-title"
          title={<>Less scroll. <span className="text-green">More connection.</span></>}
          copy="The pieces of a more useful local marketplace, designed around the way Nigerian sellers and buyers already move."
        />
        <div className="feature-bento">
          <GlowCard className="feature-cell feature-store">
            <div className="feature-copy"><span className="feature-index">01 / STORE</span><h3>A place for everything you make.</h3><p>A dedicated storefront concept, designed to stay easy to find beyond a single social post.</p></div>
            <StoreMockup />
          </GlowCard>
          <GlowCard className="feature-cell feature-location">
            <span className="feature-index">02 / NEAR YOU</span><h3>Local should feel local.</h3><p>Explore around your area, then follow the path from discovery to a seller conversation.</p>
            <LocationMap />
          </GlowCard>
          <GlowCard className="feature-cell feature-payment">
            <span className="feature-index">03 / BUYING PATH</span><h3>Make the next step clearer.</h3><p>Payment tools are planned. No payment is processed on this pre-launch page.</p>
            <PaymentPath />
            <span className="planned-pill">IN DEVELOPMENT</span>
          </GlowCard>
          <GlowCard className="feature-cell feature-posts">
            <div className="feature-copy"><span className="feature-index">04 / STAY VISIBLE</span><h3>Your best work deserves more than a disappearing post.</h3><p>A lasting place to show what is available, so discovery can continue after the feed moves on.</p></div>
            <div className="post-comparison" aria-label="Illustration comparing a temporary social post with a planned Kamba store page">
              <div className="post-preview post-preview--temporary"><span>STORY · 23H LEFT</span><i /><i /><b>gone by morning</b></div>
              <span className="comparison-arrow" aria-hidden="true">→</span>
              <div className="post-preview post-preview--store"><span>KAMBA · STORE PREVIEW</span><i /><i /><b>your work, in one place</b></div>
            </div>
          </GlowCard>
          <GlowCard className="feature-cell feature-benefit feature-benefit--one">
            <span className="benefit-symbol" aria-hidden="true">↗</span><span className="feature-index">05 / DISCOVER</span><h3>People can find the work around them.</h3><p>Start close. Let a neighborhood become a natural first market.</p>
          </GlowCard>
          <GlowCard className="feature-cell feature-benefit feature-benefit--two">
            <span className="benefit-symbol benefit-symbol--gold" aria-hidden="true">⌁</span><span className="feature-index">06 / BUILD</span><h3>Make the next post count.</h3><p>Give products, services and availability a clearer story to share.</p>
          </GlowCard>
        </div>
        <div className="feature-connection-note"><div className="feature-connection-art"><BlurImage src="/images/local-connection-nodes.webp" alt="Abstract emerald paths connecting local buyer and seller nodes." loading="lazy" /><ConnectionNodes /></div><p><span>Built from the neighborhood outward.</span> A marketplace concept shaped around real places, not an endless feed.</p></div>
      </div>
    </section>
  );
}
