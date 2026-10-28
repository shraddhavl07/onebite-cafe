/* =========================================================
   ONE BITE CAFE
   MAIN SCRIPT
   PART 1 / 3
========================================================= */

"use strict";

const API_BASE = "https://onebite-cafe.onrender.com";
/* =========================================================
   GLOBAL DATA
========================================================= */

let cart =
    JSON.parse(
        localStorage.getItem("oneBiteCart")
    ) || [];


const urlParams = new URLSearchParams(window.location.search);

const qrTable = urlParams.get("table");

let currentTable =
    qrTable
        ? String(parseInt(qrTable, 10)).padStart(2, "0")
        : (localStorage.getItem("oneBiteTable") || "05");

if (qrTable) {
    localStorage.setItem(
        "oneBiteTable",
        currentTable
    );
}

let currentOrder = null;


let menuItems = [];


let activeCategory = "All";


let toastTimer = null;


/* =========================================================
   MENU IMAGE MAP
========================================================= */

const categoryImages = {

    "Tea":
        "imagges/tea.jpg",

    "Coffee":
        "imagges/coffee.jpg",

    "Ice-Cream":
        "imagges/icecream.jpg",

    "Shake & Milkshake":
        "imagges/shake.jpg",

    "Mocktail":
        "imagges/mocktail.jpg",

    "Lassi":
        "imagges/lassi.jpg",

    "Maggi & Momos":
        "imagges/maggi-momos.jpg",

    "Sandwich":
        "imagges/sandwich.jpg",

    "Burger":
        "imagges/burger.jpg",

    "Pizza":
        "imagges/pizza.jpg",

    "Fries":
        "imagges/fries.jpg"

};


/* =========================================================
   COMBO IMAGE
========================================================= */

const comboImage =
    "imagges/combo.jpg";


