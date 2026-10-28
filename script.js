
const games = [
    {
        id: 1,
        name: "Cyberpunk 2077",
        category: "Action",
        price: 129.00,
        icon: "🌆",
        cover: "cover-scifi",
        description: "Pengembaraan futuristik dalam Night City."
    },
    {
        id: 2,
        name: "Elden Ring",
        category: "RPG",
        price: 149.00,
        icon: "🐉",
        cover: "cover-rpg",
        description: "Terokai dunia fantasi yang luas."
    },
    {
        id: 3,
        name: "Forza Horizon 5",
        category: "Racing",
        price: 99.00,
        icon: "🏎️",
        cover: "cover-racing",
        description: "Perlumbaan berkelajuan tinggi."
    },
    {
        id: 4,
        name: "The Witcher 3",
        category: "Adventure",
        price: 59.00,
        icon: "⚔️",
        cover: "cover-fantasy",
        description: "Jadi pemburu raksasa profesional."
    },
    {
        id: 5,
        name: "EA Sports FC",
        category: "Sports",
        price: 189.00,
        icon: "⚽",
        cover: "cover-sports",
        description: "Bina pasukan bola sepak impian."
    },
    {
        id: 6,
        name: "Red Dead Redemption 2",
        category: "Adventure",
        price: 119.00,
        icon: "🤠",
        cover: "cover-adventure",
        description: "Pengembaraan epik di dunia koboi."
    },
    {
        id: 7,
        name: "Assassin's Creed",
        category: "Action",
        price: 89.00,
        icon: "🗡️",
        cover: "cover-stealth",
        description: "Misi rahsia dan aksi bersejarah."
    },
    {
        id: 8,
        name: "Baldur's Gate 3",
        category: "RPG",
        price: 179.00,
        icon: "🧙",
        cover: "cover-fantasy",
        description: "Strategi dan fantasi penuh pilihan."
    },
    {
        id: 9,
        name: "Doom Eternal",
        category: "Action",
        price: 49.00,
        icon: "👹",
        cover: "cover-action",
        description: "Aksi pantas menentang makhluk asing."
    },
    {
        id: 10,
        name: "Hogwarts Legacy",
        category: "Adventure",
        price: 109.00,
        icon: "✨",
        cover: "cover-rpg",
        description: "Terokai dunia sihir yang menakjubkan."
    },
    {
        id: 11,
        name: "Need for Speed",
        category: "Racing",
        price: 69.00,
        icon: "🏁",
        cover: "cover-racing",
        description: "Kereta sport dan perlumbaan jalanan."
    },
    {
        id: 12,
        name: "Civilization VI",
        category: "Strategy",
        price: 39.00,
        icon: "🏰",
        cover: "cover-strategy",
        description: "Bina empayar anda sendiri."
    }
];

// ELEMEN HTML
const gameGrid = document.getElementById("gameGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const gameCount = document.getElementById("gameCount");
const emptyMessage = document.getElementById("emptyMessage");

const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");

// TROLI
let cart = [];

// Format harga Ringgit Malaysia
function formatPrice(price) {
    return new Intl.NumberFormat("ms-MY", {
        style: "currency",
        currency: "MYR"
    }).format(price);
}

// PAPAR GAME
function renderGames() {
    const keyword = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const sort = sortFilter.value;

    let filteredGames = games.filter(game => {
        const matchesName = game.name
            .toLowerCase()
            .includes(keyword);

        const matchesCategory =
            category === "Semua" ||
            game.category === category;

        return matchesName && matchesCategory;
    });

    if (sort === "low") {
        filteredGames.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
        filteredGames.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
        filteredGames.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    gameCount.textContent =
        `${filteredGames.length} game`;

    emptyMessage.hidden = filteredGames.length !== 0;

    gameGrid.innerHTML = filteredGames.map(game => `
        <article class="game-card">
            <div class="game-cover ${game.cover}">
                <span aria-hidden="true">${game.icon}</span>
            </div>

            <div class="game-info">
                <span class="game-category">
                    ${game.category}
                </span>

                <h3>${game.name}</h3>

                <p class="game-description">
                    ${game.description}
                </p>

                <div class="game-bottom">
                    <span class="game-price">
                        ${formatPrice(game.price)}
                    </span>

                    <button
                        class="add-button"
                        data-add="${game.id}">
                        + Troli
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// TAMBAH GAME KE TROLI
function addToCart(id) {
    const game = games.find(item => item.id === id);

    if (!game) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...game,
            quantity: 1
        });
    }

    renderCart();
}

// UBAH KUANTITI ATAU BUANG GAME
function updateQuantity(id, change) {
    const item = cart.find(game => game.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(game => game.id !== id);
    }

    renderCart();
}

// PAPAR TROLI
function renderCart() {
    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(totalPrice);

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="cart-empty">
                🛒 Troli anda masih kosong.
            </p>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.icon} ${item.name}</h4>
                <p>${formatPrice(item.price * item.quantity)}</p>

                <div class="quantity-controls">
                    <button
                        data-id="${item.id}"
                        data-change="-1"
                        aria-label="Kurangkan kuantiti">−</button>

                    <span>${item.quantity}</span>

                    <button
                        data-id="${item.id}"
                        data-change="1"
                        aria-label="Tambah kuantiti">+</button>
                </div>
            </div>

            <button
                class="icon-button remove-button"
                data-remove="${item.id}"
                aria-label="Buang ${item.name}">
                ✕
            </button>
        </div>
    `).join("");
}

// BUKA DAN TUTUP TROLI
function openCart() {
    cartPanel.classList.add("open");
    cartOverlay.classList.add("active");
}

function hideCart() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("active");
}

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", hideCart);
cartOverlay.addEventListener("click", hideCart);

// CARIAN DAN PENAPIS
searchInput.addEventListener("input", renderGames);
categoryFilter.addEventListener("change", renderGames);
sortFilter.addEventListener("change", renderGames);

// EVENT KLIK KAD GAME
gameGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    addToCart(Number(button.dataset.add));

    button.textContent = "✓ Ditambah";

    setTimeout(() => {
        if (button.isConnected) {
            button.textContent = "+ Troli";
        }
    }, 800);
});

// EVENT DALAM TROLI
cartItems.addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-change]");
    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {
        updateQuantity(
            Number(quantityButton.dataset.id),
            Number(quantityButton.dataset.change)
        );
    }

    if (removeButton) {
        const id = Number(removeButton.dataset.remove);
        cart = cart.filter(item => item.id !== id);
        renderCart();
    }
});

// PEMBELIAN DEMO
checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Troli anda masih kosong!");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    alert(
        "Pembelian demo berjaya disediakan!\n\n" +
        "Jumlah: " + formatPrice(total) +
        "\n\nTiada bayaran sebenar dibuat. " +
        "Sambungkan sistem pembayaran untuk jualan sebenar."
    );
});

// PAPARAN AWAL
renderGames();
renderCart();