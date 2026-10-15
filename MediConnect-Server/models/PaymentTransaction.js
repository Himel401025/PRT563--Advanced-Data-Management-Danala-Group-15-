import mongoose from 'mongoose';

const paymentTransactionSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
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
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'AUD' // or 'USD'
    },
    paymentGateway: {
        type: String,
        enum: ['PayPal', 'Stripe', 'SSLCommerz', 'Manual'],
        default: 'PayPal'
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentGatewayResponse: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

const PaymentTransaction = mongoose.model('PaymentTransaction', paymentTransactionSchema);
export default PaymentTransaction;
