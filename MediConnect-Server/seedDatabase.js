import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import User from './models/User.js';
import Specialization from './models/Specialization.js';
import Appointment from './models/Appointment.js';
import MedicalRecord from './models/MedicalRecord.js';
import PaymentTransaction from './models/PaymentTransaction.js';
import Notification from './models/Notification.js';

const seed = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        console.log('Connecting to MongoDB for rich database reseeding (In-Person Clinical)...');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000, family: 4 });
        console.log('Connected to MongoDB Atlas.');

        // 1. Clear all existing collections
        console.log('Clearing old collections...');
        await Promise.all([
            User.deleteMany({}),
            Specialization.deleteMany({}),
            Appointment.deleteMany({}),
            MedicalRecord.deleteMany({}),
            PaymentTransaction.deleteMany({}),
            Notification.deleteMany({})
        ]);

        // 2. Seed Specializations
        console.log('Seeding 8 Medical Specializations...');
        const specializationsData = [
            {
                name: 'Cardiology',
                description: 'Heart disease diagnosis, hypertension management, ECG/Echo evaluation, and preventative cardiovascular health.',
                iconName: 'HeartPulse',
                image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400',
                popularSymptoms: ['Chest Pain', 'Shortness of Breath', 'Palpitations', 'High Blood Pressure', 'Dizziness']
            },
            {
                name: 'Dermatology',
                description: 'Specialized clinical dermatology, acne, eczema, psoriasis, skin cancer screenings, and laser treatments.',
                iconName: 'Sparkles',
                image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400',
                popularSymptoms: ['Skin Rash', 'Acne Scars', 'Severe Itching', 'Psoriasis', 'Hair Loss', 'Skin Lesions']
            },
            {
                name: 'Pediatrics',
                description: 'Comprehensive infant, child, and adolescent healthcare, growth milestone tracking, and pediatric vaccinations.',
                iconName: 'Baby',
                image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400',
                popularSymptoms: ['Childhood Fever', 'Ear Ache', 'Growth Milestones', 'Vaccinations', 'Colic', 'Cough']
            },
            {
                name: 'Orthopedics',
                description: 'Bone, joint, spine, and ligament care, sports injury rehabilitation, arthroscopic surgery, and joint replacement.',
                iconName: 'Bone',
                image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400',
                popularSymptoms: ['Joint Pain', 'Lower Back Pain', 'Fractures', 'Knee Stiffness', 'Sports Injury', 'Sciatica']
            },
            {
                name: 'General Medicine',
                description: 'Primary medical care, routine physicals, pathology reviews, chronic disease control, and holistic family health.',
                iconName: 'Stethoscope',
                image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
                popularSymptoms: ['Fever', 'Fatigue', 'Persistent Headache', 'Cold & Flu', 'Blood Pressure Check']
            },
            {
                name: 'Neurology',
                description: 'Disorders of the brain, spinal cord, and peripheral nerves, migraine therapy, and cognitive health.',
                iconName: 'Brain',
                image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400',
                popularSymptoms: ['Severe Migraines', 'Numbness', 'Tremors', 'Seizures', 'Memory Impairment', 'Sleep Disorders']
            },
            {
                name: 'Gynecology',
                description: 'Obstetrics, prenatal care, women reproductive health, fertility assessments, and hormonal balancing.',
                iconName: 'Activity',
                image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400',
                popularSymptoms: ['Irregular Periods', 'Prenatal Care', 'Pelvic Pain', 'Hormonal Imbalance', 'PCOS']
            },
            {
                name: 'Ophthalmology',
                description: 'Comprehensive eye care, cataract evaluation, vision correction, retina care, and glaucoma management.',
                iconName: 'Eye',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400',
                popularSymptoms: ['Blurred Vision', 'Eye Strain', 'Dry Eyes', 'Redness', 'Glaucoma Checkup']
            }
        ];

        const insertedSpecializations = await Specialization.insertMany(specializationsData);
        const specMap = {};
        insertedSpecializations.forEach(s => { specMap[s.name] = s._id; });

        // Hash default passwords
        const adminPass = await bcrypt.hash('admin123', 10);
        const doctorPass = await bcrypt.hash('doctor123', 10);
        const patientPass = await bcrypt.hash('patient123', 10);

        // 3. Seed Users
        console.log('Seeding Admin, Doctors, and Patients...');

        // 3.1 Admin
        const adminUser = new User({
            name: 'Clinic Administrator',
            email: 'admin@mediconnect.com',
            password: adminPass,
            role: 'admin',
            phone: '+61 (08) 8946 6666',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
            address: { street: 'CDU Health Precinct, Ellengowan Dr', city: 'Darwin', state: 'NT', country: 'Australia' }
        });
        await adminUser.save();

        // 3.2 Doctors
        const doctorsData = [
            {
                name: 'Emily Watson',
                email: 'dr.watson@mediconnect.com',
                password: doctorPass,
                role: 'doctor',
                phone: '+61 411 222 331',
                avatar: 'https://images.unsplash.com/photo-1594824813680-e88df2998a6a?auto=format&fit=crop&q=80&w=400',
                doctorProfile: {
                    specialization: specMap['Cardiology'],
                    specializationName: 'Cardiology',
                    licenseNumber: 'MED-AU-90214',
                    qualifications: ['MBBS (Sydney)', 'MD Cardiology', 'FRACP'],
                    experienceYears: 12,
                    hospitalAffiliation: 'Royal Darwin Heart Institute',
                    bio: 'Senior consultant cardiologist specializing in preventative cardiac care, hypertension control, and non-invasive diagnostic ECG/Echo analysis.',
                    consultationFee: 75,
                    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    availableTimeSlots: [
                        '09:00 AM - 09:30 AM',
                        '09:30 AM - 10:00 AM',
                        '10:00 AM - 10:30 AM',
                        '11:00 AM - 11:30 AM',
                        '02:00 PM - 02:30 PM',
                        '03:00 PM - 03:30 PM'
                    ],
                    rating: { average: 4.9, count: 142 },
                    isApproved: true,
                    isAvailableForBooking: true
                }
            },
            {
                name: 'Sophia Chen',
                email: 'dr.chen@mediconnect.com',
                password: doctorPass,
                role: 'doctor',
                phone: '+61 411 222 332',
                avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
                doctorProfile: {
                    specialization: specMap['Dermatology'],
                    specializationName: 'Dermatology',
                    licenseNumber: 'MED-AU-77610',
                    qualifications: ['MD Dermatology', 'FACD (Australasian College of Dermatologists)'],
                    experienceYears: 10,
                    hospitalAffiliation: 'Metropolitan Skin & Laser Clinic',
                    bio: 'Specialist dermatologist offering clinical diagnosis for complex skin rashes, acne scar reduction, eczema, and allergy evaluation.',
                    consultationFee: 80,
                    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    availableTimeSlots: [
                        '09:00 AM - 09:30 AM',
                        '10:00 AM - 10:30 AM',
                        '01:30 PM - 02:00 PM',
                        '02:30 PM - 03:00 PM',
                        '03:30 PM - 04:00 PM'
                    ],
                    rating: { average: 5.0, count: 120 },
                    isApproved: true,
                    isAvailableForBooking: true
                }
            },
            {
                name: 'Marcus Hayes',
                email: 'dr.marcus@mediconnect.com',
                password: doctorPass,
                role: 'doctor',
                phone: '+61 411 222 333',
                avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
                doctorProfile: {
                    specialization: specMap['Pediatrics'],
                    specializationName: 'Pediatrics',
                    licenseNumber: 'MED-AU-84192',
                    qualifications: ['MBBS (Melbourne)', 'DCH (Child Health)', 'FRACP'],
                    experienceYears: 8,
                    hospitalAffiliation: "Children's Health & Wellness Centre",
                    bio: 'Dedicated pediatrician passionate about childhood development, early diagnosis of pediatric infections, and compassionate care.',
                    consultationFee: 60,
                    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
                    availableTimeSlots: [
                        '09:30 AM - 10:00 AM',
                        '10:00 AM - 10:30 AM',
                        '10:30 AM - 11:00 AM',
                        '02:30 PM - 03:00 PM',
                        '03:30 PM - 04:00 PM'
                    ],
                    rating: { average: 4.8, count: 98 },
                    isApproved: true,
                    isAvailableForBooking: true
                }
            },
            {
                name: 'James Wilson',
                email: 'dr.james@mediconnect.com',
                password: doctorPass,
                role: 'doctor',
                phone: '+61 411 222 334',
                avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
                doctorProfile: {
                    specialization: specMap['Orthopedics'],
                    specializationName: 'Orthopedics',
                    licenseNumber: 'MED-AU-55219',
                    qualifications: ['MBBS', 'MS Ortho', 'FRACS (Ortho)'],
                    experienceYears: 15,
                    hospitalAffiliation: 'Northern Territory Joint & Spine Centre',
                    bio: 'Orthopedic surgeon and joint specialist focusing on arthroscopic knee repair, spine stabilization, and post-injury sports recovery.',
                    consultationFee: 90,
                    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
                    availableTimeSlots: [
                        '09:00 AM - 09:30 AM',
                        '10:00 AM - 10:30 AM',
                        '11:00 AM - 11:30 AM',
                        '02:00 PM - 02:30 PM'
                    ],
                    rating: { average: 4.9, count: 165 },
                    isApproved: true,
                    isAvailableForBooking: true
                }
            },
            {
                name: 'Sarah Jenkins',
                email: 'dr.sarah@mediconnect.com',
                password: doctorPass,
                role: 'doctor',
                phone: '+61 411 222 335',
                avatar: 'https://images.unsplash.com/photo-1594824813680-e88df2998a6a?auto=format&fit=crop&q=80&w=400',
                doctorProfile: {
                    specialization: specMap['General Medicine'],
                    specializationName: 'General Medicine',
                    licenseNumber: 'MED-AU-65421',
                    qualifications: ['MBBS', 'FRACGP'],
                    experienceYears: 7,
                    hospitalAffiliation: 'Darwin Community Medical Centre',
                    bio: 'General practitioner offering holistic primary health, seasonal viral management, preventative bloodwork, and routine checkups.',
                    consultationFee: 50,
                    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    availableTimeSlots: [
                        '09:00 AM - 09:30 AM',
                        '09:30 AM - 10:00 AM',
                        '10:00 AM - 10:30 AM',
                        '11:00 AM - 11:30 AM',
                        '02:00 PM - 02:30 PM',
                        '03:00 PM - 03:30 PM'
                    ],
                    rating: { average: 4.7, count: 91 },
                    isApproved: true,
                    isAvailableForBooking: true
                }
            },
            {
                name: 'Olivia Taylor',
                email: 'dr.olivia@mediconnect.com',
                password: doctorPass,
                role: 'doctor',
                phone: '+61 411 222 336',
                avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
                doctorProfile: {
                    specialization: specMap['Gynecology'],
                    specializationName: 'Gynecology',
                    licenseNumber: 'MED-AU-33190',
                    qualifications: ['MD (Obstetrics & Gynecology)', 'FRANZCOG'],
                    experienceYears: 11,
                    hospitalAffiliation: "Darwin Women's Health Clinic",
                    bio: 'Specialist obstetrician and gynecologist offering compassionate prenatal counseling, fertility screening, and hormonal therapy.',
                    consultationFee: 85,
                    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
                    availableTimeSlots: [
                        '09:00 AM - 09:30 AM',
                        '10:00 AM - 10:30 AM',
                        '02:00 PM - 02:30 PM',
                        '03:00 PM - 03:30 PM'
                    ],
                    rating: { average: 5.0, count: 104 },
                    isApproved: true,
                    isAvailableForBooking: true
                }
            },
            // Doctor Pending Approval (to test Admin verification)
            {
                name: 'David Miller',
                email: 'dr.pending@mediconnect.com',
                password: doctorPass,
                role: 'doctor',
                phone: '+61 411 222 337',
                avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
                doctorProfile: {
                    specialization: specMap['Neurology'],
                    specializationName: 'Neurology',
                    licenseNumber: 'MED-PENDING-9941',
                    qualifications: ['MBBS', 'MD Neurology'],
                    experienceYears: 6,
                    hospitalAffiliation: 'St. Vincent Brain Institute',
                    bio: 'Neurologist awaiting credentials audit and verification.',
                    consultationFee: 95,
                    availableDays: ['Monday', 'Thursday'],
                    availableTimeSlots: ['09:00 AM - 09:30 AM', '10:00 AM - 10:30 AM'],
                    rating: { average: 5.0, count: 1 },
                    isApproved: false, // Pending
                    isAvailableForBooking: false
                }
            }
        ];

        const insertedDoctors = await User.insertMany(doctorsData);
        const docMap = {};
        insertedDoctors.forEach(d => { docMap[d.email] = d; });

        // 3.3 Patients
        const patientsData = [
            {
                name: 'John Doe',
                email: 'patient.john@gmail.com',
                password: patientPass,
                role: 'patient',
                phone: '+61 433 111 222',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
                address: { street: '42 Mitchell St', city: 'Darwin', state: 'NT', zipCode: '0800', country: 'Australia' },
                patientProfile: {
                    dateOfBirth: new Date('1992-05-15'),
                    gender: 'Male',
                    bloodGroup: 'O+',
                    emergencyContact: { name: 'Sarah Doe', relation: 'Spouse', phone: '+61 433 111 223' },
                    allergies: ['Penicillin', 'Dust mites'],
                    chronicConditions: ['Mild Asthma'],
                    medicalHistorySummary: 'Annual physical regular. Takes Ventolin as needed for asthma flare-ups.'
                }
            },
            {
                name: 'Emma Wilson',
                email: 'patient.emma@gmail.com',
                password: patientPass,
                role: 'patient',
                phone: '+61 433 444 555',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
                address: { street: '15 Knuckey St', city: 'Darwin', state: 'NT', zipCode: '0800', country: 'Australia' },
                patientProfile: {
                    dateOfBirth: new Date('1996-08-22'),
                    gender: 'Female',
                    bloodGroup: 'A+',
                    emergencyContact: { name: 'David Wilson', relation: 'Brother', phone: '+61 433 444 556' },
                    allergies: ['Peanuts'],
                    chronicConditions: [],
                    medicalHistorySummary: 'Healthy general profile. Occasional migraine symptoms.'
                }
            },
            {
                name: 'Michael Brown',
                email: 'patient.michael@gmail.com',
                password: patientPass,
                role: 'patient',
                phone: '+61 433 777 888',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
                address: { street: '88 Cavenagh St', city: 'Darwin', state: 'NT', zipCode: '0800', country: 'Australia' },
                patientProfile: {
                    dateOfBirth: new Date('1985-11-30'),
                    gender: 'Male',
                    bloodGroup: 'B+',
                    emergencyContact: { name: 'Linda Brown', relation: 'Sister', phone: '+61 433 777 889' },
                    allergies: ['Sulfa drugs'],
                    chronicConditions: ['Pre-diabetic'],
                    medicalHistorySummary: 'Dietary monitoring and regular orthopedic checkups.'
                }
            },
            {
                name: 'Sophia Miller',
                email: 'patient.sophia@gmail.com',
                password: patientPass,
                role: 'patient',
                phone: '+61 433 999 000',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
                address: { street: '12 Esplanade', city: 'Darwin', state: 'NT', zipCode: '0800', country: 'Australia' },
                patientProfile: {
                    dateOfBirth: new Date('1998-03-14'),
                    gender: 'Female',
                    bloodGroup: 'AB+',
                    emergencyContact: { name: 'Robert Miller', relation: 'Father', phone: '+61 433 999 001' },
                    allergies: [],
                    chronicConditions: [],
                    medicalHistorySummary: 'Routine health screenings and gynecology visits.'
                }
            }
        ];

        const insertedPatients = await User.insertMany(patientsData);
        const patientMap = {};
        insertedPatients.forEach(p => { patientMap[p.email] = p; });

        // 4. Seed Appointments & Associated Bookings (100% In-Person Clinical)
        console.log('Seeding 8 Rich In-Person Consultations across all patients and doctors...');

        const appointmentsToInsert = [
            // 4.1 John Doe -> Dr. Emily Watson (Cardiology) - COMPLETED & PAID
            {
                patientId: patientMap['patient.john@gmail.com']._id,
                doctorId: docMap['dr.watson@mediconnect.com']._id,
                specializationId: specMap['Cardiology'],
                specializationName: 'Cardiology',
                appointmentDate: '2026-08-10',
                timeSlot: '09:00 AM - 09:30 AM',
                consultationType: 'in-person',
                consultationFee: 75,
                reasonForVisit: 'Cardiac health screening and mild exertional chest tightness.',
                symptoms: 'Mild shortness of breath on high exertion, resting pulse normal.',
                status: 'completed',
                paymentStatus: 'paid',
                paymentDetails: {
                    transactionId: 'PAYPAL-CARDIO-99124',
                    paymentGateway: 'PayPal',
                    paidAmount: 75,
                    paidAt: new Date('2026-08-10T08:45:00Z')
                },
                doctorNotes: '12-lead ECG normal sinus rhythm. Prescribed beta-blocker and ordered follow-up Echo.'
            },
            // 4.2 John Doe -> Dr. Sophia Chen (Dermatology) - UPCOMING CONFIRMED IN-PERSON
            {
                patientId: patientMap['patient.john@gmail.com']._id,
                doctorId: docMap['dr.chen@mediconnect.com']._id,
                specializationId: specMap['Dermatology'],
                specializationName: 'Dermatology',
                appointmentDate: '2026-08-20',
                timeSlot: '02:30 PM - 03:00 PM',
                consultationType: 'in-person',
                consultationFee: 80,
                reasonForVisit: 'Dry skin rash and mild seasonal eczema on forearms.',
                symptoms: 'Red erythematous patches on both arms, dry flaking skin.',
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentDetails: {
                    transactionId: 'PAYPAL-DERMA-88412',
                    paymentGateway: 'PayPal',
                    paidAmount: 80,
                    paidAt: new Date('2026-08-15T10:00:00Z')
                }
            },
            // 4.3 John Doe -> Dr. James Wilson (Orthopedics) - UPCOMING CONFIRMED IN-PERSON
            {
                patientId: patientMap['patient.john@gmail.com']._id,
                doctorId: docMap['dr.james@mediconnect.com']._id,
                specializationId: specMap['Orthopedics'],
                specializationName: 'Orthopedics',
                appointmentDate: '2026-08-25',
                timeSlot: '11:00 AM - 11:30 AM',
                consultationType: 'in-person',
                consultationFee: 90,
                reasonForVisit: 'Knee joint stiffness and mild pain after running.',
                symptoms: 'Anterior knee discomfort on stairs.',
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentDetails: {
                    transactionId: 'PAYPAL-ORTHO-66231',
                    paymentGateway: 'PayPal',
                    paidAmount: 90,
                    paidAt: new Date('2026-08-16T11:30:00Z')
                }
            },
            // 4.4 Emma Wilson -> Dr. Marcus Hayes (Pediatrics) - PENDING CONFIRMATION
            {
                patientId: patientMap['patient.emma@gmail.com']._id,
                doctorId: docMap['dr.marcus@mediconnect.com']._id,
                specializationId: specMap['Pediatrics'],
                specializationName: 'Pediatrics',
                appointmentDate: '2026-08-22',
                timeSlot: '10:00 AM - 10:30 AM',
                consultationType: 'in-person',
                consultationFee: 60,
                reasonForVisit: 'Consultation regarding child immunization schedule and pediatric dietary advice.',
                symptoms: 'Standard developmental checkup.',
                status: 'pending',
                paymentStatus: 'unpaid',
                paymentDetails: {
                    transactionId: '',
                    paymentGateway: 'PayPal',
                    paidAmount: 0
                }
            },
            // 4.5 Emma Wilson -> Dr. Sarah Jenkins (General Medicine) - COMPLETED & PAID
            {
                patientId: patientMap['patient.emma@gmail.com']._id,
                doctorId: docMap['dr.sarah@mediconnect.com']._id,
                specializationId: specMap['General Medicine'],
                specializationName: 'General Medicine',
                appointmentDate: '2026-08-12',
                timeSlot: '09:30 AM - 10:00 AM',
                consultationType: 'in-person',
                consultationFee: 50,
                reasonForVisit: 'Acute seasonal flu, nasal congestion, and mild headache.',
                symptoms: 'Fever 100.2°F, runny nose, throat irritation for 3 days.',
                status: 'completed',
                paymentStatus: 'paid',
                paymentDetails: {
                    transactionId: 'PAYPAL-GP-44120',
                    paymentGateway: 'PayPal',
                    paidAmount: 50,
                    paidAt: new Date('2026-08-12T09:15:00Z')
                },
                doctorNotes: 'Diagnosed acute upper respiratory tract infection. Antibiotic and antipyretic course prescribed.'
            },
            // 4.6 Michael Brown -> Dr. Sarah Jenkins (General Medicine) - CONFIRMED IN-PERSON
            {
                patientId: patientMap['patient.michael@gmail.com']._id,
                doctorId: docMap['dr.sarah@mediconnect.com']._id,
                specializationId: specMap['General Medicine'],
                specializationName: 'General Medicine',
                appointmentDate: '2026-08-21',
                timeSlot: '10:00 AM - 10:30 AM',
                consultationType: 'in-person',
                consultationFee: 50,
                reasonForVisit: 'Routine bloodwork analysis review and fasting glucose guidance.',
                symptoms: 'Elevated HbA1c review.',
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentDetails: {
                    transactionId: 'PAYPAL-GP-77291',
                    paymentGateway: 'PayPal',
                    paidAmount: 50,
                    paidAt: new Date('2026-08-16T12:00:00Z')
                }
            },
            // 4.7 Michael Brown -> Dr. James Wilson (Orthopedics) - COMPLETED & PAID
            {
                patientId: patientMap['patient.michael@gmail.com']._id,
                doctorId: docMap['dr.james@mediconnect.com']._id,
                specializationId: specMap['Orthopedics'],
                specializationName: 'Orthopedics',
                appointmentDate: '2026-08-08',
                timeSlot: '02:00 PM - 02:30 PM',
                consultationType: 'in-person',
                consultationFee: 90,
                reasonForVisit: 'Chronic lower back ache after prolonged desk work.',
                symptoms: 'Lumbar tenderness, no radiating numbness.',
                status: 'completed',
                paymentStatus: 'paid',
                paymentDetails: {
                    transactionId: 'PAYPAL-ORTHO-11932',
                    paymentGateway: 'PayPal',
                    paidAmount: 90,
                    paidAt: new Date('2026-08-08T13:45:00Z')
                },
                doctorNotes: 'Lumbar musculoskeletal strain. Prescribed NSAID and recommended lumbar ergonomics.'
            },
            // 4.8 Sophia Miller -> Dr. Olivia Taylor (Gynecology) - CONFIRMED IN-PERSON
            {
                patientId: patientMap['patient.sophia@gmail.com']._id,
                doctorId: docMap['dr.olivia@mediconnect.com']._id,
                specializationId: specMap['Gynecology'],
                specializationName: 'Gynecology',
                appointmentDate: '2026-08-23',
                timeSlot: '03:00 PM - 03:30 PM',
                consultationType: 'in-person',
                consultationFee: 85,
                reasonForVisit: 'Annual women health checkup and routine pelvic ultrasound consultation.',
                symptoms: 'Preventative checkup.',
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentDetails: {
                    transactionId: 'PAYPAL-GYN-55219',
                    paymentGateway: 'PayPal',
                    paidAmount: 85,
                    paidAt: new Date('2026-08-16T14:10:00Z')
                }
            }
        ];

        const insertedAppointments = await Appointment.insertMany(appointmentsToInsert);

        // 5. Seed Medical Records & Official Prescriptions
        console.log('Seeding Official Medical Records & Prescriptions for Completed Consultations...');

        // 5.1 Medical Record for Booking 4.1 (John Doe with Dr. Emily Watson)
        const record1 = new MedicalRecord({
            patientId: patientMap['patient.john@gmail.com']._id,
            doctorId: docMap['dr.watson@mediconnect.com']._id,
            appointmentId: insertedAppointments[0]._id,
            diagnosis: 'Mild Exercise-Induced Angina (Stage 1) & Pre-Hypertension',
            symptoms: 'Exertional chest tightness, elevated resting systolic blood pressure.',
            vitalSigns: {
                bloodPressure: '135/88 mmHg',
                pulseRate: '78 bpm',
                temperature: '98.4 °F',
                weight: '74 kg',
                height: '178 cm',
                respiratoryRate: '16 bpm'
            },
            prescriptions: [
                {
                    medicineName: 'Metoprolol Tartrate',
                    dosage: '25mg',
                    frequency: '1-0-1 (Twice daily)',
                    duration: '30 days',
                    instructions: 'Take with or immediately after meals in the morning and evening.'
                },
                {
                    medicineName: 'Aspirin (CardioProtect)',
                    dosage: '100mg',
                    frequency: '0-1-0 (Once daily after lunch)',
                    duration: '30 days',
                    instructions: 'Do not take on an empty stomach. Drink with a full glass of water.'
                }
            ],
            labTestsRecommended: ['2D Echocardiogram', 'Fasting Lipid Profile', 'Serum Creatinine & Electrolytes'],
            doctorAdvice: 'Engage in moderate walking 30 mins daily. Limit sodium intake to under 2g/day. Discontinue heavy weightlifting until Echo evaluation.',
            followUpDate: '2026-09-15'
        });
        await record1.save();

        // 5.2 Medical Record for Booking 4.5 (Emma Wilson with Dr. Sarah Jenkins)
        const record2 = new MedicalRecord({
            patientId: patientMap['patient.emma@gmail.com']._id,
            doctorId: docMap['dr.sarah@mediconnect.com']._id,
            appointmentId: insertedAppointments[4]._id,
            diagnosis: 'Acute Sinusitis & Seasonal Upper Respiratory Infection',
            symptoms: 'Nasal congestion, facial pressure, productive cough, low-grade fever.',
            vitalSigns: {
                bloodPressure: '118/76 mmHg',
                pulseRate: '82 bpm',
                temperature: '100.2 °F',
                weight: '62 kg',
                height: '165 cm',
                respiratoryRate: '18 bpm'
            },
            prescriptions: [
                {
                    medicineName: 'Amoxicillin-Clavulanate (Augmentin Duo)',
                    dosage: '625mg',
                    frequency: '1-0-1 (Twice daily)',
                    duration: '7 days',
                    instructions: 'Complete the entire 7-day antibiotic course even if symptoms resolve.'
                },
                {
                    medicineName: 'Paracetamol',
                    dosage: '500mg',
                    frequency: '1-1-1 (As needed for fever/pain)',
                    duration: '5 days',
                    instructions: 'Maximum 4g in 24 hours.'
                },
                {
                    medicineName: 'Saline Nasal Spray (Flo Sinus)',
                    dosage: '2 sprays per nostril',
                    frequency: 'Three times daily',
                    duration: '10 days',
                    instructions: 'Use before bedtime to clear nasal passages.'
                }
            ],
            labTestsRecommended: ['Complete Blood Count (CBC) if fever persists > 5 days'],
            doctorAdvice: 'Maintain hydration with warm fluids, steam inhalation twice daily, and rest adequately.',
            followUpDate: '2026-08-25'
        });
        await record2.save();

        // 5.3 Medical Record for Booking 4.7 (Michael Brown with Dr. James Wilson)
        const record3 = new MedicalRecord({
            patientId: patientMap['patient.michael@gmail.com']._id,
            doctorId: docMap['dr.james@mediconnect.com']._id,
            appointmentId: insertedAppointments[6]._id,
            diagnosis: 'Lumbar Musculoskeletal Strain & Postural Sciatica',
            symptoms: 'Lower back stiffness, localized tenderness over L4-L5 lumbar region.',
            vitalSigns: {
                bloodPressure: '126/82 mmHg',
                pulseRate: '74 bpm',
                temperature: '98.6 °F',
                weight: '82 kg',
                height: '180 cm',
                respiratoryRate: '15 bpm'
            },
            prescriptions: [
                {
                    medicineName: 'Meloxicam (Mobic)',
                    dosage: '15mg',
                    frequency: '1-0-0 (Once daily after breakfast)',
                    duration: '10 days',
                    instructions: 'Anti-inflammatory. Take with food.'
                },
                {
                    medicineName: 'Baclofen',
                    dosage: '10mg',
                    frequency: '0-0-1 (Once at bedtime)',
                    duration: '7 days',
                    instructions: 'Muscle relaxant. May cause drowsiness.'
                }
            ],
            labTestsRecommended: ['Lumbar Spine X-Ray (AP & Lateral views)'],
            doctorAdvice: 'Core strengthening exercises, ergonomic chair adjustment at work, avoid heavy lifting for 3 weeks.',
            followUpDate: '2026-09-01'
        });
        await record3.save();

        // 6. Seed Payment Transactions (PayPal Sandbox)
        console.log('Seeding Verified PayPal Payment Transactions...');
        const paymentTransactionsData = [
            {
                appointmentId: insertedAppointments[0]._id,
                patientId: patientMap['patient.john@gmail.com']._id,
                doctorId: docMap['dr.watson@mediconnect.com']._id,
                amount: 75,
                currency: 'AUD',
                paymentGateway: 'PayPal',
                transactionId: 'PAYPAL-CARDIO-99124',
                status: 'success',
                paymentGatewayResponse: { payerEmail: 'patient.john@gmail.com', status: 'COMPLETED' }
            },
            {
                appointmentId: insertedAppointments[1]._id,
                patientId: patientMap['patient.john@gmail.com']._id,
                doctorId: docMap['dr.chen@mediconnect.com']._id,
                amount: 80,
                currency: 'AUD',
                paymentGateway: 'PayPal',
                transactionId: 'PAYPAL-DERMA-88412',
                status: 'success',
                paymentGatewayResponse: { payerEmail: 'patient.john@gmail.com', status: 'COMPLETED' }
            },
            {
                appointmentId: insertedAppointments[2]._id,
                patientId: patientMap['patient.john@gmail.com']._id,
                doctorId: docMap['dr.james@mediconnect.com']._id,
                amount: 90,
                currency: 'AUD',
                paymentGateway: 'PayPal',
                transactionId: 'PAYPAL-ORTHO-66231',
                status: 'success',
                paymentGatewayResponse: { payerEmail: 'patient.john@gmail.com', status: 'COMPLETED' }
            },
            {
                appointmentId: insertedAppointments[4]._id,
                patientId: patientMap['patient.emma@gmail.com']._id,
                doctorId: docMap['dr.sarah@mediconnect.com']._id,
                amount: 50,
                currency: 'AUD',
                paymentGateway: 'PayPal',
                transactionId: 'PAYPAL-GP-44120',
                status: 'success',
                paymentGatewayResponse: { payerEmail: 'patient.emma@gmail.com', status: 'COMPLETED' }
            },
            {
                appointmentId: insertedAppointments[5]._id,
                patientId: patientMap['patient.michael@gmail.com']._id,
                doctorId: docMap['dr.sarah@mediconnect.com']._id,
                amount: 50,
                currency: 'AUD',
                paymentGateway: 'PayPal',
                transactionId: 'PAYPAL-GP-77291',
                status: 'success',
                paymentGatewayResponse: { payerEmail: 'patient.michael@gmail.com', status: 'COMPLETED' }
            },
            {
                appointmentId: insertedAppointments[6]._id,
                patientId: patientMap['patient.michael@gmail.com']._id,
                doctorId: docMap['dr.james@mediconnect.com']._id,
                amount: 90,
                currency: 'AUD',
                paymentGateway: 'PayPal',
                transactionId: 'PAYPAL-ORTHO-11932',
                status: 'success',
                paymentGatewayResponse: { payerEmail: 'patient.michael@gmail.com', status: 'COMPLETED' }
            },
            {
                appointmentId: insertedAppointments[7]._id,
                patientId: patientMap['patient.sophia@gmail.com']._id,
                doctorId: docMap['dr.olivia@mediconnect.com']._id,
                amount: 85,
                currency: 'AUD',
                paymentGateway: 'PayPal',
                transactionId: 'PAYPAL-GYN-55219',
                status: 'success',
                paymentGatewayResponse: { payerEmail: 'patient.sophia@gmail.com', status: 'COMPLETED' }
            }
        ];
        await PaymentTransaction.insertMany(paymentTransactionsData);

        // 7. Seed Real-time Notifications
        console.log('Seeding System Notifications...');
        const notificationsData = [
            {
                recipient: patientMap['patient.john@gmail.com']._id,
                sender: docMap['dr.watson@mediconnect.com']._id,
                type: 'RECORD_ADDED',
                title: 'Cardiology Prescription Ready',
                message: 'Dr. Emily Watson published your cardiology clinical report and 2 prescriptions.',
                link: '/dashboard?tab=medical-records',
                isRead: false
            },
            {
                recipient: patientMap['patient.john@gmail.com']._id,
                sender: docMap['dr.chen@mediconnect.com']._id,
                type: 'APPOINTMENT_CONFIRMED',
                title: 'Dermatology Consultation Confirmed',
                message: 'Dr. Sophia Chen confirmed your consultation on 2026-08-20 at 02:30 PM.',
                link: '/dashboard?tab=appointments',
                isRead: true
            },
            {
                recipient: patientMap['patient.john@gmail.com']._id,
                sender: docMap['dr.james@mediconnect.com']._id,
                type: 'APPOINTMENT_CONFIRMED',
                title: 'Orthopedic Visit Confirmed',
                message: 'Dr. James Wilson confirmed your in-person visit on 2026-08-25 at 11:00 AM.',
                link: '/dashboard?tab=appointments',
                isRead: false
            },
            {
                recipient: docMap['dr.marcus@mediconnect.com']._id,
                sender: patientMap['patient.emma@gmail.com']._id,
                type: 'APPOINTMENT_BOOKED',
                title: 'New Patient Booking Request',
                message: 'Emma Wilson requested a pediatric consultation on 2026-08-22 at 10:00 AM.',
                link: '/dashboard?tab=doctor-appointments',
                isRead: false
            },
            {
                recipient: patientMap['patient.emma@gmail.com']._id,
                sender: docMap['dr.sarah@mediconnect.com']._id,
                type: 'RECORD_ADDED',
                title: 'General Medicine Prescription Issued',
                message: 'Dr. Sarah Jenkins published your prescription for Acute Sinusitis.',
                link: '/dashboard?tab=medical-records',
                isRead: true
            },
            {
                recipient: adminUser._id,
                sender: docMap['dr.pending@mediconnect.com']._id,
                type: 'GENERAL',
                title: 'Doctor License Verification Pending',
                message: 'Dr. David Miller (Neurology) submitted license credentials for clinic review.',
                link: '/dashboard?tab=doctor-approvals',
                isRead: false
            }
        ];
        await Notification.insertMany(notificationsData);

        console.log('======================================================');
        console.log('DATABASE RESEEDING COMPLETED SUCCESSFULLY (100% IN-PERSON)!');
        console.log('======================================================');
        process.exit(0);
    } catch (error) {
        console.error('Reseeding Error:', error);
        process.exit(1);
    }
};

seed();
