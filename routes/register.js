const express = require('express')

router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = (prisma) => {
    const router = express.Router();

    router.post('/register', async (req, res) => {
        const { username, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) return res.status(400).send('Username already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, password: hashedPassword },
        });

        req.session.userId = user.id;
        res.send('User registered and logged in');
    });
}