(function () {
  'use strict';

  // Personaliza la fiesta desde aquí.
  const FIESTA_CONFIG = {
    name: 'Emma',
    age: 6,
    colors: ['#ff3e9d', '#45e8e0', '#ffe66d', '#b9a4ff', '#9dff9a', '#ff9a5c'],
    maxBalloons: 6,
    balloonEveryMs: 2400,
    // Nivel de volumen del micrófono (0–1) que cuenta como soplido.
    blowThreshold: 0.2
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------- Confeti ---------------- */
  const canvas = document.getElementById('confetti');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let pieces = [];
  let confettiFrame = null;

  function resizeCanvas() {
    if (!canvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * ratio;
    canvas.height = innerHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function addPiece(x, y, vx, vy) {
    pieces.push({
      x, y, vx, vy,
      size: 5 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - .5) * .3,
      color: FIESTA_CONFIG.colors[Math.floor(Math.random() * FIESTA_CONFIG.colors.length)],
      round: Math.random() < .3,
      life: 0
    });
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    pieces = pieces.filter(p => p.y < innerHeight + 20 && p.life < 420);
    pieces.forEach(p => {
      p.life += 1;
      p.vy += .12;
      p.vx *= .99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx.restore();
    });
    confettiFrame = pieces.length ? requestAnimationFrame(drawConfetti) : null;
    if (!confettiFrame) ctx.clearRect(0, 0, innerWidth, innerHeight);
  }

  function startConfetti() {
    if (!confettiFrame) confettiFrame = requestAnimationFrame(drawConfetti);
  }

  function burst(x, y, count = 40) {
    if (!ctx || reduceMotion.matches) return;
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      addPiece(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed - 3);
    }
    startConfetti();
  }

  function rain(count = 160) {
    if (!ctx || reduceMotion.matches) return;
    for (let i = 0; i < count; i += 1) {
      addPiece(Math.random() * innerWidth, -20 - Math.random() * innerHeight * .6, (Math.random() - .5) * 3, 1 + Math.random() * 3);
    }
    startConfetti();
  }

  function burstFrom(element, count) {
    const rect = element.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, count);
  }

  /* ---------------- Canción: Cumpleaños feliz ---------------- */
  const NOTE = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
  const MELODY = [
    ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
    ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
    ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
    ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2.5]
  ];
  const BEAT = .42;
  const songButton = document.getElementById('song-control');
  let audioCtx = null;
  let songNodes = [];
  let songTimer = null;

  function getAudio() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playTone(audio, frequency, start, duration) {
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(.18, start + .02);
    gain.gain.exponentialRampToValueAtTime(.001, start + duration * .95);
    gain.connect(audio.destination);
    // Tono de cajita musical: triángulo + brillo una octava arriba.
    [['triangle', 1, 1], ['sine', 2, .35]].forEach(([type, mult, level]) => {
      const osc = audio.createOscillator();
      const oscGain = audio.createGain();
      osc.type = type;
      osc.frequency.value = frequency * mult;
      oscGain.gain.value = level;
      osc.connect(oscGain).connect(gain);
      osc.start(start);
      osc.stop(start + duration);
      songNodes.push(osc);
    });
  }

  function setSongButton(playing) {
    if (!songButton) return;
    songButton.setAttribute('aria-pressed', String(playing));
    songButton.textContent = playing ? '■ Detener' : '♪ Cantar';
  }

  function stopSong() {
    songNodes.forEach(osc => {
      try { osc.stop(); } catch (error) { /* El oscilador ya terminó. */ }
    });
    songNodes = [];
    window.clearTimeout(songTimer);
    songTimer = null;
    setSongButton(false);
  }

  function playSong() {
    const audio = getAudio();
    if (!audio) return;
    stopSong();
    let time = audio.currentTime + .08;
    MELODY.forEach(([note, beats]) => {
      const duration = beats * BEAT;
      playTone(audio, NOTE[note], time, duration);
      time += duration;
    });
    setSongButton(true);
    songTimer = window.setTimeout(stopSong, (time - audio.currentTime) * 1000 + 200);
  }

  if (songButton) {
    songButton.addEventListener('click', () => {
      if (songTimer) stopSong();
      else playSong();
    });
  }

  const pauseControl = document.getElementById('pause-control');
  if (pauseControl) {
    pauseControl.addEventListener('click', () => {
      if (document.body.classList.contains('is-paused')) stopSong();
    });
  }

  /* ---------------- Pastel y velitas ---------------- */
  const candles = Array.from(document.querySelectorAll('[data-candle]'));
  const cakeStatus = document.getElementById('cake-status');
  const relightButton = document.getElementById('relight-control');
  const micButton = document.getElementById('mic-control');

  function litCandles() {
    return candles.filter(candle => !candle.classList.contains('is-out'));
  }

  function setCakeStatus(text, done = false) {
    if (!cakeStatus) return;
    cakeStatus.textContent = text;
    cakeStatus.classList.toggle('is-done', done);
  }

  function celebrate() {
    stopMic();
    setCakeStatus(`¡Deseo pedido! Feliz cumple ${FIESTA_CONFIG.age}, ${FIESTA_CONFIG.name} 🎉`, true);
    if (relightButton) relightButton.hidden = false;
    rain(220);
    playSong();
  }

  function blowCandle(candle) {
    if (!candle || candle.classList.contains('is-out')) return;
    const index = candles.indexOf(candle) + 1;
    candle.classList.add('is-out');
    candle.setAttribute('aria-pressed', 'true');
    candle.setAttribute('aria-label', `Velita ${index} apagada`);
    burstFrom(candle, 12);

    const remaining = litCandles().length;
    if (remaining === 0) celebrate();
    else setCakeStatus(remaining === 1 ? '¡Solo queda 1 velita!' : `Quedan ${remaining} velitas… ¡sopla!`);
  }

  function relight() {
    candles.forEach((candle, index) => {
      candle.classList.remove('is-out');
      candle.setAttribute('aria-pressed', 'false');
      candle.setAttribute('aria-label', `Soplar velita ${index + 1}`);
    });
    if (relightButton) relightButton.hidden = true;
    stopSong();
    setCakeStatus('Velitas encendidas. ¡Pide un deseo y sopla! 🎂');
  }

  candles.forEach(candle => candle.addEventListener('click', () => blowCandle(candle)));
  if (relightButton) relightButton.addEventListener('click', relight);

  /* ---------------- Soplar al micrófono ---------------- */
  let micStream = null;
  let micCtx = null;
  let micFrame = null;

  function stopMic() {
    if (micFrame) cancelAnimationFrame(micFrame);
    micFrame = null;
    if (micStream) micStream.getTracks().forEach(track => track.stop());
    micStream = null;
    if (micCtx) micCtx.close();
    micCtx = null;
    if (micButton) {
      micButton.setAttribute('aria-pressed', 'false');
      micButton.textContent = '🎤 Soplar de verdad';
    }
  }

  async function startMic() {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      setCakeStatus('No pude usar el micrófono. Toca las velitas para soplarlas 🎂');
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    micCtx = new AudioCtx();
    const analyser = micCtx.createAnalyser();
    analyser.fftSize = 1024;
    micCtx.createMediaStreamSource(micStream).connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    let loudFrames = 0;
    let lastBlow = 0;

    micButton.setAttribute('aria-pressed', 'true');
    micButton.textContent = '🎤 Escuchando…';
    setCakeStatus('¡Sopla fuerte cerca del micrófono! 💨');

    const listen = now => {
      analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (let i = 0; i < samples.length; i += 1) {
        const value = (samples[i] - 128) / 128;
        sum += value * value;
      }
      const volume = Math.sqrt(sum / samples.length);
      loudFrames = volume > FIESTA_CONFIG.blowThreshold ? loudFrames + 1 : 0;
      if (loudFrames > 6 && now - lastBlow > 280) {
        lastBlow = now;
        blowCandle(litCandles()[0]);
      }
      if (micStream) micFrame = requestAnimationFrame(listen);
    };
    micFrame = requestAnimationFrame(listen);
  }

  if (micButton && window.isSecureContext && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    micButton.hidden = false;
    micButton.addEventListener('click', () => {
      if (micStream) {
        stopMic();
        setCakeStatus('Toca cada velita para soplarla 🎂');
        return;
      }
      if (!litCandles().length) relight();
      startMic();
    });
  }

  /* ---------------- Globos ---------------- */
  const balloonLayer = document.getElementById('balloon-layer');
  const balloonCounter = document.getElementById('balloon-counter');
  let popped = 0;

  function updateCounter() {
    if (!balloonCounter) return;
    const age = FIESTA_CONFIG.age;
    if (popped > 0 && popped % age === 0) {
      balloonCounter.textContent = `🎈 ¡${popped} globos! Uno por cada año de ${FIESTA_CONFIG.name} 🎉`;
      rain(120);
    } else {
      balloonCounter.textContent = `🎈 ${popped} ${popped === 1 ? 'globo reventado' : 'globos reventados'}`;
    }
  }

  function popBalloon(balloon) {
    if (balloon.classList.contains('is-popped')) return;
    balloon.classList.add('is-popped');
    burstFrom(balloon, 26);
    popped += 1;
    updateCounter();
    window.setTimeout(() => balloon.remove(), 240);
  }

  function spawnBalloon() {
    if (!balloonLayer || reduceMotion.matches || document.hidden) return;
    if (document.body.classList.contains('is-paused')) return;
    if (balloonLayer.childElementCount >= FIESTA_CONFIG.maxBalloons) return;

    const balloon = document.createElement('button');
    balloon.type = 'button';
    balloon.className = 'balloon';
    balloon.tabIndex = -1;
    balloon.style.setProperty('--x', `${4 + Math.random() * 88}%`);
    balloon.style.setProperty('--color', FIESTA_CONFIG.colors[Math.floor(Math.random() * FIESTA_CONFIG.colors.length)]);
    balloon.style.setProperty('--rise', `${10 + Math.random() * 6}s`);
    balloon.addEventListener('pointerdown', () => popBalloon(balloon));
    balloon.addEventListener('animationend', event => {
      if (event.animationName === 'balloon-rise') balloon.remove();
    });
    balloonLayer.appendChild(balloon);
  }

  /* ---------------- Foto de Emma ---------------- */
  const photo = document.getElementById('centered-image');
  if (photo) photo.addEventListener('click', () => burstFrom(photo, 60));

  /* ---------------- Inicio ---------------- */
  if (canvas) {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
  window.setInterval(spawnBalloon, FIESTA_CONFIG.balloonEveryMs);
  window.setTimeout(spawnBalloon, 600);
  window.setTimeout(() => rain(140), 500);

  window.EmmaFiesta = { burst, rain, playSong, stopSong };
})();
