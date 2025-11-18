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

  const pathKeys = Object.keys(PATHS);
  const shape = pathKeys[Math.floor(Math.random() * pathKeys.length)];

  const orbit = document.getElementById('orbit');

  function createLove(word, i){
    const d = document.createElement('div');
    d.className = 'love';
    d.style.setProperty('--i', i);
    d.innerHTML = `<div class="love_word">${word}</div>`;
    return d;
  }

  const frag = document.createDocumentFragment();
  names.forEach((n, i) => frag.appendChild(createLove(n, i)));
  const emma = createLove('Emma', names.length);
  emma.classList.add('love--highlight');
  frag.appendChild(emma);
  orbit.appendChild(frag);

  if (CSS.supports('offset-path', 'path("M0,0 L1,1")')) {
    const path = PATHS[shape];
    orbit.querySelectorAll('.love').forEach(el => {
      el.style.offsetPath = `path("${path}")`;
    });
  }

  const videos = [
    "./resources/video1.mp4",
    "./resources/video2.mp4"
  ];

  const randomVideo = videos[Math.floor(Math.random() * videos.length)];
  const source = document.getElementById("video-source");
  source.src = randomVideo;
  
  document.getElementById("background-video").load();

  console.log(`Forma seleccionada: ${shape}`);