const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../db");
const { users, books } = require("../db/schema");
const { eq } = require("drizzle-orm");
require("dotenv").config();

const app = express();
// app.use(cors());
app.use(
  cors({
    origin: ["https://my-apps-c9hu.vercel.app/"], // Ganti dengan URL frontend Anda
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// Middleware JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Forbidden");
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await db.insert(users).values({ username, password: hashed });
  res.json({ message: "User Created" });
});

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = (
    await db.select().from(users).where(eq(users.username, username))
  )[0];
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return res.json({ token });
  }
  res.status(400).send("Invalid Credentials");
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

// app.listen(5000, () => console.log("Server running on port 5000"));
// Tambahkan ini agar bisa dibaca oleh Vercel:
module.exports = app;
