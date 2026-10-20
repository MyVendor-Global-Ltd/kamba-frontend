import { BrandMark } from './BrandMark.jsx';
import { MagneticButton } from './MagneticButton.jsx';

const links = [
  { label: 'The idea', href: '#story' },
  { label: 'The game', href: '#the-game' },
  { label: 'What’s coming', href: '#features' },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <a className="site-brand" href="#top" aria-label="Kamba — home">
          <BrandMark size="small" />
          <span>Kamba</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <MagneticButton href="#waitlist" className="header-cta" variant="quiet">
          Get early access <span aria-hidden="true">↗</span>
        </MagneticButton>
        <a className="mobile-nav-cta" href="#waitlist">Early access <span aria-hidden="true">↗</span></a>
      </div>
    </header>
  );
}
