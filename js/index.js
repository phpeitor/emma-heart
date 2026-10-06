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
    heart: 'CORAZÓN',
    star: 'ESTRELLA',
    circle: 'CÍRCULO',
    triangle: 'TRIÁNGULO',
    diamond: 'DIAMANTE'
  };
  const effectLabels = {
    neon: 'NEON PULSE',
    arcade: 'ARCADE SCAN',
    dream: 'DREAMY GLOW'
  };
  let selectedShape = 'heart';
  let selectedEffect = 'neon';

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
    names.forEach((name, index) => frag.appendChild(createLove(name, index)));
    const emma = createLove('Emma', names.length);
    emma.classList.add('love--highlight');
    frag.appendChild(emma);
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

  function selectShape(shape) {
    if (!PATHS[shape]) return;
    selectedShape = shape;
    document.querySelectorAll('[data-shape]').forEach(button => {
      const isSelected = button.dataset.shape === shape;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
    renderOrbit();
    updateStatus();
  }

  function selectEffect(effect) {
    if (!effectLabels[effect]) return;
    selectedEffect = effect;
    document.body.dataset.effect = effect;
    document.querySelectorAll('[data-effect]').forEach(button => {
      const isSelected = button.dataset.effect === effect;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
    updateStatus();
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
  });

  renderOrbit();
  selectEffect(selectedEffect);

  const videos = [
    "./resources/video1.mp4",
    "./resources/video2.mp4"
  ];

  const randomVideo = videos[Math.floor(Math.random() * videos.length)];
  source.src = randomVideo;
  backgroundVideo.load();