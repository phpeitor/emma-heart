    const names = [
      "María","Ana","Carmen","Rosa","Lucía","Juana","Elena","Patricia","Sandra","Verónica",
      "Isabel","Teresa","Mercedes","Julia","Diana","Marta","Beatriz","Adriana","Mónica","Gloria",
      "Paola","Fátima","Rebeca","Ruth","Eva","Margarita","Susana","Nadia","Clara","Nancy",
      "Flor","Martha","María","Alejandra","Valeria","Andrea","Gabriela","Daniela","Liliana",
      "Marcela","Lorena","Melisa","Vanessa","Pamela","Cynthia","Carolina","Claudia","Johana",
      "Yessenia","Estefanía","Natalia","Belén","Jessica","Milagros","Brenda","Fiorella","Janet",
      "Alicia","Silvia","Doris","Luisa","Evelyn","Magaly","Amparo","Soledad","Emma",
    ];

    function createLoveBlock(text) {
      const love = document.createElement('div');
      love.className = 'love';

      const h = document.createElement('div');
      h.className = 'love_horizontal';

      const v = document.createElement('div');
      v.className = 'love_vertical';

      const w = document.createElement('div');
      w.className = 'love_word';
      w.textContent = text;

      v.appendChild(w);
      h.appendChild(v);
      love.appendChild(h);
      return love;
    }

    const namesContainer = document.getElementById('names');
    const frag = document.createDocumentFragment();
    names.forEach(n => frag.appendChild(createLoveBlock(n)));
    namesContainer.appendChild(frag);