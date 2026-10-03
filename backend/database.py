import os
import sqlite3


# =========================================================
# ONE BITE CAFE
# DATABASE
#
# LOCAL:
#     SQLite
#
# DEPLOYMENT:
#     PostgreSQL
# =========================================================


DATABASE_URL = os.getenv("DATABASE_URL")


# =========================================================
# SQLITE
# =========================================================

def get_sqlite_connection():

    connection = sqlite3.connect(
        "onebite.db"
    )

    connection.row_factory = sqlite3.Row

    return connection


# =========================================================
# POSTGRESQL
# =========================================================

def get_postgres_connection():

    import psycopg
    from psycopg.rows import dict_row

    connection = psycopg.connect(
        DATABASE_URL,
        row_factory=dict_row
    )

    return connection


# =========================================================
# GET CONNECTION
# =========================================================

def get_connection():

    if DATABASE_URL:
        return get_postgres_connection()

    return get_sqlite_connection()


# =========================================================
# CREATE TABLES
# =========================================================

def create_tables():

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # =================================================
        # POSTGRESQL
        # =================================================

        if DATABASE_URL:

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS orders (

                    id SERIAL PRIMARY KEY,

                    table_number TEXT NOT NULL,

                    total DOUBLE PRECISION NOT NULL,

                    status TEXT NOT NULL,

                    created_at TIMESTAMP
                    DEFAULT CURRENT_TIMESTAMP
                )
                """
            )

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS order_items (

                    id SERIAL PRIMARY KEY,

                    order_id INTEGER NOT NULL,

                    item_name TEXT NOT NULL,

                    price DOUBLE PRECISION NOT NULL,

                    quantity INTEGER NOT NULL,

                    FOREIGN KEY (order_id)
                    REFERENCES orders(id)
                    ON DELETE CASCADE
                )
                """
            )

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS menu_items (

                    id SERIAL PRIMARY KEY,

                    name TEXT NOT NULL,

                    category TEXT NOT NULL,

                    price DOUBLE PRECISION NOT NULL,

                    icon TEXT DEFAULT '🍽️',

                    image TEXT DEFAULT '',

                    available BOOLEAN DEFAULT TRUE,

                    created_at TIMESTAMP
                    DEFAULT CURRENT_TIMESTAMP
                )
                """
            )

        # =================================================
        # SQLITE
        # =================================================

        else:

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS orders (

                    id INTEGER PRIMARY KEY AUTOINCREMENT,

                    table_number TEXT NOT NULL,

                    total REAL NOT NULL,

                    status TEXT NOT NULL,

                    created_at
                    TIMESTAMP
                    DEFAULT CURRENT_TIMESTAMP
                )
                """
            )

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS order_items (

                    id INTEGER PRIMARY KEY AUTOINCREMENT,

                    order_id INTEGER NOT NULL,

                    item_name TEXT NOT NULL,

                    price REAL NOT NULL,

                    quantity INTEGER NOT NULL,

                    FOREIGN KEY (order_id)
                    REFERENCES orders(id)
                )
                """
            )

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS menu_items (

                    id INTEGER PRIMARY KEY AUTOINCREMENT,

                    name TEXT NOT NULL,

                    category TEXT NOT NULL,

                    price REAL NOT NULL,

                    icon TEXT DEFAULT '🍽️',

                    image TEXT DEFAULT '',

                    available INTEGER DEFAULT 1,

                    created_at
                    TIMESTAMP
                    DEFAULT CURRENT_TIMESTAMP
                )
                """
            )

        connection.commit()

        print("Database tables ready.")

    except Exception as error:

        connection.rollback()

        print(
            "Database setup error:",
            error
        )

        raise

    finally:

        connection.close()