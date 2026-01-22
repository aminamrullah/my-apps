const { sqliteTable, text, integer } = require("drizzle-orm/sqlite-core");

// Tabel User
const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  gender: text("gender").notNull().default("Laki-laki"),
});

// Tabel Buku
const books = sqliteTable("books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  userId: integer("user_id").references(() => users.id),
});

module.exports = { users, books };
