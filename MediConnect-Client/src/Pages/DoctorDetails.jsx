import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../Contexts/AuthContext';
import PayPalCheckoutModal from '../Components/Shared/PayPalCheckoutModal';
import { 
    Star, 
    MapPin, 
    Calendar as CalendarIcon, 
    Clock, 
    Award, 
    ShieldCheck, 
    Building2, 
    CheckCircle2, 
    AlertCircle, 
    CreditCard,
    ArrowLeft
} from 'lucide-react';

const DoctorDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookedSlots, setBookedSlots] = useState([]);
    
    // Booking Form State
    const [selectedDate, setSelectedDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });
    const [selectedSlot, setSelectedSlot] = useState('');
    const [reasonForVisit, setReasonForVisit] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState('');
    
    // PayPal Sandbox Modal State
    const [activeAppointmentForPayment, setActiveAppointmentForPayment] = useState(null);
    const [showPayPalModal, setShowPayPalModal] = useState(false);

    // Fetch doctor info
    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await api.get(`/doctors/${id}`);
                if (res.data.success) {
                    setDoctor(res.data.doctor);
                }
            } catch (error) {
                console.error('Error loading doctor:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    // Fetch booked slots for the selected date
    useEffect(() => {
        const fetchSlots = async () => {
            if (!id || !selectedDate) return;
            try {
                const res = await api.get(`/appointments/booked-slots?doctorId=${id}&date=${selectedDate}`);
                if (res.data.success) {
                    setBookedSlots(res.data.bookedSlots || []);
                }
            } catch (error) {
                console.error('Error fetching booked slots:', error);
            }
        };
        fetchSlots();
    }, [id, selectedDate]);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingError('');

        if (!user) {
            navigate('/login', { state: { from: `/doctor/${id}` } });
            return;
        }

        if (!selectedSlot) {
            setBookingError('Please select an available time slot.');
            return;
        }

        if (!reasonForVisit.trim()) {
            setBookingError('Please state the primary reason for your visit.');
            return;
        }

        setBookingLoading(true);

        try {
            const bookingPayload = {
                doctorId: id,
                appointmentDate: selectedDate,
                timeSlot: selectedSlot,
                consultationType: 'in-person',
                reasonForVisit,
                symptoms
            };

            const res = await api.post('/appointments', bookingPayload);
            if (res.data.success) {
                const appointment = res.data.appointment;
                appointment.doctorId = doctor; // attach doctor details for modal summary
                
                // Open PayPal Sandbox Checkout Modal
                setActiveAppointmentForPayment(appointment);
                setShowPayPalModal(true);
            }
        } catch (err) {
            console.error('Booking failed:', err);
            setBookingError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    const handlePayPalSuccess = (transaction, updatedAppointment) => {
        setShowPayPalModal(false);
        navigate(`/payment/success/${transaction.transactionId}`, {
            state: { appointment: updatedAppointment, transaction }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="max-w-3xl mx-auto py-20 px-4 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Doctor Profile Not Found</h2>
                <p className="text-slate-500 mb-6">The specialist you are looking for might not be available or is pending approval.</p>
                <Link to="/explore" className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm">
                    Back to Doctor Directory
                </Link>
            </div>
        );
    }

    const profile = doctor.doctorProfile || {};
    const allSlots = profile.availableTimeSlots && profile.availableTimeSlots.length > 0 
        ? profile.availableTimeSlots 
        : [
            '09:00 AM - 09:30 AM',
            '09:30 AM - 10:00 AM',
            '10:00 AM - 10:30 AM',
            '10:30 AM - 11:00 AM',
            '02:00 PM - 02:30 PM',
            '02:30 PM - 03:00 PM',
            '03:00 PM - 03:30 PM',
            '03:30 PM - 04:00 PM'
        ];

    return (
        <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Back Button */}
                <Link to="/explore" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Doctors
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Doctor Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                                <div className="relative mb-4">
                                    <img
                                        src={doctor.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'}
                                        alt={doctor.name}
                                        className="w-32 h-32 rounded-3xl object-cover border-4 border-slate-50 shadow-md"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-teal-500 text-white p-1.5 rounded-full border-2 border-white shadow">
                                        <ShieldCheck size={18} />
                                    </div>
                                </div>

                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                                    {profile.specializationName || 'General Medicine'}
                                </span>

                                <h1 className="text-2xl font-black text-slate-900 mt-2">Dr. {doctor.name}</h1>
                                
                                <div className="flex items-center gap-1.5 text-amber-500 text-sm font-bold mt-1">
                                    <Star size={16} className="fill-amber-400 text-amber-400" />
                                    <span>{profile.rating?.average?.toFixed(1) || '5.0'}</span>
                                    <span className="text-slate-400 font-normal">({profile.rating?.count || 1} reviews)</span>
                                </div>

                                <p className="text-xs text-slate-500 mt-1 font-medium">
                                    {profile.qualifications?.join(', ') || 'MBBS, MD'}
                                </p>
                            </div>

                            {/* Details List */}
                            <div className="py-5 space-y-3.5 text-xs text-slate-600 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 font-medium">Experience</span>
                                    <span className="font-bold text-slate-800">{profile.experienceYears || 5}+ Years Clinical</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 font-medium">Hospital</span>
                                    <span className="font-bold text-slate-800 text-right">{profile.hospitalAffiliation || 'Central Hospital'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 font-medium">License No.</span>
                                    <span className="font-mono font-semibold text-slate-700">{profile.licenseNumber || 'MED-AU-99214'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 font-medium">Working Days</span>
                                    <span className="font-bold text-teal-700">{profile.availableDays?.join(', ') || 'Mon - Fri'}</span>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="pt-4">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">About Doctor</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {profile.bio || `Dr. ${doctor.name} is a dedicated specialist focusing on comprehensive patient evaluation, diagnosis, and evidence-based treatment.`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Appointment Booking Widget */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 gap-4">
                                <div>
                                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Book Consultation</span>
                                    <h2 className="text-2xl font-black text-slate-900 mt-0.5">Schedule Your In-Person Visit</h2>
                                </div>
                                <div className="bg-teal-50 border border-teal-200 px-4 py-2 rounded-2xl text-right">
                                    <span className="text-[10px] text-teal-800 font-semibold block uppercase">Consultation Fee</span>
                                    <span className="text-2xl font-black text-teal-900">${profile.consultationFee || 50} <span className="text-xs font-normal">AUD</span></span>
                                </div>
                            </div>

                            {bookingError && (
                                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-xs text-red-700">
                                    <AlertCircle size={16} className="flex-shrink-0" />
                                    <span>{bookingError}</span>
                                </div>
                            )}

                            <form onSubmit={handleBookingSubmit} className="mt-6 space-y-6">
                                {/* Step 1: Select Date */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <CalendarIcon size={16} className="text-teal-600" />
                                        1. Select Consultation Date
                                    </label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-semibold focus:outline-none focus:border-teal-500 cursor-pointer"
                                        required
                                    />
                                </div>

                                {/* Step 2: Time Slots */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Clock size={16} className="text-teal-600" />
                                        2. Select Time Slot ({selectedDate})
                                    </label>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {allSlots.map((slot) => {
                                            const isBooked = bookedSlots.includes(slot);
                                            const isSelected = selectedSlot === slot;

                                            return (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    disabled={isBooked}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                                                        isBooked
                                                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                                                            : isSelected
                                                            ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                                                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-white'
                                                    }`}
                                                >
                                                    {slot}
                                                    {isBooked && <span className="block text-[9px] text-slate-400 font-normal">Booked</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Step 3: Reason for Visit */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                                        3. Reason for Visit & Symptoms *
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Describe your health concern, symptoms, or reason for scheduling..."
                                        value={reasonForVisit}
                                        onChange={(e) => setReasonForVisit(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                                        required
                                    />
                                </div>

                                {/* Payment Summary & PayPal Checkout CTA */}
                                <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <span className="text-[11px] text-teal-400 font-semibold uppercase tracking-wider block">Total Due</span>
                                        <p className="text-2xl font-black text-white">${profile.consultationFee || 50} <span className="text-xs text-slate-400 font-normal">AUD</span></p>
                                        <p className="text-[11px] text-slate-400">Processed securely via PayPal Sandbox Gateway</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={bookingLoading}
                                        className="w-full sm:w-auto bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] px-8 py-3.5 rounded-xl font-black text-sm shadow-lg shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                                    >
                                        {bookingLoading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#003087]"></div>
                                        ) : (
                                            <>
                                                <span className="font-black italic">PayPal</span>
                                                <span>Checkout</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* PayPal Sandbox Checkout Modal */}
            <PayPalCheckoutModal
                isOpen={showPayPalModal}
                onClose={() => setShowPayPalModal(false)}
                appointment={activeAppointmentForPayment}
                onSuccess={handlePayPalSuccess}
            />
        </div>
    );
};

export default DoctorDetails;
