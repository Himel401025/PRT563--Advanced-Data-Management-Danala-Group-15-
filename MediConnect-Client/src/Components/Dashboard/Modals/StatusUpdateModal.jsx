import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, CheckCircle } from 'lucide-react';

const StatusUpdateModal = ({ 
    statusModal, 
    setStatusModal, 
    handleConfirmStatusUpdate, 
    updatingBackerStatus 
}) => {
    return (
        <AnimatePresence>
            {statusModal.show && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setStatusModal({ ...statusModal, show: false })} className="absolute inset-0 bg-custom-black/80 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden" >
                        <div className="p-10">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                                statusModal.type === 'rejected' ? 'bg-red-100 text-red-500' : 
                                statusModal.type === 'approved' ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'
                            }`}>
                                {statusModal.type === 'rejected' ? <XCircle size={32} /> : <CheckCircle size={32} />}
                            </div>
                            
                            <h2 className="text-3xl font-black text-custom-black uppercase tracking-tighter mb-2">
                                {statusModal.type === 'rejected' ? 'Reject Withdrawal' : 
                                 statusModal.type === 'approved' ? 'Approve Withdrawal' : 'Complete Payout'}
                            </h2>
                            <p className="text-gray-500 font-bold mb-8">
                                {statusModal.type === 'rejected' ? 'Are you sure you want to reject this request? This will refund the amount to the project balance.' : 
                                 statusModal.type === 'approved' ? 'Are you sure you want to approve this request? The creator will be notified.' : 
                                 'Mark this payout as successfully transferred to the creator.'}
                            </p>

                            {statusModal.type === 'rejected' && (
                                <div className="space-y-2 mb-8">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Reason for Rejection (Mandatory)</label>
                                    <textarea 
                                        required 
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 outline-none px-6 py-4 rounded-2xl font-bold transition-all min-h-[100px]" 
                                        value={statusModal.reason} 
                                        onChange={e => setStatusModal({...statusModal, reason: e.target.value})} 
                                        placeholder="e.g. Invalid bank details, Account frozen, etc."
                                    />
                                </div>
                            )}

                            {(statusModal.type === 'approved' || statusModal.type === 'completed') && (
                                <div className="space-y-6 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                                            Payment Proof {statusModal.type === 'completed' && '(Mandatory)'}
                                        </label>
                                        <input 
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" 
                                            value={statusModal.paymentProof} 
                                            onChange={e => setStatusModal({...statusModal, paymentProof: e.target.value})} 
                                            placeholder="e.g. Transaction ID, Receipt URL, etc."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Admin Comment (Optional)</label>
                                        <textarea 
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all min-h-[80px]" 
                                            value={statusModal.adminComment} 
                                            onChange={e => setStatusModal({...statusModal, adminComment: e.target.value})} 
                                            placeholder="Message for the creator..."
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button onClick={() => setStatusModal({ ...statusModal, show: false })} className="flex-grow bg-gray-100 text-gray-600 py-5 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all">CANCEL</button>
                                <button 
                                    disabled={updatingBackerStatus === statusModal.id || (statusModal.type === 'rejected' && !statusModal.reason) || (statusModal.type === 'completed' && !statusModal.paymentProof)}
                                    onClick={handleConfirmStatusUpdate} 
                                    className={`flex-[2] py-5 rounded-2xl font-black text-lg text-white transition-all shadow-xl disabled:opacity-50 ${
                                        statusModal.type === 'rejected' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 
                                        'bg-green-500 hover:bg-green-600 shadow-green-500/20'
                                    }`}
                                >
                                    {updatingBackerStatus === statusModal.id ? 'PROCESSING...' : 'CONFIRM'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default StatusUpdateModal;
