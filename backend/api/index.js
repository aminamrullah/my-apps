const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../db");
const {
  users,
  books,
  packages,
  employees,
  jamaahs,
  bookings,
} = require("../db/schema");
const { eq } = require("drizzle-orm");
require("dotenv").config();

const app = express();

const trimOrigin = (origin) => origin?.trim().replace(/\/+$/, "");
const defaultOrigins = [
  "https://my-apps-a8ro.vercel.app",
  "https://my-apps-c9hu.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
]
  .map(trimOrigin)
  .filter(Boolean);
const configuredOrigins = process.env.ALLOWED_ORIGINS?.split(",")
  .map((origin) => trimOrigin(origin))
  .filter(Boolean);
const allowedOrigins = new Set(
  configuredOrigins?.length ? configuredOrigins : defaultOrigins,
);

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      const normalizedOrigin = trimOrigin(incomingOrigin);
      if (!normalizedOrigin || allowedOrigins.has(normalizedOrigin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Forbidden");
    req.user = user;
    next();
  });
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

const parseIdParam = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const toNumber = (value, fallback = null) => {
  if (value === undefined || value === null) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const ensureRecordExists = async (table, id) => {
  const [record] = await db.select().from(table).where(eq(table.id, id));
  return record || null;
};

const findUserByEmail = async (email) => {
  if (!email) return null;
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user || null;
};

const ensureUserExists = async (id) => {
  const [target] = await db.select().from(users).where(eq(users.id, id));
  return target || null;
};

const createUser = async ({ name, email, password, gender }) => {
  const hashed = await bcrypt.hash(password, 10);
  await db.insert(users).values({
    name,
    email,
    password: hashed,
    gender: gender || "Laki-laki",
  });
};

// --- AUTH ROUTES ---
app.post("/auth/register", async (req, res) => {
  const { name, email, password, gender } = req.body;
  if (!name?.trim() || !email?.trim() || !password) {
    return res
      .status(400)
      .json({ message: "Nama, email, dan password harus diisi" });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    return res.status(409).json({ message: "Email sudah terdaftar" });
  }
  await createUser({
    name: name.trim(),
    email: normalizedEmail,
    password,
    gender,
  });
  res.status(201).json({ message: "User berhasil dibuat" });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password harus diisi" });
  }
  const user = await findUserByEmail(email.trim().toLowerCase());
  if (!user) {
    return res.status(400).json({ message: "Email atau password salah" });
  }
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    return res.status(400).json({ message: "Email atau password salah" });
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.json({ token, user: sanitizeUser(user) });
});

// --- USER MANAGEMENT ---
app.post("/users", authenticate, async (req, res) => {
  const { name, email, password, gender } = req.body;
  if (!name?.trim() || !email?.trim() || !password) {
    return res
      .status(400)
      .json({ message: "Nama, email, dan password harus diisi" });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    return res.status(409).json({ message: "Email sudah digunakan" });
  }
  await createUser({
    name: name.trim(),
    email: normalizedEmail,
    password,
    gender,
  });
  res.status(201).json({ message: "User berhasil ditambahkan" });
});

app.get("/users", authenticate, async (req, res) => {
  const userList = await db.select().from(users);
  res.json({ data: userList.map(sanitizeUser) });
});

app.get("/users/:id", authenticate, async (req, res) => {
  const userId = Number(req.params.id);
  if (!userId) {
    return res.status(400).json({ message: "ID user tidak valid" });
  }
  const user = await ensureUserExists(userId);
  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }
  res.json({ data: sanitizeUser(user) });
});

