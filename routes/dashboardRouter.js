const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

router.get('/', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.render('index', {
            isAuthenticated: false,
            files: [],
            user: null,
        });
    }

    const userId = req.user.id;

    const files = await prisma.file.findMany({
        where: {
            userId,
            folderId: null,
        },
    });

    res.render('index', { isAuthenticated: req.isAuthenticated(), files });
});

module.exports = router;