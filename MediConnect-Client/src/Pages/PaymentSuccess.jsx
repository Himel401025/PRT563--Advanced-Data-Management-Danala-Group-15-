import React, { useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, User, ShieldCheck, ArrowRight, Printer, FileText } from 'lucide-react';
import InvoiceReceiptModal from '../Components/Shared/InvoiceReceiptModal';

const PaymentSuccess = () => {
    const { tranId } = useParams();
    const location = useLocation();
    const { appointment, transaction } = location.state || {};

    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    return (
        <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg text-center">
                <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/30">
                    <CheckCircle2 size={36} />
                </div>

                <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                    Payment & Booking Confirmed
                </span>

                <h1 className="text-3xl font-black text-slate-900 mt-4">Appointment Booked Successfully!</h1>
                <p className="text-slate-500 text-sm mt-2">
                    Your consultation has been reserved and registered with the clinic. A confirmation receipt has been generated.
                </p>

                {/* Appointment Summary Box */}
                <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-4 text-xs sm:text-sm">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                        <span className="text-slate-500">PayPal Transaction ID</span>
                        <span className="font-mono font-bold text-slate-800">{tranId || transaction?.transactionId || 'PAYPAL-CONFIRMED'}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-slate-500">Scheduled Date</span>
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Calendar size={15} className="text-teal-600" />
                            {appointment?.appointmentDate || 'Upcoming'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-slate-500">Time Slot</span>
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Clock size={15} className="text-teal-600" />
                            {appointment?.timeSlot || 'Confirmed Slot'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-slate-500">Consultation Format</span>
                        <span className="font-bold text-teal-700 capitalize">
                            {appointment?.consultationType === 'video' ? 'Telehealth Video Meeting' : 'In-Person Clinic Visit'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                        <span className="text-slate-500 font-bold">Total Paid (PayPal Sandbox)</span>
                        <span className="text-lg font-black text-slate-900">
                            ${appointment?.consultationFee || 50}.00 AUD
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/dashboard?tab=appointments"
                        className="bg-teal-600 hover:bg-teal-700 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
                    >
                        <span>View in Healthcare Dashboard</span>
                        <ArrowRight size={16} />
                    </Link>

                    <button
                        onClick={() => setShowInvoiceModal(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <FileText size={16} className="text-teal-400" />
                        <span>Download Official Invoice</span>
                    </button>
                </div>
            </div>

            {/* Dedicated Invoice Receipt Modal */}
            <InvoiceReceiptModal
                isOpen={showInvoiceModal}
                onClose={() => setShowInvoiceModal(false)}
                transaction={transaction || { transactionId: tranId, amount: appointment?.consultationFee || 50, createdAt: new Date() }}
                appointment={appointment}
            />
        </div>
    );
};

export default PaymentSuccess;