app.put("/users/:id", authenticate, async (req, res) => {
  const userId = Number(req.params.id);
  if (!userId) {
    return res.status(400).json({ message: "ID user tidak valid" });
  }
  const { name, email, gender, password } = req.body;
  const user = await ensureUserExists(userId);
  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }
  const payload = {};
  if (name?.trim()) {
    payload.name = name.trim();
  }
  if (email?.trim()) {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await findUserByEmail(normalizedEmail);
    if (existing && existing.id !== userId) {
      return res.status(409).json({ message: "Email sudah digunakan" });
    }
    payload.email = normalizedEmail;
  }
  if (gender) {
    payload.gender = gender;
  }
  if (password) {
    payload.password = await bcrypt.hash(password, 10);
  }
  if (!Object.keys(payload).length) {
    return res.status(400).json({ message: "Tidak ada data yang diubah" });
  }
  await db.update(users).set(payload).where(eq(users.id, userId));
  const updated = await ensureUserExists(userId);
  res.json({ data: sanitizeUser(updated) });
});

app.delete("/users/:id", authenticate, async (req, res) => {
  const userId = Number(req.params.id);
  if (!userId) {
    return res.status(400).json({ message: "ID user tidak valid" });
  }
  const user = await ensureUserExists(userId);
  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }
  await db.delete(users).where(eq(users.id, userId));
  res.json({ message: "User berhasil dihapus" });
});

// --- BOOK ROUTES ---
app.post("/books", authenticate, async (req, res) => {
  await db.insert(books).values({ ...req.body, userId: req.user.id });
  res.json({ message: "Book Added" });
});

app.get("/books", authenticate, async (req, res) => {
  const myBooks = await db
    .select()
    .from(books)
    .where(eq(books.userId, req.user.id));
  res.json(myBooks);
});

// --- PACKAGES ---
app.post("/packages", authenticate, async (req, res) => {
  const { title, description, durationDays, price, departureDate, capacity } =
    req.body;
  if (!title?.trim() || !description?.trim()) {
    return res
      .status(400)
      .json({ message: "Judul dan deskripsi paket harus diisi" });
  }
  await db.insert(packages).values({
    title: title.trim(),
    description: description.trim(),
    durationDays: toNumber(durationDays, 9),
    price: toNumber(price, 0),
    departureDate: departureDate?.trim() || null,
    capacity: toNumber(capacity, 0),
  });
  res.status(201).json({ message: "Paket umrah berhasil ditambahkan" });
});

app.get("/packages", authenticate, async (req, res) => {
  const packageList = await db.select().from(packages);
  res.json({ data: packageList });
});

app.get("/packages/:id", authenticate, async (req, res) => {
  const packageId = parseIdParam(req.params.id);
  if (!packageId) {
    return res.status(400).json({ message: "ID paket tidak valid" });
  }
  const pkg = await ensureRecordExists(packages, packageId);
  if (!pkg) {
    return res.status(404).json({ message: "Paket tidak ditemukan" });
  }
  res.json({ data: pkg });
});

app.put("/packages/:id", authenticate, async (req, res) => {
  const packageId = parseIdParam(req.params.id);
  if (!packageId) {
    return res.status(400).json({ message: "ID paket tidak valid" });
  }
  const pkg = await ensureRecordExists(packages, packageId);
  if (!pkg) {
    return res.status(404).json({ message: "Paket tidak ditemukan" });
  }
  const payload = {};
  if (req.body.title?.trim()) payload.title = req.body.title.trim();
  if (req.body.description?.trim())
    payload.description = req.body.description.trim();
  if (req.body.durationDays !== undefined)
    payload.durationDays = toNumber(req.body.durationDays, pkg.durationDays);
  if (req.body.price !== undefined)
    payload.price = toNumber(req.body.price, pkg.price);
  if (req.body.departureDate !== undefined)
    payload.departureDate = req.body.departureDate?.trim() || null;
  if (req.body.capacity !== undefined)
    payload.capacity = toNumber(req.body.capacity, pkg.capacity);
  if (!Object.keys(payload).length) {
    return res.status(400).json({ message: "Tidak ada perubahan yang disimpan" });
  }
  await db.update(packages).set(payload).where(eq(packages.id, packageId));
  const updated = await ensureRecordExists(packages, packageId);
  res.json({ data: updated });
});

