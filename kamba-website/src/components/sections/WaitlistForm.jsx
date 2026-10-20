import { useState } from 'react';
import { MagneticButton } from '../ui/MagneticButton.jsx';

export function WaitlistForm({ includePhone = false, source = 'website', vendorType = '' }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    const trimmedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus('error');
      setMessage('Enter a valid email address to continue.');
      return;
    }
    if (includePhone && phone.replace(/\D/g, '').length < 10) {
      setStatus('error');
      setMessage('Enter a phone number we can use to reach you.');
      return;
    }

    const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT?.trim();
    if (!endpoint) {
      setStatus('not-connected');
      setMessage('The waitlist is not connected yet. No details were sent.');
      return;
    }

    setStatus('sending');
    setMessage('Sending your request…');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          ...(includePhone ? { phone: phone.trim() } : {}),
          source,
          ...(vendorType ? { vendorType } : {}),
        }),
      });
      if (!response.ok) throw new Error('The waitlist service did not accept the request.');
      setStatus('success');
      setMessage("You're in. We'll reach out soon.");
      setEmail('');
      setPhone('');
    } catch {
      setStatus('error');
      setMessage('We could not send your details. Nothing was saved; please try again later.');
    }
  }

  if (status === 'success') {
    return (
      <div className="waitlist-success" role="status" aria-live="polite">
        <span className="success-check" aria-hidden="true">✓</span>
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form className={`waitlist-form${includePhone ? ' waitlist-form--phone' : ''}`} onSubmit={handleSubmit} noValidate>
      <div className="waitlist-fields">
        <label className="waitlist-field">
          <span className="visually-hidden">Email address</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="Your email address"
            value={email}
            onChange={(event) => { setEmail(event.target.value); if (status !== 'sending') { setStatus('idle'); setMessage(''); } }}
            required
          />
        </label>
        {includePhone && (
          <label className="waitlist-field waitlist-field--phone">
            <span className="visually-hidden">Nigerian phone number</span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              placeholder="Phone · +234 800 000 0000"
              value={phone}
              onChange={(event) => { setPhone(event.target.value); if (status !== 'sending') { setStatus('idle'); setMessage(''); } }}
              required
            />
          </label>
        )}
      </div>
      <MagneticButton type="submit" className="waitlist-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : includePhone ? 'Claim my spot' : 'Join the waitlist'}
        <span aria-hidden="true">↗</span>
      </MagneticButton>
      <p className={`waitlist-message waitlist-message--${status}`} role="status" aria-live="polite">{message || 'By submitting, you agree Kamba may contact you about early access.'}</p>
    </form>
  );
}
