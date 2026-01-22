const { drizzle } = require("drizzle-orm/libsql");
const { createClient } = require("@libsql/client");
require("dotenv").config();

const client = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);
module.exports = { db };