app.delete("/packages/:id", authenticate, async (req, res) => {
  const packageId = parseIdParam(req.params.id);
  if (!packageId) {
    return res.status(400).json({ message: "ID paket tidak valid" });
  }
  const pkg = await ensureRecordExists(packages, packageId);
  if (!pkg) {
    return res.status(404).json({ message: "Paket tidak ditemukan" });
  }
  await db.delete(packages).where(eq(packages.id, packageId));
  res.json({ message: "Paket berhasil dihapus" });
});

// --- EMPLOYEES ---
app.post("/employees", authenticate, async (req, res) => {
  const { name, role, email, phone, note } = req.body;
  if (!name?.trim() || !role?.trim() || !email?.trim()) {
    return res
      .status(400)
      .json({ message: "Nama, peran, dan email pegawai harus diisi" });
  }
  await db.insert(employees).values({
    name: name.trim(),
    role: role.trim(),
    email: email.trim(),
    phone: phone?.trim() || null,
    note: note?.trim() || null,
  });
  res.status(201).json({ message: "Pegawai berhasil ditambahkan" });
});

app.get("/employees", authenticate, async (req, res) => {
  const employeeList = await db.select().from(employees);
  res.json({ data: employeeList });
});

app.get("/employees/:id", authenticate, async (req, res) => {
  const employeeId = parseIdParam(req.params.id);
  if (!employeeId) {
    return res.status(400).json({ message: "ID pegawai tidak valid" });
  }
  const employee = await ensureRecordExists(employees, employeeId);
  if (!employee) {
    return res.status(404).json({ message: "Pegawai tidak ditemukan" });
  }
  res.json({ data: employee });
});

app.put("/employees/:id", authenticate, async (req, res) => {
  const employeeId = parseIdParam(req.params.id);
  if (!employeeId) {
    return res.status(400).json({ message: "ID pegawai tidak valid" });
  }
  const employee = await ensureRecordExists(employees, employeeId);
  if (!employee) {
    return res.status(404).json({ message: "Pegawai tidak ditemukan" });
  }
  const payload = {};
  if (req.body.name?.trim()) payload.name = req.body.name.trim();
  if (req.body.role?.trim()) payload.role = req.body.role.trim();
  if (req.body.email?.trim()) payload.email = req.body.email.trim();
  if (req.body.phone !== undefined)
    payload.phone = req.body.phone?.trim() || null;
  if (req.body.note !== undefined) payload.note = req.body.note?.trim() || null;
  if (!Object.keys(payload).length) {
    return res.status(400).json({ message: "Tidak ada perubahan yang disimpan" });
  }
  await db.update(employees).set(payload).where(eq(employees.id, employeeId));
  const updated = await ensureRecordExists(employees, employeeId);
  res.json({ data: updated });
});

app.delete("/employees/:id", authenticate, async (req, res) => {
  const employeeId = parseIdParam(req.params.id);
  if (!employeeId) {
    return res.status(400).json({ message: "ID pegawai tidak valid" });
  }
  const employee = await ensureRecordExists(employees, employeeId);
  if (!employee) {
    return res.status(404).json({ message: "Pegawai tidak ditemukan" });
  }
  await db.delete(employees).where(eq(employees.id, employeeId));
  res.json({ message: "Pegawai berhasil dihapus" });
});

// --- JEMAAH ---
app.post("/jamaahs", authenticate, async (req, res) => {
  const {
    fullName,
    birthDate,
    passportNumber,
    nationality,
    email,
    phone,
    packageId,
    status,
    notes,
  } = req.body;
  if (!fullName?.trim()) {
    return res.status(400).json({ message: "Nama jamaah harus diisi" });
  }
  let packageRef = null;
  if (packageId !== undefined && packageId !== null) {
    const parsedPackage = parseIdParam(packageId);
    if (!parsedPackage) {
      return res.status(400).json({ message: "Paket tidak valid" });
    }
    const exists = await ensureRecordExists(packages, parsedPackage);
    if (!exists) {
      return res.status(404).json({ message: "Paket tidak ditemukan" });
    }
    packageRef = parsedPackage;
  }
  await db.insert(jamaahs).values({
    fullName: fullName.trim(),
    birthDate: birthDate?.trim() || null,
    passportNumber: passportNumber?.trim() || null,
    nationality: nationality?.trim() || "Indonesia",
    email: email?.trim() || null,
    phone: phone?.trim() || null,
    packageId: packageRef,
    status: status?.trim() || "Aktif",
    notes: notes?.trim() || null,
  });
  res.status(201).json({ message: "Data jamaah berhasil ditambahkan" });
});

