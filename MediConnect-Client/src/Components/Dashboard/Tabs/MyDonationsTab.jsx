import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const MyDonationsTab = ({ data }) => {
    return (
        <motion.div 
            key="donations" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
        >
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Project</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Method</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.donations.length > 0 ? (
                            data.donations.map(d => (
                                <tr key={d._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-custom-yellow/10 flex items-center justify-center text-custom-yellow">
                                                <Heart size={18} />
                                            </div>
                                            <div>
                                                <p className="font-black text-custom-black truncate max-w-[250px]">
                                                    {d.campaignId?.title || 'Unknown Project'}
                                                </p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    By {d.campaignId?.creatorId?.name || 'Unknown Creator'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-black text-custom-black">{d.amount} {d.currency}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            {d.payment?.gateway || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            d.status === 'charged' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right text-sm font-bold text-gray-400">
                                        {new Date(d.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest">You haven't made any donations yet</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default MyDonationsTab;
