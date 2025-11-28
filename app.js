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

    // DESACTIVAR snap mientras reordenamos
    scroll.style.scrollSnapType = "none";

    // Mover primera carta al final
    if (position >= maxScroll - cardSize) {
        isAdjusting = true;

        const first = scroll.children[0];
        scroll.appendChild(first);

        scroll.scrollLeft -= cardSize;
        isAdjusting = false;

        scroll.style.scrollSnapType = "x mandatory";
    }

    // Mover última carta al inicio
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

        // Inyectar diseño de carta dinámica
        front.innerHTML = `
            <div class="card-frame">
                <div class="card-header">
                    <div class="tag">BASIC</div>
                    <div class="name" data-name></div>
                    <div class="stats">
                        <span class="hp" data-hp></span>
                        <img class="type-icon" data-type-icon />
                    </div>
                </div>

                <div class="card-art" data-art></div>

                <div class="card-body">
                    <div class="ability">
                        <div class="cost">
                            <img src="pokeball.png" />
                            <img src="pokeball.png" />
                        </div>
                        <div class="move-name" data-move>—</div>
                    </div>

                    <p class="description" data-description>—</p>
                </div>

                <div class="card-footer">
                    <div class="weak">weak ×2</div>
                    <div class="res">res —</div>
                    <div class="retreat">⭐⭐⭐⭐⭐</div>

                    <div class="collector">
                        <span class="number" data-number></span>
                        <img src="pokeball.png" class="smallball" />
                        <img src="pokeball.png" class="smallball" />
                    </div>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            inner.classList.toggle("flipped");
        });

        inner.appendChild(back);
        inner.appendChild(front);
        card.appendChild(inner);
        scroll.appendChild(card);

        // Pokémon aleatorio
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

    const nameEl = front.querySelector("[data-name]");
    const hpEl = front.querySelector("[data-hp]");
    const typeIcon = front.querySelector("[data-type-icon]");
    const art = front.querySelector("[data-art]");
    const numberEl = front.querySelector("[data-number]");
    const moveEl = front.querySelector("[data-move]");
    const descEl = front.querySelector("[data-description]");

    // Nombre
    nameEl.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);

    // HP
    hpEl.textContent = "HP " + data.stats[0].base_stat;

    // Arte
    art.style.backgroundImage = `url(${data.sprites.other["official-artwork"].front_default})`;

    // Tipo
    const type = data.types[0].type.name;
    typeIcon.src = `icons/types/${type}.png`;

    // Número Pokédex
    numberEl.textContent = `${String(data.id).padStart(3, "0")}/151`;

    // Movimiento
    moveEl.textContent = data.moves[0]?.move?.name || "—";

    // Descripción temporal
    descEl.textContent = "Un Pokémon misterioso lleno de sombras.";
}
