console.log("app.js cargado ✔");

/* =====================================================
   REFERENCIA GLOBAL AL SCROLL
===================================================== */
const scrollArea = document.getElementById("scroll");

/* =====================================================
   ARRAY CON LOS 151 POKÉMON ORDENADOS
===================================================== */
function getPokemonIDsFromGenerations(selectedGens) {
    let ids = [];

    selectedGens.forEach(gen => {
        const data = generations[gen];
        
        if (!data) return; 

        // Si es un objeto con rango (start/end)
        if (data.start && data.end) {
            for (let i = data.start; i <= data.end; i++) {
                ids.push(i);
            }
        } 
        // Si es directamente un array de IDs (Legendarios/Singulares)
        else if (Array.isArray(data)) {
            ids = ids.concat(data);
        }
    });

    // Eliminamos duplicados por si acaso
    return [...new Set(ids)];
}


const generations = {
    1: { start: 1, end: 151 },    // Kanto
    2: { start: 152, end: 251 },  // Johto
    3: { start: 252, end: 386 },  // Hoenn
    4: { start: 387, end: 493 },  // Sinnoh
    5: { start: 494, end: 649 },  // Teselia (Unova)
    6: { start: 650, end: 721 },  // Kalos
    7: { start: 722, end: 809 },  // Alola
    8: { start: 810, end: 905 },  // Galar e Hisui
    9: { start: 906, end: 1025 },  // Paldea y DLCs (Noriteo/Arándano)

    // Categorías Especiales (Arrays de IDs)
    'legendary': [
        144, 145, 146, 150, 243, 244, 245, 249, 250, 377, 378, 379, 380, 381, 382, 383, 384, 
        480, 481, 482, 483, 484, 485, 486, 487, 488, 638, 639, 640, 641, 642, 643, 644, 645, 646,
        716, 717, 718, 772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800,
        888, 889, 890, 891, 892, 894, 895, 896, 897, 898, 905,
        1001, 1002, 1003, 1004, 1007, 1008, 1020, 1021, 1022, 1023, 1024
    ],
    
    'mythical': [
        151, 251, 385, 386, 489, 490, 491, 492, 493, 494, 647, 648, 649, 
        719, 720, 721, 801, 802, 807, 808, 809, 893, 1025
    ]

};

const genCards = document.querySelectorAll(".gen-card");

const btnStart = document.getElementById("btnStart");
const menu = document.getElementById("menu");
const config = document.getElementById("config");

btnStart.addEventListener("click", () => {
    menu.classList.add("hidden");      // ocultar menú
    config.classList.remove("hidden"); // mostrar configuración
});

genCards.forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("selected");
    });
});



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
    <div class="type-badge" data-type-badge></div>

    <div class="pokemon-name" data-name></div>

    <img class="pokemon-art" data-art />

    <div class="pokedex-number" data-number></div>

    <div class="pokeballs">
        <img src="assets/pokeball.png" class="ball">
        <img src="assets/pokeball.png" class="ball">
    </div>

    <img class="marco" src="assets/Formato.png" />
