"use strict";

/* =========================================================
   ADMIN DASHBOARD
   ONE BITE CAFE
========================================================= */

const API_BASE = "https://onebite-cafe.onrender.com";

/* =========================================================
   AUTH
========================================================= */

function getStaffToken() {
    return sessionStorage.getItem("oneBiteStaffToken");
}


function staffLogout() {

    sessionStorage.removeItem("oneBiteStaffToken");

    window.location.href = "login.html";
}


/* =========================================================
   AUTH HEADERS
========================================================= */

function authHeaders() {

    const token = getStaffToken();

    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}


/* =========================================================
   TAB SWITCHING
========================================================= */

function showAdminTab(tabId, button) {

    document
        .querySelectorAll(".admin-tab-content")
        .forEach(tab => {

            tab.classList.add("hidden");

        });


    document
        .querySelectorAll(".admin-tab")
        .forEach(tab => {

            tab.classList.remove("active");

        });


    const selectedTab =
        document.getElementById(tabId);


    if (selectedTab) {

        selectedTab.classList.remove("hidden");

    }


    if (button) {

        button.classList.add("active");

    }


    if (tabId === "ordersTab") {

        loadAdminDashboard();

    }


    if (tabId === "reviewsTab") {

        loadAdminReviews();

    }


    if (tabId === "menuTab") {

        loadAdminMenu();

    }


    if (tabId === "qrTab") {

        generateQRCodes();

    }

}


/* ORDER DATE FILTERS */

let adminOrdersCache = [];
let adminOrderPeriod = "today";
let adminHistoryDate = "";

function getIndiaDateKey(value = new Date()) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(date);

    const part = type =>
        parts.find(item => item.type === type)?.value || "";

    return `${part("year")}-${part("month")}-${part("day")}`;
}

function parseAdminOrderDate(order) {
    const value = order.created_at || order.createdAt ||
                  order.date || order.timestamp;

    if (!value) return "";

    const text = String(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

    return getIndiaDateKey(text);
}

function shiftDateKey(dateKey, days) {
    const [year, month, day] = dateKey.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day + days, 12));

    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function setAdminOrderPeriod(period, button) {
    adminOrderPeriod = period;

    document.querySelectorAll(".order-filter-btn")
        .forEach(btn => btn.classList.remove("active"));

    if (button) button.classList.add("active");

    const wrap = document.getElementById("adminHistoryDateWrap");
    if (wrap) wrap.hidden = period !== "history";

    refreshAdminOrderPeriodView();
}

function setAdminHistoryDate(value) {
    adminHistoryDate = value || "";
    refreshAdminOrderPeriodView();
}

function clearAdminHistoryDate() {
    adminHistoryDate = "";

    const input = document.getElementById("adminHistoryDate");
    if (input) input.value = "";

    refreshAdminOrderPeriodView();
}

function getVisibleAdminOrders(orders) {
    const today = getIndiaDateKey();
    const yesterday = shiftDateKey(today, -1);

    if (adminOrderPeriod === "today") {
        return orders.filter(order => parseAdminOrderDate(order) === today);
    }

    if (adminOrderPeriod === "yesterday") {
        return orders.filter(order => parseAdminOrderDate(order) === yesterday);
    }

    if (adminHistoryDate) {
        return orders.filter(order => parseAdminOrderDate(order) === adminHistoryDate);
    }

    return orders;
}

function refreshAdminOrderPeriodView() {
    const orders = getVisibleAdminOrders(adminOrdersCache);

    renderAdminOrders(orders);
    updateAdminStats(orders);

    const ordersLabel = document.getElementById("adminOrdersLabel");
    const salesLabel = document.getElementById("adminSalesLabel");

    if (ordersLabel) {
        ordersLabel.textContent =
            adminOrderPeriod === "today" ? "TODAY'S ORDERS" :
            adminOrderPeriod === "yesterday" ? "YESTERDAY'S ORDERS" :
            adminHistoryDate ? `ORDERS · ${adminHistoryDate}` : "ALL ORDERS";
    }

    if (salesLabel) {
        salesLabel.textContent =
            adminOrderPeriod === "today" ? "TODAY'S SALES" :
            adminOrderPeriod === "yesterday" ? "YESTERDAY'S SALES" :
            adminHistoryDate ? `SALES · ${adminHistoryDate}` : "ALL SALES";
    }
}

/* =========================================================
   LOAD ADMIN DASHBOARD
========================================================= */

