const { drizzle } = require("drizzle-orm/libsql");
const { createClient } = require("@libsql/client");
require("dotenv").config();

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
