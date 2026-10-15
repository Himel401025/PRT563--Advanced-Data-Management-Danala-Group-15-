import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useAuth } from '../../../Contexts/AuthContext';
import { CreditCard, DollarSign, Calendar, CheckCircle2, ShieldCheck, Download, FileText } from 'lucide-react';
import InvoiceReceiptModal from '../../Shared/InvoiceReceiptModal';

const PaymentsTab = () => {
    const { user, isDoctor, isPatient, isAdmin } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(true);

    // Selected Transaction for Invoice Modal
    const [selectedTxForInvoice, setSelectedTxForInvoice] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const endpoint = isAdmin ? '/payment/admin/all' : '/payment/my-transactions';
                const res = await api.get(endpoint);
                if (res.data.success) {
                    setTransactions(res.data.transactions || []);
                    if (isAdmin) {
                        setTotalRevenue(res.data.totalRevenue || 0);
                    } else {
                        const sum = (res.data.transactions || []).reduce((acc, t) => acc + (t.amount || 0), 0);
                        setTotalRevenue(sum);
                    }
                }
            } catch (err) {
                console.error('Error fetching payments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [isAdmin]);

    const handleOpenInvoice = (tx) => {
        setSelectedTxForInvoice(tx);
        setShowInvoiceModal(true);
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">
                        {isDoctor ? 'Doctor Consultation Earnings' : (isAdmin ? 'Financial & Revenue Audit' : 'Payment Invoices & Receipts')}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Verified PayPal transaction records, consultation fees, and official downloadable tax invoices.
                    </p>
                </div>

                <div className="bg-teal-50 border border-teal-200 px-5 py-3 rounded-2xl text-right">
                    <span className="text-[10px] text-teal-800 font-bold uppercase tracking-wider block">
                        {isDoctor ? 'Total Earned' : (isAdmin ? 'Platform Total' : 'Total Spent')}
                    </span>
                    <span className="text-2xl font-black text-teal-900">${totalRevenue} AUD</span>
                </div>
            </div>

            {loading ? (
                <div className="py-16 text-center text-teal-600 text-xs">Loading transaction records...</div>
            ) : transactions.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                    No payment transactions recorded yet.
                </div>
            ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                                <th className="p-4">Transaction ID</th>
                                <th className="p-4">{isDoctor ? 'Patient' : 'Doctor & Specialty'}</th>
                                <th className="p-4">Gateway</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Official Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-slate-50/50">
                                    <td className="p-4 font-mono font-bold text-slate-900">
                                        {tx.transactionId}
                                    </td>
                                    <td className="p-4">
                                        {isDoctor ? (
                                            <p className="font-semibold text-slate-800">{tx.patientId?.name}</p>
                                        ) : (
                                            <div>
                                                <p className="font-semibold text-slate-800">Dr. {tx.doctorId?.name}</p>
                                                <p className="text-[10px] text-slate-400">{tx.doctorId?.doctorProfile?.specializationName}</p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                                            {tx.paymentGateway}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-slate-900">
                                        ${tx.amount} {tx.currency || 'AUD'}
                                    </td>
                                    <td className="p-4 text-slate-500">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleOpenInvoice(tx)}
                                            className="bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-200 px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                                        >
                                            <FileText size={13} className="text-teal-600" />
                                            <span>Download Invoice</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Dedicated Invoice & Receipt Modal */}
            <InvoiceReceiptModal
                isOpen={showInvoiceModal}
                onClose={() => setShowInvoiceModal(false)}
                transaction={selectedTxForInvoice}
                appointment={selectedTxForInvoice?.appointmentId}
            />
        </div>
    );
};

export default PaymentsTab;
