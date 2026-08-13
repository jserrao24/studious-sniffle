const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors({
  origin: 'https://studious-sniffle-pi.vercel.app'
}));

app.use(express.json());

// 🗄️ DATABASE CONNECTION
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Create BOTH tables automatically if they don't exist
const initDb = async () => {
  try {
    // Announcements Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        date VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL
      );
    `);
    // PDFs Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pdfs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL
      );
    `);
    console.log("Database tables verified.");
  } catch (err) {
    console.error("Database initialization error:", err);
  }
};
initDb();

// ☁️ SUPABASE STORAGE CONFIGURATION
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Multer keeps the file in Memory for upload to Supabase
const upload = multer({ storage: multer.memoryStorage() });

// --- ANNOUNCEMENT API ENDPOINTS ---
app.get('/api/announcements', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM announcements ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/announcements', async (req, res) => {
  const { date, title, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO announcements (date, title, content) VALUES ($1, $2, $3) RETURNING *',
      [date, title, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/announcements/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM announcements WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PDF API ENDPOINTS (CLOUD STORAGE + DATABASE REGISTRY) ---

// GET PDFs from the Neon Database
app.get('/api/pdfs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pdfs ORDER BY id ASC');
    


// UPLOAD a PDF to Supabase and save its URL to the Neon Database
app.post('/api/pdfs/upload', upload.single('pdfFile'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  
  const fileName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  try {
    // 1. Upload the physical file to Supabase Storage
    const { error } = await supabase
      .storage
      .from('pdfs')
      .upload(fileName, req.file.buffer, {
        contentType: 'application/pdf'
      });

    if (error) throw error;

    // 2. Get the public URL for the newly uploaded file
    const { data: publicUrlData } = supabase
      .storage
      .from('pdfs')
      .getPublicUrl(fileName);

    const fileUrl = publicUrlData.publicUrl;
    const fileNameDisplay = req.file.originalname;

    // 3. Save the permanent URL into the Neon PostgreSQL Database
    const result = await pool.query(
      'INSERT INTO pdfs (name, url) VALUES ($1, $2) RETURNING *',
      [fileNameDisplay, fileUrl]
    );

    // 4. Return the new database record to React
    res.json(result.rows[0]);

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: 'Failed to upload PDF and save to registry.' });
  }
});

// DELETE a PDF record from the Neon Database
app.delete('/api/pdfs/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (id === 0) return res.status(400).json({ error: "Cannot delete the default PDF." });

  try {
    // Note: To be perfectly clean, you would also delete the file from the Supabase bucket here.
    await pool.query('DELETE FROM pdfs WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
