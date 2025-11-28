const scroll = document.getElementById("scroll");
const cardSize = 685;
let isAdjusting = false;

/* ==========================
   SCROLL INFINITO CIRCULAR
   ========================== */
scroll.addEventListener("scroll", () => {
    if (isAdjusting) return;

    const position = scroll.scrollLeft;
    const maxScroll = scroll.scrollWidth - scroll.clientWidth;

    scroll.style.scrollSnapType = "none";

    if (position >= maxScroll - cardSize) {
        isAdjusting = true;

        const first = scroll.children[0];
        scroll.appendChild(first);

        scroll.scrollLeft -= cardSize;
        isAdjusting = false;

        scroll.style.scrollSnapType = "x mandatory";
    }

    if (position <= cardSize) {
        isAdjusting = true;

        const last = scroll.children[scroll.children.length - 1];
        scroll.prepend(last);

        scroll.scrollLeft += cardSize;
        isAdjusting = false;

        scroll.style.scrollSnapType = "x mandatory";
    }
});

/* ==========================
       CREAR CARTAS
   ========================== */

function createCards(amount = 10) {
    for (let i = 0; i < amount; i++) {
        const card = document.createElement("div");
        card.className = "card";

        const inner = document.createElement("div");
        inner.className = "inner";

        const back = document.createElement("div");
        back.className = "back";

        const front = document.createElement("div");
        front.className = "front";

        /* --- CONTENIDO DEL FRONT (SOLO IMAGEN + MARCO) --- */
        front.innerHTML = `
            <img class="pokemon-art" data-art />
            <img class="marco" src="assets/Formato.png" />
        `;

        card.addEventListener("click", () => {
            inner.classList.toggle("flipped");
        });

        inner.appendChild(back);
        inner.appendChild(front);
        scroll.appendChild(card);

        /* Pokemon aleatorio */
        const randomId = Math.floor(Math.random() * 151) + 1;
        loadPokemonData(front, randomId);
    }
}

createCards();

/* ==========================
  CARGAR DATOS DE POKÉAPI
   ========================== */

async function loadPokemonData(front, id) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    /* Selecciona la imagen */
    const art = front.querySelector("[data-art]");

    /* Arte oficial */
    art.src = data.sprites.other["official-artwork"].front_default;
}
