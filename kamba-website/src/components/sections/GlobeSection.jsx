import { BlurImage } from '../ui/BlurImage.jsx';
import { ViewportLazy } from '../ui/ViewportLazy.jsx';
import { ConnectionNodes } from '../3d/ConnectionNodes.jsx';

const cities = ['Umuahia', 'Aba', 'Lagos', 'Port Harcourt'];

export function GlobeSection() {
  return (
    <section className="globe-section" id="story" aria-labelledby="globe-title">
      <div className="container globe-layout">
        <div className="globe-copy">
          <p className="eyebrow">A marketplace with a sense of place</p>
          <h2 id="globe-title" className="section-title">Started in Umuahia.<br /><span className="text-green">Growing across Nigeria.</span></h2>
          <p className="section-copy">Great local businesses are already here. Kamba is designed to make nearby sellers easier to discover, one community at a time.</p>
          <ul className="city-list" aria-label="Launch and expansion cities">
            {cities.map((city, index) => <li key={city}><span className="city-dot" /> <span>{city}</span><small>{index === 0 ? 'starting point' : 'on the map'}</small></li>)}
          </ul>
        </div>
        <div className="globe-visual" aria-label="Illustration connecting Umuahia, Aba, Lagos and Port Harcourt">
          <ViewportLazy scene="globe" className="globe-canvas" />
          <div className="globe-mobile-fallback">
            <BlurImage src="/images/local-connection-nodes.webp" alt="Abstract emerald lines connecting buyer and seller nodes." loading="lazy" />
            <ConnectionNodes />
          </div>
          <span className="globe-orbit-label globe-orbit-label--north">ABIA STATE</span>
          <span className="globe-orbit-label globe-orbit-label--south">SOUTHERN NIGERIA</span>
        </div>
      </div>
      <div className="globe-bridge container"><span>NEIGHBORHOOD FIRST</span><i /><span>BUILT TO GROW WITH YOU</span></div>
    </section>
  );
}
