import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useAuth } from '../../../Contexts/AuthContext';
import { 
    Calendar, 
    FileText, 
    CreditCard, 
    Users, 
    ShieldCheck, 
    Clock, 
    HeartPulse, 
    ArrowRight,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const OverviewTab = ({ setActiveTab }) => {
    const { user, isPatient, isDoctor, isAdmin } = useAuth();
    const [stats, setStats] = useState({
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedAppointments: 0,
        totalRecords: 0,
        totalSpentOrEarned: 0
    });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardOverview = async () => {
            try {
                const [appRes, recRes] = await Promise.all([
                    api.get('/appointments/my-appointments'),
                    isPatient ? api.get('/medical-records/my-records') : Promise.resolve({ data: { records: [] } })
                ]);

                if (appRes.data.success) {
                    const apps = appRes.data.appointments || [];
                    setRecentAppointments(apps.slice(0, 4));

                    const upcoming = apps.filter(a => ['pending', 'confirmed'].includes(a.status)).length;
                    const completed = apps.filter(a => a.status === 'completed').length;
                    const totalMoney = apps
                        .filter(a => a.paymentStatus === 'paid')
                        .reduce((sum, a) => sum + (a.consultationFee || 0), 0);

                    setStats({
                        totalAppointments: apps.length,
                        upcomingAppointments: upcoming,
                        completedAppointments: completed,
                        totalRecords: recRes.data.records?.length || 0,
                        totalSpentOrEarned: totalMoney
                    });
                }
            } catch (error) {
                console.error('Error loading overview:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardOverview();
    }, [user, isPatient]);

    return (
        <div className="space-y-8">
            {/* Greeting Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-700 shadow-sm">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-500/30">
                        <HeartPulse size={14} />
                        <span>{user?.role} Portal</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black">Welcome back, {user?.name}!</h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                        {isPatient && 'Track your consultations, prescriptions, and scheduled appointments.'}
                        {isDoctor && 'Manage your clinic schedule, patient queue, and clinical notes.'}
                        {isAdmin && 'Oversee doctor verifications, appointments, and medical departments.'}
                    </p>
                </div>

                {isPatient && (
                    <Link
                        to="/explore"
                        className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-teal-500/20 transition-all flex-shrink-0"
                    >
                        + Book New Appointment
                    </Link>
                )}
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                        <Calendar size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Upcoming</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">{stats.upcomingAppointments}</p>
                    <span className="text-[11px] text-teal-600 font-semibold mt-1 block">Active Bookings</span>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                        <CheckCircle2 size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">{stats.completedAppointments}</p>
                    <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Past Sessions</span>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                        <FileText size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        {isPatient ? 'Prescriptions' : 'Total Consults'}
                    </span>
                    <p className="text-2xl font-black text-slate-900 mt-1">
                        {isPatient ? stats.totalRecords : stats.totalAppointments}
                    </p>
                    <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Clinical Records</span>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                        <CreditCard size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        {isDoctor ? 'Total Earned' : 'Fees Paid'}
                    </span>
                    <p className="text-2xl font-black text-slate-900 mt-1">${stats.totalSpentOrEarned}</p>
                    <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Processed via PayPal</span>
                </div>
            </div>

            {/* Recent Appointments Preview */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Recent Appointments</h3>
                        <p className="text-xs text-slate-500">Your latest scheduled clinical consultations.</p>
                    </div>
                    <button
                        onClick={() => setActiveTab(isDoctor ? 'doctor-appointments' : 'appointments')}
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                    >
                        <span>View All</span>
                        <ArrowRight size={14} />
                    </button>
                </div>

                {loading ? (
                    <div className="py-8 text-center text-teal-600 text-xs">Loading appointments...</div>
                ) : recentAppointments.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                        No appointments found. Click 'Book New Appointment' to schedule a consultation.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {recentAppointments.map((app) => (
                            <div key={app._id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm">
                                        {isDoctor ? app.patientId?.name?.charAt(0) : app.doctorId?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            {isDoctor ? `Patient: ${app.patientId?.name}` : `Dr. ${app.doctorId?.name}`}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {app.specializationName} • {app.appointmentDate} at {app.timeSlot}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                        app.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                        app.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                        'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                        {app.status}
                                    </span>
                                    <span className="text-xs font-bold text-slate-900">${app.consultationFee}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OverviewTab;