/* =========================================================
   COMPLETE MENU
   63 ITEMS
========================================================= */

  const defaultMenu = [

    // =========================
    // TEA
    // =========================

    {
        id: 1,
        name: "Lemon Tea",
        description: "Refreshing lemon tea",
        price: 15,
        category: "Tea",
        image: "imagges/lemon-tea.jpg"
    },

    {
        id: 2,
        name: "Black Tea",
        description: "Classic black tea",
        price: 15,
        category: "Tea",
        image: "imagges/black-tea.jpg"
    },

    {
        id: 3,
        name: "Elaichi Tea",
        description: "Aromatic cardamom tea",
        price: 20,
        category: "Tea",
        image: "imagges/elaichi-tea.jpg"
    },

    {
        id: 4,
        name: "Ginger Tea",
        description: "Fresh ginger tea",
        price: 20,
        category: "Tea",
        image: "imagges/ginger-tea.jpg"
    },

    {
        id: 5,
        name: "Green Tea",
        description: "Light and refreshing green tea",
        price: 30,
        category: "Tea",
        image: "imagges/green-tea.jpg"
    },

    {
        id: 6,
        name: "Masala Tea",
        description: "Traditional spicy masala tea",
        price: 30,
        category: "Tea",
        image: "imagges/masala-tea.jpg"
    },


    // =========================
    // COFFEE
    // =========================

    {
        id: 7,
        name: "Black Coffee",
        description: "Strong black coffee",
        price: 15,
        category: "Coffee",
        image: "imagges/black-coffee.jpg"
    },

    {
        id: 8,
        name: "Hot Coffee",
        description: "Fresh hot coffee",
        price: 30,
        category: "Coffee",
        image: "imagges/hot-coffee.jpg"
    },

    {
        id: 9,
        name: "Caramel Coffee",
        description: "Coffee with caramel flavour",
        price: 30,
        category: "Coffee",
        image: "imagges/caramel-coffee.jpg"
    },

    {
        id: 10,
        name: "Normal Cold Coffee",
        description: "Chilled creamy cold coffee",
        price: 39,
        category: "Coffee",
image: "imagges/normal-cold-coffee.jpg"    },

    {
        id: 11,
        name: "Cold Coffee with Crush",
        description: "Cold coffee with delicious crush",
        price: 49,
        category: "Coffee",
image: "imagges/cold-coffee-crush.jpg"    },

    {
        id: 12,
        name: "Cold Coffee with Ice-Cream",
        description: "Cold coffee topped with ice cream",
        price: 59,
        category: "Coffee",
image: "imagges/cold-coffee-icecream.jpg"
    },

    {
        id: 13,
        name: "Thick Cold Coffee",
        description: "Rich and creamy thick cold coffee",
        price: 69,
        category: "Coffee",
        image: "imagges/cold-coffee.jpg"
    },


    // =========================
    // ICE CREAM
    // =========================

    {
        id: 14,
        name: "Vanilla",
        description: "Classic vanilla ice cream",
        price: 49,
        category: "Ice-Cream",
image: "imagges/vanilla-ice-cream.jpg"    },

    {
        id: 15,
        name: "Chocolate",
        description: "Rich chocolate ice cream",
        price: 49,
        category: "Ice-Cream",
image: "imagges/chocolate-ice-cream.jpg"    },

    {
        id: 16,
        name: "Mango",
        description: "Creamy mango ice cream",
        price: 49,
        category: "Ice-Cream",
image: "imagges/mango-ice-cream.jpg"    },

    {
        id: 17,
        name: "Strawberry",
        description: "Sweet strawberry ice cream",
        price: 49,
        category: "Ice-Cream",
image: "imagges/strawberry-ice-cream.jpg"    },


    // =========================
    // SHAKE & MILKSHAKE
    // =========================

    {
        id: 18,
        name: "Thick Oreo Shake",
        description: "Thick creamy Oreo shake",
        price: 79,
        category: "Shake & Milkshake",
        image: "imagges/oreo-shake.jpg"
    },

    {
        id: 19,
        name: "Thick Kit-Kat Shake",
        description: "Thick Kit-Kat chocolate shake",
        price: 89,
        category: "Shake & Milkshake",
        image: "imagges/kitkat-shake.jpg"
    },

    {
        id: 20,
        name: "Rose Shake",
        description: "Sweet rose flavoured shake",
        price: 69,
        category: "Shake & Milkshake",
        image: "imagges/rose-shake.jpg"
    },

    {
        id: 21,
        name: "Mango Shake",
        description: "Fresh mango shake",
        price: 69,
        category: "Shake & Milkshake",
        image: "imagges/mango-shake.jpg"
    },

    {
        id: 22,
        name: "Strawberry Shake",
        description: "Fresh strawberry shake",
        price: 79,
        category: "Shake & Milkshake",
        image: "imagges/strawberry-shake.jpg"
    },

    {
        id: 23,
        name: "Pineapple Shake",
        description: "Refreshing pineapple shake",
        price: 79,
        category: "Shake & Milkshake",
        image: "imagges/pineapple-shake.jpg"
    },


    // =========================
    // MOCKTAIL
    // =========================

    {
        id: 24,
        name: "Mojito",
        description: "Refreshing mint mojito",
        price: 59,
        category: "Mocktail",
        image: "imagges/mojito.jpg"
    },

    {
        id: 25,
        name: "Blue Lagoon",
        description: "Refreshing blue lagoon",
        price: 59,
        category: "Mocktail",
        image: "imagges/blue-lagoon.jpg"
    },

    {
        id: 26,
        name: "Kiwi",
        description: "Refreshing kiwi mocktail",
        price: 59,
        category: "Mocktail",
        image: "imagges/kiwi.jpg"
    },

    {
        id: 27,
        name: "Mango",
        description: "Refreshing mango mocktail",
        price: 59,
        category: "Mocktail",
        image: "imagges/mango-mocktail.jpg"
    },


    // =========================
    // LASSI
    // =========================

    {
        id: 28,
        name: "Plain Lassi",
        description: "Classic creamy lassi",
        price: 59,
        category: "Lassi",
image: "imagges/plain-lassi.jpg"
 },

    {
        id: 29,
        name: "Rose Lassi",
        description: "Refreshing rose lassi",
        price: 69,
        category: "Lassi",
image: "imagges/rose-lassi.jpg"
    },

    {
        id: 30,
        name: "Mango Lassi",
        description: "Creamy mango lassi",
        price: 79,
        category: "Lassi",
image: "imagges/mango-lassi.jpg"
    },


    // =========================
    // MAGGI & MOMOS
    // =========================

    {
        id: 31,
        name: "Plain Maggi",
        description: "Classic hot Maggi",
        price: 39,
        category: "Maggi & Momos",
image: "imagges/plain-maggi.jpg"
    },

    {
        id: 32,
        name: "Cheese Maggi",
        description: "Maggi with melted cheese",
        price: 49,
        category: "Maggi & Momos",
image: "imagges/cheese-maggi.jpg"    },

    {
        id: 33,
        name: "Veg Cheese Maggi",
        description: "Veg Maggi with cheese",
        price: 59,
        category: "Maggi & Momos",
image: "imagges/veg-cheese-maggi.jpg"    },

    {
        id: 34,
        name: "Mix Veg Momos",
        description: "Steamed vegetable momos",
        price: 69,
        category: "Maggi & Momos",
       image: "imagges/mix-veg-momos.jpg"

    },

    {
        id: 35,
        name: "Paneer Momos",
        description: "Soft paneer momos",
        price: 79,
        category: "Maggi & Momos",
       image: "imagges/paneer-momos.jpg"
    },

    {
        id: 36,
        name: "Cheese Corn Momos",
        description: "Cheese and corn momos",
        price: 89,
        category: "Maggi & Momos",
       image: "imagges/cheese-corn-momos.jpg"
    },


    // =========================
    // SANDWICH
    // =========================

    {
        id: 37,
        name: "Cheese Sandwich",
        description: "Grilled cheese sandwich",
        price: 49,
        category: "Sandwich",
        image: "imagges/cheese-sandwich.jpg"
    },

    {
        id: 38,
        name: "Veg Grill Sandwich",
        description: "Grilled vegetable sandwich",
        price: 59,
        category: "Sandwich",
        image: "imagges/veg-grill-sandwich.jpg"
    },
    {
        id: 39,
        name: "Chocolate Sandwich",
        description: "Sweet chocolate sandwich",
        price: 69,
        category: "Sandwich",
        image: "imagges/chocolate-sandwich.jpg"
    },

    {
        id: 40,
        name: "Spicy Schezwan Sandwich",
        description: "Spicy Schezwan sandwich",
        price: 79,
        category: "Sandwich",
        image: "imagges/schezwan-sandwich.jpg"
    },

    {
        id: 41,
        name: "Tandoori Sandwich",
        description: "Tandoori style sandwich",
        price: 89,
        category: "Sandwich",
        image: "imagges/tandoori-sandwich.jpg"
    },

    {
        id: 42,
        name: "Cheese Veg Sandwich",
        description: "Vegetable sandwich with cheese",
        price: 99,
        category: "Sandwich",
        image: "imagges/cheese-veg-sandwich.jpg"
    },


    // =========================
    // BURGER
    // =========================

    {
        id: 43,
        name: "Veg Burger",
        description: "Classic vegetable burger",
        price: 59,
        category: "Burger",
       image: "imagges/veg-burger.jpg"
    },

    {
        id: 44,
        name: "Aloo Tikki Burger",
        description: "Crispy aloo tikki burger",
        price: 59,
        category: "Burger",
        image: "imagges/aloo-tikki-burger.jpg"
    },

    {
        id: 45,
        name: "Crispy Burger",
        description: "Crispy veg burger",
        price: 69,
        category: "Burger",
        image: "imagges/crispy-burger.jpg"
    },

    {
        id: 46,
        name: "Peri-Peri Burger",
        description: "Spicy peri-peri burger",
        price: 69,
        category: "Burger",
        image: "imagges/peri-peri-burger.jpg"
    },

    {
        id: 47,
        name: "Schezwan Burger",
        description: "Spicy Schezwan burger",
        price: 79,
        category: "Burger",
        image: "imagges/schezwan-burger.jpg"
    },

    {
        id: 48,
        name: "Tandoori Burger",
        description: "Tandoori flavoured burger",
        price: 79,
        category: "Burger",
       image: "imagges/tandoori-burger.jpg"
    },

    {
        id: 49,
        name: "Cheese Burger",
        description: "Burger with melted cheese",
        price: 89,
        category: "Burger",
        image: "imagges/cheese-burger.jpg"
    },

    {
        id: 50,
        name: "Aloo Cheese Burger",
        description: "Aloo tikki with cheese",
        price: 89,
        category: "Burger",
        image: "imagges/aloo-cheese-burger.jpg"
    },

    {
        id: 51,
        name: "Maharaja Burger",
        description: "Loaded Maharaja style burger",
        price: 99,
        category: "Burger",
       image: "imagges/maharaja-burger.jpg"
    },


    // =========================
    // PIZZA
    // =========================

    {
        id: 52,
        name: "Margherita Pizza",
        description: "Classic cheese Margherita pizza",
        price: 99,
        category: "Pizza",
       image: "imagges/margherita-pizza.jpg"
    },

    {
        id: 53,
        name: "Onion Pizza",
        description: "Fresh onion pizza",
        price: 109,
        category: "Pizza",
        image: "imagges/onion-pizza.jpg"
    },

    {
        id: 54,
        name: "Tomato Pizza",
        description: "Fresh tomato pizza",
        price: 119,
        category: "Pizza",
        image: "imagges/tomato-pizza.jpg"
    },

    {
        id: 55,
        name: "Veg Pizza",
        description: "Loaded vegetable pizza",
        price: 129,
        category: "Pizza",
        image: "imagges/veg-pizza.jpg"
    },

    {
        id: 56,
        name: "Corn Pizza",
        description: "Sweet corn pizza",
        price: 139,
        category: "Pizza",
       image: "imagges/corn-pizza.jpg"
    },

    {
        id: 57,
        name: "Paneer Pizza",
        description: "Paneer topped pizza",
        price: 149,
        category: "Pizza",
       image: "imagges/paneer-pizza.jpg"
    },


    // =========================
    // FRIES
    // =========================

    {
        id: 58,
        name: "French Fries",
        description: "Crispy golden fries",
        price: 69,
        category: "Fries",
        image: "imagges/french-fries.jpg"
    },

    {
        id: 59,
        name: "Masala Fries",
        description: "Spicy masala fries",
        price: 69,
        category: "Fries",
image: "imagges/masala-fries.jpg"
    },

    {
        id: 60,
        name: "Tandoori Fries",
        description: "Tandoori flavoured fries",
        price: 79,
        category: "Fries",
       image: "imagges/tandoori-fries.jpg"
    },

    {
        id: 61,
        name: "Peri Peri Fries",
        description: "Spicy peri-peri fries",
        price: 79,
        category: "Fries",
        image: "imagges/peri-peri-fries.jpg"
    },

    {
        id: 62,
        name: "Chipotle Fries",
        description: "Creamy chipotle fries",
        price: 89,
        category: "Fries",
        image: "imagges/chipotle-fries.jpg"
    },

    {
        id: 63,
        name: "Cheese Fries",
        description: "Fries topped with cheese",
        price: 89,
        category: "Fries",
        image: "imagges/cheese-fries.jpg"
    }

];

