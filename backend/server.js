import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import linkRoutes from "./routes/links.js";

dotenv.config();
const app = express();

/* -----------------
   CORS FIRST
------------------ */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.options("*", cors());

app.use(express.json());

/* -----------------
   API ROUTES FIRST
------------------ */
app.use("/api/links", linkRoutes);

/* -----------------
   Health check
------------------ */
app.get("/healthz", (req, res) => {
  res.json({ ok: true, version: "1.0", uptime: process.uptime() });
});

/* -----------------
   Redirect handler LAST
------------------ */
app.get("/:code", async (req, res) => {
  const { code } = req.params;

  const result = await pool.query("SELECT * FROM links WHERE code=$1", [code]);

  if (result.rowCount === 0)
    return res.status(404).send("Not found");

  await pool.query(
    `UPDATE links
     SET total_clicks = total_clicks + 1,
         last_clicked = NOW()
     WHERE code=$1`,
    [code]
  );

  return res.redirect(302, result.rows[0].target_url);
});

/* -----------------
   Start server
------------------ */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
