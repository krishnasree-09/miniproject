const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');

// Test Endpoint
const test = (req, res) => {
    res.json('test is working');
};

// Register Endpoint
const registerUser = async (req, res) => {
    try {
        const { name, email, password, location, number, serviceProvider, serviceRequestor } = req.body;

        if (!name) {
            return res.json({ error: 'Name is required' });
        }

        if (!password || password.length < 6) {
            return res.json({ error: 'Password is required and must be at least 6 characters long' });
        }

        if (await User.findOne({ email })) {
            return res.json({ error: 'Email is already taken' });
        }

        if (!number || number.length < 10) {
            return res.json({ error: 'Number should be of 10 digits' });
        }

        if (!location) {
            return res.json({ error: 'Location is required' });
        }

        if (typeof serviceProvider !== 'boolean') {
            return res.json({ error: 'Service provider must be a boolean value' });
        }

        if (typeof serviceRequestor !== 'boolean') {
            return res.json({ error: 'Service requestor must be a boolean value' });
        }

        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            location,
            number,
            serviceProvider,
            serviceRequestor
        });

        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred during registration' });
    }
};

// Login Endpoint
const loginUser = async (req, res) => {
    try {
        const { email, password, serviceProvider, serviceRequestor } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: 'No user found' });
        }

        // Check if passwords match
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.json({ error: 'Incorrect password' });
        }

        // Check if serviceProvider and serviceRequestor match
        if (serviceProvider !== user.serviceProvider) {
            return res.json({ error: 'Service provider selection does not match' });
        }

        if (serviceRequestor !== user.serviceRequestor) {
            return res.json({ error: 'Service requestor selection does not match' });
        }

        // Generate JWT token
        jwt.sign(
            { email: user.email, id: user._id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Example expiration time
            (err, token) => {
                if (err) throw err
                res.cookie('token', token ) .json(user);
                return res.json({ message: 'Login successful', user });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred during login' });
    }
};

// Get Profile Endpoint
const getProfile = (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {} , (err, user) => {
            if (err) throw err;
             res.json(user);
        });
    } else {
         res.json(null);
    }
};

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile
};
