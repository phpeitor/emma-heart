 const names = [
    "María","Ana","Carmen","Rosa","Lucía","Juana","Elena","Patricia","Sandra","Verónica",
    "Isabel","Teresa","Mercedes","Julia","Diana","Marta","Beatriz","Adriana","Mónica","Gloria",
    "Paola","Fátima","Rebeca","Ruth","Eva","Margarita","Susana","Nadia","Clara","Nancy",
    "Flor","Martha","Alejandra","Valeria","Andrea","Gabriela","Daniela","Liliana",
    "Marcela","Lorena","Melisa","Vanessa","Pamela","Cynthia","Carolina","Claudia","Johana",
    "Yessenia","Estefanía","Natalia","Belén","Jessica","Milagros","Brenda","Fiorella","Janet",
    "Alicia","Silvia","Doris","Luisa","Evelyn","Magaly","Amparo","Soledad"
  ];

  const PATHS = {
    // 6️⃣ Número 6 (la edad de Emma)
    six: 'M355,62 C265,10 100,60 95,285 A155,155 0 0,0 405,285 A155,155 0 0,0 95,285 C112,85 255,40 345,82 Z',
    // ❤️ Corazón
    heart: 'M250,90 C200,10 60,40 70,180 C80,300 210,360 250,410 C290,360 420,300 430,180 C440,40 300,10 250,90 Z',
    // ⭐ Estrella
    star: 'M250,40 L302,182 L450,182 L330,264 L372,410 L250,330 L128,410 L170,264 L50,182 L198,182 Z',
    // ⚪ Círculo
    circle: 'M250,100 A150,150 0 1,1 249.9,100 Z',
    // 🔺 Triángulo 
    triangle: 'M250,50 L450,400 L50,400 Z',
    // 🔷 Diamante
    diamond: 'M250,50 L450,250 L250,450 L50,250 Z'
  };

  const orbit = document.getElementById('orbit');
  const backgroundVideo = document.getElementById('background-video');
  const source = document.getElementById('video-source');
  const ui = document.getElementById('ui');
  const status = document.getElementById('selection-status');
  const pauseControl = document.getElementById('pause-control');
  const shapeLabels = {
    six: 'NÚMERO 6',
    heart: 'CORAZÓN',
    star: 'ESTRELLA',
    circle: 'CÍRCULO',
    triangle: 'TRIÁNGULO',
    diamond: 'DIAMANTE'
  };
  const effectLabels = {
    party: 'FIESTA',
    neon: 'NEON PULSE',
    arcade: 'ARCADE SCAN',
    dream: 'DREAMY GLOW'
  };
  const EMMA_REPEAT = 3;
  const PREFS_KEY = 'emma-heart:prefs';
  const SWITCH_MS = 190;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selectedShape = 'six';
  let selectedEffect = 'party';
  let switchTimer = null;

  // Recuerda la última forma y efecto elegidos (si el navegador lo permite).
  function loadPrefs() {
    try {
      const prefs = JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
      if (PATHS[prefs.shape]) selectedShape = prefs.shape;
      if (effectLabels[prefs.effect]) selectedEffect = prefs.effect;
    } catch (error) { /* sin almacenamiento: se usan los valores por defecto */ }
  }

  function savePrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ shape: selectedShape, effect: selectedEffect }));
    } catch (error) { /* modo privado o almacenamiento bloqueado */ }
  }

  function createLove(word, i){
    const d = document.createElement('div');
    d.className = 'love';
    d.style.setProperty('--i', i);
    const label = document.createElement('div');
    label.className = 'love_word';
    label.textContent = word;
    d.appendChild(label);
    return d;
  }

  function renderOrbit() {
    orbit.replaceChildren();
    const frag = document.createDocumentFragment();
    // EMMA se reparte en posiciones equidistantes (0, 1/3 y 2/3 del recorrido con 3).
    const total = names.length + EMMA_REPEAT;
    const emmaSlots = new Set(Array.from({ length: EMMA_REPEAT }, (_, k) => Math.round(k * total / EMMA_REPEAT)));
    const words = [];
    let nameIndex = 0;
    for (let slot = 0; slot < total; slot++) {
      words.push(emmaSlots.has(slot) ? null : names[nameIndex++]);
    }
    // El retraso de cada palabra se calcula con este total (ver #orbit .love en style.css).
    orbit.style.setProperty('--total', total);
    words.forEach((word, index) => {
      const love = createLove(word || 'EMMA', index);
      if (!word) love.classList.add('love--highlight');
      frag.appendChild(love);
    });
    orbit.appendChild(frag);

    if (!CSS.supports('offset-path', 'path("M0,0 L1,1")')) return;
    const path = PATHS[selectedShape];
    orbit.querySelectorAll('.love').forEach(el => {
      el.style.offsetPath = `path("${path}")`;
    });
  }

  function updateStatus() {
    status.innerHTML = `FORMA: ${shapeLabels[selectedShape]} <span>•</span> EFECTO: ${effectLabels[selectedEffect]}`;
  }

  function markShape(shape) {
    document.querySelectorAll('[data-shape]').forEach(button => {
      const isSelected = button.dataset.shape === shape;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
  }

  function selectShape(shape) {
    if (!PATHS[shape] || shape === selectedShape) return;
    selectedShape = shape;
    markShape(shape);
    updateStatus();
    savePrefs();

    // Transición suave: la órbita se desvanece, cambia de figura y vuelve a entrar.
    window.clearTimeout(switchTimer);
    if (reduceMotion.matches) {
      renderOrbit();
      return;
    }
    orbit.classList.add('is-switching');
    switchTimer = window.setTimeout(() => {
      renderOrbit();
      orbit.classList.remove('is-switching');
    }, SWITCH_MS);
  }

  function selectEffect(effect) {
    if (!effectLabels[effect]) return;
    selectedEffect = effect;
    document.body.dataset.effect = effect;
    document.querySelectorAll('#effect-controls [data-effect]').forEach(button => {
      const isSelected = button.dataset.effect === effect;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
    updateStatus();
    savePrefs();
  }

  document.getElementById('shape-controls').addEventListener('click', event => {
    const button = event.target.closest('[data-shape]');
    if (button) selectShape(button.dataset.shape);
  });
  document.getElementById('effect-controls').addEventListener('click', event => {
    const button = event.target.closest('[data-effect]');
    if (button) selectEffect(button.dataset.effect);
  });
  pauseControl.addEventListener('click', () => {
    const isPaused = document.body.classList.toggle('is-paused');
    pauseControl.setAttribute('aria-pressed', String(isPaused));
    pauseControl.innerHTML = isPaused ? '<span>▶</span> Reanudar' : '<span>Ⅱ</span> Pausar';
    // El video de fondo también se detiene con la pausa.
    if (isPaused) backgroundVideo.pause();
    else backgroundVideo.play().catch(() => {});
  });

  loadPrefs();
  markShape(selectedShape);
  renderOrbit();
  selectEffect(selectedEffect);

  const videos = [
    "./resources/video1.mp4",
    "./resources/video2.mp4"
  ];

  const randomVideo = videos[Math.floor(Math.random() * videos.length)];
  source.src = randomVideo;
  backgroundVideo.load();