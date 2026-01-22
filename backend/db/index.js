const express = require("express");
const { drizzle } = require("drizzle-orm/libsql");
const { createClient } = require("@libsql/client");
require("dotenv").config();

const app = express();
app.use(express.json());

const client = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

const ensureSchema = async () => {
  await client.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL UNIQUE DEFAULT '',
        password TEXT NOT NULL,
        gender TEXT NOT NULL DEFAULT 'Laki-laki'
      )
    `,
  });
  await client.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        duration_days INTEGER NOT NULL DEFAULT 9,
        price INTEGER NOT NULL DEFAULT 0,
        departure_date TEXT,
        capacity INTEGER NOT NULL DEFAULT 0
      )
    `,
  });
  await client.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        note TEXT
      )
    `,
  });
  await client.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS jamaahs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        birth_date TEXT,
        passport_number TEXT,
        nationality TEXT NOT NULL DEFAULT 'Indonesia',
        email TEXT,
        phone TEXT,
        package_id INTEGER REFERENCES packages(id),
        status TEXT NOT NULL DEFAULT 'Aktif',
        notes TEXT
      )
    `,
  });
  await client.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jamaah_id INTEGER REFERENCES jamaahs(id),
        package_id INTEGER REFERENCES packages(id),
        booking_date TEXT,
        status TEXT NOT NULL DEFAULT 'Pending',
        payment_status TEXT NOT NULL DEFAULT 'Menunggu',
        notes TEXT,
        seat_number TEXT
      )
    `,
  });
  await client.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id)
      )
    `,
  });

  const pragma = await client.execute({ sql: "PRAGMA table_info('users')" });
  const rows = pragma?.rows || [];
  const columns = new Set(rows.map((row) => row.name));
  if (!columns.has("name")) {
    await client.execute({
      sql: "ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT ''",
    });
  }
  if (!columns.has("email")) {
    await client.execute({
      sql: "ALTER TABLE users ADD COLUMN email TEXT NOT NULL DEFAULT ''",
    });
    await client.execute({
      sql: "CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email)",
    });
  }
  if (!columns.has("gender")) {
    await client.execute({
      sql: "ALTER TABLE users ADD COLUMN gender TEXT NOT NULL DEFAULT 'Laki-laki'",
    });
  }
};

ensureSchema().catch((error) => {
  console.error("Failed to synchronize database schema", error);
});

module.exports = { db };

// app.get("/", (req, res) => {
//   res.json({ message: "Backend running ✅" });
// });

// app.listen(5000, () => console.log("Backend running on port 5000"));
