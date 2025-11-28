console.log("app.js cargado ✔");

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

    // CONTENIDO DEL FRONT (IMAGEN + MARCO PNG)
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

    // Evento flip
    inner.addEventListener("click", () => {
        inner.classList.toggle("flipped");
    });

    // ARMAR CARTA
    inner.appendChild(back);
    inner.appendChild(front);
    card.appendChild(inner);

    // Cargar Pokémon aleatorio
    const id = Math.floor(Math.random() * 151) + 1;
    loadPokemonData(front, id);

    
    return card;
}

/* =====================================================
   2. FUNCIÓN: CREAR VARIAS CARTAS
   ===================================================== */
function createCards(amount = 10) {
    const scroll = document.getElementById("scroll");

    console.log("Creando cartas…");

    for (let i = 0; i < amount; i++) {
        const carta = createCard();
        scroll.appendChild(carta);
    }

    console.log("Cartas creadas ✔");
}

/* =====================================================
   3. FUNCIÓN: CARGAR DATOS DEL POKÉMON
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

        // Número pokédex (#001)
        numberEl.textContent = "#" + String(data.id).padStart(3, "0");

    } catch (e) {
        console.error("Error cargando Pokémon", e);
    }
}



/* =====================================================
   4. SCROLL INFINITO CIRCULAR 
   ===================================================== */
function setupCircularScroll() {
    const scroll = document.getElementById("scroll");
    const cardSize = 685;
    let isAdjusting = false;

    scroll.addEventListener("scroll", () => {
        if (isAdjusting) return;

        const position = scrollArea.scrollLeft;
        const maxScroll = scroll.scrollWidth - scroll.clientWidth;

        // Desactiva snap temporalmente
        scroll.style.scrollSnapType = "none";

        // Mover primera carta al final
        if (position >= maxScroll - cardSize) {
            isAdjusting = true;
            scroll.appendChild(scroll.children[0]);
            scroll.scrollLeft -= cardSize;
            isAdjusting = false;
            scroll.style.scrollSnapType = "x mandatory";
        }

        // Mover última carta al inicio
        if (position <= cardSize) {
            isAdjusting = true;
            scroll.prepend(scroll.children[scroll.children.length - 1]);
            scroll.scrollLeft += cardSize;
            isAdjusting = false;
            scroll.style.scrollSnapType = "x mandatory";
        }
    });
}

/* =====================================================
   5. INICIALIZAR TODO
   ===================================================== */
createCards(10);
setupCircularScroll();
console.log("Sistema listo ✔");


function centerNearestCard() {
    const scrollArea = document.getElementById("scroll");
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

    if (closestCard) {
        const target = closestCard.offsetLeft - (scrollArea.clientWidth / 2 - closestCard.clientWidth / 2);
        scrollArea.scrollTo({
            left: target,
            behavior: "smooth"
        });
    }
}

let scrollTimeout;

scrollArea.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        centerNearestCard();
    }, 130);
});

