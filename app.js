console.log("app.js cargado ✔");

/* =====================================================
   REFERENCIA GLOBAL AL SCROLL
===================================================== */
const scrollArea = document.getElementById("scroll");

/* =====================================================
   ARRAY CON LOS 151 POKÉMON ORDENADOS
===================================================== */
const kantoIDs = Array.from({ length: 151 }, (_, i) => i + 1);

/* =====================================================
   SHUFFLE (MEZCLA ALEATORIA SIN REPETIR)
===================================================== */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/* =====================================================
   1. CREAR UNA CARTA (RECIBE ID ESPECÍFICO)
===================================================== */
function createCard(id) {
    const card = document.createElement("div");
    card.className = "card";

    const inner = document.createElement("div");
    inner.className = "inner";

    const back = document.createElement("div");
    back.className = "back";

    const front = document.createElement("div");
    front.className = "front";

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

    inner.appendChild(back);
    inner.appendChild(front);
    card.appendChild(inner);

    loadPokemonData(front, id);

    return card;
}

/* =====================================================
   2. CREAR LAS 151 CARTAS EN ORDEN ALEATORIO
===================================================== */
function createCards() {
    console.log("Creando cartas…");

    const randomOrder = shuffle([...kantoIDs]);

    randomOrder.forEach(id => {
        scrollArea.appendChild(createCard(id));
    });

    console.log("Cartas creadas (151 pokémon aleatorios) ✔");
}

/* =====================================================
   3. CARGAR DATOS DEL POKÉMON + MODO SHINY
===================================================== */
async function loadPokemonData(front, id) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();

        const art = front.querySelector("[data-art]");
        const nameEl = front.querySelector("[data-name]");
        const numberEl = front.querySelector("[data-number]");

        /* -------------------------------
           SHINY ALEATORIO (10% PROBABILIDAD)
           ------------------------------- */
        const isShiny = Math.random() < 0.10; // 10% chance
        const spriteSource = isShiny 
            ? data.sprites.other["official-artwork"].front_shiny
            : data.sprites.other["official-artwork"].front_default;

        const marco = front.querySelector(".marco");
        marco.src = isShiny ? "assets/Formato_shiny.png" : "assets/Formato.png";

        // Imagen (normal o shiny)
        art.src = spriteSource;

        // Nombre
        nameEl.textContent =
            data.name.charAt(0).toUpperCase() + data.name.slice(1) +
            (isShiny ? " ✨" : "");

        // Número Pokédex
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

        scrollArea.style.scrollSnapType = "none";

        if (position >= maxScroll - cardSize) {
            isAdjusting = true;
            scrollArea.appendChild(scrollArea.children[0]);
            scrollArea.scrollLeft -= cardSize;
            isAdjusting = false;
            scrollArea.style.scrollSnapType = "x mandatory";
        }

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
   5. AUTOCENTRADO ORGÁNICO
===================================================== */
function centerNearestCard() {
    const cards = Array.from(scrollArea.children);
    const scrollCenter = scrollArea.scrollLeft + scrollArea.clientWidth / 2;

    let closestCard = null;
    let smallestDistance = Infinity;

    cards.forEach(card => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - scrollCenter);
        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestCard = card;
        }
    });

    if (!closestCard) return;

    const targetLeft =
        closestCard.offsetLeft -
        (scrollArea.clientWidth / 2 - closestCard.clientWidth / 2);

    animateScroll(scrollArea.scrollLeft, targetLeft, 450);
}

function animateScroll(from, to, duration) {
    const start = performance.now();

    function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        scrollArea.scrollLeft = from + (to - from) * eased;
        if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

let scrollTimeout = null;

scrollArea.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(centerNearestCard, 150);
});

/* =====================================================
   6. INICIALIZAR TODO
===================================================== */
createCards();          // ← ahora carga 151 mezclados
setupCircularScroll();
console.log("Sistema listo ✔");