/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateTableDisplay();

        updateCartCount();

        loadMenu();

        loadReviews();

    }
);


/* =========================================================
   TABLE FUNCTIONS
========================================================= */

function startTableOrder() {

    const modal =
        document.getElementById(
            "tableModal"
        );

    const input =
        document.getElementById(
            "tableInput"
        );

    if (!modal) return;

    if (input) {

        input.value =
            currentTable;

    }

    modal.classList.remove(
        "hidden"
    );

}


function closeTableModal() {

    const modal =
        document.getElementById(
            "tableModal"
        );

    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


function confirmTable() {

    const input =
        document.getElementById(
            "tableInput"
        );

    if (!input) return;

    let table =
        parseInt(
            input.value,
            10
        );

    if (
        isNaN(table) ||
        table < 1 ||
        table > 99
    ) {

        showToast(
            "Please enter a valid table number."
        );

        return;

    }

    table =
        String(table).padStart(
            2,
            "0"
        );

    currentTable =
        table;

    localStorage.setItem(
        "oneBiteTable",
        table
    );

    updateTableDisplay();

    closeTableModal();

    showToast(
        `Table ${table} selected`
    );

}


/* =========================================================
   TABLE DISPLAY
========================================================= */

function updateTableDisplay() {

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const qrTable =
        urlParams.get("table");

    const table =
        qrTable
            ? String(
                parseInt(qrTable, 10)
              ).padStart(2, "0")
            : (
                localStorage.getItem(
                    "oneBiteTable"
                ) || "05"
              );

    currentTable =
        table;

    if (qrTable) {

        localStorage.setItem(
            "oneBiteTable",
            table
        );
    }


    const header =
        document.getElementById(
            "headerTable"
        );

    const current =
        document.getElementById(
            "currentTable"
        );

    const cartTable =
        document.getElementById(
            "cartTable"
        );

    const tracking =
        document.getElementById(
            "trackingTable"
        );


    if (header) {

        header.textContent =
            table;

    }

    if (current) {

        current.textContent =
            table;

    }

    if (cartTable) {

        cartTable.textContent =
            table;

    }

    if (tracking) {

        tracking.textContent =
            table;

    }

}


/* =========================================================
   LOAD MENU
========================================================= */

async function loadMenu() {

    try {
const response = await fetch(`${API_BASE}/api/menu`);


        if (!response.ok) {

            throw new Error(
                "Menu API unavailable"
            );

        }


        const data =
            await response.json();


        if (Array.isArray(data)) {

            menuItems =
                data;

        }

        else if (
            Array.isArray(
                data.menu
            )
        ) {

            menuItems =
                data.menu;

        }

        else {

            menuItems =
                defaultMenu;

        }

    }

    catch (error) {

        console.log(
            "Using complete default menu:",
            error
        );

        menuItems =
            defaultMenu;

    }


    renderCategories();

    renderMenu();

    renderCombos();

}


/* =========================================================
   CATEGORY IMAGE
========================================================= */

function getMenuImage(category) {

    return (
        categoryImages[
            category
        ] ||
        "imagges/combo.jpg"
    );

}


/* =========================================================
   CATEGORIES
========================================================= */

function renderCategories() {

    const container =
        document.getElementById(
            "categories"
        );

    if (!container) return;


    const categories = [

        "All",

        ...new Set(

            menuItems

                .map(
                    item =>
                        item.category
                )

                .filter(Boolean)

        )

    ];


    container.innerHTML =
        "";


    categories.forEach(
        category => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "category-btn";


            if (
                category ===
                activeCategory
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.textContent =
                category;


            button.addEventListener(
                "click",
                () => {

                    activeCategory =
                        category;

                    renderCategories();

                    renderMenu();

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   MENU RENDERING
========================================================= */

function renderMenu() {

    const grid =
        document.getElementById(
            "menuGrid"
        );

    if (!grid) return;


    let items =
        menuItems;


    if (
        activeCategory !==
        "All"
    ) {

        items =
            menuItems.filter(
                item =>
                    item.category ===
                    activeCategory
            );

    }


    grid.innerHTML =
        "";


    if (!items.length) {

        grid.innerHTML = `

            <p class="loading">
                No menu items available.
            </p>

        `;

        return;

    }


    items.forEach(
        item => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "menu-card";


        const image =
    item.image ||
    getMenuImage(
        item.category
    );


            card.innerHTML = `

                <div class="menu-image">

                    <img
                        src="${image}"
                        alt="${escapeHTML(item.name)}"
                        loading="lazy"
                        onerror="this.style.display='none'"
                    >

                </div>


                <div class="menu-card-content">

                    <span class="menu-category">
                        ${escapeHTML(
                            item.category || ""
                        )}
                    </span>


                    <h3>
                        ${escapeHTML(
                            item.name
                        )}
                    </h3>


                    <p>
                        ${escapeHTML(
                            item.description || ""
                        )}
                    </p>


                    <div class="menu-card-bottom">

                        <strong>
                            ₹${Number(
                                item.price || 0
                            )}
                        </strong>


                        <button
                            class="primary-btn"
                            type="button"
                            onclick="addToCart(${item.id})"
                        >
                            Add
                        </button>

                    </div>

                </div>

            `;


            grid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   END OF PART 1
========================================================= */
/* =========================================================
   ONE BITE CAFE
   MAIN SCRIPT
   PART 2 / 3
========================================================= */


/* =========================================================
   COMBOS
========================================================= */

const comboItems = [

    {
        id: "combo1",
        name:
            "Veg Grilled Sandwich + Cold Coffee",
        description:
            "Veg grilled sandwich with cold coffee",
        price: 79
    },

    {
        id: "combo2",
        name:
            "Cheese Burger + Cold Coffee",
        description:
            "Cheese burger with two cold coffees",
        price: 99
    },

    {
        id: "combo3",
        name:
            "3 Veg Burgers",
        description:
            "Three classic veg burgers",
        price: 149
    },

    {
        id: "combo4",
        name:
            "Veg Grilled Sandwich + Maggi + Any Mocktail",
        description:
            "Veg grilled sandwich, Maggi and any mocktail",
        price: 179
    },

    {
        id: "combo5",
        name:
            "Paneer Pizza + Any 2 Mocktail",
        description:
            "Paneer pizza with any two mocktails",
        price:  249
    },

    {
        id: "combo6",
        name:
            "2 Thick Cold Coffee + 1 Margherita + Fries",
        description:
            "Two thick cold coffees, Margherita pizza and fries",
        price:  299
    }

];


/* =========================================================
   RENDER COMBOS
========================================================= */

function renderCombos() {

    const grid =
        document.getElementById(
            "comboGrid"
        );

    if (!grid) return;


    grid.innerHTML =
        "";


    comboItems.forEach(
        combo => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "combo-card";


            card.innerHTML = `

                <div class="menu-image">

                    <img
                        src="${comboImage}"
                        alt="${escapeHTML(combo.name)}"
                        loading="lazy"
                        onerror="this.style.display='none'"
                    >

                </div>


                <div>

                    <span class="menu-category">
                        COMBO
                    </span>


                    <h3>
                        ${escapeHTML(
                            combo.name
                        )}
                    </h3>


                    <p>
                        ${escapeHTML(
                            combo.description
                        )}
                    </p>

                </div>


                <div class="menu-card-bottom">

                    <strong>
                        ₹${combo.price}
                    </strong>


                    <button
                        class="primary-btn"
                        type="button"
                        onclick="addComboToCart('${combo.id}')"
                    >
                        Add
                    </button>

                </div>

            `;


            grid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   ADD MENU ITEM TO CART
========================================================= */

function addToCart(itemId) {

    const item =
        menuItems.find(
            product =>
                String(product.id) ===
                String(itemId)
        );


    if (!item) {

        showToast(
            "Item not found."
        );

        return;

    }


    const existing =
        cart.find(
            product =>
                String(product.id) ===
                String(item.id)
        );


    if (existing) {

        existing.quantity +=
            1;

    }

    else {

        cart.push({

            id:
                item.id,

            name:
                item.name,

            price:
                Number(item.price) || 0,

            quantity:
                1

        });

    }


    saveCart();

    updateCartCount();

    showToast(
        `${item.name} added to cart`
    );

}


/* =========================================================
   ADD COMBO TO CART
========================================================= */

function addComboToCart(comboId) {

    const combo =
        comboItems.find(
            item =>
                item.id ===
                comboId
        );


    if (!combo) {

        showToast(
            "Combo not found."
        );

        return;

    }


    const existing =
        cart.find(
            item =>
                item.id ===
                combo.id
        );


    if (existing) {

        existing.quantity +=
            1;

    }

    else {

        cart.push({

            id:
                combo.id,

            name:
                combo.name,

            price:
                combo.price,

            quantity:
                1

        });

    }


    saveCart();

    updateCartCount();

    showToast(
        `${combo.name} added`
    );

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(

        "oneBiteCart",

        JSON.stringify(
            cart
        )

    );

}


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

    const drawer =
        document.getElementById(
            "cartDrawer"
        );

    if (!drawer) return;


    updateTableDisplay();

    renderCart();


    drawer.classList.remove(
        "hidden"
    );

}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCart() {

    const drawer =
        document.getElementById(
            "cartDrawer"
        );


    if (drawer) {

        drawer.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (!container) return;


    container.innerHTML =
        "";


    if (!cart.length) {

        container.innerHTML = `

            <div class="empty-cart">

                <p>
                    Your cart is empty.
                </p>

            </div>

        `;


        if (totalElement) {

            totalElement.textContent =
                "₹0";

        }

        return;

    }


    let total =
        0;


    cart.forEach(
        item => {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            total +=
                itemTotal;


            const row =
                document.createElement(
                    "div"
                );


            row.className = "cart-item";

row.style.cssText = `
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:8px;
    width:100%;
    box-sizing:border-box;
    padding:12px;
`;

row.innerHTML = `

    <div
        style="
            flex:1 1 auto;
            min-width:0;
            overflow:hidden;
        "
    >

        <strong
            style="
                display:block;
                white-space:normal;
                overflow-wrap:anywhere;
            "
        >
            ${escapeHTML(item.name)}
        </strong>

        <small
            style="
                display:block;
                white-space:nowrap;
            "
        >
            ₹${item.price} × ${item.quantity}
        </small>

    </div>


    <div
        class="cart-item-actions"
        style="
            display:flex !important;
            flex-direction:row !important;
            flex-wrap:nowrap !important;
            align-items:center !important;
            justify-content:center !important;
            gap:3px !important;
            width:90px !important;
            min-width:90px !important;
            max-width:90px !important;
            flex:0 0 90px !important;
            height:32px !important;
        "
    >

        <button
            type="button"
            onclick="decreaseQuantity('${item.id}')"
            style="
                display:flex !important;
                align-items:center !important;
                justify-content:center !important;
                width:28px !important;
                min-width:28px !important;
                max-width:28px !important;
                height:28px !important;
                min-height:28px !important;
                padding:0 !important;
                margin:0 !important;
                flex:0 0 28px !important;
                border:none !important;
                border-radius:50% !important;
                background:#171513 !important;
                color:#ffffff !important;
            "
        >
            −
        </button>


        <strong
            style="
                display:flex !important;
                align-items:center !important;
                justify-content:center !important;
                width:24px !important;
                min-width:24px !important;
                max-width:24px !important;
                height:28px !important;
                padding:0 !important;
                margin:0 !important;
                flex:0 0 24px !important;
            "
        >
            ${item.quantity}
        </strong>


        <button
            type="button"
            onclick="increaseQuantity('${item.id}')"
            style="
                display:flex !important;
                align-items:center !important;
                justify-content:center !important;
                width:28px !important;
                min-width:28px !important;
                max-width:28px !important;
                height:28px !important;
                min-height:28px !important;
                padding:0 !important;
                margin:0 !important;
                flex:0 0 28px !important;
                border:none !important;
                border-radius:50% !important;
                background:#171513 !important;
                color:#ffffff !important;
            "
        >
            +
        </button>

    </div>

`;

            container.appendChild(
                row
            );

        }
    );


    if (totalElement) {

        totalElement.textContent =
            `₹${total}`;

    }

}


/* =========================================================
   INCREASE QUANTITY
========================================================= */

function increaseQuantity(id) {

    const item =
        cart.find(
            product =>
                String(product.id) ===
                String(id)
        );


    if (!item) return;


    item.quantity +=
        1;


    saveCart();

    renderCart();

    updateCartCount();

}


/* =========================================================
   DECREASE QUANTITY
========================================================= */

function decreaseQuantity(id) {

    const index =
        cart.findIndex(
            product =>
                String(product.id) ===
                String(id)
        );


    if (index === -1) return;


    if (
        cart[index].quantity >
        1
    ) {

        cart[index].quantity -=
            1;

    }

    else {

        cart.splice(
            index,
            1
        );

    }


    saveCart();

    renderCart();

    updateCartCount();

}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

    const count =
        document.getElementById(
            "cartCount"
        );


    if (!count) return;


    const total =
        cart.reduce(
            (
                sum,
                item
            ) => {

                return (
                    sum +
                    Number(
                        item.quantity
                    )

                );

            },
            0
        );


    count.textContent =
        total;

}


/* =========================================================
   PLACE ORDER
========================================================= */

async function placeOrder() {

    if (!cart.length) {

        showToast(
            "Your cart is empty."
        );

        return;

    }


    const total =
        cart.reduce(
            (
                sum,
                item
            ) => {

                return (
                    sum +
                    (
                        Number(item.price) *
                        Number(item.quantity)
                    )
                );

            },
            0
        );


    const orderData = {

        table:
            currentTable,

        items:
            cart,

        total:
            total,

        createdAt:
            new Date().toISOString()

    };


    
try {
    const response = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    });

    if (!response.ok) {
        showToast("Could not place your order. Please try again.");
        return;
    }

    const data = await response.json();
    const realOrderId = data.orderNumber || data.order_id || data.id;

    if (!realOrderId) {
        showToast("Order ID missing. Please contact staff.");
        return;
    }

    currentOrder = {
        ...orderData,
        orderNumber: realOrderId
    };

} catch (error) {
    console.error("Order API unavailable:", error);
    showToast("Unable to connect to the server. Please try again.");
    return;

    }


    localStorage.setItem(

        "oneBiteLastOrder",

        JSON.stringify(
            currentOrder
        )

    );


    /*
       IMPORTANT:

       Cart closes first.

       Success popup opens.

       Tracking does NOT open yet.

       User must click Continue.
    */

    closeCart();

    showOrderSuccess();

}


/* =========================================================
   GENERATE ORDER NUMBER
========================================================= */

function generateOrderNumber() {

    return Math.floor(

        1000 +
        Math.random() *
        9000

    );

}


/* =========================================================
   ORDER SUCCESS
========================================================= */

function showOrderSuccess() {

    const modal =
        document.getElementById(
            "orderSuccessModal"
        );


    const number =
        document.getElementById(
            "successOrderNumber"
        );


    if (!modal) return;


    const orderNumber =

        currentOrder &&
        currentOrder.orderNumber

            ? currentOrder.orderNumber

            : generateOrderNumber();


    if (number) {

        number.textContent =
            `#${orderNumber}`;

    }


    modal.classList.remove(
        "hidden"
    );

}


/* =========================================================
   CONTINUE TO TRACKING
========================================================= */

function continueToTracking() {

    const successModal =
        document.getElementById(
            "orderSuccessModal"
        );


    if (successModal) {

        successModal.classList.add(
            "hidden"
        );

    }


    showTracking();

}

let trackingInterval = null;
function showTracking() {

    const modal =
        document.getElementById("trackingModal");

    if (!modal) return;


    const orderNumber =
        document.getElementById("orderNumber");

    const table =
        document.getElementById("trackingTable");


    const received =
        document.getElementById("trackingReceived");

    const beingMade =
        document.getElementById("trackingBeingMade");

    const ready =
        document.getElementById("trackingReady");

    const served =
        document.getElementById("trackingServed");


    /* =====================================================
       SHOW BASIC ORDER INFORMATION
    ===================================================== */

    if (currentOrder) {

        if (orderNumber) {

            orderNumber.textContent =
                `#${currentOrder.orderNumber}`;

        }

    }


    if (table) {

        table.textContent =
            currentTable;

    }


    /* =====================================================
       UPDATE TRACKING UI
    ===================================================== */

    function updateTrackingStatus(status) {
        
        // Update customer notification message
        const notificationText = document.getElementById("trackingNotificationText");
        const notificationBox = document.getElementById("trackingNotification");

        const messages = {
            "Received": "✅ Your order has been received!",
            "Being Made": "👨‍🍳 Your order is being prepared!",
            "Ready": "🔔 Your order is ready! Please collect it.",
            "Served": "🍽️ Your order has been served. Enjoy your meal!"
        };

        if (notificationText && messages[status]) {
            notificationText.textContent = messages[status];
        }

        if (notificationBox && messages[status]) {
            notificationBox.style.display = "flex";
        }


        /* Remove active from all steps */

        if (received) {
            received.classList.remove("active");
        }

        if (beingMade) {
            beingMade.classList.remove("active");
        }

        if (ready) {
            ready.classList.remove("active");
        }

        if (served) {
            served.classList.remove("active");
        }


        /* Activate current status */

        if (status === "Received") {

            if (received) {
                received.classList.add("active");
            }

        }


        if (status === "Being Made") {

            if (received) {
                received.classList.add("active");
            }

            if (beingMade) {
                beingMade.classList.add("active");
            }

        }


        if (status === "Ready") {

            if (received) {
                received.classList.add("active");
            }

            if (beingMade) {
                beingMade.classList.add("active");
            }

            if (ready) {
                ready.classList.add("active");
            }

        }


        if (status === "Served") {

            if (received) {
                received.classList.add("active");
            }

            if (beingMade) {
                beingMade.classList.add("active");
            }

            if (ready) {
                ready.classList.add("active");
            }

            if (served) {
                served.classList.add("active");
            }

        }

    }


    /* =====================================================
       GET CURRENT STATUS FROM SERVER
    ===================================================== */

    async function refreshTrackingStatus() {

        if (!currentOrder) return;


        const orderId =
            currentOrder.orderNumber ||
            currentOrder.order_id ||
            currentOrder.id;


        if (!orderId) return;


        try {

            const response =
                await fetch(
                    `https://onebite-cafe.onrender.com/api/orders/${orderId}/track`);


            if (!response.ok) {

                console.error(
                    "Tracking request failed:",
                    response.status
                );

                return;

            }


            const data =
                await response.json();


            if (data.status) {

                updateTrackingStatus(
                    data.status
                );

            }


        } catch (error) {

            console.error(
                "TRACKING ERROR:",
                error
            );

        }

    }


    /* =====================================================
       OPEN TRACKING
    ===================================================== */

    modal.classList.remove("hidden");


    /* Get status immediately */

    refreshTrackingStatus();
    






    /* =====================================================
       CHECK STATUS EVERY 3 SECONDS
    ===================================================== */

    if (trackingInterval) {

        clearInterval(
            trackingInterval
        );

    }


    trackingInterval =
        setInterval(
            refreshTrackingStatus,
            3000
        );


    /* =====================================================
       CLEAR CART AFTER TRACKING OPENS
    ===================================================== */

    cart = [];

    saveCart();

    updateCartCount();

}

/* =========================================================
   CLOSE TRACKING
========================================================= */


function closeTracking() {
    const modal = document.getElementById("trackingModal");

    // Stop automatic status checking
    if (trackingInterval) {
        clearInterval(trackingInterval);
        trackingInterval = null;
    }

    // Close the tracking popup
    if (modal) {
        modal.classList.add("hidden");
    }
}


/* =========================================================
   CLOSE SUCCESS
========================================================= */

function closeOrderSuccess() {

    const modal =
        document.getElementById(
            "orderSuccessModal"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   END OF PART 2
========================================================= */
/* =========================================================
   ONE BITE CAFE
   MAIN SCRIPT
   PART 3 / 3
========================================================= */



/* =========================================================
   REVIEWS
========================================================= */

const REVIEW_API = "https://onebite-cafe.onrender.com/api/reviews";

function openReview() {
    const modal = document.getElementById("reviewModal");
    if (modal) modal.classList.remove("hidden");
}

function closeReview() {
    const modal = document.getElementById("reviewModal");
    if (modal) modal.classList.add("hidden");
}

/* SUBMIT REVIEW */
async function submitReview() {
    const name = document.getElementById("reviewName")?.value.trim();
    const rating = Number(document.getElementById("reviewRating")?.value);
    const text = document.getElementById("reviewText")?.value.trim();

    if (!name) {
        showToast("Please enter your name.");
        return;
    }

    if (!text) {
        showToast("Please write a review.");
        return;
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        showToast("Please select a valid rating.");
        return;
    }

    try {
        const response = await fetch(REVIEW_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, rating, text })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.detail || "Could not submit your review.");
        }

        closeReview();
        showToast("Thank you for your review!");

        const nameInput = document.getElementById("reviewName");
        const textInput = document.getElementById("reviewText");

        if (nameInput) nameInput.value = "";
        if (textInput) textInput.value = "";

        await loadReviews();

    } catch (error) {
        console.error("SUBMIT REVIEW ERROR:", error);
        showToast("Could not submit review. Please try again.");
    }
}


/* LOAD AND DISPLAY CUSTOMER REVIEWS */
async function loadReviews() {
    const grid = document.getElementById("reviewsGrid");

    try {
        const response = await fetch(REVIEW_API);

        if (!response.ok) {
            throw new Error(`Reviews API returned ${response.status}`);
        }

        const data = await response.json();
        const reviews = Array.isArray(data)
            ? data
            : (data.reviews || []);

        if (!grid) return reviews;

        if (reviews.length === 0) {
            grid.innerHTML = `
                <p class="loading">
                    Be the first to share your experience!
                </p>
            `;
            return reviews;
        }

        grid.innerHTML = reviews.map(review => {
            const rating = Math.max(
                1,
                Math.min(5, Number(review.rating) || 5)
            );

            return `
                <div class="review-card">
                    <div class="review-stars">
                        ${"⭐".repeat(rating)}
                    </div>

                    <p class="review-text">
                        ${escapeHTML(review.text || review.review_text || "")}
                    </p>

                    <strong>
                        — ${escapeHTML(review.name || "Customer")}
                    </strong>
                </div>
            `;
        }).join("");

        console.log("Customer reviews displayed:", reviews.length);
        return reviews;

    } catch (error) {
        console.error("LOAD REVIEWS ERROR:", error);

        if (grid) {
            grid.innerHTML = `
                <p class="loading">
                    Reviews are temporarily unavailable.
                    Please try again later.
                </p>
            `;
        }

        return [];
    }
}



/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   CLICK OUTSIDE MODALS
========================================================= */

document.addEventListener(
    "click",
    event => {

        const overlays =
            document.querySelectorAll(
                ".overlay"
            );


        overlays.forEach(
            overlay => {

                if (
                    event.target !==
                    overlay
                ) {

                    return;

                }


                /*
                   DO NOT automatically close
                   order success or tracking.
                */

                if (

                    overlay.id ===
                    "trackingModal"

                    ||

                    overlay.id ===
                    "orderSuccessModal"

                ) {

                    return;

                }


                overlay.classList.add(
                    "hidden"
                );

            }
        );

    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        /*
           Success and tracking should
           stay until user uses the button.
        */

        const tableModal =
            document.getElementById(
                "tableModal"
            );


        const cartDrawer =
            document.getElementById(
                "cartDrawer"
            );


        const reviewModal =
            document.getElementById(
                "reviewModal"
            );


        if (tableModal) {

            tableModal.classList.add(
                "hidden"
            );

        }


        if (cartDrawer) {

            cartDrawer.classList.add(
                "hidden"
            );

        }


        if (reviewModal) {

            reviewModal.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================================================
   SAFETY INITIALIZATION
========================================================= */

updateTableDisplay();

updateCartCount();


/* =========================================================
   END OF SCRIPT.JS
========================================================= */
/* =========================================================
   ONE BITE CAFE
   STAFF / ADMIN DASHBOARD
========================================================= */


/* =========================================================
   STAFF TOKEN
========================================================= */
function getStaffToken() {
    return sessionStorage.getItem("oneBiteStaffToken");
}


async function adminFetch(url, options = {}) {

    const token = getStaffToken();

    if (!token) {
        window.location.href = "login.html";
        throw new Error("Staff session expired.");
    }

    const headers = {
        ...(options.headers || {}),
        "Authorization": `Bearer ${token}`
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {

        sessionStorage.removeItem("oneBiteStaffToken");
        sessionStorage.removeItem("oneBiteStaffLoggedIn");

        window.location.href = "login.html";

        throw new Error("Staff session expired.");
    }

    return response;
}


/* =========================================================
   STAFF LOGOUT
========================================================= */

function staffLogout() {

    sessionStorage.removeItem(
        "oneBiteStaffToken"
    );

    sessionStorage.removeItem(
        "oneBiteStaffLoggedIn"
    );

    window.location.href =
        "login.html";

}


/* =========================================================
   ADMIN TAB SWITCHING
========================================================= */

function showAdminTab(
    tabId,
    button
) {

    const tabs =
        document.querySelectorAll(
            ".admin-tab-content"
        );

    tabs.forEach(
        tab => {

            tab.classList.add(
                "hidden"
            );

        }
    );


    const selected =
        document.getElementById(
            tabId
        );


    if (selected) {

        selected.classList.remove(
            "hidden"
        );
        console.log(
    "Selected tab:",
    selected.id,
    "Classes:",
    selected.className
);

    }


    const buttons =
        document.querySelectorAll(
            ".admin-tab"
        );


    buttons.forEach(
        btn => {

            btn.classList.remove(
                "active"
            );

        }
    );


    if (button) {

        button.classList.add(
            "active"
        );

    }


    /*
       Load the selected section
    */

    if (
        tabId ===
        "ordersTab"
    ) {

        loadAdminDashboard();

    }


    if (
        tabId ===
        "reviewsTab"
    ) {

        loadAdminReviews();

    }


    if (
        tabId ===
        "menuTab"
    ) {

        loadAdminMenu();

    }


    if (
        tabId ===
        "qrTab"
    ) {

        generateTableQRCodes();

    }

}


/* =========================================================
   ADMIN API REQUEST
========================================================= */

async function adminFetch(
    url,
    options = {}
) {

    const token =
        getStaffToken();


    if (!token) {

        window.location.href =
            "login.html";

        throw new Error(
            "Staff session expired."
        );

    }


    const headers = {

        ...(options.headers || {}),

        "Authorization":
            `Bearer ${token}`

    };


    const response =
        await fetch(
            url,
            {
                ...options,
                headers
            }
        );


    /*
       Staff session expired
    */

    if (
        response.status ===
        401
    ) {

        sessionStorage.removeItem(
            "oneBiteStaffToken"
        );

        sessionStorage.removeItem(
            "oneBiteStaffLoggedIn"
        );

        window.location.href =
            "login.html";

        throw new Error(
            "Staff session expired."
        );

    }


    return response;

}


/* =========================================================
   LOAD ADMIN DASHBOARD
========================================================= */

async function loadAdminDashboard() {

    const list =
        document.getElementById(
            "adminOrderList"
        );


    if (!list) return;


    list.innerHTML = `

        <p>
            Loading orders...
        </p>

    `;


    try {

        const response =
            await adminFetch(
                "/api/orders"
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Could not load orders."
            );

        }


        const orders =
            Array.isArray(data)
                ? data
                : (
                    Array.isArray(
                        data.orders
                    )
                        ? data.orders
                        : []
                );


        adminOrdersCache = orders;

        refreshAdminOrderPeriodView();


    }

    catch (error) {

        console.error(
            "Admin orders error:",
            error
        );


        list.innerHTML = `

            <div class="admin-error">

                <p>
                    Unable to load orders.
                </p>

                <small>
                    ${escapeHTML(
                        error.message
                    )}
                </small>

            </div>

        `;

    }

}


/* =========================================================
   RENDER ADMIN ORDERS
========================================================= */

function renderAdminOrders(
    orders
) {

    const container =
        document.getElementById(
            "adminOrderList"
        );


    if (!container) return;


    container.innerHTML =
        "";


    if (!orders.length) {

        container.innerHTML = `

            <div class="empty-admin">

                <h3>
                    No orders yet
                </h3>

                <p>
                    Customer orders will appear here.
                </p>

            </div>

        `;

        return;

    }


    orders.forEach(
        order => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "admin-order-card";


            const orderNumber =
                order.orderNumber ||
                order.order_id ||
                order.id;


            const table =
                order.table ||
                order.table_number ||
                "—";

const orderDateTime = formatAdminOrderDateTime(order);
            const status =
                order.status ||
                "Received";


            const total =
                Number(
                    order.total || 0
                );


            const items =
                Array.isArray(
                    order.items
                )
                    ? order.items
                    : [];


            const itemsHTML =
                items.length

                    ? items.map(
                        item => `

                            <div class="admin-order-item">

                                <span>
                                    ${escapeHTML(
                                        item.item_name ||
                                        item.name ||
                                        ""
                                    )}
                                </span>

                                <span>
                                    ×
                                    ${Number(
                                        item.quantity || 0
                                    )}
                                </span>

                            </div>

                        `
                    ).join("")

                    : `

                        <p>
                            No item details
                        </p>

                    `;


            card.innerHTML = `

                <div class="admin-order-top">

                    <div>

                        <p class="eyebrow">
                            ORDER
                        </p>

                        <h3>
                            #${escapeHTML(
                                orderNumber
                            )}
                        </h3>

                    </div>


                    <span class="order-status">
                        ${escapeHTML(
                            status
                        )}
                    </span>

                </div>


<div class="admin-order-datetime">
    <strong>Placed:</strong>
    ${escapeHTML(orderDateTime)}
</div>

                <div class="admin-order-info">

                    <span>
                        Table ${escapeHTML(
                            table
                        )}
                    </span>

                    <strong>
                        ₹${total.toFixed(2)}
                    </strong>

                </div>


                <div class="admin-order-items">

                    ${itemsHTML}

                </div>


                <div class="admin-order-actions">

                    <button
                        type="button"
                        onclick="updateAdminOrderStatus(
                            ${Number(orderNumber)},
                            'Received'
                        )"
                    >
                        Received
                    </button>


                    <button
                        type="button"
                        onclick="updateAdminOrderStatus(
                            ${Number(orderNumber)},
                            'Being Made'
                        )"
                    >
                        Being Made
                    </button>


                    <button
                        type="button"
                        onclick="updateAdminOrderStatus(
                            ${Number(orderNumber)},
                            'Ready'
                        )"
                    >
                        Ready
                    </button>


                    <button
                        type="button"
                        onclick="updateAdminOrderStatus(
                            ${Number(orderNumber)},
                            'Served'
                        )"
                    >
                        Served
                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}

async function updateAdminOrderStatus(orderId, status) {

    try {

        const response = await adminFetch(
            `/api/orders/${orderId}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Could not update order status."
            );

        }


        console.log(
            `Order #${orderId} → ${status}`
        );


        // Reload orders so the new status appears
        loadAdminDashboard();


    }

    catch (error) {

        console.error(
            "Status update error:",
            error
        );

        alert(
            error.message ||
            "Could not update order status."
        );

    }

}
/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

async function updateAdminOrderStatus(
    orderId,
    status
) {

    try {

        const response =
            await adminFetch(
                `/api/orders/${orderId}/status`,
                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({
                            status:
                                status
                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Could not update order."
            );

        }


        showToast(
            `Order #${orderId} → ${status}`
        );


        await loadAdminDashboard();

    }

    catch (error) {

        console.error(
            "Status update error:",
            error
        );


        showToast(
            error.message
        );

    }

}


/* =========================================================
   ADMIN STATISTICS
========================================================= */

function updateAdminStatistics(
    orders
) {

    const ordersElement =
        document.getElementById(
            "adminOrders"
        );


    const salesElement =
        document.getElementById(
            "adminSales"
        );


    const activeElement =
        document.getElementById(
            "adminActive"
        );


    const reviewsElement =
        document.getElementById(
            "adminReviews"
        );


    /*
       Today's orders
    */

    const today =
        new Date()
            .toISOString()
            .slice(
                0,
                10
            );


    const todayOrders =
        orders.filter(
            order => {

                if (
                    !order.created_at
                ) {

                    return true;

                }


                return String(
                    order.created_at
                ).startsWith(
                    today
                );

            }
        );


    const sales =
        todayOrders.reduce(
            (
                sum,
                order
            ) => {

                return (
                    sum +
                    Number(
                        order.total || 0
                    )
                );

            },
            0
        );


    const activeOrders =
        orders.filter(
            order => {

                const status =
                    String(
                        order.status ||
                        ""
                    );


                return (

                    status !==
                    "Served"

                    &&

                    status !==
                    "Cancelled"

                );

            }
        );


    if (ordersElement) {

        ordersElement.textContent =
            todayOrders.length;

    }


    if (salesElement) {

        salesElement.textContent =
            `₹${sales.toFixed(2)}`;

    }


    if (activeElement) {

        activeElement.textContent =
            activeOrders.length;

    }


    loadAdminReviewCount();

}


/* =========================================================
   REVIEWS
========================================================= */

async function loadAdminReviews() {

    const container =
        document.getElementById(
            "adminReviewList"
        );


    if (!container) return;


    container.innerHTML = `

        <p>
            Loading reviews...
        </p>

    `;


    /*
       Reviews are currently stored
       locally by the customer script.

       Display local reviews here.
    */

    const reviews =
        JSON.parse(
            localStorage.getItem(
                "oneBiteReviews"
            )
        ) || [];


    if (!reviews.length) {

        container.innerHTML = `

            <div class="empty-admin">

                <h3>
                    No reviews yet
                </h3>

                <p>
                    Customer reviews will appear here.
                </p>

            </div>

        `;

        updateAdminReviewNumber(0);

        return;

    }


    container.innerHTML =
        "";


    reviews
        .slice()
        .reverse()
        .forEach(
            review => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "admin-review-card";


                const rating =
                    Number(
                        review.rating || 0
                    );


                card.innerHTML = `

                    <div>

                        <strong>
                            ${escapeHTML(
                                review.name
                            )}
                        </strong>

                        <span>
                            ${"★".repeat(
                                Math.max(
                                    0,
                                    Math.min(
                                        5,
                                        rating
                                    )
                                )
                            )}
                        </span>

                    </div>


                    <p>
                        ${escapeHTML(
                            review.text
                        )}
                    </p>

                `;


                container.appendChild(
                    card
                );

            }
        );


    updateAdminReviewNumber(
        reviews.length
    );

}


/* =========================================================
   REVIEW COUNT
========================================================= */

function loadAdminReviewCount() {

    const reviews =
        JSON.parse(
            localStorage.getItem(
                "oneBiteReviews"
            )
        ) || [];


    updateAdminReviewNumber(
        reviews.length
    );

}


function updateAdminReviewNumber(
    count
) {

    const element =
        document.getElementById(
            "adminReviews"
        );


    if (element) {

        element.textContent =
            count;

    }

}


/* =========================================================
   ADMIN MENU
========================================================= */

async function loadAdminMenu() {

    const container =
        document.getElementById(
            "adminMenuList"
        );


    if (!container) return;


    container.innerHTML = `

        <p>
            Loading menu...
        </p>

    `;


    try {

        const response =
            await fetch(
                "/api/menu"
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                "Could not load menu."
            );

        }


        const items =
            Array.isArray(data)
                ? data
                : (
                    Array.isArray(
                        data.items
                    )
                        ? data.items
                        : []
                );


        if (!items.length) {

            container.innerHTML = `

                <p>
                    No menu items found.
                </p>

            `;

            return;

        }


        container.innerHTML =
            "";


        items.forEach(
            item => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "admin-menu-row";


                row.innerHTML = `

                    <div>

                        <strong>
                            ${escapeHTML(
                                item.name
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                item.category ||
                                ""
                            )}
                        </small>

                    </div>


                    <strong>
                        ₹${Number(
                            item.price || 0
                        )}
                    </strong>

                `;


                container.appendChild(
                    row
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Admin menu error:",
            error
        );


        container.innerHTML = `

            <p>
                ${escapeHTML(
                    error.message
                )}
            </p>

        `;

    }

}


/* =========================================================
   QR CODE GENERATION
========================================================= */

function generateTableQRCodes() {

    const grid =
        document.getElementById(
            "qrGrid"
        );


    if (!grid) return;


    /*
       Prevent rebuilding unnecessarily
    */

    if (
        grid.children.length
    ) {

        return;

    }


    for (
        let table = 1;
        table <= 20;
        table++
    ) {

        const number =
            String(table)
                .padStart(
                    2,
                    "0"
                );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "qr-card";


        const qr =
            document.createElement(
                "div"
            );


        qr.className =
            "qr-code";


        const url =
            `${window.location.origin}/index.html?table=${number}`;


        card.innerHTML = `

            <h3>
                Table ${number}
            </h3>

        `;


        card.appendChild(
            qr
        );


        const printButton =
            document.createElement(
                "button"
            );


        printButton.className =
            "primary-btn";


        printButton.textContent =
            "Print QR";


        printButton.onclick =
            () => {

                window.print();

            };


        card.appendChild(
            printButton
        );


        grid.appendChild(
            card
        );


        if (
            typeof QRCode !==
            "undefined"
        ) {

            new QRCode(
                qr,
                {

                    text:
                        url,

                    width:
                        150,

                    height:
                        150

                }
            );

        }

    }

}


/* =========================================================
   ADMIN INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
           Only run admin initialization
           when admin.html is open.
        */

        if (
            document.body.classList.contains(
                "admin-page"
            )
        ) {

            loadAdminDashboard();

            loadAdminReviews();

            loadAdminMenu();

            loadAdminReviewCount();

            generateTableQRCodes();

        }

    }
);


/* =========================================================
   END OF ADMIN SCRIPT
========================================================= */

/* =========================================
   ADMIN ORDER DATE FILTERS
   ========================================= */

let adminOrdersCache = [];
let adminOrderPeriod = "today";
let adminHistoryDate = "";


/* Parse an order's date safely */
function parseAdminOrderDate(value) {
    if (!value) return null;

    if (typeof value === "string") {
        const text = value.trim();

        // Treat timestamps without a timezone as UTC.
        // This matches the usual server/database timestamp format.
        if (
            /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(text) &&
            !/(Z|[+-]\d{2}:\d{2})$/i.test(text)
        ) {
            value = text.replace(" ", "T") + "Z";
        }
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
}


/* Get a date key using India time */
function getCafeDateKey(value) {
    const date = value instanceof Date
        ? value
        : parseAdminOrderDate(value);

    if (!date) return "";

    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(date);

    const part = type =>
        parts.find(item => item.type === type).value;

    return `${part("year")}-${part("month")}-${part("day")}`;
}


/* Today's date in India */
function getCafeTodayKey() {
    return getCafeDateKey(new Date());
}


/* Yesterday's date in India */
function getCafeYesterdayKey() {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const getPart = type =>
        Number(parts.find(item => item.type === type).value);

    const yesterday = new Date(Date.UTC(
        getPart("year"),
        getPart("month") - 1,
        getPart("day") - 1
    ));

    return [
        yesterday.getUTCFullYear(),
        String(yesterday.getUTCMonth() + 1).padStart(2, "0"),
        String(yesterday.getUTCDate()).padStart(2, "0")
    ].join("-");
}


/* Choose which orders should be displayed */
function getAdminOrdersForSelectedPeriod() {
    if (adminOrderPeriod === "history" && !adminHistoryDate) {
        // History shows all orders until a date is selected.
        return adminOrdersCache.slice();
    }

    let targetDate = "";

    if (adminOrderPeriod === "today") {
        targetDate = getCafeTodayKey();
    } else if (adminOrderPeriod === "yesterday") {
        targetDate = getCafeYesterdayKey();
    } else {
        targetDate = adminHistoryDate;
    }

    return adminOrdersCache.filter(order => {
        const timestamp =
            order.created_at ||
            order.createdAt ||
            order.timestamp ||
            order.date;

        return getCafeDateKey(timestamp) === targetDate;
    });
}


/* Handle Today, Yesterday and History buttons */
function setAdminOrderPeriod(period, button) {
    adminOrderPeriod = period;

    document.querySelectorAll(".order-filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    const dateWrap =
        document.getElementById("adminHistoryDateWrap");

    if (dateWrap) {
        dateWrap.hidden = period !== "history";
    }

    refreshAdminOrderPeriodView();
}


/* Filter History by a selected date */
function setAdminHistoryDate(value) {
    adminHistoryDate = value || "";
    refreshAdminOrderPeriodView();
}


/* Clear the History date filter */
function clearAdminHistoryDate() {
    adminHistoryDate = "";

    const dateInput =
        document.getElementById("adminHistoryDate");

    if (dateInput) {
        dateInput.value = "";
    }

    refreshAdminOrderPeriodView();
}

/* =========================================
   REFRESH FILTERED ORDERS AND STATISTICS
   ========================================= */

function refreshAdminOrderPeriodView() {
    const filteredOrders =
        getAdminOrdersForSelectedPeriod();

    renderAdminOrders(filteredOrders);

    updateAdminPeriodStats(
        adminOrdersCache,
        filteredOrders
    );
}


function updateAdminPeriodStats(allOrders, visibleOrders) {
    const ordersElement =
        document.getElementById("adminOrders");

    const salesElement =
        document.getElementById("adminSales");

    const activeElement =
        document.getElementById("adminActive");

    const sales = visibleOrders.reduce(
        (sum, order) =>
            sum + Number(order.total || 0),
        0
    );

    const ordersLabel =
    document.getElementById("adminOrdersLabel");

const salesLabel =
    document.getElementById("adminSalesLabel");

let labelPrefix = "TODAY'S";

if (adminOrderPeriod === "yesterday") {
    labelPrefix = "YESTERDAY'S";
} else if (adminOrderPeriod === "history") {
    labelPrefix = adminHistoryDate
        ? "SELECTED DAY"
        : "ALL-TIME";
}

if (ordersLabel) {
    ordersLabel.textContent = `${labelPrefix} ORDERS`;
}

if (salesLabel) {
    salesLabel.textContent = `${labelPrefix} SALES`;
}

    const active = allOrders.filter(order =>
        order.status !== "Served" &&
        order.status !== "Cancelled"
    ).length;

    if (ordersElement) {
        ordersElement.textContent = visibleOrders.length;
    }

    if (salesElement) {
        salesElement.textContent = `₹${sales.toFixed(2)}`;
    }

    if (activeElement) {
        activeElement.textContent = active;
    }
}

/* Format order date and time using India time */
function formatAdminOrderDateTime(order) {
    const value =
        order.created_at ||
        order.createdAt ||
        order.timestamp ||
        order.date;

    const date = parseAdminOrderDate(value);

    if (!date) {
        return "Date/time unavailable";
    }

    return new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    }).format(date);
}

let trackingStatusTimer = null;
let lastCustomerTrackingStatus = null;

async function checkCustomerOrderStatus() {
    const savedOrder = localStorage.getItem("oneBiteLastOrder");

    if (!savedOrder) return;

    let order;

    try {
        order = JSON.parse(savedOrder);
    } catch (error) {
        console.error("Could not read saved order:", error);
        return;
    }

    const orderId = order.orderNumber;

    if (!orderId || !Number.isInteger(Number(orderId))) {
        console.error("A valid order ID is not available.");
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE}/api/orders/${encodeURIComponent(orderId)}/track`,
            { cache: "no-store" }
        );

        if (!response.ok) return;

        const data = await response.json();
        const status = data.status;

        const validStatuses = [
            "Received",
            "Being Made",
            "Ready",
            "Served"
        ];

        if (!validStatuses.includes(status)) return;

        if (status !== lastCustomerTrackingStatus) {
            updateTrackingStatus(status);
            lastCustomerTrackingStatus = status;
        }
    } catch (error) {
        console.error("Could not refresh order status:", error);
    }
}

function startCustomerOrderStatusUpdates() {
    if (trackingStatusTimer) {
        clearInterval(trackingStatusTimer);
    }

    lastCustomerTrackingStatus = null;

    checkCustomerOrderStatus();
    trackingStatusTimer = setInterval(checkCustomerOrderStatus, 5000);
}

function stopCustomerOrderStatusUpdates() {
    if (trackingStatusTimer) {
        clearInterval(trackingStatusTimer);
        trackingStatusTimer = null;
    }
}
