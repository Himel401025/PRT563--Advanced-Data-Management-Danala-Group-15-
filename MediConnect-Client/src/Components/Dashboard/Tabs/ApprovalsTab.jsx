import React from 'react';
import { motion } from 'framer-motion';
import { Eye, XCircle } from 'lucide-react';

const ApprovalsTab = ({ 
    data, 
    navigate, 
    handleApprove, 
    handleToggleCampaignBan 
}) => {
    return (
        <motion.div key="approvals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {data.pendingApprovals.length > 0 ? data.pendingApprovals.map(campaign => (
                <div key={campaign._id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6 flex-grow">
                        <img src={campaign.thumbnail} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                            <div>
                                <h3 className="text-xl font-black text-custom-black">{campaign.title}</h3>
                                <p className="text-sm font-bold text-gray-400 italic">By {campaign.creatorId?.name} • ${campaign.fundingGoal} Goal</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    campaign.status === 'active' ? 'bg-green-100 text-green-600' : 
                                    campaign.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                    campaign.status === 'banned' ? 'bg-red-100 text-red-600' :
                                    'bg-gray-100 text-gray-600'
                                }`}>
                                    {campaign.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(`/campaign/${campaign._id}`)} className="p-4 bg-gray-50 text-gray-400 hover:text-custom-black rounded-2xl transition-all" title="View"><Eye size={20}/></button>
                        
                        {campaign.status === 'pending' && (
                            <>
                                <button onClick={() => handleApprove(campaign._id, false)} className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all" title="Reject"><XCircle size={20}/></button>
                                <button onClick={() => handleApprove(campaign._id, true)} className="px-8 py-4 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20">APPROVE</button>
                            </>
                        )}

                        {campaign.status !== 'successful' && (
                            <button 
                                onClick={() => handleToggleCampaignBan(campaign._id)}
                                className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                                    campaign.status === 'banned' 
                                    ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white' 
                                    : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                                }`}
                            >
                                {campaign.status === 'banned' ? 'Restore' : 'Ban'}
                            </button>
                        )}
                    </div>
                </div>
            )) : (
                <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest">No campaigns to display</p>
                </div>
            )}
        </motion.div>
    );
};

export default ApprovalsTab;
