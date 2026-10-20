import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { KambaMascot } from '../ui/KambaMascot.jsx';
import { WaitlistForm } from './WaitlistForm.jsx';

const rounds = [
  { name: 'The Finder', headline: "What's your business?", options: ['Food & Drinks', 'Fashion', 'Phones & Tech', 'Beauty', 'Skills & Services', 'Something Else'] },
  { name: 'The Reality Check', headline: 'How do new customers find you RIGHT NOW?', options: ['WhatsApp Status', 'Instagram / TikTok', 'Word of Mouth', 'They just walk in'] },
  { name: 'The Honest Moment', headline: 'What actually keeps you up at night?', options: ['Nobody can find me', "Buyers don't trust me", 'Getting scammed on payments', 'No time to keep posting'] },
  { name: 'The Flip', headline: 'What would YOU charge for it?', options: ['Free only', '₦500 – ₦2,000/mo', '₦2,000 – ₦5,000/mo', '₦5,000+/mo'] },
];

const resultCopy = {
  'Food & Drinks': 'Your best customers may already be just around the corner. Kamba is being shaped to help local sellers give their work a place people can find again.',
  Fashion: 'Your taste deserves a home beyond the feed. Kamba is being shaped to help local sellers show what they make and stay discoverable nearby.',
  'Phones & Tech': 'Good products need clear context. Kamba is being shaped to help nearby buyers find a seller and learn more before they reach out.',
  Beauty: 'Your next regular should not have to scroll past your work. Kamba is being shaped to make local beauty businesses easier to discover.',
  'Skills & Services': 'The best service is the one someone nearby can actually find. Kamba is being shaped to give local skills a more lasting place to show up.',
  'Something Else': 'Whatever you make or do, it deserves a place people can come back to. Kamba is being shaped around local discovery.',
};

function getMascotMood(round, stage, choice, hover) {
  if (stage === 'flip-intro') return 'thinking';
  if (stage === 'whisper') return 'smirk';
  if (stage === 'result') return 'joy';
  if (hover === 'WhatsApp Status' || choice === 'WhatsApp Status') return 'hide';
  if (hover || choice) return round === 3 ? 'thinking' : 'curious';
  return 'idle';
}

