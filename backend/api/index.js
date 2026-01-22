const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../db");
const { users, books } = require("../db/schema");
const { eq } = require("drizzle-orm");
require("dotenv").config();

const app = express();

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) ?? [
    "https://my-apps-a8ro.vercel.app",
    "https://my-apps-c9hu.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
  ]
).filter(Boolean);

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      if (!incomingOrigin || allowedOrigins.includes(incomingOrigin)) {
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
    return res
      .status(400)
      .json({ message: "Email dan password harus diisi" });
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
    return res
      .status(400)
      .json({ message: "Tidak ada data yang diubah" });
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

module.exports = app;
