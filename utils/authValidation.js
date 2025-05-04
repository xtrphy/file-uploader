const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');

// Register
exports.registerValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username required')
        .isLength({ min: 3, max: 20 }).withMessage('Minimum 3 characters, maximum 20')
        .custom(async (username) => {
            const existingUser = await prisma.user.findUnique({ where: { username } });
            if (existingUser) {
                throw new Error('Username already exist');
            }
        }),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),

    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('The passwords do not match');
        }
        return true;
    }),
];

exports.loginValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .custom(async (username, { req }) => {
            const user = await prisma.user.findUnique({ where: { username } });

            if (!user) {
                throw new Error('User does not exist');
            }

            req.user = user;
        }),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .custom(async (password, { req }) => {
            const user = req.user;
            if (!user) return;

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                throw new Error('Invalid password');
            }
        }),
];