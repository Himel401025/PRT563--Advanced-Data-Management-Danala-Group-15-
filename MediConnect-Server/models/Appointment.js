import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specializationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialization'
    },
    specializationName: {
        type: String,
        default: 'General Consultation'
    },
    appointmentDate: {
        type: String, // Format: YYYY-MM-DD
        required: true
    },
    timeSlot: {
        type: String, // e.g. "09:00 AM - 09:30 AM"
        required: true
    },
    consultationType: {
        type: String,
        enum: ['in-person', 'video'],
        default: 'in-person'
    },
    consultationFee: {
        type: Number,
        required: true,
        default: 50
    },
    reasonForVisit: {
        type: String,
        required: true,
        trim: true
    },
    symptoms: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    },
    paymentDetails: {
        transactionId: { type: String, default: '' },
        paymentGateway: { type: String, default: 'PayPal' },
        paidAmount: { type: Number, default: 0 },
        paidAt: { type: Date }
    },
    meetingLink: {
        type: String,
        default: ''
    },
    doctorNotes: {
        type: String,
        default: ''
    },
    cancellationDetails: {
        cancelledBy: { type: String, enum: ['patient', 'doctor', 'admin', null], default: null },
        reason: { type: String, default: '' },
        cancelledAt: { type: Date }
    }
}, {
    timestamps: true
});

// Index to prevent duplicate bookings for the same doctor, date, and timeslot unless cancelled
appointmentSchema.index({ doctorId: 1, appointmentDate: 1, timeSlot: 1, status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
