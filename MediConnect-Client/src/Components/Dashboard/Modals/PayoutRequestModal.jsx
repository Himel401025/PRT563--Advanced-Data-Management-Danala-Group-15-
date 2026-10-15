import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet } from 'lucide-react';

const PayoutRequestModal = ({ 
    isOpen, 
    onClose, 
    handleRequestPayout, 
    withdrawalStats, 
    payoutForm, 
    setPayoutForm, 
    requestingPayout 
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-custom-black/80 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden" >
                        <div className="p-8 md:p-12">
                            <h2 className="text-3xl font-black text-custom-black uppercase tracking-tighter mb-4 flex items-center gap-3">
                                <Wallet className="text-custom-yellow" /> Request Payout
                            </h2>
                            <p className="text-gray-500 font-bold mb-8">Funds will be transferred to your specified account after admin review.</p>
                            <form onSubmit={handleRequestPayout} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Amount to Withdraw (Max: ${withdrawalStats?.currentAvailable})</label>
                                    <input required type="number" max={withdrawalStats?.currentAvailable} className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={payoutForm.amount} onChange={e => setPayoutForm({...payoutForm, amount: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Transfer Method</label>
                                    <select className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={payoutForm.method} onChange={e => setPayoutForm({...payoutForm, method: e.target.value})}>
                                        <option>Bank Transfer</option>
                                        <option>Bkash</option>
                                        <option>Nagad</option>
                                        <option>Paypal</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Account Details (Number / IBAN)</label>
                                    <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={payoutForm.accountNumber} onChange={e => setPayoutForm({...payoutForm, accountNumber: e.target.value})} placeholder="e.g. 017XXXXXXXX or Account No." />
                                </div>
                                <button disabled={requestingPayout} type="submit" className="w-full bg-custom-black text-custom-white py-5 rounded-2xl font-black text-lg hover:bg-custom-yellow hover:text-custom-black transition-all shadow-xl shadow-black/10 disabled:opacity-50" >
                                    {requestingPayout ? 'SUBMITTING...' : 'REQUEST WITHDRAWAL'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PayoutRequestModal;
