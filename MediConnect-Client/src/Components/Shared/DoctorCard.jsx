import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, Clock, Award, ShieldCheck, ArrowRight } from 'lucide-react';

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate();
    if (!doctor) return null;

    const doctorId = doctor._id || doctor.id;
    const profile = doctor.doctorProfile || {};
    const defaultAvatar = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';
    const doctorName = doctor.name ? (doctor.name.startsWith('Dr.') ? doctor.name : `Dr. ${doctor.name}`) : 'Dr. Specialist';

    const handleCardClick = () => {
        if (doctorId) {
            navigate(`/doctor/${doctorId}`);
        }
    };

    return (
        <div 
            onClick={handleCardClick}
            className="bg-white rounded-3xl border border-slate-200/80 hover:border-teal-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
        >
            {/* Top Bar with Avatar & Basic Info */}
            <div className="p-6 pb-4 flex gap-4 items-start">
                <div className="relative">
                    <img 
                        src={doctor.avatar || defaultAvatar} 
                        alt={doctor.name}
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-1.5 -right-1.5 bg-teal-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified Specialist">
                        <ShieldCheck size={14} />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60 truncate">
                            {profile.specializationName || 'General Medicine'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <span>{profile.rating?.average?.toFixed(1) || '5.0'}</span>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mt-1.5 truncate group-hover:text-teal-600 transition-colors">
                        {doctorName}
                    </h3>
                    
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <Award size={13} className="text-slate-400 flex-shrink-0" />
                        <span>{profile.qualifications?.join(', ') || 'MBBS, MD'} • {profile.experienceYears || 5}+ yrs exp</span>
                    </p>
                </div>
            </div>

            {/* Doctor Details & Hospital */}
            <div className="px-6 py-3 bg-slate-50/70 border-y border-slate-100 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2 truncate">
                    <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{profile.hospitalAffiliation || 'Central Hospital & Health Center'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={14} className="text-teal-600 flex-shrink-0" />
                    <span>Next Available: <strong className="text-slate-700 font-semibold">Today / Tomorrow</strong></span>
                </div>
            </div>

            {/* Price & Action */}
            <div className="p-6 pt-4 mt-auto flex items-center justify-between gap-4">
                <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Consultation Fee</span>
                    <span className="text-xl font-black text-slate-900">
                        ${profile.consultationFee || 50}
                        <span className="text-xs font-normal text-slate-500"> AUD</span>
                    </span>
                </div>

                <Link
                    to={`/doctor/${doctorId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shadow-teal-600/20 active:scale-95 text-center flex items-center gap-1.5"
                >
                    <Calendar size={14} />
                    <span>Book Now</span>
                </Link>
            </div>
        </div>
    );
};

export default DoctorCard;
