import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: [
            'APPOINTMENT_BOOKED',
            'APPOINTMENT_CONFIRMED',
            'APPOINTMENT_CANCELLED',
            'APPOINTMENT_COMPLETED',
            'RECORD_ADDED',
            'PAYMENT_SUCCESS',
            'DOCTOR_APPROVED',
            'DOCTOR_REJECTED',
            'REMINDER_APPOINTMENT',
            'GENERAL'
        ],
        default: 'GENERAL'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: '/dashboard'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
