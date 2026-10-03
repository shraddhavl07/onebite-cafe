"use strict";

/* =========================================================
   ADMIN DASHBOARD
   ONE BITE CAFE
========================================================= */

const API_BASE = "";


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


        renderAdminOrders(orders);

        updateAdminStats(orders);


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
        table <= 20;
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
        renderAdminOrders(orders);

        updateAdminStats(orders);

    } catch (error) {

        console.error(
            "Silent order refresh error:",
            error
        );

    }

}, 3000);