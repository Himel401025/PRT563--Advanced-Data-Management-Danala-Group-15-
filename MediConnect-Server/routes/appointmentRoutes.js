import express from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { verifyJWT, authorizeRoles } from '../middleware/authMiddleware.js';
import { createNotification } from '../utils/notificationHelper.js';

const router = express.Router();

// Public / Patient: Check booked slots for a specific doctor on a given date
router.get('/booked-slots', async (req, res) => {
    try {
        const { doctorId, date } = req.query;
        if (!doctorId || !date) {
            return res.status(400).json({ success: false, message: 'doctorId and date query parameters are required' });
        }

        const bookedAppointments = await Appointment.find({
            doctorId,
            appointmentDate: date,
            status: { $in: ['pending', 'confirmed'] } // Only active/held slots
        }).select('timeSlot');

        const bookedSlots = bookedAppointments.map(a => a.timeSlot);
        return res.json({ success: true, bookedSlots });
    } catch (error) {
        console.error('Error fetching booked slots:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve booked slots' });
    }
});

// Patient: Book an appointment
router.post('/', verifyJWT, async (req, res) => {
    try {
        const {
            doctorId,
            appointmentDate,
            timeSlot,
            consultationType = 'in-person',
            reasonForVisit,
            symptoms = ''
        } = req.body;

        const patientId = req.user.id;

        if (!doctorId || !appointmentDate || !timeSlot || !reasonForVisit) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID, appointment date, time slot, and reason for visit are required.'
            });
        }

        const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Check if doctor is approved
        if (!doctor.doctorProfile?.isApproved) {
            return res.status(400).json({ success: false, message: 'This doctor is not currently approved for bookings.' });
        }

        // Check for slot collision
        const existingAppointment = await Appointment.findOne({
            doctorId,
            appointmentDate,
            timeSlot,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existingAppointment) {
            return res.status(409).json({
                success: false,
                message: 'This time slot is already booked. Please choose a different slot.'
            });
        }

        const patient = await User.findById(patientId);

        const newAppointment = new Appointment({
            patientId,
            doctorId,
            specializationId: doctor.doctorProfile?.specialization,
            specializationName: doctor.doctorProfile?.specializationName || 'General Consultation',
            appointmentDate,
            timeSlot,
            consultationType,
            consultationFee: doctor.doctorProfile?.consultationFee || 50,
            reasonForVisit,
            symptoms,
            status: 'pending',
            paymentStatus: 'unpaid',
            meetingLink: consultationType === 'video' ? `https://meet.jit.si/mediconnect-${Date.now()}` : ''
        });

        await newAppointment.save();

        // Send notification to Doctor
        await createNotification({
            recipient: doctorId,
            sender: patientId,
            type: 'APPOINTMENT_BOOKED',
            title: 'New Appointment Booking',
            message: `${patient.name} requested an appointment on ${appointmentDate} at ${timeSlot}.`,
            link: '/dashboard'
        });

        // Send confirmation notification to Patient
        await createNotification({
            recipient: patientId,
            sender: doctorId,
            type: 'APPOINTMENT_BOOKED',
            title: 'Appointment Request Submitted',
            message: `Your appointment with Dr. ${doctor.name} on ${appointmentDate} at ${timeSlot} is pending confirmation.`,
            link: '/dashboard'
        });

        return res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            appointment: newAppointment
        });
    } catch (error) {
        console.error('Booking Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to book appointment', error: error.message });
    }
});

