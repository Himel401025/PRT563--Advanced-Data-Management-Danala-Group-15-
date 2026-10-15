import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient'
    },
    phone: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    },
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        zipCode: { type: String, default: '' },
        country: { type: String, default: 'Australia' }
    },
    // Patient-specific fields
    patientProfile: {
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'], default: 'Prefer not to say' },
        bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'], default: 'Unknown' },
        emergencyContact: {
            name: { type: String, default: '' },
            relation: { type: String, default: '' },
            phone: { type: String, default: '' }
        },
        allergies: [{ type: String }],
        chronicConditions: [{ type: String }],
        medicalHistorySummary: { type: String, default: '' }
    },
    // Doctor-specific fields
    doctorProfile: {
        specialization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Specialization'
        },
        specializationName: { type: String, default: 'General Medicine' },
        licenseNumber: { type: String, default: '' },
        qualifications: [{ type: String }], // e.g. ['MBBS', 'MD Cardiology', 'FRACP']
        experienceYears: { type: Number, default: 0 },
        hospitalAffiliation: { type: String, default: '' },
        bio: { type: String, default: '' },
        consultationFee: { type: Number, default: 50 },
        availableDays: {
            type: [String],
            default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        availableTimeSlots: {
            type: [String],
            default: [
                '09:00 AM - 09:30 AM',
                '09:30 AM - 10:00 AM',
                '10:00 AM - 10:30 AM',
                '10:30 AM - 11:00 AM',
                '02:00 PM - 02:30 PM',
                '02:30 PM - 03:00 PM',
                '03:00 PM - 03:30 PM',
                '03:30 PM - 04:00 PM'
            ]
        },
        rating: {
            average: { type: Number, default: 5.0 },
            count: { type: Number, default: 1 }
        },
        isApproved: { type: Boolean, default: false },
        isAvailableForBooking: { type: Boolean, default: true },
        verificationDocuments: [{ type: String }]
    },
    isBanned: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for fast search
userSchema.index({ name: 'text', 'doctorProfile.specializationName': 'text', 'doctorProfile.hospitalAffiliation': 'text' });

const User = mongoose.model('User', userSchema);
export default User;
