import mongoose from 'mongoose';

const prescriptionItemSchema = new mongoose.Schema({
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true }, // e.g. "500mg", "1 tablet"
    frequency: { type: String, required: true }, // e.g. "1-0-1 (Twice daily after meals)"
    duration: { type: String, required: true }, // e.g. "7 days"
    instructions: { type: String, default: '' } // e.g. "Take with water"
}, { _id: false });

const medicalRecordSchema = new mongoose.Schema({
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
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    diagnosis: {
        type: String,
        required: true,
        trim: true
    },
    symptoms: {
        type: String,
        default: ''
    },
    vitalSigns: {
        bloodPressure: { type: String, default: '' }, // e.g. "120/80 mmHg"
        pulseRate: { type: String, default: '' }, // e.g. "72 bpm"
        temperature: { type: String, default: '' }, // e.g. "98.6 F"
        weight: { type: String, default: '' }, // e.g. "70 kg"
        height: { type: String, default: '' }, // e.g. "175 cm"
        respiratoryRate: { type: String, default: '' }
    },
    prescriptions: [prescriptionItemSchema],
    labTestsRecommended: [{
        type: String
    }],
    doctorAdvice: {
        type: String,
        default: ''
    },
    followUpDate: {
        type: String, // YYYY-MM-DD
        default: ''
    },
    attachments: [{
        title: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
export default MedicalRecord;
