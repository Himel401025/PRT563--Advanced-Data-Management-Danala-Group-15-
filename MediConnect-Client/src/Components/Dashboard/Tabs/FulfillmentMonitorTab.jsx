import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, Clock } from 'lucide-react';

const FulfillmentMonitorTab = ({ 
    data 
}) => {
    return (
        <motion.div key="fulfillment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Project / Creator</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Progress</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Confirmation Rate</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stage</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Risk</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.fulfillmentStats.length > 0 ? data.fulfillmentStats.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <div>
                                        <p className="font-black text-custom-black">{s.title}</p>
                                        <p className="text-xs font-bold text-gray-400">By {s.creator?.name}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-full max-w-[120px] h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all ${parseFloat(s.deliveryRate) > 80 ? 'bg-green-500' : 'bg-custom-yellow'}`} 
                                                style={{ width: `${s.deliveryRate}%` }} 
                                            />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                            {s.deliveredRewards} / {s.totalRewards} ({s.deliveryRate}%)
                                        </p>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="font-black text-custom-black text-sm">{s.confirmationRate}%</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                            {s.confirmedRewards} Backers Confirmed
                                        </p>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        s.rewardProgressStatus === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                        {s.rewardProgressStatus?.replace('_', ' ') || 'Pending'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    {s.isHighRisk ? (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest">
                                            <ShieldAlert size={14} /> High Risk
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl font-black text-[10px] uppercase tracking-widest">
                                            <CheckCircle size={14} /> Low Risk
                                        </span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest">No successful campaigns to monitor</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default FulfillmentMonitorTab;
