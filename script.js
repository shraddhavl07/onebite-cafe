/* =========================================================
   ONE BITE CAFE
   MAIN SCRIPT
   PART 1 / 3
========================================================= */

"use strict";


/* =========================================================
   GLOBAL DATA
========================================================= */

let cart =
    JSON.parse(
        localStorage.getItem("oneBiteCart")
    ) || [];


let currentTable =
    localStorage.getItem("oneBiteTable") || "05";


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
        image: "imagges/cold-coffee.jpg"
    },

    {
        id: 11,
        name: "Cold Coffee with Crush",
        description: "Cold coffee with delicious crush",
        price: 49,
        category: "Coffee",
        image: "imagges/cold-coffee.jpg"
    },

    {
        id: 12,
        name: "Cold Coffee with Ice-Cream",
        description: "Cold coffee topped with ice cream",
        price: 59,
        category: "Coffee",
        image: "imagges/cold-coffee.jpg"
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
        image: "imagges/ice-cream.jpg"
    },

    {
        id: 15,
        name: "Chocolate",
        description: "Rich chocolate ice cream",
        price: 49,
        category: "Ice-Cream",
        image: "imagges/ice-cream.jpg"
    },

    {
        id: 16,
        name: "Mango",
        description: "Creamy mango ice cream",
        price: 49,
        category: "Ice-Cream",
        image: "imagges/ice-cream.jpg"
    },

    {
        id: 17,
        name: "Strawberry",
        description: "Sweet strawberry ice cream",
        price: 49,
        category: "Ice-Cream",
        image: "imagges/ice-cream.jpg"
    },


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
        image: "imagges/lassi.jpg"
    },

    {
        id: 29,
        name: "Rose Lassi",
        description: "Refreshing rose lassi",
        price: 69,
        category: "Lassi",
        image: "imagges/lassi.jpg"
    },

    {
        id: 30,
        name: "Mango Lassi",
        description: "Creamy mango lassi",
        price: 79,
        category: "Lassi",
        image: "imagges/lassi.jpg"
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
        image: "imagges/maggi.jpg"
    },

    {
        id: 32,
        name: "Cheese Maggi",
        description: "Maggi with melted cheese",
        price: 49,
        category: "Maggi & Momos",
        image: "imagges/maggi.jpg"
    },

    {
        id: 33,
        name: "Veg Cheese Maggi",
        description: "Veg Maggi with cheese",
        price: 59,
        category: "Maggi & Momos",
        image: "imagges/maggi.jpg"
    },

    {
        id: 34,
        name: "Mix Veg Momos",
        description: "Steamed vegetable momos",
        price: 69,
        category: "Maggi & Momos",
        image: "imagges/momos.jpg"
    },

    {
        id: 35,
        name: "Paneer Momos",
        description: "Soft paneer momos",
        price: 79,
        category: "Maggi & Momos",
        image: "imagges/momos.jpg"
    },

    {
        id: 36,
        name: "Cheese Corn Momos",
        description: "Cheese and corn momos",
        price: 89,
        category: "Maggi & Momos",
        image: "imagges/momos.jpg"
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
        image: "imagges/sandwich.jpg"
    },

    {
        id: 38,
        name: "Veg Grill Sandwich",
        description: "Grilled vegetable sandwich",
        price: 59,
        category: "Sandwich",
        image: "imagges/sandwich.jpg"
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
        image: "imagges/sandwich.jpg"
    },

    {
        id: 41,
        name: "Tandoori Sandwich",
        description: "Tandoori style sandwich",
        price: 89,
        category: "Sandwich",
        image: "imagges/sandwich.jpg"
    },

    {
        id: 42,
        name: "Cheese Veg Sandwich",
        description: "Vegetable sandwich with cheese",
        price: 99,
        category: "Sandwich",
        image: "imagges/sandwich.jpg"
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
        image: "imagges/burger.jpg"
    },

    {
        id: 44,
        name: "Aloo Tikki Burger",
        description: "Crispy aloo tikki burger",
        price: 59,
        category: "Burger",
        image: "imagges/burger.jpg"
    },

    {
        id: 45,
        name: "Crispy Burger",
        description: "Crispy veg burger",
        price: 69,
        category: "Burger",
        image: "imagges/burger.jpg"
    },

    {
        id: 46,
        name: "Peri-Peri Burger",
        description: "Spicy peri-peri burger",
        price: 69,
        category: "Burger",
        image: "imagges/burger.jpg"
    },

    {
        id: 47,
        name: "Schezwan Burger",
        description: "Spicy Schezwan burger",
        price: 79,
        category: "Burger",
        image: "imagges/burger.jpg"
    },

    {
        id: 48,
        name: "Tandoori Burger",
        description: "Tandoori flavoured burger",
        price: 79,
        category: "Burger",
        image: "imagges/burger.jpg"
    },

    {
        id: 49,
        name: "Cheese Burger",
        description: "Burger with melted cheese",
        price: 89,
        category: "Burger",
        image: "imagges/burger.jpg"
    },

    {
        id: 50,
        name: "Aloo Cheese Burger",
        description: "Aloo tikki with cheese",
        price: 89,
        category: "Burger",
        image: "imagges/burger.jpg"
    },

    {
        id: 51,
        name: "Maharaja Burger",
        description: "Loaded Maharaja style burger",
        price: 99,
        category: "Burger",
        image: "imagges/burger.jpg"
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
        image: "imagges/pizza.jpg"
    },

    {
        id: 53,
        name: "Onion Pizza",
        description: "Fresh onion pizza",
        price: 109,
        category: "Pizza",
        image: "imagges/pizza.jpg"
    },

    {
        id: 54,
        name: "Tomato Pizza",
        description: "Fresh tomato pizza",
        price: 119,
        category: "Pizza",
        image: "imagges/pizza.jpg"
    },

    {
        id: 55,
        name: "Veg Pizza",
        description: "Loaded vegetable pizza",
        price: 129,
        category: "Pizza",
        image: "imagges/pizza.jpg"
    },

    {
        id: 56,
        name: "Corn Pizza",
        description: "Sweet corn pizza",
        price: 139,
        category: "Pizza",
        image: "imagges/pizza.jpg"
    },

    {
        id: 57,
        name: "Paneer Pizza",
        description: "Paneer topped pizza",
        price: 149,
        category: "Pizza",
        image: "imagges/pizza.jpg"
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
        image: "imagges/fries.jpg"
    },

    {
        id: 59,
        name: "Masala Fries",
        description: "Spicy masala fries",
        price: 69,
        category: "Fries",
        image: "imagges/fries.jpg"
    },

    {
        id: 60,
        name: "Tandoori Fries",
        description: "Tandoori flavoured fries",
        price: 79,
        category: "Fries",
        image: "imagges/fries.jpg"
    },

    {
        id: 61,
        name: "Peri Peri Fries",
        description: "Spicy peri-peri fries",
        price: 79,
        category: "Fries",
        image: "imagges/fries.jpg"
    },

    {
        id: 62,
        name: "Chipotle Fries",
        description: "Creamy chipotle fries",
        price: 89,
        category: "Fries",
        image: "imagges/fries.jpg"
    },

    {
        id: 63,
        name: "Cheese Fries",
        description: "Fries topped with cheese",
        price: 89,
        category: "Fries",
        image: "imagges/fries.jpg"
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

    const table =
        localStorage.getItem(
            "oneBiteTable"
        ) || "05";

    currentTable =
        table;


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

        const response =
            await fetch(
                "/api/menu"
            );


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
            "1 Cheese Burger + 2 Cold Coffee",
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
        price: 249
    },

    {
        id: "combo5",
        name:
            "Paneer Pizza + Any 2 Mocktail",
        description:
            "Paneer pizza with any two mocktails",
        price: 299
    },

    {
        id: "combo6",
        name:
            "2 Thick Cold Coffee + 1 Margherita + Fries",
        description:
            "Two thick cold coffees, Margherita pizza and fries",
        price: 179
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


            row.className =
                "cart-item";


            row.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(
                            item.name
                        )}
                    </strong>


                    <small>
                        ₹${item.price}
                        ×
                        ${item.quantity}
                    </small>

                </div>


                <div class="cart-item-actions">

                    <button
                        type="button"
                        onclick="decreaseQuantity('${item.id}')"
                    >
                        −
                    </button>


                    <strong>
                        ${item.quantity}
                    </strong>


                    <button
                        type="button"
                        onclick="increaseQuantity('${item.id}')"
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

        const response =
            await fetch(
                "/api/orders",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            orderData
                        )

                }
            );


        if (response.ok) {

            const data =
                await response.json();


            currentOrder = {

                ...orderData,

                orderNumber:

                    data.orderNumber ||

                    data.order_id ||

                    data.id ||

                    generateOrderNumber()

            };

        }

        else {

            currentOrder = {

                ...orderData,

                orderNumber:
                    generateOrderNumber()

            };

        }

    }

    catch (error) {

        console.log(
            "Order API unavailable:",
            error
        );


        currentOrder = {

            ...orderData,

            orderNumber:
                generateOrderNumber()

        };

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
                    `/api/orders/${orderId}/track`
                );


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

    const modal =
        document.getElementById(
            "trackingModal"
        );


    /* Stop automatic status checking */

    if (trackingInterval) {

        clearInterval(
            trackingInterval
        );

        trackingInterval = null;

    }


    if (modal) {

        modal.classList.add(
            "hidden"
        );

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

function openReview() {

    const modal =
        document.getElementById(
            "reviewModal"
        );


    if (modal) {

        modal.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   CLOSE REVIEW
========================================================= */

function closeReview() {

    const modal =
        document.getElementById(
            "reviewModal"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   SUBMIT REVIEW
========================================================= */

async function submitReview() {

    const name =
        document
            .getElementById(
                "reviewName"
            )
            ?.value
            .trim();


    const rating =
        document
            .getElementById(
                "reviewRating"
            )
            ?.value;


    const text =
        document
            .getElementById(
                "reviewText"
            )
            ?.value
            .trim();


    if (!name) {

        showToast(
            "Please enter your name."
        );

        return;

    }


    if (!text) {

        showToast(
            "Please write a review."
        );

        return;

    }


    const review = {

        name:
            name,

        rating:
            Number(rating),

        text:
            text,

        createdAt:
            new Date().toISOString()

    };


    /*
       SAVE LOCALLY
    */

    const reviews =

        JSON.parse(

            localStorage.getItem(
                "oneBiteReviews"
            )

        ) || [];


    reviews.push(
        review
    );


    localStorage.setItem(

        "oneBiteReviews",

        JSON.stringify(
            reviews
        )

    );


    /*
       TRY BACKEND
    */

    try {

        await fetch(

            "/api/reviews",

            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        review
                    )

            }

        );

    }

    catch (error) {

        console.log(
            "Review API unavailable."
        );

    }


    closeReview();


    showToast(
        "Thank you for your review!"
    );


    const nameInput =
        document.getElementById(
            "reviewName"
        );


    const textInput =
        document.getElementById(
            "reviewText"
        );


    if (nameInput) {

        nameInput.value =
            "";

    }


    if (textInput) {

        textInput.value =
            "";

    }

}


/* =========================================================
   LOAD REVIEWS
========================================================= */

function loadReviews() {

    /*
       The default reviews are already
       present in index.html.

       Customer-submitted reviews are
       saved in localStorage.
    */

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


        renderAdminOrders(
            orders
        );


        updateAdminStatistics(
            orders
        );


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