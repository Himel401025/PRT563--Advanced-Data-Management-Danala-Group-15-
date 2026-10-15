import mongoose from 'mongoose';

const specializationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    iconName: {
        type: String,
        default: 'Activity' // Lucide icon identifier
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400'
    },
    popularSymptoms: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Specialization = mongoose.model('Specialization', specializationSchema);
export default Specialization;
