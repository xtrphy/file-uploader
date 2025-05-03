const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const deleteFolderRecursive = require('../utils/deleteFolderRecursive');

router.get('/', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.render('index', {
            isAuthenticated: false,
            files: [],
            folders: [],
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

    const folders = await prisma.folder.findMany({
        where: {
            userId,
            parentId: null,
        },
        include: {
            subfolders: true,
            files: true,
        },
    });

    res.render('index', { isAuthenticated: req.isAuthenticated(), files, folders });
});

// File routes
router.post('/delete-file', async (req, res) => {
    const { fileId } = req.body;
    const userId = req.user.id;

    const file = await prisma.file.findUnique({
        where: { id: fileId }
    });

    if (!file || file.userId !== userId) {
        return res.status(403).send('No access')
    }

    await prisma.file.delete({
        where: { id: fileId }
    });

    res.redirect('/dashboard');
});

router.post('/rename-file', async (req, res) => {
    const { fileId, newName } = req.body;
    const userId = req.user.id;

    const file = await prisma.file.findUnique({
        where: { id: fileId }
    });

    if (!file || file.userId !== userId) {
        return res.status(403).send('No access')
    }

    await prisma.file.update({
        where: { id: fileId },
        data: { name: newName }
    });

    res.redirect('/dashboard');
});

// Folder routes
router.post('/delete-folder', async (req, res) => {
    const { folderId } = req.body;
    const userId = req.user.id;

    const folder = await prisma.folder.findUnique({
        where: { id: folderId }
    });

    if (!folder || folder.userId !== userId) {
        return res.status(403).send('No access')
    }

    await deleteFolderRecursive(prisma, folderId, userId);

    res.redirect('/dashboard');
});

router.post('/rename-folder', async (req, res) => {
    const { folderId, newName } = req.body;
    const userId = req.user.id;

    const folder = await prisma.folder.findUnique({
        where: { id: folderId }
    });

    if (!folder || folder.userId !== userId) {
        return res.status(403).send('No access');
    }

    await prisma.folder.update({
        where: { id: folderId },
        data: { name: newName }
    });

    res.redirect('/dashboard');
});

module.exports = router;