const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg'); // PostgreSQL client

const app = express();
app.use(cors());
app.use(express.json());

// 🗄️ Database Connection
// Render automatically provides the 'DATABASE_URL' environment variable when deployed
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/postgres', // Fallback to local if running offline
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false // Required for secure cloud connections
});

// Create the announcements table automatically if it doesn't exist
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

// 📂 Multer Configuration for PDF uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// In-Memory Fallback for PDF paths (Simulated Registry)
let pdfs = [
  { 
    id: 1, 
    name: 'Default Dummy PDF.pdf', 
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' 
  }
];

// --- ANNOUNCEMENT API ENDPOINTS (CONNECTED TO DATABASE) ---
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

// --- PDF API ENDPOINTS ---
app.get('/api/pdfs', (req, res) => res.json(pdfs));

app.post('/api/pdfs/upload', upload.single('pdfFile'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  
  // Use Render's host URL if deployed, otherwise fallback to localhost
const host = req.get('host');
const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const newPdf = {
    id: Date.now(),
    name: req.file.originalname,
    url: `${protocol}://${host}/uploads/${req.file.filename}` 
  };
  
  pdfs.push(newPdf);
  res.json(newPdf);
});

app.delete('/api/pdfs/:id', (req, res) => {
  const idToRemove = parseInt(req.params.id);
  pdfs = pdfs.filter(pdf => pdf.id !== idToRemove);
  res.json({ success: true });
});

app.use('/uploads', express.static(uploadDir));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
