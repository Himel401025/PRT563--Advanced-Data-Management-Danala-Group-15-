import React from 'react';
import { X, Lock } from 'lucide-react';
import PayPalOfficialButton from './PayPalOfficialButton';

const PayPalCheckoutModal = ({ isOpen, onClose, appointment, onSuccess }) => {
    if (!isOpen || !appointment) return null;

    const amount = appointment.consultationFee || 50;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col">
                {/* PayPal Official Header */}
                <div className="bg-[#003087] px-6 py-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center tracking-tighter font-black text-2xl italic">
                            <span className="text-[#0079C1]">Pay</span><span className="text-[#00457C]">Pal</span>
                        </div>
                        <span className="bg-[#0079C1]/40 text-blue-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-white/20">
                            Official Sandbox Gateway
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 space-y-6">
                    {/* Order Summary Box */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                        <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>Doctor / Specialist</span>
                            <strong className="text-slate-800">Dr. {appointment.doctorId?.name || 'Specialist'}</strong>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>Specialization & Date</span>
                            <span className="text-slate-700 font-medium">
                                {appointment.specializationName} • {appointment.appointmentDate}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>Time Slot</span>
                            <span className="text-slate-700 font-medium">{appointment.timeSlot}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-700">Total Consultation Fee</span>
                            <span className="text-xl font-black text-slate-900">${amount}.00 <span className="text-xs font-normal text-slate-500">USD</span></span>
                        </div>
                    </div>

                    {/* Official PayPal Buttons SDK */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                            Complete Payment via Official PayPal Sandbox
                        </label>
                        <PayPalOfficialButton
                            appointment={appointment}
                            onSuccess={onSuccess}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayPalCheckoutModal;
