const { sqliteTable, text, integer } = require("drizzle-orm/sqlite-core");

// Tabel User
const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  gender: text("gender").notNull().default("Laki-laki"),
});

const packages = sqliteTable("packages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  durationDays: integer("duration_days").notNull().default(9),
  price: integer("price").notNull().default(0),
  departureDate: text("departure_date"),
  capacity: integer("capacity").notNull().default(0),
});

const employees = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  note: text("note"),
});

const jamaahs = sqliteTable("jamaahs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  birthDate: text("birth_date"),
  passportNumber: text("passport_number"),
  nationality: text("nationality").notNull().default("Indonesia"),
  email: text("email"),
  phone: text("phone"),
  packageId: integer("package_id").references(() => packages.id),
  status: text("status").notNull().default("Aktif"),
  notes: text("notes"),
});

const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jamaahId: integer("jamaah_id").references(() => jamaahs.id),
  packageId: integer("package_id").references(() => packages.id),
  bookingDate: text("booking_date"),
  status: text("status").notNull().default("Pending"),
  paymentStatus: text("payment_status").notNull().default("Menunggu"),
  notes: text("notes"),
  seatNumber: text("seat_number"),
});

const books = sqliteTable("books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  userId: integer("user_id").references(() => users.id),
});

module.exports = { users, books, packages, employees, jamaahs, bookings };
