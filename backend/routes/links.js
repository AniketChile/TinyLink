import express from "express";
import { pool } from "../db.js";

const router = express.Router();
const isValidUrl = (url) => {
  try { new URL(url); return true; }
  catch { return false; }
};

router.post("/", async (req, res) => {
  const { url, code } = req.body;

  if (!url || !isValidUrl(url))
    return res.status(400).json({ error: "Invalid URL" });
  const check = await pool.query(
    "SELECT code FROM links WHERE code=$1",
    [code]
  );
  if (check.rowCount > 0)
    return res.status(409).json({ error: "Code already exists" });

  await pool.query(
    "INSERT INTO links (code, target_url) VALUES ($1,$2)",
    [code, url]
  );

  res.json({ ok: true, code, shortUrl: `${process.env.BASE_URL}/${code}` });
});


router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM links ORDER BY code");
  res.json(result.rows);
});


router.get("/:code", async (req, res) => {
  const { code } = req.params;

  const result = await pool.query(
    "SELECT * FROM links WHERE code=$1",
    [code]
  );

  if (result.rowCount === 0)
    return res.status(404).json({ error: "Not found" });

  res.json(result.rows[0]);
});


router.delete("/:code", async (req, res) => {
  const { code } = req.params;

  await pool.query("DELETE FROM links WHERE code=$1", [code]);
  res.json({ ok: true });
});

export default router;
