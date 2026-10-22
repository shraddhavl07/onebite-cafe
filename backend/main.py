from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

import os
import secrets
import hashlib
import hmac
import base64
import json
import time

from dotenv import load_dotenv
load_dotenv()

from backend.menu import menu
from backend.database import get_connection, create_tables


# =========================================================
# ONE BITE CAFE
# FASTAPI BACKEND
# =========================================================

app = FastAPI(
    title="One Bite Cafe",
    version="1.0.0"
)


# =========================================================
# PATHS
# =========================================================

BACKEND_DIR = Path(__file__).resolve().parent
BASE_DIR = BACKEND_DIR.parent


# =========================================================
# DATABASE
# =========================================================

DATABASE_URL = os.getenv("DATABASE_URL")
IS_POSTGRES = bool(DATABASE_URL)


# =========================================================
# CORS
# =========================================================


FRONTEND_URL = os.getenv("FRONTEND_URL", "")

ALLOWED_ORIGINS = [
    "https://onebite-cafee.netlify.app",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

if FRONTEND_URL.strip():
    frontend_origin = FRONTEND_URL.strip().rstrip("/")
    if frontend_origin not in ALLOWED_ORIGINS:
        ALLOWED_ORIGINS.append(frontend_origin)

print("CORS ALLOWED ORIGINS:", ALLOWED_ORIGINS)


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# =========================================================
# STAFF AUTHENTICATION
# =========================================================

STAFF_USERNAME = os.getenv(
    "STAFF_USERNAME",
    "admin"
)

STAFF_PASSWORD = os.getenv(
    "STAFF_PASSWORD",
    "onebite123"
)

STAFF_SECRET = os.getenv(
    "STAFF_SECRET",
    "change-this-secret-before-deployment"
)


# =========================================================
# TOKEN CREATION
# =========================================================

def create_staff_token(username: str):

    payload = {
        "username": username,
        "role": "staff",
        "expires": int(time.time()) + (60 * 60 * 8)
    }

    payload_json = json.dumps(
        payload,
        separators=(",", ":")
    )

    encoded_payload = base64.urlsafe_b64encode(
        payload_json.encode()
    ).decode().rstrip("=")

    signature = hmac.new(
        STAFF_SECRET.encode(),
        encoded_payload.encode(),
        hashlib.sha256
    ).hexdigest()

    return encoded_payload + "." + signature


# =========================================================
# TOKEN VERIFICATION
# =========================================================

def verify_staff_token(token: str):

    try:

        encoded_payload, signature = token.split(".", 1)

        expected_signature = hmac.new(
            STAFF_SECRET.encode(),
            encoded_payload.encode(),
            hashlib.sha256
        ).hexdigest()

        if not secrets.compare_digest(
            signature,
            expected_signature
        ):
            return False

        padding = "=" * (
            4 - len(encoded_payload) % 4
        )

        payload_json = base64.urlsafe_b64decode(
            encoded_payload + padding
        ).decode()

        payload = json.loads(payload_json)

        if payload.get("role") != "staff":
            return False

        if payload.get("expires", 0) < int(time.time()):
            return False

        return True

    except Exception:
        return False


# =========================================================
# REQUIRE STAFF
# =========================================================

def require_staff(request: Request):

    authorization = request.headers.get(
        "Authorization",
        ""
    )

    if not authorization.startswith("Bearer "):

        raise HTTPException(
            status_code=401,
            detail="Staff authentication required"
        )

    token = authorization[
        len("Bearer "):
    ].strip()

    if not token or not verify_staff_token(token):

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired staff session"
        )

    return True


# =========================================================
# STARTUP
# =========================================================

@app.on_event("startup")
def startup():

    create_tables()

    print("========================================")
    print("ONE BITE CAFE")
    print("Backend started successfully")
    print(
        "Database:",
        "PostgreSQL" if IS_POSTGRES else "SQLite"
    )
    print("========================================")


# =========================================================
# STAFF LOGIN
# =========================================================

@app.post("/api/login")
def staff_login(data: dict):

    username = str(
        data.get("username", "")
    ).strip()

    password = str(
        data.get("password", "")
    )

    username_ok = secrets.compare_digest(
        username,
        STAFF_USERNAME
    )

    password_ok = secrets.compare_digest(
        password,
        STAFF_PASSWORD
    )

    if not username_ok or not password_ok:

        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password."
        )

    token = create_staff_token(username)

    return {
        "message": "Login successful",
        "token": token
    }


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    index_file = BASE_DIR / "index.html"

    if index_file.exists():
        return FileResponse(index_file)

    return {
        "message": "One Bite Cafe is running",
        "status": "online"
    }


# =========================================================
# MENU
# =========================================================

@app.get("/api/menu")
def get_menu():

    return {
        "items": menu
    }


