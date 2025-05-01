const path = require('node:path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
require('dotenv').config();

// Set up
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
const prisma = new PrismaClient();

// TODO: Log In, Registration, Log Out using Prisma Session Store

app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000
        },
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            new PrismaClient(),
            {
                checkPeriod: 2 * 60 * 1000,
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
    })
);

// Routes

app.get('/', (req, res) => {
    res.render('index', { title: 'Vaultix', name: 'Xtrphy' });
});

app.get('/register', registerRouter(prisma));

// Start
const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});