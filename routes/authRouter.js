const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('auth', { path: req.path });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
}));


router.get('/sign-up', (req, res) => {
    res.render('auth', { path: req.path });
});

router.post('/sign-up', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { username, passwordHash },
        });

        req.login(newUser, (err) => {
            if (err) return next(err);
            return res.redirect('/dashboard');
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

router.post('/log-out', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/dashboard');
    });
});

module.exports = router;