# =========================================================
# CREATE ORDER
# CUSTOMER
# =========================================================

@app.post("/api/orders")
def create_order(order: dict):

    # -----------------------------------------------------
    # Accept both names:
    #
    # table_number  -> preferred
    # table          -> supported for old script.js
    # -----------------------------------------------------

    table_number = str(
        order.get(
            "table_number",
            order.get("table", "01")
        )
    ).strip()

    items = order.get("items", [])

    if not table_number:

        raise HTTPException(
            status_code=400,
            detail="Table number is required"
        )

    if not isinstance(items, list) or not items:

        raise HTTPException(
            status_code=400,
            detail="Cart is empty"
        )

    total = 0.0
    validated_items = []

    for item in items:

        try:

            name = str(
                item["name"]
            ).strip()

            price = float(
                item["price"]
            )

            quantity = int(
                item["quantity"]
            )

            if not name:
                raise ValueError()

            if price < 0:
                raise ValueError()

            if quantity <= 0:
                raise ValueError()

            total += price * quantity

            validated_items.append({
                "name": name,
                "price": price,
                "quantity": quantity
            })

        except (
            KeyError,
            ValueError,
            TypeError
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid order item"
            )

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # =================================================
        # POSTGRESQL
        # =================================================

        if IS_POSTGRES:

            cursor.execute(
                """
                INSERT INTO orders
                (table_number, total, status)
                VALUES (%s, %s, %s)
                RETURNING id
                """,
                (
                    table_number,
                    total,
                    "Received"
                )
            )

            result = cursor.fetchone()

            if isinstance(result, dict):
                order_id = result["id"]
            else:
                order_id = result[0]

            for item in validated_items:

                cursor.execute(
                    """
                    INSERT INTO order_items
                    (order_id, item_name, price, quantity)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (
                        order_id,
                        item["name"],
                        item["price"],
                        item["quantity"]
                    )
                )

        # =================================================
        # SQLITE
        # =================================================

        else:

            cursor.execute(
                """
                INSERT INTO orders
                (table_number, total, status)
                VALUES (?, ?, ?)
                """,
                (
                    table_number,
                    total,
                    "Received"
                )
            )

            order_id = cursor.lastrowid

            for item in validated_items:

                cursor.execute(
                    """
                    INSERT INTO order_items
                    (order_id, item_name, price, quantity)
                    VALUES (?, ?, ?, ?)
                    """,
                    (
                        order_id,
                        item["name"],
                        item["price"],
                        item["quantity"]
                    )
                )

        connection.commit()

        return {
            "message": "Order placed successfully",
            "order_id": order_id,
            "orderNumber": order_id,
            "table_number": table_number,
            "total": round(total, 2),
            "status": "Received"
        }

    except Exception as error:

        connection.rollback()

        print(
            "CREATE ORDER ERROR:",
            repr(error)
        )

        if isinstance(error, HTTPException):
            raise

        raise HTTPException(
            status_code=500,
            detail="Could not create order"
        )

    finally:

        connection.close()


# =========================================================
# GET ALL ORDERS
# STAFF ONLY
# =========================================================

@app.get("/api/orders")
def get_orders(request: Request):

    require_staff(request)

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            SELECT *
            FROM orders
            ORDER BY id DESC
            """
        )

        rows = cursor.fetchall()

        orders = []

        for row in rows:

            order = dict(row)

            placeholder = (
                "%s"
                if IS_POSTGRES
                else "?"
            )

            cursor.execute(
                f"""
                SELECT
                    item_name,
                    price,
                    quantity
                FROM order_items
                WHERE order_id = {placeholder}
                """,
                (
                    order["id"],
                )
            )

            order["items"] = [
                dict(item)
                for item in cursor.fetchall()
            ]

            # Make frontend-friendly fields
            order["order_id"] = order["id"]
            order["orderNumber"] = order["id"]
            order["table"] = order["table_number"]

            orders.append(order)

        return {
            "orders": orders
        }

    except Exception as error:

        print(
            "GET ORDERS ERROR:",
            repr(error)
        )

        raise HTTPException(
            status_code=500,
            detail="Could not load orders"
        )

    finally:

        connection.close()


# =========================================================
# CUSTOMER ORDER TRACKING
# =========================================================