app.get("/jamaahs", authenticate, async (req, res) => {
  const jamaahList = await db.select().from(jamaahs);
  res.json({ data: jamaahList });
});

app.get("/jamaahs/:id", authenticate, async (req, res) => {
  const jamaahId = parseIdParam(req.params.id);
  if (!jamaahId) {
    return res.status(400).json({ message: "ID jamaah tidak valid" });
  }
  const jamaah = await ensureRecordExists(jamaahs, jamaahId);
  if (!jamaah) {
    return res.status(404).json({ message: "Jamaah tidak ditemukan" });
  }
  res.json({ data: jamaah });
});

app.put("/jamaahs/:id", authenticate, async (req, res) => {
  const jamaahId = parseIdParam(req.params.id);
  if (!jamaahId) {
    return res.status(400).json({ message: "ID jamaah tidak valid" });
  }
  const jamaah = await ensureRecordExists(jamaahs, jamaahId);
  if (!jamaah) {
    return res.status(404).json({ message: "Jamaah tidak ditemukan" });
  }
  const payload = {};
  if (req.body.fullName?.trim()) payload.fullName = req.body.fullName.trim();
  if (req.body.birthDate !== undefined)
    payload.birthDate = req.body.birthDate?.trim() || null;
  if (req.body.passportNumber !== undefined)
    payload.passportNumber = req.body.passportNumber?.trim() || null;
  if (req.body.nationality?.trim())
    payload.nationality = req.body.nationality.trim();
  if (req.body.email !== undefined) payload.email = req.body.email?.trim() || null;
  if (req.body.phone !== undefined) payload.phone = req.body.phone?.trim() || null;
  if (req.body.packageId !== undefined) {
    if (req.body.packageId === null) {
      payload.packageId = null;
    } else {
      const parsedPackage = parseIdParam(req.body.packageId);
      if (!parsedPackage) {
        return res.status(400).json({ message: "Paket tidak valid" });
      }
      const exists = await ensureRecordExists(packages, parsedPackage);
      if (!exists) {
        return res.status(404).json({ message: "Paket tidak ditemukan" });
      }
      payload.packageId = parsedPackage;
    }
  }
  if (req.body.status?.trim()) payload.status = req.body.status.trim();
  if (req.body.notes !== undefined)
    payload.notes = req.body.notes?.trim() || null;
  if (!Object.keys(payload).length) {
    return res.status(400).json({ message: "Tidak ada perubahan yang disimpan" });
  }
  await db.update(jamaahs).set(payload).where(eq(jamaahs.id, jamaahId));
  const updated = await ensureRecordExists(jamaahs, jamaahId);
  res.json({ data: updated });
});

app.delete("/jamaahs/:id", authenticate, async (req, res) => {
  const jamaahId = parseIdParam(req.params.id);
  if (!jamaahId) {
    return res.status(400).json({ message: "ID jamaah tidak valid" });
  }
  const jamaah = await ensureRecordExists(jamaahs, jamaahId);
  if (!jamaah) {
    return res.status(404).json({ message: "Jamaah tidak ditemukan" });
  }
  await db.delete(jamaahs).where(eq(jamaahs.id, jamaahId));
  res.json({ message: "Data jamaah berhasil dihapus" });
});