async function loadAdminDashboard() {

    const orderList =
        document.getElementById("adminOrderList");


    if (!orderList) return;


    orderList.innerHTML =
        "<p>Loading orders...</p>";


    try {

        const response =
            await fetch(
                `${API_BASE}/api/orders`,
                {
                    method: "GET",
                    headers: authHeaders()
                }
            );


        if (response.status === 401) {

            staffLogout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                `Orders API returned ${response.status}`
            );

        }


        const data =
            await response.json();


        const orders =
            Array.isArray(data)
                ? data
                : (data.orders || []);


        adminOrdersCache = orders;
refreshAdminOrderPeriodView();

    } catch (error) {

        console.error(
            "ADMIN ORDERS ERROR:",
            error
        );


        orderList.innerHTML = `

            <div class="admin-error">

                <p>
                    Failed to load orders.
                </p>

                <small>
                    ${escapeAdminHTML(error.message)}
                </small>

            </div>

        `;

    }

}


/* =========================================================
   RENDER ORDERS
========================================================= */

function renderAdminOrders(orders) {

    const container =
        document.getElementById(
            "adminOrderList"
        );


    if (!container) return;


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


    container.innerHTML = "";


    orders.forEach(order => {

        const card =
            document.createElement("div");


        card.className =
            "admin-order-card";


        const items =
            Array.isArray(order.items)
                ? order.items
                : [];


        const itemHTML =
            items.map(item => `

                <div class="admin-order-item">

                    <span>
                        ${escapeAdminHTML(
                            item.item_name ||
                            item.name ||
                            ""
                        )}
                    </span>

                    <span>
                        × ${Number(
                            item.quantity || 0
                        )}
                    </span>

                </div>

            `).join("");


        const status =
            order.status || "Received";


        card.innerHTML = `

            <div class="admin-order-top">

                <div>

                    <span class="eyebrow">
                        ORDER
                    </span>

                    <h3>
                        #${order.orderNumber ||
                           order.order_id ||
                           order.id}
                    </h3>

                </div>


                <span class="order-status">
                    ${escapeAdminHTML(status)}
                </span>

            </div>


            <div class="admin-order-info">

                <p>
                    <strong>Table:</strong>
                    ${escapeAdminHTML(
                        order.table ||
                        order.table_number ||
                        ""
                    )}
                </p>

                <p>
                    <strong>Total:</strong>
                    ₹${Number(
                        order.total || 0
                    )}
                </p>

            </div>


            <div class="admin-order-items">

                ${itemHTML}

            </div>


            <div class="admin-order-actions">

    ${
        status === "Received"
            ? `
                <button
                    class="status-btn"
                    type="button"
                    onclick="moveOrderToNextStatus(
                        ${order.id},
                        'Received'
                    )"
                >
                    Start Making
                </button>
            `
            : ""
    }


    ${
        status === "Being Made"
            ? `
                <button
                    class="status-btn"
                    type="button"
                    onclick="moveOrderToNextStatus(
                        ${order.id},
                        'Being Made'
                    )"
                >
                    Mark Ready
                </button>
            `
            : ""
    }


    ${
        status === "Ready"
            ? `
                <button
                    class="status-btn"
                    type="button"
                    onclick="moveOrderToNextStatus(
                        ${order.id},
                        'Ready'
                    )"
                >
                    Mark Served
                </button>
            `
            : ""
    }


    ${
        status === "Served"
            ? `
                <button
                    class="status-btn"
                    type="button"
                    disabled
                >
                    Served
                </button>
            `
            : ""
    }

</div>
        `;


        container.appendChild(card);

    });

}


/* =========================================================
   UPDATE STATS
========================================================= */

function updateAdminStats(orders) {

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


    const today =
        new Date()
            .toISOString()
            .slice(0, 10);


    const todayOrders =
        orders.filter(order => {

            if (!order.created_at) {

                return true;

            }

            return String(
                order.created_at
            ).slice(0, 10) === today;

        });


    const sales =
        todayOrders.reduce(
            (sum, order) => {

                return sum +
                    Number(
                        order.total || 0
                    );

            },
            0
        );


    const active =
        orders.filter(order => {

            return [
                "Received",
                "Being Made",
                "Ready"
            ].includes(
                order.status
            );

        }).length;


    if (ordersElement) {

        ordersElement.textContent =
            todayOrders.length;

    }


    if (salesElement) {

        salesElement.textContent =
            `₹${sales}`;

    }


    if (activeElement) {

        activeElement.textContent =
            active;

    }

}


/* =========================================================
   CHANGE ORDER STATUS
========================================================= */
/* =========================================================
   ORDER STATUS
========================================================= */

async function changeOrderStatus(orderId, newStatus) {

    console.log(
        `Changing order #${orderId} to ${newStatus}`
    );

    try {

        const response = await fetch(
            `${API_BASE}/api/orders/${orderId}/status`,
            {
                method: "PUT",

                headers: authHeaders(),

                body: JSON.stringify({
                    status: newStatus
                })
            }
        );


        if (response.status === 401) {

            staffLogout();
            return;

        }


        const data =
            await response.json().catch(() => ({}));


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Could not update order status."
            );

        }


        console.log(
            `Order #${orderId} changed to ${newStatus}`
        );


        // Reload the orders
        await loadAdminDashboard();


    } catch (error) {

        console.error(
            "STATUS UPDATE ERROR:",
            error
        );

        alert(
            error.message ||
            "Could not update order status."
        );

    }

}


