import express from 'express';
import Appointment from '../models/Appointment.js';
import PaymentTransaction from '../models/PaymentTransaction.js';
import User from '../models/User.js';
import { verifyJWT, authorizeRoles } from '../middleware/authMiddleware.js';
import { createNotification } from '../utils/notificationHelper.js';

const router = express.Router();

// 1. Create PayPal Sandbox Order
router.post('/create-paypal-order', verifyJWT, async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointment = await Appointment.findById(appointmentId)
            .populate('doctorId', 'name email phone doctorProfile avatar')
            .populate('patientId', 'name email phone patientProfile address avatar');

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        const fee = appointment.consultationFee || 50;

        return res.json({
            success: true,
            orderData: {
                appointmentId: appointment._id,
                amount: fee,
                currency: 'USD',
                description: `Medical Consultation - Dr. ${appointment.doctorId.name} (${appointment.specializationName})`
            }
        });
    } catch (error) {
        console.error('Error creating PayPal order:', error);
        return res.status(500).json({ success: false, message: 'Failed to initialize PayPal order' });
    }
});

// 2. Capture PayPal Sandbox Order
router.post('/capture-paypal-order', verifyJWT, async (req, res) => {
    try {
        const { appointmentId, orderID, paymentDetails = {} } = req.body;

        const appointment = await Appointment.findById(appointmentId)
            .populate('doctorId', 'name email phone doctorProfile avatar')
            .populate('patientId', 'name email phone patientProfile address avatar');

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        const finalTxId = orderID || `PAYPAL-SB-${Date.now()}`;

        // Create transaction audit log
        const transaction = new PaymentTransaction({
            appointmentId: appointment._id,
            patientId: appointment.patientId._id,
            doctorId: appointment.doctorId._id,
            amount: appointment.consultationFee,
            currency: 'USD',
            paymentGateway: 'PayPal',
            transactionId: finalTxId,
            status: 'success',
            paymentGatewayResponse: paymentDetails
        });
        await transaction.save();

        // Mark appointment as paid and confirmed
        appointment.paymentStatus = 'paid';
        appointment.status = 'confirmed';
        appointment.paymentDetails = {
            transactionId: finalTxId,
            paymentGateway: 'PayPal',
            paidAmount: appointment.consultationFee,
            paidAt: new Date()
        };
        await appointment.save();

        // Notify Doctor
        await createNotification({
            recipient: appointment.doctorId._id,
            sender: req.user.id,
            type: 'PAYMENT_SUCCESS',
            title: 'PayPal Payment Received',
            message: `${appointment.patientId.name} paid $${appointment.consultationFee} via PayPal Sandbox for appointment on ${appointment.appointmentDate}.`,
            link: '/dashboard'
        });

        // Notify Patient
        await createNotification({
            recipient: appointment.patientId._id,
            type: 'PAYMENT_SUCCESS',
            title: 'PayPal Payment Confirmed',
            message: `Your payment of $${appointment.consultationFee} for Dr. ${appointment.doctorId.name} was successfully captured via PayPal (ID: ${finalTxId}).`,
            link: '/dashboard'
        });

        return res.json({
            success: true,
            message: 'PayPal payment captured and appointment confirmed successfully',
            appointment,
            transaction
        });
    } catch (error) {
        console.error('Error capturing PayPal order:', error);
        return res.status(500).json({ success: false, message: 'Failed to capture PayPal payment' });
    }
});

// 3. Fallback / Direct Confirmation
router.post('/confirm', verifyJWT, async (req, res) => {
    try {
        const { appointmentId, transactionId, paymentGateway = 'PayPal', paymentDetails = {} } = req.body;

        const appointment = await Appointment.findById(appointmentId)
            .populate('doctorId', 'name email phone doctorProfile avatar')
            .populate('patientId', 'name email phone patientProfile address avatar');

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        const finalTxId = transactionId || `TXN-${Date.now()}`;

        const transaction = new PaymentTransaction({
            appointmentId: appointment._id,
            patientId: appointment.patientId._id,
            doctorId: appointment.doctorId._id,
            amount: appointment.consultationFee,
            currency: 'USD',
            paymentGateway,
            transactionId: finalTxId,
            status: 'success',
            paymentGatewayResponse: paymentDetails
        });
        await transaction.save();

        appointment.paymentStatus = 'paid';
        if (appointment.status === 'pending') {
            appointment.status = 'confirmed';
        }
        appointment.paymentDetails = {
            transactionId: finalTxId,
            paymentGateway,
            paidAmount: appointment.consultationFee,
            paidAt: new Date()
        };
        await appointment.save();

        return res.json({
            success: true,
            message: 'Payment completed and appointment confirmed successfully',
            appointment,
            transaction
        });
    } catch (error) {
        console.error('Payment Confirmation Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to process payment confirmation' });
    }
});

// 4. Patient / Doctor: Get transaction history (Full Patient & Doctor details for invoices)
router.get('/my-transactions', verifyJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        let query = {};
        if (user.role === 'patient') {
            query.patientId = userId;
        } else if (user.role === 'doctor') {
            query.doctorId = userId;
        }

        const transactions = await PaymentTransaction.find(query)
            .populate({
                path: 'appointmentId',
                populate: [
                    { path: 'patientId', select: 'name email phone address patientProfile avatar' },
                    { path: 'doctorId', select: 'name email phone address doctorProfile avatar' }
                ]
            })
            .populate('patientId', 'name email phone address patientProfile avatar')
            .populate('doctorId', 'name email phone address doctorProfile avatar')
            .sort({ createdAt: -1 });

        return res.json({ success: true, transactions });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to retrieve transactions' });
    }
});

// 5. Admin: All transactions
router.get('/admin/all', verifyJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const transactions = await PaymentTransaction.find()
            .populate({
                path: 'appointmentId',
                populate: [
                    { path: 'patientId', select: 'name email phone address patientProfile avatar' },
                    { path: 'doctorId', select: 'name email phone address doctorProfile avatar' }
                ]
            })
            .populate('patientId', 'name email phone address patientProfile avatar')
            .populate('doctorId', 'name email phone address doctorProfile avatar')
            .sort({ createdAt: -1 });

        const totalRevenue = transactions
            .filter(t => t.status === 'success')
            .reduce((sum, t) => sum + t.amount, 0);

        return res.json({ success: true, totalRevenue, transactions });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to retrieve all transactions' });
    }
});

export default router;
