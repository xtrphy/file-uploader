const express = require('express');
const multer = require('multer');
const path = require('node:path');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.post('/', upload.single('uploaded_file'), (req, res) => {
    console.log('File uploaded', req.file);
    res.redirect('/dashboard');
});

module.exports = router;