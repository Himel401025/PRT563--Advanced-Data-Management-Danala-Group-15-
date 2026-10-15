import express from 'express';
import MedicalRecord from '../models/MedicalRecord.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { verifyJWT, authorizeRoles } from '../middleware/authMiddleware.js';
import { createNotification } from '../utils/notificationHelper.js';

const router = express.Router();

// Doctor: Create or update a medical record & prescription
router.post('/', verifyJWT, authorizeRoles('doctor', 'admin'), async (req, res) => {
    try {
        const {
            appointmentId,
            diagnosis,
            symptoms,
            vitalSigns,
            prescriptions,
            labTestsRecommended,
            doctorAdvice,
            followUpDate
        } = req.body;

        if (!appointmentId || !diagnosis) {
            return res.status(400).json({ success: false, message: 'Appointment ID and diagnosis are required' });
        }

        const appointment = await Appointment.findById(appointmentId)
            .populate('patientId', 'name email')
            .populate('doctorId', 'name email');

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Associated appointment not found' });
        }

        // Verify that the logged-in doctor is the treating doctor
        if (req.user.role !== 'admin' && appointment.doctorId._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Only the attending doctor can issue a medical record' });
        }

        let record = await MedicalRecord.findOne({ appointmentId });
        if (record) {
            // Update existing record
            record.diagnosis = diagnosis;
            if (symptoms !== undefined) record.symptoms = symptoms;
            if (vitalSigns) record.vitalSigns = vitalSigns;
            if (prescriptions) record.prescriptions = prescriptions;
            if (labTestsRecommended) record.labTestsRecommended = labTestsRecommended;
            if (doctorAdvice !== undefined) record.doctorAdvice = doctorAdvice;
            if (followUpDate !== undefined) record.followUpDate = followUpDate;
            await record.save();
        } else {
            // Create new record
            record = new MedicalRecord({
                patientId: appointment.patientId._id,
                doctorId: appointment.doctorId._id,
                appointmentId,
                diagnosis,
                symptoms: symptoms || appointment.symptoms,
                vitalSigns: vitalSigns || {},
                prescriptions: prescriptions || [],
                labTestsRecommended: labTestsRecommended || [],
                doctorAdvice: doctorAdvice || '',
                followUpDate: followUpDate || ''
            });
            await record.save();

            // Mark appointment as completed
            appointment.status = 'completed';
            await appointment.save();

            // Notify patient
            await createNotification({
                recipient: appointment.patientId._id,
                sender: req.user.id,
                type: 'RECORD_ADDED',
                title: 'New Prescription & Medical Record',
                message: `Dr. ${appointment.doctorId.name} has published your clinical report and prescription.`,
                link: '/dashboard'
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Medical record and prescription saved successfully',
            record
        });
    } catch (error) {
        console.error('Error saving medical record:', error);
        return res.status(500).json({ success: false, message: 'Failed to save medical record', error: error.message });
    }
});

// Patient: Get all personal medical records
router.get('/my-records', verifyJWT, async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patientId: req.user.id })
            .populate('doctorId', 'name email doctorProfile avatar')
            .populate('appointmentId')
            .sort({ createdAt: -1 });

        return res.json({ success: true, records });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to retrieve personal medical records' });
    }
});

// Doctor/Admin/Patient: Get medical records for a specific patient
router.get('/patient/:patientId', verifyJWT, async (req, res) => {
    try {
        const { patientId } = req.params;
        const currentUserId = req.user.id;

        // Authorization: Current user must be the patient, a doctor, or an admin
        if (req.user.role === 'patient' && currentUserId !== patientId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to view other patient records' });
        }

        const records = await MedicalRecord.find({ patientId })
            .populate('doctorId', 'name email doctorProfile avatar')
            .populate('appointmentId')
            .sort({ createdAt: -1 });

        return res.json({ success: true, records });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch patient history' });
    }
});

// Get record for a single appointment
router.get('/appointment/:appointmentId', verifyJWT, async (req, res) => {
    try {
        const record = await MedicalRecord.findOne({ appointmentId: req.params.appointmentId })
            .populate('doctorId', 'name email doctorProfile avatar')
            .populate('patientId', 'name email phone patientProfile')
            .populate('appointmentId');

        if (!record) {
            return res.status(404).json({ success: false, message: 'No medical record found for this appointment' });
        }

        return res.json({ success: true, record });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch appointment record' });
    }
});

export default router;
