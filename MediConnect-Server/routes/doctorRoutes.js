import express from 'express';
import User from '../models/User.js';
import Specialization from '../models/Specialization.js';
import { verifyJWT, authorizeRoles } from '../middleware/authMiddleware.js';
import { createNotification } from '../utils/notificationHelper.js';

const router = express.Router();

// Public: Get doctors directory with search, filter, and pagination
router.get('/', async (req, res) => {
    try {
        const { search, specialization, maxFee, minExp, day, page = 1, limit = 12 } = req.query;

        const query = {
            role: 'doctor',
            isBanned: { $ne: true },
            'doctorProfile.isApproved': true // only approved doctors
        };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { 'doctorProfile.specializationName': { $regex: search, $options: 'i' } },
                { 'doctorProfile.hospitalAffiliation': { $regex: search, $options: 'i' } },
                { 'doctorProfile.qualifications': { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (specialization && specialization !== 'all') {
            query['doctorProfile.specializationName'] = { $regex: new RegExp(`^${specialization}$`, 'i') };
        }

        if (maxFee) {
            query['doctorProfile.consultationFee'] = { $lte: Number(maxFee) };
        }

        if (minExp) {
            query['doctorProfile.experienceYears'] = { $gte: Number(minExp) };
        }

        if (day && day !== 'all') {
            query['doctorProfile.availableDays'] = day;
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await User.countDocuments(query);
        const doctors = await User.find(query)
            .select('-password')
            .populate('doctorProfile.specialization')
            .sort({ 'doctorProfile.rating.average': -1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        return res.json({
            success: true,
            doctors,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch doctors list' });
    }
});

// Public: Get top rated / featured doctors for homepage
router.get('/featured', async (req, res) => {
    try {
        const doctors = await User.find({
            role: 'doctor',
            isBanned: { $ne: true },
            'doctorProfile.isApproved': true
        })
            .select('-password')
            .populate('doctorProfile.specialization')
            .sort({ 'doctorProfile.rating.average': -1, 'doctorProfile.experienceYears': -1 })
            .limit(6);

        return res.json({ success: true, doctors });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch featured doctors' });
    }
});

// Public: Get single doctor profile by ID
router.get('/:id', async (req, res) => {
    try {
        const doctor = await User.findOne({
            _id: req.params.id,
            role: 'doctor'
        }).select('-password').populate('doctorProfile.specialization');

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        return res.json({ success: true, doctor });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error retrieving doctor profile' });
    }
});

// Doctor: Update schedule, available slots, and consultation settings
router.patch('/schedule/update', verifyJWT, authorizeRoles('doctor'), async (req, res) => {
    try {
        const {
            availableDays,
            availableTimeSlots,
            consultationFee,
            hospitalAffiliation,
            bio,
            qualifications,
            specializationName,
            isAvailableForBooking
        } = req.body;

        const doctor = await User.findById(req.user.id);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ success: false, message: 'Doctor account not found' });
        }

        if (availableDays) doctor.doctorProfile.availableDays = availableDays;
        if (availableTimeSlots) doctor.doctorProfile.availableTimeSlots = availableTimeSlots;
        if (consultationFee !== undefined) doctor.doctorProfile.consultationFee = Number(consultationFee);
        if (hospitalAffiliation !== undefined) doctor.doctorProfile.hospitalAffiliation = hospitalAffiliation;
        if (bio !== undefined) doctor.doctorProfile.bio = bio;
        if (qualifications) doctor.doctorProfile.qualifications = qualifications;
        if (specializationName) doctor.doctorProfile.specializationName = specializationName;
        if (isAvailableForBooking !== undefined) doctor.doctorProfile.isAvailableForBooking = isAvailableForBooking;

        await doctor.save();

        const userObj = doctor.toObject();
        delete userObj.password;

        return res.json({
            success: true,
            message: 'Schedule and profile updated successfully',
            doctor: userObj
        });
    } catch (error) {
        console.error('Error updating doctor schedule:', error);
        return res.status(500).json({ success: false, message: 'Failed to update schedule' });
    }
});

// Admin: List all doctors (including pending verification)
router.get('/admin/all', verifyJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' })
            .select('-password')
            .sort({ createdAt: -1 });

        return res.json({ success: true, doctors });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch doctor applications' });
    }
});

// Admin: Approve or Reject Doctor Application
router.patch('/admin/:id/approval', verifyJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const { isApproved } = req.body;
        const doctor = await User.findById(req.params.id);

        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        doctor.doctorProfile.isApproved = Boolean(isApproved);
        await doctor.save();

        // Send notification to doctor
        await createNotification({
            recipient: doctor._id,
            type: isApproved ? 'DOCTOR_APPROVED' : 'DOCTOR_REJECTED',
            title: isApproved ? 'Doctor Verification Approved' : 'Doctor Verification Status Update',
            message: isApproved
                ? 'Congratulations! Your medical credentials have been verified. You can now accept patient bookings.'
                : 'Your doctor verification application was rejected. Please update your credentials in settings.',
            link: '/dashboard'
        });

        return res.json({
            success: true,
            message: `Doctor status successfully updated to ${isApproved ? 'Approved' : 'Unapproved'}`,
            doctor
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update doctor approval status' });
    }
});

export default router;
