import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import linkRoutes from "./routes/links.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

/* -----------------
   Health check
------------------ */
app.get("/healthz", (req, res) => {
  res.json({
    ok: true,
    version: "1.0",
    uptime: process.uptime()
  });
});

/* -----------------
   Redirect handler
------------------ */
app.get("/:code", async (req, res, next) => {
  if (req.path.startsWith("/api") || req.path === "/" || req.path.startsWith("/code")) 
    return next();

  const { code } = req.params;

  const result = await pool.query(
    "SELECT * FROM links WHERE code=$1",
    [code]
  );

  if (result.rowCount === 0)
    return res.status(404).send("Not found");

  // increment
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
   API Routes
------------------ */
app.use("/api/links", linkRoutes);

/* -----------------
   Start server
------------------ */
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
