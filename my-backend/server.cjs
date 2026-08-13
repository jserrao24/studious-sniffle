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

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        date VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL
      );
    `);
    console.log("Database table verified.");
  } catch (err) {
    console.error("Database initialization error:", err);
  }
};
initDb();

// ☁️ SUPABASE STORAGE CONFIGURATION
// These variables will be provided by Render
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Multer is now configured to keep the file in Memory, not on Disk
const upload = multer({ storage: multer.memoryStorage() });

let pdfs = [
  { 
    id: 1, 
    name: 'Default Dummy PDF.pdf', 
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' 
  }
];

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

// --- PDF API ENDPOINTS (CLOUD STORAGE) ---
app.get('/api/pdfs', (req, res) => res.json(pdfs));

app.post('/api/pdfs/upload', upload.single('pdfFile'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  
  // 1. Create a unique filename to prevent overwriting
  const fileName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  try {
    // 2. Upload the file buffer to Supabase Storage bucket 'pdfs'
    const { data, error } = await supabase
      .storage
      .from('pdfs')
      .upload(fileName, req.file.buffer, {
        contentType: 'application/pdf'
      });

    if (error) throw error;

    // 3. Get the public URL for the newly uploaded file
    const { data: publicUrlData } = supabase
      .storage
      .from('pdfs')
      .getPublicUrl(fileName);

    const newPdf = {
      id: Date.now(),
      name: req.file.originalname,
      url: publicUrlData.publicUrl 
    };
    
    pdfs.push(newPdf);
    res.json(newPdf);

  } catch (err) {
    console.error("Supabase upload error:", err);
    res.status(500).json({ error: 'Failed to upload PDF to cloud storage.' });
  }
});

app.delete('/api/pdfs/:id', (req, res) => {
  const idToRemove = parseInt(req.params.id);
  pdfs = pdfs.filter(pdf => pdf.id !== idToRemove);
  // Note: For a complete system, you would also delete the file from the Supabase bucket here.
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
