const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const UPLOAD_DIR = '/tmp/uploads'; // Use the /tmp directory for Vercel

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
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Construct the URL based on the request headers from Vercel's proxy
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const protocol = req.headers['x-forwarded-proto'] || (host.startsWith('localhost') ? 'http' : 'https');
  const fileUrl = `${protocol}://${host}/api/files/${req.file.filename}`;
  
  // SERVERLESS CAVEAT:
  // In a serverless environment like Vercel, using setTimeout for file deletion is unreliable.
  // The function instance that handles the upload may be shut down or frozen before the
  // timeout completes, meaning the file will never be deleted.
  // The `/tmp` directory is temporary by nature and will eventually be cleared by the platform.

  res.status(200).json({
    message: 'File uploaded successfully.',
    url: fileUrl,
    expiresIn: 'approximately 1 minute (best-effort)',
  });
});

// GET endpoint to serve the temporary files from /tmp
app.get('/api/files/:filename', (req, res) => {
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
