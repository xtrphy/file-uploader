const express = require('express');
const router = express.Router();
const multer = require('multer');
const prisma = require('../prisma/client');
const { storage } = require('../utils/cloudinary');

const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
];

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, pdf\'s and docx are allowed.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/', upload.single('file'), async (req, res) => {
    try {
        const userId = req.user.id;
        const folderId = req.body.folderId || null;
        const file = req.file;
        const fileUrl = file.path;

        if (!file) {
            throw new Error('File not uploaded');
        }

        await prisma.file.create({
            data: {
                name: file.originalname,
                url: fileUrl,
                userId,
                folderId,
            },
        });

        res.redirect(folderId ? `/dashboard/folder/${folderId}` : '/dashboard');
    } catch (err) {
        console.error('Error loading:', err.message);
        return res.status(400).send('<h1>Error:</h1><p>Only JPG, PNG, JPEG, PDF, DOCX, TXT available</p>')
    }
});

module.exports = router;