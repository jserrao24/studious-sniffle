const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Temporary Server Memory
let announcements = [];
let pdfs = [
  { 
    id: 1, 
    name: 'Default Dummy PDF.pdf', 
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' 
  }
];

// --- ANNOUNCEMENT ENDPOINTS ---
app.get('/api/announcements', (req, res) => res.json(announcements));

app.post('/api/announcements', (req, res) => {
  const newPost = { id: Date.now(), ...req.body };
  announcements = [newPost, ...announcements];
  res.json(newPost);
});

app.delete('/api/announcements/:id', (req, res) => {
  const idToRemove = parseInt(req.params.id);
  announcements = announcements.filter(post => post.id !== idToRemove);
  res.json({ success: true });
});

// --- PDF ENDPOINTS ---
app.get('/api/pdfs', (req, res) => res.json(pdfs));

app.post('/api/pdfs/upload', upload.single('pdfFile'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  
  const newPdf = {
    id: Date.now(),
    name: req.file.originalname,
    url: `http://localhost:5000/uploads/${req.file.filename}` 
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