// Get appointments for the logged in user (Patient or Doctor)
router.get('/my-appointments', verifyJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const { status } = req.query;

        let query = {};
        if (user.role === 'doctor') {
            query.doctorId = userId;
        } else if (user.role === 'patient') {
            query.patientId = userId;
        } else if (user.role === 'admin') {
            // Admin can view all
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        const appointments = await Appointment.find(query)
            .populate('patientId', 'name email phone avatar patientProfile')
            .populate('doctorId', 'name email phone avatar doctorProfile')
            .sort({ appointmentDate: -1, createdAt: -1 });

        return res.json({ success: true, appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve appointments' });
    }
});

// Get single appointment by ID
router.get('/:id', verifyJWT, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patientId', 'name email phone avatar address patientProfile')
            .populate('doctorId', 'name email phone avatar doctorProfile');

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Check if user is patient, doctor, or admin
        const userId = req.user.id.toString();
        const isParticipant = appointment.patientId._id.toString() === userId ||
            appointment.doctorId._id.toString() === userId ||
            req.user.role === 'admin';

        if (!isParticipant) {
            return res.status(403).json({ success: false, message: 'Access denied to this appointment' });
        }

        return res.json({ success: true, appointment });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to retrieve appointment details' });
    }
});

// Update appointment status (Confirm, Complete, Cancel)
router.patch('/:id/status', verifyJWT, async (req, res) => {
    try {
        const { status, reason, doctorNotes } = req.body;
        const appointment = await Appointment.findById(req.params.id)
            .populate('patientId', 'name email')
            .populate('doctorId', 'name email');

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        const userId = req.user.id.toString();
        const isPatient = appointment.patientId._id.toString() === userId;
        const isDoctor = appointment.doctorId._id.toString() === userId;
        const isAdmin = req.user.role === 'admin';

        if (!isPatient && !isDoctor && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Unauthorized to modify this appointment' });
        }

        if (status === 'cancelled') {
            appointment.status = 'cancelled';
            appointment.cancellationDetails = {
                cancelledBy: isPatient ? 'patient' : (isDoctor ? 'doctor' : 'admin'),
                reason: reason || 'Cancelled by user',
                cancelledAt: new Date()
            };

            // Notify counterpart
            const recipientId = isPatient ? appointment.doctorId._id : appointment.patientId._id;
            await createNotification({
                recipient: recipientId,
                sender: req.user.id,
                type: 'APPOINTMENT_CANCELLED',
                title: 'Appointment Cancelled',
                message: `Appointment on ${appointment.appointmentDate} (${appointment.timeSlot}) was cancelled. Reason: ${reason || 'N/A'}`,
                link: '/dashboard'
            });
        } else if (status === 'confirmed' && (isDoctor || isAdmin)) {
            appointment.status = 'confirmed';
            await createNotification({
                recipient: appointment.patientId._id,
                sender: req.user.id,
                type: 'APPOINTMENT_CONFIRMED',
                title: 'Appointment Confirmed!',
                message: `Dr. ${appointment.doctorId.name} confirmed your appointment on ${appointment.appointmentDate} at ${appointment.timeSlot}.`,
                link: '/dashboard'
            });
        } else if (status === 'completed' && (isDoctor || isAdmin)) {
            appointment.status = 'completed';
            if (doctorNotes) appointment.doctorNotes = doctorNotes;
            await createNotification({
                recipient: appointment.patientId._id,
                sender: req.user.id,
                type: 'APPOINTMENT_COMPLETED',
                title: 'Consultation Completed',
                message: `Your consultation with Dr. ${appointment.doctorId.name} has been marked complete. Check your medical records for prescriptions and notes.`,
                link: '/dashboard'
            });
        }

        await appointment.save();
        return res.json({ success: true, message: `Appointment status updated to ${status}`, appointment });
    } catch (error) {
        console.error('Status Update Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update appointment status' });
    }
});

// Admin: System-wide appointment analytics and list
router.get('/admin/overview', verifyJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
        const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
        const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
        const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

        const appointments = await Appointment.find()
            .populate('patientId', 'name email')
            .populate('doctorId', 'name email doctorProfile')
            .sort({ createdAt: -1 })
            .limit(50);

        return res.json({
            success: true,
            stats: {
                totalAppointments,
                pendingAppointments,
                confirmedAppointments,
                completedAppointments,
                cancelledAppointments
            },
            appointments
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch admin overview' });
    }
});

export default router;
