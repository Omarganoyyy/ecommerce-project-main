import express from 'express';
import crypto from 'crypto';
import { User } from '../models/User.js';

const router = express.Router();

const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

const sanitizeUser = (user) => {
    if (!user) return null;

    const raw = user.toJSON ? user.toJSON() : user;

    return {
        id: raw.id,
        firstName: raw.firstName,
        lastName: raw.lastName,
        email: raw.email,
        phone: raw.phone || '',
        address: raw.address || '',
        city: raw.city || '',
        state: raw.state || '',
        zipCode: raw.zipCode || '',
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
    };
};

const getToken = (userId) => Buffer.from(`${userId}:${Date.now()}`).toString('base64');

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'Please provide first name, last name, email, and password.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const user = await User.create({
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
    });

    const token = getToken(user.id);

    return res.status(201).json({
        token,
        user: sanitizeUser(user)
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.passwordHash !== hashPassword(password)) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    return res.json({
        token: getToken(user.id),
        user: sanitizeUser(user)
    });
});

router.get('/me', async (req, res) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const userId = decoded.split(':')[0];

    if (!userId) {
        return res.status(401).json({ error: 'Invalid token.' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ user: sanitizeUser(user) });
});

router.put('/profile', async (req, res) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const userId = decoded.split(':')[0];

    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    const { firstName, lastName, phone, address, city, state, zipCode } = req.body;

    user.firstName = firstName ? String(firstName).trim() : user.firstName;
    user.lastName = lastName ? String(lastName).trim() : user.lastName;
    user.phone = phone ? String(phone).trim() : user.phone;
    user.address = address ? String(address).trim() : user.address;
    user.city = city ? String(city).trim() : user.city;
    user.state = state ? String(state).trim() : user.state;
    user.zipCode = zipCode ? String(zipCode).trim() : user.zipCode;

    await user.save();

    return res.json({ user: sanitizeUser(user) });
});

export default router;
