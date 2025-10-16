const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = 'uploads';
const FILE_LIFETIME = 1 * 60 * 1000; // 1 minute in milliseconds

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Serve static files from the 'uploads' directory
app.use('/files', express.static(path.join(__dirname, UPLOAD_DIR)));

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to avoid collisions
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

  const fileUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
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

  // Return the direct link to the file
  res.status(200).json({
    message: 'File uploaded successfully.',
    url: fileUrl,
    expiresIn: '1 minute',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});