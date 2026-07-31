const UserModel = require('../models/UserModal');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { first_name, last_name, email, password, confirm_password, accept_terms } = req.body;

    if (!first_name || !last_name || !email || !password || !confirm_password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (!accept_terms) {
        return res.status(400).json({ message: 'You must accept the terms and conditions' });
    }

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'super_secret_jwt_key_12345',
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token, user: { _id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role } });

    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};