@app.get("/api/orders/{order_id}/track")
def track_order(order_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        placeholder = (
            "%s"
            if IS_POSTGRES
            else "?"
        )

        cursor.execute(
            f"""
            SELECT
                id,
                table_number,
                total,
                status,
                created_at
            FROM orders
            WHERE id = {placeholder}
            """,
            (
                order_id,
            )
        )

        row = cursor.fetchone()

        if not row:

            raise HTTPException(
                status_code=404,
                detail="Order not found"
            )

        order = dict(row)

        return {
            "order_id": order["id"],
            "orderNumber": order["id"],
            "table_number": order["table_number"],
            "table": order["table_number"],
            "total": order["total"],
            "status": order["status"],
            "created_at": order["created_at"]
        }

    finally:

        connection.close()


# =========================================================
# STAFF - GET SINGLE ORDER
# =========================================================

@app.get("/api/orders/{order_id}")
def get_single_order(
    order_id: int,
    request: Request
):

    require_staff(request)

    connection = get_connection()
    cursor = connection.cursor()

    try:

        placeholder = (
            "%s"
            if IS_POSTGRES
            else "?"
        )

        cursor.execute(
            f"""
            SELECT *
            FROM orders
            WHERE id = {placeholder}
            """,
            (
                order_id,
            )
        )

        row = cursor.fetchone()

        if not row:

            raise HTTPException(
                status_code=404,
                detail="Order not found"
            )

        order = dict(row)

        cursor.execute(
            f"""
            SELECT
                item_name,
                price,
                quantity
            FROM order_items
            WHERE order_id = {placeholder}
            """,
            (
                order_id,
            )
        )

        order["items"] = [
            dict(item)
            for item in cursor.fetchall()
        ]

        order["order_id"] = order["id"]
        order["orderNumber"] = order["id"]
        order["table"] = order["table_number"]

        return order

    finally:

        connection.close()




@app.delete("/api/orders/{order_id}")
def delete_order(order_id: int, request: Request):

    # Only authorized staff can delete orders.
    require_staff(request)

    connection = get_connection()
    cursor = connection.cursor()

    try:
        placeholder = "%s" if IS_POSTGRES else "?"

        # Check that the order exists.
        cursor.execute(
            f"SELECT id FROM orders WHERE id = {placeholder}",
            (order_id,)
        )

        if not cursor.fetchone():
            raise HTTPException(
                status_code=404,
                detail=f"Order {order_id} not found"
            )

        # Delete the order's items first.
        cursor.execute(
            f"DELETE FROM order_items WHERE order_id = {placeholder}",
            (order_id,)
        )

        # Then delete the order itself.
        cursor.execute(
            f"DELETE FROM orders WHERE id = {placeholder}",
            (order_id,)
        )

        connection.commit()

        print(f"Order #{order_id} deleted successfully")

        return {
            "message": "Order deleted successfully",
            "order_id": order_id
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        print("DELETE ORDER ERROR:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="Could not delete order"
        )

    finally:
        cursor.close()
        connection.close()

# =========================================================
# UPDATE ORDER STATUS
# STAFF ONLY
# =========================================================

@app.put("/api/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    data: dict,
    request: Request
):

    require_staff(request)

    status = str(
        data.get("status", "")
    ).strip()

    allowed_statuses = [
        "Received",
        "Being Made",
        "Ready",
        "Served",
        "Cancelled"
    ]

    if status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail=f"Invalid status: {status}"
        )

    connection = get_connection()
    cursor = connection.cursor()

    try:

        placeholder = (
            "%s"
            if IS_POSTGRES
            else "?"
        )

        cursor.execute(
            f"""
            SELECT id
            FROM orders
            WHERE id = {placeholder}
            """,
            (
                order_id,
            )
        )

        existing_order = cursor.fetchone()

        if not existing_order:

            raise HTTPException(
                status_code=404,
                detail=f"Order {order_id} not found"
            )

        cursor.execute(
            f"""
            UPDATE orders
            SET status = {placeholder}
            WHERE id = {placeholder}
            """,
            (
                status,
                order_id
            )
        )

        connection.commit()

        print(
            f"Order #{order_id} changed to {status}"
        )

        return {
            "message": "Order status updated successfully",
            "order_id": order_id,
            "status": status
        }

    except HTTPException:

        connection.rollback()
        raise

    except Exception as error:

        connection.rollback()

        print(
            "STATUS UPDATE ERROR:",
            repr(error)
        )

        raise HTTPException(
            status_code=500,
            detail="Could not update order status"
        )

    finally:

        connection.close()


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/api/health")
def health_check():

    connection = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT 1")
        cursor.fetchone()

        return {
            "status": "online",
            "service": "One Bite Cafe",
            "database": (
                "PostgreSQL"
                if IS_POSTGRES
                else "SQLite"
            ),
            "database_status": "connected"
        }

    except Exception as error:

        print(
            "HEALTH CHECK ERROR:",
            repr(error)
        )

        raise HTTPException(
            status_code=503,
            detail="Database connection failed"
        )

    finally:

        if connection:
            connection.close()


# =========================================================
# FRONTEND
# =========================================================

if BASE_DIR.exists():

    app.mount(
        "/",
        StaticFiles(
            directory=str(BASE_DIR),
            html=True
        ),
        name="frontend"
    )