export function GameSection() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState('');
  const [hovered, setHovered] = useState('');
  const [stage, setStage] = useState('play');
  const [exitWave, setExitWave] = useState(false);
  const timers = useRef([]);
  const waveTimer = useRef(0);
  const reduce = useReducedMotion() ?? false;
  const current = rounds[roundIndex];
  const baseMood = getMascotMood(roundIndex, stage, selected, hovered);
  const mood = baseMood === 'idle' && exitWave ? 'wave' : baseMood;

  useEffect(() => () => {
    timers.current.forEach(window.clearTimeout);
    window.clearTimeout(waveTimer.current);
  }, []);

  useEffect(() => {
    if (roundIndex === 3 && stage === 'flip-intro') {
      const id = window.setTimeout(() => setStage('play'), reduce ? 0 : 2900);
      timers.current.push(id);
      return () => window.clearTimeout(id);
    }
    if (stage === 'whisper') {
      const id = window.setTimeout(() => setStage('result'), reduce ? 0 : 2800);
      timers.current.push(id);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [roundIndex, stage, reduce]);

  function choose(option) {
    if (stage !== 'play' || selected) return;
    setSelected(option);
    setAnswers((previous) => ({ ...previous, [roundIndex]: option }));
    setHovered('');
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(30);
    if (roundIndex < 3) {
      const next = roundIndex + 1;
      const id = window.setTimeout(() => {
        setSelected('');
        setRoundIndex(next);
        setStage(next === 3 ? 'flip-intro' : 'play');
      }, reduce ? 0 : 620);
      timers.current.push(id);
    } else {
      const id = window.setTimeout(() => setStage('whisper'), reduce ? 0 : 500);
      timers.current.push(id);
    }
  }

  function handlePointerEnter() {
    window.clearTimeout(waveTimer.current);
    setExitWave(false);
  }

  function handlePointerLeave() {
    setHovered('');
    setExitWave(true);
    window.clearTimeout(waveTimer.current);
    waveTimer.current = window.setTimeout(() => setExitWave(false), reduce ? 0 : 850);
  }

  function restart() {
    timers.current.forEach(window.clearTimeout);
    window.clearTimeout(waveTimer.current);
    timers.current = [];
    setAnswers({});
    setSelected('');
    setHovered('');
    setExitWave(false);
    setRoundIndex(0);
    setStage('play');
  }

  const business = answers[0] || 'Local';
  const channel = answers[1] || 'nearby discovery';
  const concern = answers[2] || 'local visibility';
  const price = answers[3] || '';

  return (
    <section className={`game-section game-section--${stage}`} id="the-game" aria-labelledby="game-section-title" onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
      <div className="game-spotlight" aria-hidden="true" />
      <div className="game-shell container">
        <header className="game-intro">
          <p className="eyebrow">A small thought experiment</p>
          <h2 className="game-section-title" id="game-section-title">Help us build the<br /><span className="text-green">marketplace you need.</span></h2>
          <p className="game-intro-copy">Four quick rounds. No right answers. Just a clearer picture of what local sellers want next.</p>
        </header>

        {stage !== 'result' ? (
          <div className="game-arena" aria-live="polite">
            <div className="game-question-column">
              {stage === 'flip-intro' ? (
                <div className="flip-intro" key="flip-intro">
                  <p className="section-kicker">THE FLIP · ONE LAST QUESTION</p>
                  <h3>Imagine you built the solution<br />to everything you just described.</h3>
                  <span className="flip-pause-note">Take a second.</span>
                </div>
              ) : stage === 'whisper' ? (
                <div className="flip-whisper" key="flip-whisper">
                  <p className="section-kicker">INTERESTING.</p>
                  <h3>Interesting. Because we&apos;re not<br />charging any of that.</h3>
                  <p className="flip-pause-note">A marketplace should be built around people, not pressure.</p>
                  <div className="confetti-layer" aria-hidden="true">
                    {Array.from({ length: 24 }, (_, index) => {
                      const angle = (index / 24) * Math.PI * 2;
                      return <i key={index} style={{ '--confetti-index': index, '--confetti-angle': `${index * 15}deg`, '--confetti-x': `${Math.cos(angle) * 250}px`, '--confetti-y': `${Math.sin(angle) * 215}px` }} />;
                    })}
                  </div>
                  <span className="result-flash" aria-hidden="true" />
                </div>
              ) : (
                <>
                  <div className="game-step-label"><span>ROUND {String(roundIndex + 1).padStart(2, '0')}</span><span>{current.name}</span></div>
                  <div className="game-progress" aria-label={`Round ${roundIndex + 1} of 4`}><span style={{ width: `${((roundIndex + 1) / 4) * 100}%` }} /></div>
                  <h3 className="game-question">{current.headline}</h3>
                  {roundIndex === 3 && <p className="flip-helper">The number is only a thought experiment. Kamba is not charging any of these amounts now.</p>}
                  <div className={`game-options game-options--round-${roundIndex + 1}`}>
                    {current.options.map((option, index) => (
                      <motion.button
                        key={option}
                        type="button"
                        className={`game-option${selected === option ? ' is-selected' : ''}${selected && selected !== option ? ' is-scattering' : ''}`}
                        onClick={() => choose(option)}
                        onPointerEnter={() => setHovered(option)}
                        onPointerLeave={() => setHovered('')}
                        onFocus={() => setHovered(option)}
                        onBlur={() => setHovered('')}
                        aria-pressed={selected === option}
                        disabled={stage !== 'play' || Boolean(selected)}
                        data-cursor="button"
                        initial={reduce ? false : { opacity: 0, y: 26, scale: 0.94 }}
                        animate={selected === option
                          ? { opacity: 0, x: index % 2 ? 165 : -165, y: -155, scale: 0.5, rotate: index % 2 ? 12 : -12 }
                          : selected
                            ? { opacity: 0.08, x: Math.cos(index * 1.4) * 240, y: Math.sin(index * 1.4) * 170, scale: 0.72, rotate: index % 2 ? 10 : -10 }
                            : { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
                        transition={reduce
                          ? { duration: 0 }
                          : { delay: selected ? 0 : index * 0.08, type: 'spring', stiffness: selected ? 150 : 190, damping: selected ? 18 : 18 }}
                        whileHover={reduce ? undefined : { y: roundIndex === 0 ? -8 : -4, rotateX: roundIndex === 0 ? 3 : 0, scale: 1.02 }}
                        whileTap={reduce ? undefined : { scale: 0.96 }}
                      >
                        <span className="option-index">{String(index + 1).padStart(2, '0')}</span>
                        <span>{option}</span>
                        <span className="option-arrow" aria-hidden="true">↗</span>
                      </motion.button>
                    ))}
                  </div>
                  {roundIndex < 3 && <p className="game-no-wrong">There are no wrong answers. Choose what feels closest.</p>}
                </>
              )}
            </div>
            <div className="game-mascot-column" aria-label="Kamba mascot responds to your choices">
              <div className="mascot-halo" aria-hidden="true" />
              <KambaMascot mood={mood} />
              <p className="mascot-caption">{stage === 'whisper' ? 'one honest moment' : stage === 'flip-intro' ? 'thinking it through' : hovered ? 'I’m listening' : 'Kamba is listening'}</p>
              {selected && stage === 'play' && roundIndex === 1 && <p className="mascot-reaction">{selected === 'WhatsApp Status' ? 'There goes the post.' : `Got it: ${selected}.`}</p>}
            </div>
          </div>
        ) : (
          <div className="game-result" key="game-result">
            <div className="result-orbit" aria-hidden="true" />
            <div className="result-badge"><span className="result-badge-mark"><span /></span><span>YOUR LOCAL PROFILE</span></div>
            <p className="eyebrow">A small picture of your next chapter</p>
            <h3>You are a <span className="text-green">{business}</span> vendor.</h3>
            <p className="result-summary">{resultCopy[business] || resultCopy['Something Else']}</p>
            <div className="result-insight"><span>YOU SAID</span><p>Customers find you through <b>{channel}</b>. The thing on your mind is <b>{concern.toLowerCase()}</b>{price ? `, and you would charge ${price.toLowerCase()}.` : '.'}</p></div>
            <div className="result-waitlist">
              <div><p className="section-kicker">BUILT FOR THE PEOPLE BEHIND THE BUSINESS</p><h4>We built Kamba for exactly this.</h4><p>Leave your email and phone when the waitlist connection is ready. No fake counts, no pretend reservation.</p></div>
              <WaitlistForm includePhone source="vendor-game" vendorType={business} />
            </div>
            <button type="button" className="game-restart" onClick={restart}>Play it again <span aria-hidden="true">↻</span></button>
          </div>
        )}
      </div>
    </section>
  );
}
