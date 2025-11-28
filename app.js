console.log("app.js cargado ✔");

/* =====================================================
   REFERENCIA GLOBAL AL SCROLL
===================================================== */
const scrollArea = document.getElementById("scroll");

/* =====================================================
   1. FUNCIÓN: CREAR UNA CARTA
===================================================== */
function createCard() {
    const card = document.createElement("div");
    card.className = "card";

    const inner = document.createElement("div");
    inner.className = "inner";

    const back = document.createElement("div");
    back.className = "back";

    const front = document.createElement("div");
    front.className = "front";

    // CONTENIDO DEL FRONT
    front.innerHTML = `
        <div class="pokemon-name" data-name></div>

        <img class="pokemon-art" data-art />

        <div class="pokedex-number" data-number></div>

        <div class="pokeballs">
            <img src="assets/pokeball.png" class="ball">
            <img src="assets/pokeball.png" class="ball">
        </div>

        <img class="marco" src="assets/Formato.png" />
    `;

    // Flip
    inner.addEventListener("click", () => {
        inner.classList.toggle("flipped");
    });

    // Armar carta
    inner.appendChild(back);
    inner.appendChild(front);
    card.appendChild(inner);

    // Pokemon random
    const id = Math.floor(Math.random() * 151) + 1;
    loadPokemonData(front, id);

    return card;
}

/* =====================================================
   2. CREAR MUCHAS CARTAS
===================================================== */
function createCards(amount = 10) {
    console.log("Creando cartas…");

    for (let i = 0; i < amount; i++) {
        scrollArea.appendChild(createCard());
    }

    console.log("Cartas creadas ✔");
}

/* =====================================================
   3. CARGAR DATOS DEL POKEMON
===================================================== */
async function loadPokemonData(front, id) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();

        const art = front.querySelector("[data-art]");
        const nameEl = front.querySelector("[data-name]");
        const numberEl = front.querySelector("[data-number]");

        // Imagen
        art.src = data.sprites.other["official-artwork"].front_default;

        // Nombre
        nameEl.textContent =
            data.name.charAt(0).toUpperCase() + data.name.slice(1);

        // Número Pokedex
        numberEl.textContent = "#" + String(data.id).padStart(3, "0");

    } catch (e) {
        console.error("Error cargando Pokémon", e);
    }
}

/* =====================================================
   4. SCROLL INFINITO CIRCULAR
===================================================== */
function setupCircularScroll() {
    const cardSize = 685;
    let isAdjusting = false;

    scrollArea.addEventListener("scroll", () => {
        if (isAdjusting) return;

        const position = scrollArea.scrollLeft;
        const maxScroll = scrollArea.scrollWidth - scrollArea.clientWidth;

        // Desactivar snap
        scrollArea.style.scrollSnapType = "none";

        // Mover primera carta al final
        if (position >= maxScroll - cardSize) {
            isAdjusting = true;
            scrollArea.appendChild(scrollArea.children[0]);
            scrollArea.scrollLeft -= cardSize;
            isAdjusting = false;
            scrollArea.style.scrollSnapType = "x mandatory";
        }

        // Mover última carta al inicio
        if (position <= cardSize) {
            isAdjusting = true;
            scrollArea.prepend(scrollArea.children[scrollArea.children.length - 1]);
            scrollArea.scrollLeft += cardSize;
            isAdjusting = false;
            scrollArea.style.scrollSnapType = "x mandatory";
        }
    });
}

/* =====================================================
   5. AUTOCENTRADO
===================================================== */
function centerNearestCard() {
    const cards = Array.from(scrollArea.children);

    const center = scrollArea.scrollLeft + scrollArea.clientWidth / 2;

    let closest = null;
    let minDist = Infinity;

    cards.forEach(card => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - cardCenter);
        if (dist < minDist) {
            minDist = dist;
            closest = card;
        }
    });

    if (closest) {
        const target =
            closest.offsetLeft - (scrollArea.clientWidth / 2 - closest.clientWidth / 2);

        scrollArea.scrollTo({
            left: target,
            behavior: "smooth"
        });
    }
}

let scrollTimeout = null;

scrollArea.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(centerNearestCard, 150);
});

/* =====================================================
   6. INICIALIZAR TODO
===================================================== */
createCards(10);
setupCircularScroll();
console.log("Sistema listo ✔");