`;

    overrideCardFlip(inner);

    inner.appendChild(back);
    inner.appendChild(front);
    card.appendChild(inner);

    loadPokemonData(front, id);

    return card;
}

/* =====================================================
   2. CREAR LAS 151 CARTAS EN ORDEN ALEATORIO
===================================================== */
function createCards(pokemonIDs) {
    console.log("Creando cartas…");

    const randomOrder = shuffle([...pokemonIDs]);

    randomOrder.forEach(id => {
        scrollArea.appendChild(createCard(id));
    });

    console.log(`Cartas creadas (${pokemonIDs.length} Pokémon) ✔`);
}

/* =====================================================
   3. CARGAR DATOS DEL POKÉMON + MODO SHINY + FONDO POR TIPO
===================================================== */

const typeBackgrounds = {
    normal:    "linear-gradient(135deg, #cfcfcf, #9e9e9e)",
    fire:      "linear-gradient(135deg, #e9ad74, #e9592c)",
    water:     "linear-gradient(135deg, #cbe2f9, #093e99)",
    electric:  "linear-gradient(135deg, #ffe13c, #ffb800)",
    grass:     "linear-gradient(135deg, #7ed957, #2ba84a)",
    ice:       "linear-gradient(135deg, #8de7ff, #42c3ff)",
    fighting:  "linear-gradient(135deg, #d57e2b, #a35411)",
    poison:    "linear-gradient(135deg, #c55cff, #7b1fa2)",
    ground:    "linear-gradient(135deg, #e4c46b, #c19a38)",
    flying:    "linear-gradient(135deg, #88b9ff, #577dff)",
    psychic:   "linear-gradient(135deg, #ff6ce5, #d10fd1)",
    bug:       "linear-gradient(135deg, #a0d957, #7abf26)",
    rock:      "linear-gradient(135deg, #d6bc74, #9d843b)",
    ghost:     "linear-gradient(135deg, #a97cff, #6d49c6)",
    dragon:    "linear-gradient(135deg, #8e6cff, #4b2fff)",
    dark:      "linear-gradient(135deg, #7a5c5c, #3a2c2c)",
    steel:     "linear-gradient(135deg, #c7d4e0, #82929c)",
    fairy:     "linear-gradient(135deg, #ffbde3, #ff75c7)"
};

/* =====================================================
   3. CARGAR DATOS DEL POKÉMON + SHINY + MASTER BALL + TIPO
===================================================== */

const typeBadgeInfo = {
    fire:      { color: "#ff6b3c", icon: "assets/types/Fire.png" },
    water:     { color: "#3ca0ff", icon: "assets/types/Water.png" },
    electric:  { color: "#ffd93c", icon: "assets/types/Electric.png" },
    grass:     { color: "#7ed957", icon: "assets/types/Grass.png" },
    psychic:   { color: "#ff6ce5", icon: "assets/types/Psychic.png" },
    ghost:     { color: "#a87cff", icon: "assets/types/Ghost.png" },
    dragon:    { color: "#8e6cff", icon: "assets/types/Dragon.png" },
    dark:      { color: "#5a4a4a", icon: "assets/types/Dark.png" },
    steel:     { color: "#8ea0ad", icon: "assets/types/Steel.png" },
    rock:      { color: "#c6ad6b", icon: "assets/types/Rock.png" },
    ground:    { color: "#d4b46d", icon: "assets/types/Ground.png" },
    ice:       { color: "#9ae7ff", icon: "assets/types/Ice.png" },
    flying:    { color: "#9fb9ff", icon: "assets/types/Flying.png" },
    poison:    { color: "#b55cff", icon: "assets/types/Poison.png" },
    bug:       { color: "#a4d957", icon: "assets/types/Bug.png" },
    fighting:  { color: "#c56b2d", icon: "assets/types/Fighting.png" },
    normal:    { color: "#cfcfcf", icon: "assets/types/Normal.png" },
    fairy:     { color: "#ffbde3", icon: "assets/types/Fairy.png" }
};

async function loadPokemonData(front, id) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();

        const art = front.querySelector("[data-art]");
        const nameEl = front.querySelector("[data-name]");
        const numberEl = front.querySelector("[data-number]");
        const marco = front.querySelector(".marco");
        const balls = front.querySelector(".pokeballs");
        const badge = front.querySelector("[data-type-badge]");

        /* ----------------------------------------
           SHINY 10% — sprite + marco + pokebola extra
        ----------------------------------------- */
const isShiny = Math.random() < gameSettings.shinyChance;

        const spriteSource = isShiny
            ? data.sprites.other["official-artwork"].front_shiny
            : data.sprites.other["official-artwork"].front_default;

        art.src = spriteSource;
        marco.src = isShiny
            ? "assets/Formato_shiny.png"
            : "assets/Formato.png";

        /* Nombre + shiny */
        nameEl.textContent =
            data.name.charAt(0).toUpperCase() + data.name.slice(1) +
            (isShiny ? " ✨" : "");

        /* Número */
        numberEl.textContent = "#" + String(data.id).padStart(3, "0");

        /* ----------------------------------------
           RESETEAR POKEBOLAS + MASTER BALL SI SHINY
        ----------------------------------------- */
        balls.innerHTML = `
            <img src="assets/pokeball.png" class="ball">
            <img src="assets/pokeball.png" class="ball">
        `;

        if (isShiny) {
            const master = document.createElement("img");
            master.src = "assets/pokeball_master.png";
            master.className = "ball";
            balls.appendChild(master);
        }

        /* ----------------------------------------
           ESFERA DE TIPO (color + ícono)
        ----------------------------------------- */
        const type = data.types[0].type.name;

        if (typeBadgeInfo[type]) {
            badge.style.backgroundImage = `url(${typeBadgeInfo[type].icon})`;
            badge.style.backgroundSize = "70%";
            badge.style.backgroundPosition = "center";
            badge.style.backgroundRepeat = "no-repeat";
        }

    } catch (e) {
        console.error("Error cargando Pokémon", e);
    }
}


let gameSettings = {
    difficulty: "normal",
    shinyChance: 0.10
};

let selectedGenerations = ["1"]; // por defecto Kanto


btnSaveConfig.addEventListener("click", () => {

    selectedGenerations = Array.from(
        document.querySelectorAll(".gen-card.selected")
    ).map(card => card.dataset.gen);

    if (selectedGenerations.length === 0) {
        alert("Selecciona al menos una generación");
        return;
    }

    document.getElementById("config").classList.add("hidden");
    startGame();
});


function startGame() {
    scrollArea.innerHTML = "";

    const pokemonIDs = getPokemonIDsFromGenerations(selectedGenerations);
    createCards(pokemonIDs);
    setupCircularScroll();

    console.log("Juego iniciado ✔");
}




const btnSettings = document.getElementById("btnSettings");
const settings = document.getElementById("settings");
const btnSaveSettings = document.getElementById("btnSaveSettings");
settings.querySelectorAll(".gen-card").forEach(card => {
    card.addEventListener("click", () => {

        // Dificultad (solo una)
        if (card.dataset.difficulty) {
            settings.querySelectorAll("[data-difficulty]")
                .forEach(c => c.classList.remove("selected"));
        }

        // Shiny (solo una)
        if (card.dataset.shiny) {
            settings.querySelectorAll("[data-shiny]")
                .forEach(c => c.classList.remove("selected"));
        }

        card.classList.add("selected");
    });
});


btnSettings.addEventListener("click", () => {
    menu.classList.add("hidden");
    settings.classList.remove("hidden");
});

btnSaveSettings.addEventListener("click", () => {

    // dificultad
    const difficultyCard = document.querySelector(".gen-card.selected[data-difficulty]");
    if (difficultyCard) {
        gameSettings.difficulty = difficultyCard.dataset.difficulty;
    }

    // shiny
    const shinyCard = document.querySelector(".gen-card.selected[data-shiny]");
    if (shinyCard) {
        gameSettings.shinyChance = parseFloat(shinyCard.dataset.shiny);
    }

    settings.classList.add("hidden");
    menu.classList.remove("hidden");

    console.log("Ajustes guardados:", gameSettings);
});












/* =====================================================
   4. SCROLL INFINITO CIRCULAR
===================================================== */
function setupCircularScroll() {
    const cardSize = 685;
    let isAdjusting = false;

    scrollArea.addEventListener("scroll", () => {
        if (isAdjusting || interactionsLocked) return;

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
    if (interactionsLocked) return;

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
        const eased = 1 - Math.pow(1 - progress, 3);
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
   6. SISTEMA DE TURNOS (BLOQUEO / BOTONES)
===================================================== */

let selectedCard = null;
let interactionsLocked = false;
let isHidden = false;

const controls = document.getElementById("controls");
const btnHide = document.getElementById("btnHide");
const btnNext = document.getElementById("btnNext");

function lockInteractions() {
    interactionsLocked = true;
    scrollArea.style.pointerEvents = "none";
    controls.classList.remove("hidden");
}

function unlockInteractions() {
    interactionsLocked = false;
    scrollArea.style.pointerEvents = "auto";
    controls.classList.add("hidden");
}

function flipCard(inner, state) {
    if (state === "front") {
        inner.classList.add("flipped");
    } else {
        inner.classList.remove("flipped");
    }
}

function overrideCardFlip(inner) {
    inner.addEventListener("click", () => {

        // Si está bloqueado y NO es la carta seleccionada
        if (interactionsLocked && selectedCard !== inner) return;

        // Si está bloqueado y ES la carta seleccionada → toggle con click
        if (interactionsLocked && selectedCard === inner) {
            if (isHidden) {
                flipCard(inner, "front");
                isHidden = false;
                btnHide.textContent = "Ocultar";
            }
            return;
        }

        // Primera vez que se abre
        flipCard(inner, "front");
        selectedCard = inner;
        isHidden = false;
        btnHide.textContent = "Ocultar"; // ← texto correcto
        lockInteractions();
    });
}

/* =====================================================
   BOTÓN OCULTAR / MOSTRAR (TOGGLE)
===================================================== */
btnHide.addEventListener("click", () => {
    if (!selectedCard) return;

    if (isHidden) {
        flipCard(selectedCard, "front");
        isHidden = false;
        btnHide.textContent = "Ocultar";
    } else {
        flipCard(selectedCard, "back");
        isHidden = true;
        btnHide.textContent = "Mostrar";
    }
});

/* =====================================================
   BOTÓN SIGUIENTE TURNO
===================================================== */
btnNext.addEventListener("click", () => {
    if (!selectedCard) return;

    const card = selectedCard.parentElement;

    flipCard(selectedCard, "back");

    setTimeout(() => {
        card.remove();
        selectedCard = null;
        isHidden = false;
        btnHide.textContent = "Ocultar"; // reset
        unlockInteractions();
    }, 350);
});

/* =====================================================
   7. INICIALIZAR TODO
===================================================== */

console.log("Sistema listo ✔");



/* =====================================================
   8. SISTEMA DE REINICIO (MODAL + RESET COMPLETO)
===================================================== */

const resetButton = document.getElementById("resetButton");
const resetModal = document.getElementById("resetModal");
const confirmReset = document.getElementById("confirmReset");
const cancelReset = document.getElementById("cancelReset");

// ABRIR MODAL
resetButton.addEventListener("click", () => {
    resetModal.classList.remove("hidden");
});

// CERRAR MODAL
cancelReset.addEventListener("click", () => {
    resetModal.classList.add("hidden");
});

// CONFIRMACIÓN → REINICIAR JUEGO
confirmReset.addEventListener("click", () => {

    // limpiar todo
    scrollArea.innerHTML = "";

    // reiniciar variables de turno
    selectedCard = null;
    interactionsLocked = false;
    btnHide.textContent = "Ocultar";

    // ocultar botones si estaban visibles
    controls.classList.add("hidden");
    scrollArea.style.pointerEvents = "auto";

    // volver a cargar pokémon
    createCards();

    // cerrar modal
    resetModal.classList.add("hidden");

    console.log("Juego reiniciado ✔");
});


const openDifficulty = document.getElementById("openDifficulty");
const openShiny = document.getElementById("openShiny");
const openPokedex = document.getElementById("openPokedex");

const difficultyScreen = document.getElementById("difficultyScreen");
const shinyScreen = document.getElementById("shinyScreen");
const pokedexScreen = document.getElementById("pokedexScreen");

const btnBackFromSettings = document.getElementById("btnBackFromSettings");

openDifficulty.onclick = () => {
    settings.classList.add("hidden");
    difficultyScreen.classList.remove("hidden");
};

openShiny.onclick = () => {
    settings.classList.add("hidden");
    shinyScreen.classList.remove("hidden");
};

openPokedex.onclick = () => {
    settings.classList.add("hidden");
    pokedexScreen.classList.remove("hidden");
    loadPokedex();
};

btnBackFromSettings.onclick = () => {
    settings.classList.add("hidden");
    menu.classList.remove("hidden");
};


difficultyScreen.querySelectorAll("[data-difficulty]").forEach(card => {
    card.onclick = () => {
        difficultyScreen.querySelectorAll("[data-difficulty]")
            .forEach(c => c.classList.remove("selected"));

        card.classList.add("selected");
        gameSettings.difficulty = card.dataset.difficulty;
    };
});
