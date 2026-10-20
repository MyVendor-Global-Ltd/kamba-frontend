const waitlistAnswer = import.meta.env.VITE_WAITLIST_ENDPOINT?.trim()
  ? 'Use the waitlist form on this page to send your details.'
  : 'The waitlist form is displayed, but no submission endpoint is configured yet, so details are not currently collected.';

const faqs = [
  { question: 'What is Kamba?', answer: 'Kamba is a pre-launch marketplace concept designed to help buyers discover nearby Nigerian sellers and give vendors a dedicated store page.' },
  { question: 'Is the Kamba app available to download?', answer: 'Not yet. The app is in pre-launch and its App Store and Google Play links will be announced when it is available.' },
  { question: 'Can I sign up for the Kamba waitlist?', answer: waitlistAnswer },
];

export function FaqSection() {
  return (
    <section className="faq-section container" id="faq" aria-labelledby="faq-title">
      <div className="faq-intro"><p className="eyebrow">Before we open the doors</p><h2 className="section-title" id="faq-title">A few clear answers.</h2></div>
      <div className="faq-list">
        {faqs.map((item, index) => (
          <details className="faq-item" key={item.question}>
            <summary><span>{String(index + 1).padStart(2, '0')}</span><b>{item.question}</b><i aria-hidden="true">+</i></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
