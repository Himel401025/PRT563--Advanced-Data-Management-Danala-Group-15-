import express from 'express';
import Specialization from '../models/Specialization.js';
import { verifyJWT, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get all active specializations
router.get('/', async (req, res) => {
    try {
        let specializations = await Specialization.find({ isActive: true }).sort({ name: 1 });
        
        // If empty, auto-seed default medical specializations
        if (specializations.length === 0) {
            const defaults = [
                {
                    name: 'General Medicine',
                    description: 'Primary healthcare, physical checkups, fever, diabetes, and preventive care.',
                    iconName: 'Stethoscope',
                    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
                    popularSymptoms: ['Fever', 'Fatigue', 'Headache', 'Cough']
                },
                {
                    name: 'Cardiology',
                    description: 'Heart health, blood pressure management, ECGs, and cardiovascular therapy.',
                    iconName: 'HeartPulse',
                    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400',
                    popularSymptoms: ['Chest Pain', 'Shortness of Breath', 'High Blood Pressure', 'Palpitations']
                },
                {
                    name: 'Dermatology',
                    description: 'Skin conditions, acne treatment, allergy evaluation, hair and nail care.',
                    iconName: 'Sparkles',
                    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400',
                    popularSymptoms: ['Skin Rash', 'Acne', 'Itching', 'Hair Loss']
                },
                {
                    name: 'Pediatrics',
                    description: 'Specialized healthcare, developmental tracking, and immunizations for children.',
                    iconName: 'Baby',
                    image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400',
                    popularSymptoms: ['Child Fever', 'Ear Infection', 'Growth Milestones', 'Vaccinations']
                },
                {
                    name: 'Orthopedics',
                    description: 'Bone, joint, spine disorders, sports injuries, and arthritis management.',
                    iconName: 'Bone',
                    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400',
                    popularSymptoms: ['Joint Pain', 'Back Pain', 'Fracture Recovery', 'Knee Stiffness']
                },
                {
                    name: 'Neurology',
                    description: 'Nervous system, chronic migraines, sleep disorders, and brain health.',
                    iconName: 'Brain',
                    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400',
                    popularSymptoms: ['Severe Migraine', 'Dizziness', 'Numbness', 'Memory Issues']
                },
                {
                    name: 'Gynecology',
                    description: "Women's health, pregnancy care, reproductive health, and hormone therapy.",
                    iconName: 'HeartHandshake',
                    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400',
                    popularSymptoms: ['Irregular Periods', 'Pregnancy Checkup', 'Pelvic Pain', 'Hormonal Imbalance']
                },
                {
                    name: 'Ophthalmology',
                    description: 'Vision testing, eye infections, cataract evaluation, and laser eye care.',
                    iconName: 'Eye',
                    image: 'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?auto=format&fit=crop&q=80&w=400',
                    popularSymptoms: ['Blurred Vision', 'Dry Eyes', 'Eye Redness', 'Eye Strain']
                }
            ];
            specializations = await Specialization.insertMany(defaults);
        }

        return res.json({ success: true, specializations });
    } catch (error) {
        console.error('Error fetching specializations:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch specializations' });
    }
});

// Admin: Create specialization
router.post('/', verifyJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const { name, description, iconName, image, popularSymptoms } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Specialization name is required' });
        }

        const existing = await Specialization.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Specialization already exists' });
        }

        const spec = new Specialization({
            name,
            description,
            iconName: iconName || 'Activity',
            image: image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400',
            popularSymptoms: popularSymptoms || []
        });

        await spec.save();
        return res.status(201).json({ success: true, message: 'Specialization created successfully', specialization: spec });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to create specialization', error: error.message });
    }
});

// Admin: Update specialization
router.put('/:id', verifyJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const spec = await Specialization.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!spec) return res.status(404).json({ success: false, message: 'Specialization not found' });
        return res.json({ success: true, message: 'Specialization updated', specialization: spec });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update specialization' });
    }
});

export default router;
