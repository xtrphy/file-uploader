const express = require('express');
const prisma = require('../prisma/client');

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, parentId } = req.body;
    const userId = req.user.id;

    await prisma.folder.create({
        data: {
            name,
            parentId: parentId || null,
            userId,
        },
    });

    res.redirect('/dashboard');
});

module.exports = router;