import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CreatorApplicationModal = ({ 
    isOpen, 
    onClose, 
    handleApplyCreator, 
    creatorForm, 
    setCreatorForm, 
    applyingCreator 
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-custom-black/80 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden" >
                        <div className="p-8 md:p-12">
                            <h2 className="text-3xl font-black text-custom-black uppercase tracking-tighter mb-4">Creator Application</h2>
                            <p className="text-gray-500 font-bold mb-8">Please provide additional information for verification.</p>
                            <form onSubmit={handleApplyCreator} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">National ID (NID)</label>
                                    <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={creatorForm.nid} onChange={e => setCreatorForm({...creatorForm, nid: e.target.value})} placeholder="XXXX-XXXX-XXXX" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Physical Address</label>
                                    <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={creatorForm.address} onChange={e => setCreatorForm({...creatorForm, address: e.target.value})} placeholder="House, Road, City" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Phone Number</label>
                                    <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={creatorForm.phone} onChange={e => setCreatorForm({...creatorForm, phone: e.target.value})} placeholder="+880 1XXX-XXXXXX" />
                                </div>
                                <button disabled={applyingCreator} type="submit" className="w-full bg-custom-black text-custom-white py-5 rounded-2xl font-black text-lg hover:bg-custom-yellow hover:text-custom-black transition-all shadow-xl shadow-black/10 disabled:opacity-50" >
                                    {applyingCreator ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreatorApplicationModal;
