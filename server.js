const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads'); // Store uploads in a local directory

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

const upload = multer({ storage });

// API: POST endpoint for file upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Construct the URL based on the request headers
  const host = req.get('host');
  // In a typical proxy setup (like Easypanel's Traefik), x-forwarded-proto is set
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const fileUrl = `${protocol}://${host}/files/${req.file.filename}`;
  const filePath = req.file.path;
  const FILE_LIFETIME_MS = 1 * 60 * 1000; // 1 minute

  // Schedule file deletion. This is reliable in a persistent server environment.
  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      } else {
        console.log(`Successfully deleted expired file: ${filePath}`);
      }
    });
  }, FILE_LIFETIME_MS);

  res.status(200).json({
    message: 'File uploaded successfully.',
    url: fileUrl,
    expiresIn: '1 minute',
  });
});

// API: GET endpoint to serve the temporary files
app.use('/files', express.static(UPLOAD_DIR));

// FRONTEND: Serve the static files from the React build
app.use(express.static(path.join(__dirname, 'dist')));

// FRONTEND: Handle any requests that don't match the ones above
// by returning the main index.html file. This is for client-side routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
