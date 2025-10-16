const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const UPLOAD_DIR = '/tmp/uploads'; // Use the /tmp directory for Vercel
const FILE_LIFETIME = 1 * 60 * 1000; // 1 minute in milliseconds

// Ensure upload directory exists in the /tmp folder
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

// POST endpoint for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Construct the URL based on the request headers
  // Vercel provides the VERCEL_URL env var for the deployment's URL
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const fileUrl = `${protocol}://${host}/files/${req.file.filename}`;
  const filePath = req.file.path;

  // Schedule file deletion
  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      } else {
        console.log(`Successfully deleted temporary file: ${filePath}`);
      }
    });
  }, FILE_LIFETIME);

  res.status(200).json({
    message: 'File uploaded successfully.',
    url: fileUrl,
    expiresIn: '1 minute',
  });
});

// GET endpoint to serve the temporary files from /tmp
app.get('/files/:filename', (req, res) => {
    const { filename } = req.params;
    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(UPLOAD_DIR, safeFilename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(`Error sending file ${filePath}:`, err);
                res.status(500).send('Error sending file');
            }
        });
    } else {
        res.status(404).send('File not found or has expired.');
    }
});


// Export the app as a module for Vercel
module.exports = app;
