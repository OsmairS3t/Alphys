import { type SQLiteDatabase } from 'expo-sqlite'

export async function initializeDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoryname TEXT NOT NULL,
      name TEXT NOT NULL,
      price INTEGER,
      photo TEXT,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      photo TEXT,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS stocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      product_name TEXT,
      amount INTEGER,
      hasstock BOOLEAN,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT,
      product_name TEXT,
      amount INTEGER,
      price INTEGER,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nameproduct TEXT,
      ingredients TEXT,
      preparation TEXT,
      cooking TEXT,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      amount INTEGER,
      conditions TEXT,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      modality TEXT,
      kind TEXT,
      place TEXT,
      product_name TEXT,
      client_name TEXT,
      amount INTEGER,
      price INTEGER,
      datetransaction TEXT,
      ispaid BOOLEAN,
      stock_id INTEGER,
      created_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
    );
  `)
}