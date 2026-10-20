import { WaitlistForm } from './WaitlistForm.jsx';

export function WaitlistSection() {
  return (
    <section className="waitlist-section" id="waitlist" aria-labelledby="waitlist-title">
      <div className="waitlist-orb waitlist-orb--one" aria-hidden="true" />
      <div className="waitlist-orb waitlist-orb--two" aria-hidden="true" />
      <div className="container waitlist-content">
        <p className="eyebrow">From Umuahia, outward</p>
        <h2 id="waitlist-title">Be part of something<br />that’s never existed<br /><span className="text-green">in Nigeria before.</span></h2>
        <p className="waitlist-lede">Kamba is in pre-launch. Leave your email when the waitlist connection is ready, and help us shape a marketplace built around local life.</p>
        <WaitlistForm source="closing-cta" />
        <p className="waitlist-assurance">No account yet. No pretend countdown. We’ll only say you’re in when a real submission succeeds.</p>
      </div>
      <div className="waitlist-bottom container"><span>LOCAL COMMERCE, CLOSER.</span><span>NG · ABIA STATE</span></div>
    </section>
  );
}