// --- BOOKINGS ---
app.post("/bookings", authenticate, async (req, res) => {
  const { jamaahId, packageId, bookingDate, status, paymentStatus, notes, seatNumber } =
    req.body;
  const parsedJamaah = parseIdParam(jamaahId);
  const parsedPackage = parseIdParam(packageId);
  if (!parsedJamaah || !parsedPackage) {
    return res
      .status(400)
      .json({ message: "ID jamaah dan paket harus diisi dengan benar" });
  }
  const jamaah = await ensureRecordExists(jamaahs, parsedJamaah);
  if (!jamaah) {
    return res.status(404).json({ message: "Jamaah tidak ditemukan" });
  }
  const pkg = await ensureRecordExists(packages, parsedPackage);
  if (!pkg) {
    return res.status(404).json({ message: "Paket tidak ditemukan" });
  }
  await db.insert(bookings).values({
    jamaahId: parsedJamaah,
    packageId: parsedPackage,
    bookingDate: bookingDate?.trim() || null,
    status: status?.trim() || "Pending",
    paymentStatus: paymentStatus?.trim() || "Menunggu",
    notes: notes?.trim() || null,
    seatNumber: seatNumber?.trim() || null,
  });
  res.status(201).json({ message: "Paket berhasil dibooking" });
});

app.get("/bookings", authenticate, async (req, res) => {
  const bookingList = await db.select().from(bookings);
  res.json({ data: bookingList });
});

app.get("/bookings/:id", authenticate, async (req, res) => {
  const bookingId = parseIdParam(req.params.id);
  if (!bookingId) {
    return res.status(400).json({ message: "ID booking tidak valid" });
  }
  const booking = await ensureRecordExists(bookings, bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking tidak ditemukan" });
  }
  res.json({ data: booking });
});

app.put("/bookings/:id", authenticate, async (req, res) => {
  const bookingId = parseIdParam(req.params.id);
  if (!bookingId) {
    return res.status(400).json({ message: "ID booking tidak valid" });
  }
  const booking = await ensureRecordExists(bookings, bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking tidak ditemukan" });
  }
  const payload = {};
  if (req.body.jamaahId !== undefined) {
    if (req.body.jamaahId === null) {
      payload.jamaahId = null;
    } else {
      const parsedJamaah = parseIdParam(req.body.jamaahId);
      if (!parsedJamaah) {
        return res.status(400).json({ message: "Jamaah tidak valid" });
      }
      const exists = await ensureRecordExists(jamaahs, parsedJamaah);
      if (!exists) {
        return res.status(404).json({ message: "Jamaah tidak ditemukan" });
      }
      payload.jamaahId = parsedJamaah;
    }
  }
  if (req.body.packageId !== undefined) {
    if (req.body.packageId === null) {
      payload.packageId = null;
    } else {
      const parsedPackage = parseIdParam(req.body.packageId);
      if (!parsedPackage) {
        return res.status(400).json({ message: "Paket tidak valid" });
      }
      const exists = await ensureRecordExists(packages, parsedPackage);
      if (!exists) {
        return res.status(404).json({ message: "Paket tidak ditemukan" });
      }
      payload.packageId = parsedPackage;
    }
  }
  if (req.body.bookingDate !== undefined)
    payload.bookingDate = req.body.bookingDate?.trim() || null;
  if (req.body.status?.trim()) payload.status = req.body.status.trim();
  if (req.body.paymentStatus?.trim())
    payload.paymentStatus = req.body.paymentStatus.trim();
  if (req.body.notes !== undefined) payload.notes = req.body.notes?.trim() || null;
  if (req.body.seatNumber !== undefined)
    payload.seatNumber = req.body.seatNumber?.trim() || null;
  if (!Object.keys(payload).length) {
    return res.status(400).json({ message: "Tidak ada perubahan yang disimpan" });
  }
  await db.update(bookings).set(payload).where(eq(bookings.id, bookingId));
  const updated = await ensureRecordExists(bookings, bookingId);
  res.json({ data: updated });
});

app.delete("/bookings/:id", authenticate, async (req, res) => {
  const bookingId = parseIdParam(req.params.id);
  if (!bookingId) {
    return res.status(400).json({ message: "ID booking tidak valid" });
  }
  const booking = await ensureRecordExists(bookings, bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking tidak ditemukan" });
  }
  await db.delete(bookings).where(eq(bookings.id, bookingId));
  res.json({ message: "Booking berhasil dihapus" });
});

module.exports = app;
