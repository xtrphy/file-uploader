const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');
const { validationResult } = require('express-validator');
const { registerValidation, loginValidation } = require('../utils/authValidation');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('auth', { path: req.path, errors: {}, oldInput: {} });
});

router.post('/login', loginValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorObj = {};
        errors.array().forEach(error => {
            errorObj[error.path] = error.msg;
        });

        return res.status(400).render('auth', {
            errors: errorObj,
            oldInput: {
                username: req.body.username,
            },
            path: req.path,
        });
    }

    passport.authenticate('local', {

        successRedirect: '/dashboard',
        failureRedirect: '/login',
    })(req, res, next);
});

router.get('/sign-up', (req, res) => {
    res.render('auth', { path: req.path, errors: {}, oldInput: {} });
});

router.post('/sign-up', registerValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorObj = {};
        errors.array().forEach(error => {
            errorObj[error.path] = error.msg;
        });

        return res.status(400).render('auth', {
            errors: errorObj,
            oldInput: {
                username: req.body.username,
            },
            path: req.path,
        });
    }

    const { username, password } = req.body;

    try {
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