/* =========================================================
   MOVE TO NEXT STATUS
========================================================= */

function getNextOrderStatus(currentStatus) {

    switch (currentStatus) {

        case "Received":
            return "Being Made";

        case "Being Made":
            return "Ready";

        case "Ready":
            return "Served";

        case "Served":
            return null;

        default:
            return "Being Made";

    }

}


/* =========================================================
   NEXT STATUS BUTTON
========================================================= */

async function moveOrderToNextStatus(
    orderId,
    currentStatus
) {

    const nextStatus =
        getNextOrderStatus(currentStatus);


    if (!nextStatus) {

        console.log(
            `Order #${orderId} is already Served`
        );

        return;

    }


    await changeOrderStatus(
        orderId,
        nextStatus
    );

}


/* =========================================================
   MENU
========================================================= */

async function loadAdminMenu() {

    const container =
        document.getElementById(
            "adminMenuList"
        );


    if (!container) return;


    container.innerHTML =
        "<p>Loading menu...</p>";


    try {

        const response =
            await fetch(
                "/api/menu"
            );


        if (!response.ok) {

            throw new Error(
                "Menu API failed"
            );

        }


        const data =
            await response.json();


        const items =
            Array.isArray(data)
                ? data
                : (
                    data.items ||
                    data.menu ||
                    []
                );


        container.innerHTML = `

            <div class="admin-menu-grid">

                ${items.map(item => `

                    <div class="admin-menu-card">

                        <span class="menu-category">
                            ${escapeAdminHTML(
                                item.category || ""
                            )}
                        </span>

                        <h3>
                            ${escapeAdminHTML(
                                item.name || ""
                            )}
                        </h3>

                        <strong>
                            ₹${Number(
                                item.price || 0
                            )}
                        </strong>

                    </div>

                `).join("")}

            </div>

        `;


    } catch (error) {

        console.error(
            "ADMIN MENU ERROR:",
            error
        );


        container.innerHTML =
            "<p>Failed to load menu.</p>";

    }

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


    container.innerHTML =
        "<p>Loading reviews...</p>";


    /*
       Your current backend does not contain
       GET /api/reviews yet.

       So don't keep loading forever.
    */

    const reviews =
        JSON.parse(
            localStorage.getItem(
                "oneBiteReviews"
            )
        ) || [];


    const reviewsElement =
        document.getElementById(
            "adminReviews"
        );


    if (reviewsElement) {

        reviewsElement.textContent =
            reviews.length;

    }


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

        return;

    }


    container.innerHTML =
        reviews.map(review => `

            <div class="admin-review-card">

                <strong>
                    ${escapeAdminHTML(
                        review.name
                    )}
                </strong>

                <span>
                    ${"★".repeat(
                        Number(
                            review.rating || 0
                        )
                    )}
                </span>

                <p>
                    ${escapeAdminHTML(
                        review.text
                    )}
                </p>

            </div>

        `).join("");

}


/* =========================================================
   QR CODES
========================================================= */

function generateQRCodes() {

    const grid =
        document.getElementById(
            "qrGrid"
        );


    if (!grid) return;


    grid.innerHTML = "";


    for (
        let table = 1;
        table <= 10;
        table++
    ) {

        const tableNumber =
            String(table).padStart(
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


        card.innerHTML = `

            <h3>
                Table ${tableNumber}
            </h3>

        `;


        card.appendChild(qr);


        const url =
            `${window.location.origin}/index.html?table=${tableNumber}`;


        new QRCode(
            qr,
            {
                text: url,
                width: 160,
                height: 160
            }
        );


        grid.appendChild(card);

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeAdminHTML(value) {

    return String(
        value ?? ""
    )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadAdminDashboard();

    }
);
/* =========================================================
   SILENT AUTO REFRESH ORDERS
========================================================= */

setInterval(async () => {

    const orderList =
        document.getElementById("adminOrderList");

    if (!orderList) return;

    try {

        const response =
            await fetch(
                `${API_BASE}/api/orders`,
                {
                    method: "GET",
                    headers: authHeaders()
                }
            );

        if (response.status === 401) {
            staffLogout();
            return;
        }

        if (!response.ok) {
            return;
        }

        const data =
            await response.json();

        const orders =
            Array.isArray(data)
                ? data
                : (data.orders || []);

        // Update orders without showing "Loading orders..."
       adminOrdersCache = orders;
refreshAdminOrderPeriodView();
    } catch (error) {

        console.error(
            "Silent order refresh error:",
            error
        );

    }

}, 3000);