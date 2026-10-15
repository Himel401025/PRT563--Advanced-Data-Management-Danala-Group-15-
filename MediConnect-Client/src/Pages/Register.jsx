import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import api from '../api/axios';
import { User, Stethoscope, Mail, Lock, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Register = () => {
    const [role, setRole] = useState('patient'); // 'patient' or 'doctor'
    const [specializations, setSpecializations] = useState([]);
    
    // Common Fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    
    // Patient Fields
    const [gender, setGender] = useState('Prefer not to say');
    const [bloodGroup, setBloodGroup] = useState('Unknown');
    const [dateOfBirth, setDateOfBirth] = useState('');
    
    // Doctor Fields
    const [specializationName, setSpecializationName] = useState('General Medicine');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [qualifications, setQualifications] = useState('MBBS');
    const [experienceYears, setExperienceYears] = useState(3);
    const [hospitalAffiliation, setHospitalAffiliation] = useState('');
    const [consultationFee, setConsultationFee] = useState(50);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    // Fetch specializations for doctor dropdown
    useEffect(() => {
        const fetchSpecs = async () => {
            try {
                const res = await api.get('/specializations');
                if (res.data.success) {
                    setSpecializations(res.data.specializations || []);
                }
            } catch (err) {
                console.error('Error loading specializations:', err);
            }
        };
        fetchSpecs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = {
                name,
                email,
                password,
                phone,
                role
            };

            if (role === 'patient') {
                payload.patientProfile = {
                    gender,
                    bloodGroup,
                    dateOfBirth: dateOfBirth || undefined
                };
            } else if (role === 'doctor') {
                payload.doctorProfile = {
                    specializationName,
                    licenseNumber,
                    qualifications: qualifications.split(',').map(q => q.trim()),
                    experienceYears: Number(experienceYears),
                    hospitalAffiliation,
                    consultationFee: Number(consultationFee)
                };
            }

            const res = await register(payload);
            if (res.success) {
                navigate('/dashboard');
            } else {
                setError(res.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please check your information.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
                <div className="text-center mb-8">
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Join MediConnect</span>
                    <h1 className="text-3xl font-black text-slate-900 mt-1">Create Your Account</h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Already registered? <Link to="/login" className="text-teal-600 font-bold hover:underline">Sign in here</Link>
                    </p>
                </div>

                {/* Role Switcher */}
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl mb-8">
                    <button
                        type="button"
                        onClick={() => setRole('patient')}
                        className={`py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                            role === 'patient'
                                ? 'bg-white text-teal-700 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <User size={18} />
                        <span>I am a Patient</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setRole('doctor')}
                        className={`py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                            role === 'doctor'
                                ? 'bg-white text-teal-700 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Stethoscope size={18} />
                        <span>I am a Doctor</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Common Fields */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white outline-none p-3.5 rounded-xl text-sm font-medium transition-all text-slate-900"
                                placeholder={role === 'doctor' ? 'Dr. John Doe' : 'Jane Doe'}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white outline-none p-3.5 rounded-xl text-sm font-medium transition-all text-slate-900"
                                placeholder="+61 400 123 456"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white outline-none p-3.5 rounded-xl text-sm font-medium transition-all text-slate-900"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Password *
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white outline-none p-3.5 rounded-xl text-sm font-medium transition-all text-slate-900"
                                placeholder="Min 6 characters"
                            />
                        </div>
                    </div>

                    {/* Patient Specific Fields */}
                    {role === 'patient' && (
                        <div className="pt-4 border-t border-slate-100 space-y-4">
                            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">Health Details</span>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                                    <select
                                        value={bloodGroup}
                                        onChange={(e) => setBloodGroup(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                                    >
                                        {['Unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Doctor Specific Fields */}
                    {role === 'doctor' && (
                        <div className="pt-4 border-t border-slate-100 space-y-4">
                            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">Clinical Qualifications & Verification</span>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Medical Specialty *</label>
                                    <select
                                        value={specializationName}
                                        onChange={(e) => setSpecializationName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                                    >
                                        {specializations.map(s => (
                                            <option key={s._id} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Medical License Number *</label>
                                    <input
                                        type="text"
                                        required
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                                        placeholder="e.g. MED-AU-88910"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Qualifications</label>
                                    <input
                                        type="text"
                                        value={qualifications}
                                        onChange={(e) => setQualifications(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                                        placeholder="MBBS, MD, FRACP"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Years)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={experienceYears}
                                        onChange={(e) => setExperienceYears(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Fee ($)</label>
                                    <input
                                        type="number"
                                        min="10"
                                        value={consultationFee}
                                        onChange={(e) => setConsultationFee(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Hospital or Clinic Affiliation</label>
                                <input
                                    type="text"
                                    value={hospitalAffiliation}
                                    onChange={(e) => setHospitalAffiliation(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                                    placeholder="e.g. Royal Darwin Hospital & Health Care"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 active:scale-[0.98] disabled:opacity-50 mt-6"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <span>Complete Registration</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
