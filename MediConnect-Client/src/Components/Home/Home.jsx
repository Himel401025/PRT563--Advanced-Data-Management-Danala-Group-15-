import React, { useEffect, useState } from 'react';
import DoctorCard from '../Shared/DoctorCard';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Search, 
    Calendar, 
    ShieldCheck, 
    HeartPulse, 
    Stethoscope, 
    Sparkles, 
    Baby, 
    Bone, 
    Brain, 
    HeartHandshake, 
    Eye, 
    ArrowRight,
    Award,
    Clock,
    FileText,
    Users
} from 'lucide-react';

const specialtyIcons = {
    'General Medicine': Stethoscope,
    'Cardiology': HeartPulse,
    'Dermatology': Sparkles,
    'Pediatrics': Baby,
    'Orthopedics': Bone,
    'Neurology': Brain,
    'Gynecology': HeartHandshake,
    'Ophthalmology': Eye
};

const Home = () => {
    const [featuredDoctors, setFeaturedDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpec, setSelectedSpec] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                const [specRes, docRes] = await Promise.all([
                    api.get('/specializations'),
                    api.get('/doctors/featured')
                ]);

                if (specRes.data.success) {
                    setSpecializations(specRes.data.specializations || []);
                }
                if (docRes.data.success) {
                    setFeaturedDoctors(docRes.data.doctors || []);
                }
            } catch (error) {
                console.error('Error loading home data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedSpec) params.append('specialization', selectedSpec);
        navigate(`/explore?${params.toString()}`);
    };

    // Fallback sample doctors if backend DB is empty
    const displayDoctors = featuredDoctors.length > 0 ? featuredDoctors : [
        {
            _id: 'doc1',
            name: 'Emily Watson',
            avatar: 'https://images.unsplash.com/photo-1594824813680-e88df2998a6a?auto=format&fit=crop&q=80&w=400',
            doctorProfile: {
                specializationName: 'Cardiology',
                qualifications: ['MBBS', 'MD Cardiology'],
                experienceYears: 12,
                hospitalAffiliation: 'Royal Care Heart Institute',
                consultationFee: 75,
                rating: { average: 4.9, count: 128 }
            }
        },
        {
            _id: 'doc2',
            name: 'Marcus Hayes',
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
            doctorProfile: {
                specializationName: 'Pediatrics',
                qualifications: ['MBBS', 'DCH Pediatrics'],
                experienceYears: 8,
                hospitalAffiliation: "Children's Health Clinic",
                consultationFee: 60,
                rating: { average: 4.8, count: 94 }
            }
        },
        {
            _id: 'doc3',
            name: 'Sophia Chen',
            avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
            doctorProfile: {
                specializationName: 'Dermatology',
                qualifications: ['MD Dermatology', 'FACD'],
                experienceYears: 10,
                hospitalAffiliation: 'Metropolitan Skin Center',
                consultationFee: 80,
                rating: { average: 5.0, count: 110 }
            }
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen text-slate-800">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-6">
                        <HeartPulse size={14} className="text-teal-400" />
                        <span>MediConnect Healthcare Portal</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
                        Find & Book Trusted <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">Medical Specialists</span> Online
                    </h1>

                    <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mt-5 leading-relaxed">
                        Connect with verified physicians, schedule appointments seamlessly, and manage your clinical prescriptions and medical history in one unified portal.
                    </p>

                    {/* Quick Search Box */}
                    <form onSubmit={handleSearchSubmit} className="mt-10 max-w-3xl mx-auto bg-white p-2 sm:p-3 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 text-slate-900 border border-slate-100">
                        <div className="flex-1 flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-slate-100">
                            <Search size={20} className="text-teal-600 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Doctor name, hospital, or symptoms..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent text-sm focus:outline-none text-slate-800 placeholder-slate-400"
                            />
                        </div>

                        <div className="sm:w-52 flex items-center px-4 py-2">
                            <select
                                value={selectedSpec}
                                onChange={(e) => setSelectedSpec(e.target.value)}
                                className="w-full bg-transparent text-sm text-slate-700 focus:outline-none cursor-pointer"
                            >
                                <option value="">All Specialties</option>
                                {specializations.map((spec) => (
                                    <option key={spec._id} value={spec.name}>
                                        {spec.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-700 text-white px-7 py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-teal-600/30 flex items-center justify-center gap-2"
                        >
                            <span>Search</span>
                            <ArrowRight size={16} />
                        </button>
                    </form>

                    {/* Key Stats Strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16 pt-10 border-t border-slate-700/60">
                        <div className="text-center">
                            <p className="text-3xl font-black text-teal-400">100%</p>
                            <p className="text-xs text-slate-400 mt-1">Verified Doctors</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-white">8+</p>
                            <p className="text-xs text-slate-400 mt-1">Clinical Specialties</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-teal-400">24/7</p>
                            <p className="text-xs text-slate-400 mt-1">Slot Scheduling</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-white">Instant</p>
                            <p className="text-xs text-slate-400 mt-1">Prescription Records</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Medical Specialties Grid */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
                    <div>
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Department Taxonomy</span>
                        <h2 className="text-3xl font-black text-slate-900 mt-1">Explore by Medical Specialty</h2>
                        <p className="text-slate-500 text-sm mt-1">Choose a field to find specialized doctors and treatment programs.</p>
                    </div>
                    <Link
                        to="/explore"
                        className="text-teal-600 hover:text-teal-700 font-bold text-sm flex items-center gap-1 group"
                    >
                        <span>View All Doctors</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {specializations.map((spec) => {
                        const IconComponent = specialtyIcons[spec.name] || Stethoscope;
                        return (
                            <Link
                                key={spec._id}
                                to={`/explore?specialization=${encodeURIComponent(spec.name)}`}
                                className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-teal-500/50 hover:shadow-lg transition-all duration-300 group flex flex-col items-start"
                            >
                                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                    <IconComponent size={24} />
                                </div>
                                <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-600 transition-colors">
                                    {spec.name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                                    {spec.description || 'Specialized diagnostics and therapeutic consultation.'}
                                </p>
                                <span className="mt-4 text-xs font-bold text-teal-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Book Doctors →
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Featured Doctors Section */}
            <section className="py-20 bg-slate-100/70 border-y border-slate-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
                        <div>
                            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Top Rated Physicians</span>
                            <h2 className="text-3xl font-black text-slate-900 mt-1">Featured Medical Specialists</h2>
                            <p className="text-slate-500 text-sm mt-1">Verified practitioners with active consultation hours.</p>
                        </div>
                        <Link
                            to="/explore"
                            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                        >
                            Browse All Specialists
                        </Link>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayDoctors.map((doc) => (
                            <DoctorCard key={doc._id} doctor={doc} />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Patient Workflow</span>
                    <h2 className="text-3xl font-black text-slate-900 mt-1">How Appointment Booking Works</h2>
                    <p className="text-slate-500 text-sm mt-2">Book a doctor and manage your medical records in 3 effortless steps.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm relative text-center">
                        <div className="w-14 h-14 bg-teal-500 text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-6 shadow-md shadow-teal-500/20">
                            1
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Find Your Doctor</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Search by specialty, location, consultation fee, or rating. View comprehensive physician credentials and hospital affiliations.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm relative text-center">
                        <div className="w-14 h-14 bg-teal-500 text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-6 shadow-md shadow-teal-500/20">
                            2
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Select Slot & Pay</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Pick an open time slot on your preferred date. Complete secure checkout with integrated PayPal or card payments.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm relative text-center">
                        <div className="w-14 h-14 bg-teal-500 text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-6 shadow-md shadow-teal-500/20">
                            3
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Consult & Track Health</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Attend your consultation. Receive structured digital prescriptions, diagnostic notes, and lab recommendations directly in your dashboard.
                        </p>
                    </div>
                </div>
            </section>

            {/* Bottom CTA Banner */}
            <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-black">Are You a Qualified Medical Doctor?</h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto mt-3">
                        Join the MediConnect clinical network. Manage patient bookings, streamline your consultation schedule, and issue digital prescriptions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Link
                            to="/register"
                            className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-500/20"
                        >
                            Register as a Doctor
                        </Link>
                        <Link
                            to="/explore"
                            className="bg-transparent border border-slate-700 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all"
                        >
                            Book an Appointment
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;