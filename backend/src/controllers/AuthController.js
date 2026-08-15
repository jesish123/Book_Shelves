const UserModel = require('../models/UserModal');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const createEmailTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  const secure = process.env.EMAIL_SECURE === 'true';
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
};

const sendResetCodeEmail = async (email, code) => {
  const transporter = createEmailTransporter();
  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@bookshelves.app';
  const message = {
    from: fromAddress,
    to: email,
    subject: 'Book Shelves Password Reset Code',
    text: `Your password reset code is ${code}. It expires in 5 minutes.`,
    html: `<p>Your password reset code is <strong>${code}</strong>.</p><p>It expires in 5 minutes.</p>`,
  };

  console.log(`Password reset code for ${email}: ${code} (valid 5 minutes)`);

  if (!transporter) {
    console.warn('Email transporter not configured. Reset code not sent by email.');
    return;
  }

  await transporter.sendMail(message);
};

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
            password: hashedPassword,
            status: 'offline'
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

        user.status = 'online';
        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'super_secret_jwt_key_12345',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = 'offline';
        await user.save();

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out:', error.message);
        return res.status(500).json({ message: 'Error logging out', error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await UserModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(200).json({ message: 'If that email is registered, a reset code has been sent.' });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 5 * 60 * 1000);

        user.resetCode = resetCode;
        user.resetCodeExpiry = expiry;
        await user.save();

        await sendResetCodeEmail(user.email, resetCode);
        res.status(200).json({ message: 'Password reset code sent to your email. It will expire in 5 minutes.' });
    } catch (error) {
        console.error('Forgot password error:', error.message);
        res.status(500).json({ message: 'Unable to process password reset request', error: error.message });
    }
};

const verifyResetCode = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: 'Email and reset code are required' });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await UserModel.findOne({ email: normalizedEmail });
        if (!user || !user.resetCode || !user.resetCodeExpiry) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        if (user.resetCode !== code) {
            return res.status(400).json({ message: 'Invalid reset code' });
        }

        if (Date.now() > new Date(user.resetCodeExpiry).getTime()) {
            return res.status(400).json({ message: 'Reset code has expired' });
        }

        res.status(200).json({ message: 'Reset code verified' });
    } catch (error) {
        console.error('Verify reset code error:', error.message);
        res.status(500).json({ message: 'Unable to verify reset code', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { email, code, password, confirm_password } = req.body;

    if (!email || !code || !password || !confirm_password) {
        return res.status(400).json({ message: 'Email, code, and password fields are required' });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await UserModel.findOne({ email: normalizedEmail });
        if (!user || !user.resetCode || !user.resetCodeExpiry) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        if (user.resetCode !== code) {
            return res.status(400).json({ message: 'Invalid reset code' });
        }

        if (Date.now() > new Date(user.resetCodeExpiry).getTime()) {
            return res.status(400).json({ message: 'Reset code has expired' });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetCode = null;
        user.resetCodeExpiry = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        console.error('Reset password error:', error.message);
        res.status(500).json({ message: 'Unable to reset password', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    verifyResetCode,
    resetPassword
};