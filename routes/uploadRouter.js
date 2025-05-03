const express = require('express');
const router = express.Router();
const multer = require('multer');
const prisma = require('../prisma/client');
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
    const userId = req.user.id;
    const folderId = req.body.folderId || null;
    const file = req.file;

    const fileUrl = `/uploads/${file.filename}`;

    await prisma.file.create({
        data: {
            name: file.originalname,
            url: fileUrl,
            userId,
            folderId,
        },
    });

    res.redirect(folderId ? `/dashboard/folder/${folderId}` : '/dashboard');
});

module.exports = router;