import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Specialization from '../models/Specialization.js';
import { generateAccessToken } from '../utils/jwt.js';
import { verifyJWT, authorizeRoles } from '../middleware/authMiddleware.js';
import { createNotification } from '../utils/notificationHelper.js';

const router = express.Router();

// Register Patient or Doctor
router.post('/register', async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role = 'patient',
            phone,
            address,
            patientProfile,
            doctorProfile
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: ['patient', 'doctor', 'admin'].includes(role) ? role : 'patient',
            phone: phone || '',
            address: address || {}
        };

        if (userData.role === 'patient') {
            userData.patientProfile = patientProfile || {};
        } else if (userData.role === 'doctor') {
            userData.doctorProfile = {
                specializationName: doctorProfile?.specializationName || 'General Medicine',
                specialization: doctorProfile?.specialization || null,
                licenseNumber: doctorProfile?.licenseNumber || '',
                qualifications: doctorProfile?.qualifications || ['MBBS'],
                experienceYears: Number(doctorProfile?.experienceYears) || 1,
                hospitalAffiliation: doctorProfile?.hospitalAffiliation || '',
                bio: doctorProfile?.bio || '',
                consultationFee: Number(doctorProfile?.consultationFee) || 50,
                isApproved: false, // Requires admin approval
                isAvailableForBooking: true
            };
        }

        const newUser = new User(userData);
        await newUser.save();

        const token = generateAccessToken(newUser);

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Strip password before returning
        const userObj = newUser.toObject();
        delete userObj.password;

        return res.status(201).json({
            success: true,
            message: `${userData.role === 'doctor' ? 'Doctor registration submitted (pending admin approval)' : 'Account registered successfully'}`,
            user: userObj
        });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        if (user.isBanned) {
            return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateAccessToken(user);

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        const userObj = user.toObject();
        delete userObj.password;

        return res.json({
            success: true,
            message: 'Logged in successfully',
            user: userObj
        });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    return res.json({ success: true, message: 'Logged out successfully' });
});

// Get Current User Profile
router.get('/me', verifyJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error fetching user profile' });
    }
});

// Update Profile
router.patch('/profile', verifyJWT, async (req, res) => {
    try {
        const updates = req.body;
        delete updates.password; // Handled separately
        delete updates.email; // Non-editable via simple update
        delete updates.role; // Non-editable directly

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (updates.name) user.name = updates.name;
        if (updates.phone) user.phone = updates.phone;
        if (updates.avatar) user.avatar = updates.avatar;
        if (updates.address) user.address = { ...user.address, ...updates.address };

        if (user.role === 'patient' && updates.patientProfile) {
            user.patientProfile = { ...user.patientProfile, ...updates.patientProfile };
        }

        if (user.role === 'doctor' && updates.doctorProfile) {
            user.doctorProfile = { ...user.doctorProfile, ...updates.doctorProfile };
        }

        await user.save();

        const userObj = user.toObject();
        delete userObj.password;

        return res.json({
            success: true,
            message: 'Profile updated successfully',
            user: userObj
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
    }
});

// Change Password
router.post('/change-password', verifyJWT, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change Password Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to change password' });
    }
});

export default router;
