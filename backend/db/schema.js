const { sqliteTable, text, integer } = require("drizzle-orm/sqlite-core");

// Tabel User
const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Tabel Buku
const books = sqliteTable("books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  userId: integer("user_id").references(() => users.id),
});

module.exports = { users, books };
