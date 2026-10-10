import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Heart, Gift, Sparkles, Cake, Music2, VolumeX, ArrowRight, Camera, Mail, Star, PartyPopper, ChevronLeft } from "lucide-react";
import "./styles.css";

const memories = [
  { image: "/photos/memory-1.png", title: "Certified chaos", caption: "Same chaos, same wavelength, zero explanations needed.", emoji: "🤪" },
  { image: "/photos/memory-2.png", title: "Mall-side legends", caption: "Same food cravings, same movie taste, same vibe.", emoji: "🛍️" },
  { image: "/photos/memory-3.png", title: "Festive besties", caption: "Different outfits, same bestie energy.", emoji: "💛" },
  { image: "/photos/memory-4.png", title: "Main character", caption: "Main character energy, obviously.", emoji: "✨" },
  { image: "/photos/memory-5.png", title: "Cutie alert", caption: "The camera roll is basically our shared diary.", emoji: "📸" },
  { image: "/photos/memory-6.png", title: "Forever in the frame", caption: "One more memory for the bestie archive.", emoji: "🫶" },
  { image: "/photos/memory-7.png", title: "Flower-power Jamuni", caption: "Cute? Yes. Dramatic? Also yes.", emoji: "🌺" },
  { image: "/photos/memory-8.png", title: "Our little world", caption: "Sending reels instead of having normal conversations.", emoji: "💗" },
  { image: "/photos/memory-9.png", title: "Bestie energy", caption: "Same games, same movies, same food opinions.", emoji: "⭐" },
];
const gifts = [
  { emoji: "💌", title: "A tiny love letter", message: "Dear Jamuni, I love that we vibe on the same wavelength — same food cravings, same movie taste, same games, and an endless exchange of reels. Somehow even our random scrolling becomes a whole conversation. Life is more fun with you in it." },
  { emoji: "😂", title: "Your official award", message: "🏆 Awarded to Supriya aka Jamuni: CEO of being dramatic, professional yapper, and my favourite person to annoy. This award cannot be returned. Ever." },
  { emoji: "🧁", title: "A birthday wish", message: "May this year bring you ridiculous amounts of happiness, delicious food, big wins, peaceful days, and people who love you exactly as you are. You deserve all the good stuff." },
];
function App() {
  const [step, setStep] = useState(0), [giftOpen, setGiftOpen] = useState(null), [noCount, setNoCount] = useState(0);
  const [musicOn, setMusicOn] = useState(false), [confetti, setConfetti] = useState(false), [letterOpen, setLetterOpen] = useState(false);
  useEffect(() => {
    if (step === 3) { setConfetti(true); const t = setTimeout(() => setConfetti(false), 4500); return () => clearTimeout(t); }
  }, [step]);

  // Soft romantic instrumental made with gentle synth tones (no external audio file needed).
  // It starts only after the visitor clicks the music button, as browsers block autoplay.
  useEffect(() => {
    if (!musicOn) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setMusicOn(false);
      return;
    }

    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    const delay = ctx.createDelay(1.0);
    const feedback = ctx.createGain();
    const wet = ctx.createGain();
    master.gain.value = 0.55;
    delay.delayTime.value = 0.32;
    feedback.gain.value = 0.16;
    wet.gain.value = 0.13;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(ctx.destination);
    master.connect(ctx.destination);
    master.connect(delay);

    // Warm, slow chord progression: Fmaj7, C, G, Am7.
    const chords = [
      [174.61, 220.00, 261.63, 329.63],
      [130.81, 164.81, 196.00, 261.63],
      [146.83, 196.00, 220.00, 293.66],
      [110.00, 164.81, 220.00, 261.63],
    ];
    const melody = [
      523.25, 493.88, 440.00, 392.00,
      440.00, 392.00, 349.23, 329.63,
      392.00, 440.00, 493.88, 440.00,
      392.00, 329.63, 293.66, 261.63,
    ];
    let beat = 0;
    let timer;

    const playTone = (frequency, when, duration, volume, type = 'sine') => {
      const osc = ctx.createOscillator();
      const envelope = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, when);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(type === 'triangle' ? 1500 : 2200, when);
      envelope.gain.setValueAtTime(0.0001, when);
      envelope.gain.exponentialRampToValueAtTime(volume, when + 0.09);
      envelope.gain.exponentialRampToValueAtTime(0.0001, when + duration);
      osc.connect(filter);
      filter.connect(envelope);
      envelope.connect(master);
      osc.start(when);
      osc.stop(when + duration + 0.03);
    };

    const playBeat = () => {
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime + 0.02;
      const chordIndex = Math.floor(beat / 4) % chords.length;
      const chord = chords[chordIndex];
      // Long, quiet chord tones underneath the melody.
      if (beat % 4 === 0) {
        chord.forEach((frequency, i) => {
          playTone(frequency, now, 1.75, i === 0 ? 0.018 : 0.012, 'sine');
        });
      }
      // Gentle piano-like plucks, one note every half-second.
      const note = melody[beat % melody.length];
      playTone(note, now, 0.72, 0.045, 'triangle');
      // Occasional high sparkle to keep the background sweet and airy.
      if (beat % 4 === 2) playTone(note * 2, now, 0.42, 0.009, 'sine');
      beat += 1;
    };

    playBeat();
    timer = window.setInterval(playBeat, 500);
    return () => {
      window.clearInterval(timer);
      ctx.close().catch(() => {});
    };
  }, [musicOn]);

  const goNext = () => setStep(s => Math.min(s + 1, 6));
  const goBack = () => { setStep(s => Math.max(s - 1, 0)); setGiftOpen(null); };
  return <div className="site-shell">
    <div className="top-strip"><span>✦ A VERY IMPORTANT MESSAGE FOR JAMUNI ✦</span><span className="top-date">11 · 10 · 2006</span></div>
    <header className="nav">
      <button className="brand" onClick={() => setStep(0)}><span className="brand-icon">し</span><span>jamuni.exe <small>birthday edition</small></span></button>
      <div className="nav-right"><span className="nav-note">made with 101% love</span><button className="sound-button" onClick={() => setMusicOn(!musicOn)} aria-label="Toggle music">{musicOn ? <Music2 size={16}/> : <VolumeX size={16}/>} {musicOn ? "Music on" : "Play music"}</button></div>
    </header>
    {step > 0 && <div className="back-row"><button className="back-button" onClick={goBack}><ChevronLeft size={16}/> go back</button><span>YOUR SURPRISE IS {Math.round(step / 6 * 100)}% UNLOCKED</span></div>}
    <main>
      {step === 0 && <section className="hero section-wrap" id="home">
        <div className="hero-copy"><div className="eyebrow"><Sparkles size={14}/> TOP SECRET BIRTHDAY OPERATION</div>
          <h1>Oi, <span>Jamuni!</span><br/>I made you<br/><em>a thing.</em></h1>
          <p className="hero-desc">It contains nonsense, questionable levels of affection, and one extremely birthday-shaped surprise.</p>
          <div className="hero-actions"><button className="btn btn-red" onClick={goNext}>OPEN YOUR SURPRISE <ArrowRight size={17}/></button><span className="tiny-note">⚠️ side effects include smiling</span></div>
          <div className="hero-stats"><div><strong>01</strong><span>birthday girl</span></div><i></i><div><strong>∞</strong><span>inside jokes</span></div><i></i><div><strong>100%</strong><span>bestie love</span></div></div>
        </div>
        <div className="hero-art"><div className="sunburst"></div><div className="tape tape-one">TOP SECRET</div>
          <div className="character-card"><div className="card-top"><span>SHINCHAN ENERGY</span><span>NO. 011</span></div>
            <div className="cartoon-scene"><div className="doodle-star star-a">✦</div><div className="doodle-star star-b">★</div>
              <div className="shin-head"><div className="hair"></div><div className="brow left"></div><div className="brow right"></div><div className="eye eye-left"></div><div className="eye eye-right"></div><div className="cheek"></div><div className="mouth"></div></div>
              <div className="shin-body"><div className="shirt-mark">し</div></div><div className="arms"><span></span><span></span></div>
              <div className="speech-bubble">HAPPY B-DAY<br/>JAMUNIII!!</div><div className="mini-heart">♥</div>
            </div><div className="card-bottom"><span>chaos gremlin club</span><span>♡ bestie certified ♡</span></div>
          </div><div className="sticker sticker-left">BFF<br/>4EVER</div><div className="sticker sticker-right">NO<br/>BORING<br/>ALLOWED</div><div className="floating-note">pssst…<br/>you're loved!</div>
        </div>
      </section>}
      {step === 1 && <section className="quiz-section section-wrap"><div className="section-kicker">PAGE 01 / THE VERY SERIOUS QUIZ</div><div className="paper-panel quiz-panel">
        <div className="paper-grid"></div><div className="panel-sticker">SHINCHAN<br/>APPROVED</div><p className="scribble">Question number one…</p><h2>Do you wanna<br/><span>see your surprise?</span></h2><div className="question-doodle">🤨</div>
        <div className="answer-row"><button className="btn btn-red" onClick={goNext}>YES, OBVIOUSLY <Heart size={16} fill="currentColor"/></button><button className="btn btn-outline" style={{transform:`translate(${noCount%2?12:0}px, ${noCount%3?-4:0}px)`}} onClick={() => setNoCount(n=>n+1)}>{noCount > 1 ? "NICE TRY 😭" : "NO"}</button></div>
        <p className="microcopy">{noCount > 0 ? "The NO button has filed a complaint. Please choose wisely. 😤" : "Choose carefully. Shinchan is watching."}</p>
      </div></section>}
      {step === 2 && <section className="quiz-section section-wrap"><div className="section-kicker">PAGE 02 / VIBE CHECK</div><div className="paper-panel quiz-panel">
        <p className="scribble">Just checking…</p><h2>Are you ready for<br/><span>maximum bakchodi?</span></h2><div className="big-emoji">😎</div>
        <div className="answer-row"><button className="btn btn-red" onClick={goNext}>BORN READY <PartyPopper size={16}/></button><button className="btn btn-outline" onClick={goNext}>ALSO YES 😂</button></div><p className="microcopy">Correct answer. You are clearly very intelligent.</p>
      </div></section>}
      {step === 3 && <section className="birthday-reveal section-wrap">{confetti && <div className="confetti-layer" aria-hidden="true">{Array.from({length:38},(_,i)=><span key={i} style={{left:`${(i*37)%100}%`,animationDelay:`${(i%9)*.17}s`}}>{["✦","♥","✧","★"][i%4]}</span>)}</div>}
        <div className="reveal-copy"><div className="eyebrow"><Cake size={15}/> IT'S YOUR DAY</div><p className="scribble">drumroll please…</p><h1>HAPPY BIRTHDAY<br/><span>SU PRI YA!</span></h1><p className="hero-desc">To my Jamuni, my favourite human, my daily dose of nonsense. Today is all about YOU. 💗</p><button className="btn btn-red" onClick={goNext}>UNLOCK THE GIFTS <Gift size={17}/></button></div>
        <div className="cake-card"><div className="cake-spark">✦ ✧ ✦</div><div className="candles"><i/><i/><i/><i/><i/></div><div className="cake-top"></div><div className="cake-middle"></div><div className="cake-bottom"></div><div className="cake-plate"></div><div className="cake-caption">make a wish, jamuni ♡</div><div className="cake-character">😚</div></div>
      </section>}
      {step === 4 && <section className="gifts-section section-wrap"><div className="section-kicker">PAGE 03 / OPEN WITH CARE (OR NOT)</div><h2 className="section-title">Each gift has a little<br/><span>something for you.</span></h2><p className="section-lead">Tap a box. Yes, all of them. You deserve it.</p>
        <div className="gift-grid">{gifts.map((g,i)=><button className={`gift-card ${giftOpen===i?"selected":""}`} key={g.title} onClick={()=>setGiftOpen(giftOpen===i?null:i)}><span className="gift-number">GIFT 0{i+1}</span><span className="gift-emoji">{g.emoji}</span><span className="gift-title">{g.title}</span><span className="gift-hint">{giftOpen===i?"CLOSE GIFT":"CLICK TO OPEN ↗"}</span></button>)}</div>
        {giftOpen!==null && <div className="gift-message"><span className="message-emoji">{gifts[giftOpen].emoji}</span><div><h3>{gifts[giftOpen].title}</h3><p>{gifts[giftOpen].message}</p></div></div>}
        <button className="btn btn-red centered-btn" onClick={goNext}>NEXT: MEMORY LANE <ArrowRight size={16}/></button>
      </section>}
      {step === 5 && <section className="memories-section section-wrap"><div className="section-kicker">PAGE 04 / OUR LITTLE SCRAPBOOK</div><h2 className="section-title">Proof that we're<br/><span>iconic together.</span></h2><p className="section-lead">Little snapshots from our bestie archive — because every photo has a story. ♡</p>
        <div className="memory-grid">{memories.map((m,i)=><article className={`memory-card memory-${i+1}`} key={m.title}><div className="memory-photo-wrap"><img className="memory-photo" src={m.image} alt={m.title + " memory"} loading="lazy" /><span className="photo-sticker">♡ memory {String(i+1).padStart(2, "0")}</span></div><div className="memory-caption"><span>{m.emoji}</span><div><h3>{m.title}</h3><p>{m.caption}</p></div><span className="memory-star">✦</span></div></article>)}</div>
        <button className="btn btn-red centered-btn" onClick={goNext}>ONE LAST THING… <Heart size={16}/></button>
      </section>}
      {step === 6 && <section className="letter-section section-wrap"><div className="section-kicker">PAGE 05 / NO JOKES FOR A SECOND</div><div className="letter-layout"><div className="letter-side"><div className="eyebrow"><Mail size={15}/> A NOTE FOR MY PERSON</div><h2>Okay, jokes aside…<br/><span>you matter a lot.</span></h2><p>One tiny letter for the birthday girl. Open when ready. 🥹</p><div className="letter-doodle">♡<br/><small>for jamuni</small></div></div>
          <div className={`letter-paper ${letterOpen?"is-open":""}`}><div className="letter-tape">HANDWRITTEN WITH LOVE</div><button className="letter-open" onClick={()=>setLetterOpen(!letterOpen)}>{letterOpen?"CLOSE LETTER ↑":"OPEN YOUR LETTER ↓"}</button>
            {letterOpen && <div className="letter-content"><p className="letter-dear">Dear Jamuni,</p><p>Happy 20th birthday, Supriya! 💗</p><p>I hope you know how special you are to me. Thank you for matching my vibe so perfectly — for loving the same kinds of food, getting excited about the same movies and games, and sending reels back and forth like it is our full-time job. Even the smallest things are more fun when we like them together.</p><p>I hope this new year of your life is kind to you. I hope you get closer to everything you dream about, find your favourite food everywhere, discover amazing movies and games, and laugh until your stomach hurts. And may our reel-sharing streak never die — even if half the reels are just us saying “literally us”. 😭</p><p>Stay weird, stay wonderful, and never forget that you have a permanent place in my corner of the world.</p><p>Happy birthday, my Jamuni. Here's to more memories, more nonsense, and more years of us being us.</p><p className="letter-sign">Love you loads,<br/>Saeee, your Roushagullaaa ♡</p></div>}
            {!letterOpen && <div className="letter-closed-art"><div className="envelope">💌</div><p>A little something from my heart to yours.</p><span>♡ ♡ ♡</span></div>}
          </div></div><div className="ending-line">THE END… UNTIL OUR NEXT CHAOTIC ADVENTURE <span>♥</span></div><button className="btn btn-outline centered-btn" onClick={()=>{setStep(0);setLetterOpen(false);setGiftOpen(null)}}>REPLAY THE SURPRISE ↻</button>
        </section>}
    </main>
    <footer><span>made for Supriya aka Jamuni</span><span>with love, giggles & a little Shinchan energy ♡</span></footer>
  </div>;
}
createRoot(document.getElementById("root")).render(<App />);
