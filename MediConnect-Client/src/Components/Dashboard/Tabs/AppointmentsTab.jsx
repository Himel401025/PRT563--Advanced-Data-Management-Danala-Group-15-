import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useAuth } from '../../../Contexts/AuthContext';
import PayPalCheckoutModal from '../../Shared/PayPalCheckoutModal';
import { 
    Calendar, 
    Clock, 
    User, 
    Building2, 
    CheckCircle2, 
    AlertCircle, 
    Filter,
    CreditCard,
    FileText
} from 'lucide-react';

const AppointmentsTab = ({ setActiveTab, setSelectedAppointmentForRecord }) => {
    const { user, isDoctor, isPatient } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [actionLoading, setActionLoading] = useState(null);
    
    // PayPal Sandbox Modal State
    const [selectedAppointmentForPayment, setSelectedAppointmentForPayment] = useState(null);
    const [showPayPalModal, setShowPayPalModal] = useState(false);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const url = statusFilter === 'all' 
                ? '/appointments/my-appointments' 
                : `/appointments/my-appointments?status=${statusFilter}`;
            const res = await api.get(url);
            if (res.data.success) {
                setAppointments(res.data.appointments || []);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [statusFilter]);

    const handleStatusUpdate = async (id, status, reason = '') => {
        setActionLoading(id);
        try {
            const res = await api.patch(`/appointments/${id}/status`, { status, reason });
            if (res.data.success) {
                fetchAppointments();
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            alert(error.response?.data?.message || 'Failed to update appointment status');
        } finally {
            setActionLoading(null);
        }
    };

    const handlePayPalSuccess = (transaction, updatedAppointment) => {
        setShowPayPalModal(false);
        fetchAppointments();
    };

    return (
        <div className="space-y-6">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">
                        {isDoctor ? 'Clinical Appointments Queue' : 'My Consultations & Bookings'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                        {isDoctor 
                            ? 'Manage incoming patient consultations, accept bookings, and author prescriptions.'
                            : 'Review upcoming doctor appointments and medical consultation statuses.'}
                    </p>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                                statusFilter === tab
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-teal-600">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600 mb-3"></div>
                    <p className="text-xs text-slate-500 font-medium">Loading appointments...</p>
                </div>
            ) : appointments.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
                    <Calendar size={36} className="text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-900">No Appointments Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        There are no consultations currently matching the selected filter ({statusFilter}).
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {appointments.map((app) => {
                        const otherUser = isDoctor ? app.patientId : app.doctorId;

                        return (
                            <div
                                key={app._id}
                                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
                            >
                                {/* Left Side: Appointment Info */}
                                <div className="flex items-start gap-4">
                                    <img
                                        src={otherUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                                        alt={otherUser?.name}
                                        className="w-14 h-14 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
                                    />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-base font-bold text-slate-900">
                                                {isDoctor ? `Patient: ${app.patientId?.name}` : `Dr. ${app.doctorId?.name}`}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                                                {app.specializationName}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                app.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                app.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                                {app.status}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                app.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                            }`}>
                                                {app.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={13} className="text-teal-600" />
                                                <strong>{app.appointmentDate}</strong>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={13} className="text-teal-600" />
                                                <strong>{app.timeSlot}</strong>
                                            </span>
                                            <span className="flex items-center gap-1 text-slate-500">
                                                <Building2 size={13} className="text-teal-600" />
                                                <span>In-Person Clinic Visit</span>
                                            </span>
                                            <span className="font-black text-slate-900">
                                                Fee: ${app.consultationFee || 50} AUD
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                            <strong className="text-slate-700">Reason:</strong> {app.reasonForVisit}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side: Actions & Links */}
                                <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-2.5 w-full lg:w-auto flex-shrink-0">
                                    {/* Unpaid Patient PayPal Checkout CTA */}
                                    {isPatient && app.paymentStatus !== 'paid' && app.status !== 'cancelled' && (
                                        <button
                                            onClick={() => {
                                                setSelectedAppointmentForPayment(app);
                                                setShowPayPalModal(true);
                                            }}
                                            className="bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] px-4 py-2.5 rounded-xl font-black text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <span className="italic">PayPal</span>
                                            <span>Pay Now</span>
                                        </button>
                                    )}

                                    {/* Doctor Actions */}
                                    {isDoctor && app.status === 'pending' && (
                                        <button
                                            disabled={actionLoading === app._id}
                                            onClick={() => handleStatusUpdate(app._id, 'confirmed')}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
                                        >
                                            Accept & Confirm
                                        </button>
                                    )}

                                    {isDoctor && ['confirmed', 'pending'].includes(app.status) && (
                                        <button
                                            onClick={() => {
                                                if (setSelectedAppointmentForRecord) {
                                                    setSelectedAppointmentForRecord(app);
                                                }
                                                setActiveTab('issue-record');
                                            }}
                                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                            <FileText size={14} />
                                            <span>Write Prescription</span>
                                        </button>
                                    )}

                                    {/* Patient view record */}
                                    {app.status === 'completed' && (
                                        <button
                                            onClick={() => setActiveTab('medical-records')}
                                            className="bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                            <FileText size={14} />
                                            <span>View Clinical Record</span>
                                        </button>
                                    )}

                                    {/* Cancel Button */}
                                    {['pending', 'confirmed'].includes(app.status) && (
                                        <button
                                            disabled={actionLoading === app._id}
                                            onClick={() => {
                                                const reason = prompt('Please enter cancellation reason:') || 'Cancelled by user';
                                                handleStatusUpdate(app._id, 'cancelled', reason);
                                            }}
                                            className="bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all border border-slate-200 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* PayPal Sandbox Checkout Modal */}
            <PayPalCheckoutModal
                isOpen={showPayPalModal}
                onClose={() => setShowPayPalModal(false)}
                appointment={selectedAppointmentForPayment}
                onSuccess={handlePayPalSuccess}
            />
        </div>
    );
};

export default AppointmentsTab;
