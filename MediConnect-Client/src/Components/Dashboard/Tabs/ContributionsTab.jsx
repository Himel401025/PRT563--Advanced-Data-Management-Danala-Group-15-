import React from 'react';
import { motion } from 'framer-motion';

const ContributionsTab = ({ 
    data 
}) => {
    return (
        <motion.div key="contributions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Backer / Project</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.contributions.length > 0 ? data.contributions.map(c => (
                            <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-custom-blue/10 flex items-center justify-center font-black text-custom-blue">
                                            {c.isAnonymous ? 'A' : (c.backerId?.name?.[0] || '?')}
                                        </div>
                                        <div>
                                            <p className="font-black text-custom-black">
                                                {c.isAnonymous ? 'Anonymous Donor' : (c.backerId?.name || 'Unknown User')}
                                            </p>
                                            <p className="text-xs font-bold text-gray-400 truncate max-w-[200px]">
                                                {c.campaignId?.title || 'Deleted Campaign'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="font-black text-custom-black">{c.amount} {c.currency}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{c.payment?.gateway}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        c.status === 'charged' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                    }`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right text-xs font-bold text-gray-400">
                                    {new Date(c.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest">No contributions found yet</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default ContributionsTab;
