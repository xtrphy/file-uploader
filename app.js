const path = require('node:path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./prisma/client');
require('dotenv').config();

const dashboardRouter = require('./routes/dashboardRouter');
const authRouter = require('./routes/authRouter');
const uploadRouter = require('./routes/uploadRouter');
const folderRouter = require('./routes/folderRouter');


// Set up
const app = express();

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));


// Authentication Set Up
app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000
        },
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(prisma, {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    })
);

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { username } });
            if (!user) return done(null, false, { message: 'User not found' });

            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (!isValid) return done(null, false, { message: 'Wrong password' });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.use(passport.initialize());
app.use(passport.session());


// Routes
app.get('/', (req, res) => {
    res.redirect('/dashboard');
});
app.use('/dashboard', dashboardRouter);
app.use('/', authRouter);
app.use('/upload', uploadRouter);
app.use('/create-folder', folderRouter);


// Start
const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});