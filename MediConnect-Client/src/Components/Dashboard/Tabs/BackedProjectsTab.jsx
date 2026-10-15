import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, CheckCircle, Clock } from 'lucide-react';

const BackedProjectsTab = ({ 
    data, 
    confirmingDelivery, 
    handleConfirmDelivery 
}) => {
    return (
        <motion.div key="backed-projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {Array.from(new Set(data.donations.map(d => d.campaignId?._id))).map(campaignId => {
                const projectDonations = data.donations.filter(d => d.campaignId?._id === campaignId);
                const campaign = projectDonations[0].campaignId;
                const totalContributed = projectDonations.reduce((acc, d) => acc + d.amount, 0);
                const isCampaignEnded = new Date(campaign.deadline) < new Date();

                return (
                    <div key={campaignId} className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden group">
                        <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10">
                            <img src={campaign.thumbnail} className="w-full md:w-64 h-64 md:h-48 rounded-[32px] object-cover" alt="" />
                            <div className="flex-grow space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-3xl font-black text-custom-black uppercase tracking-tighter">{campaign.title}</h3>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">By {campaign.creatorId?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Contributed</p>
                                        <p className="text-3xl font-black text-custom-blue">${totalContributed}</p>
                                    </div>
                                </div>

                                {/* Reward Tiers Reached */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <Rocket size={14} className="text-custom-yellow" /> Reward Tiers Reached
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {campaign.rewardTiers?.filter(tier => totalContributed >= tier.minimumAmount).map(tier => {
                                            const relevantDonation = projectDonations.find(d => d.rewardDelivery?.fulfilledRewardTierIds?.includes(tier._id));
                                            const isFulfilled = !!relevantDonation;
                                            const isConfirmed = relevantDonation?.rewardDelivery?.confirmedRewardTierIds?.includes(tier._id);
                                            
                                            return (
                                                <div key={tier._id} className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-4">
                                                    <div>
                                                        <p className="font-black text-custom-black text-sm">{tier.title}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className={`w-2 h-2 rounded-full ${isFulfilled ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                                {isConfirmed ? 'CONFIRMED' : isFulfilled ? 'FULFILLED' : 'PENDING'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {isFulfilled && !isConfirmed && (
                                                        <button 
                                                            disabled={confirmingDelivery}
                                                            onClick={() => handleConfirmDelivery(relevantDonation._id, tier._id)}
                                                            className="bg-custom-yellow text-custom-black px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-md"
                                                        >
                                                            {confirmingDelivery ? '...' : 'Confirm Receipt'}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {campaign.rewardTiers?.filter(tier => totalContributed >= tier.minimumAmount).length === 0 && (
                                            <p className="text-xs font-bold text-gray-400 italic">No tiers reached yet</p>
                                        )}
                                    </div>
                                </div>

                                {/* Delivery Status */}
                                <div className="pt-6 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Project Progress</p>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-2xl ${isCampaignEnded ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {isCampaignEnded ? <CheckCircle size={24} /> : <Clock size={24} />}
                                            </div>
                                            <div>
                                                <p className="font-black text-custom-black uppercase text-sm">{isCampaignEnded ? 'Campaign Ended' : 'Funding Period'}</p>
                                                <p className="text-xs font-bold text-gray-400">
                                                    {isCampaignEnded ? 'Rewards will be fulfilled soon' : `Ends on ${new Date(campaign.deadline).toLocaleDateString()}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {isCampaignEnded && (
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fulfillment Status</p>
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-custom-yellow/10 text-custom-yellow rounded-2xl">
                                                    <Rocket size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-custom-black uppercase text-sm">
                                                        {campaign.rewardProgressStatus?.replace('_', ' ') || 'Preparing'}
                                                    </p>
                                                    <p className="text-xs font-bold text-gray-400">
                                                        {campaign.rewardProgressNote || 'Estimated 2-3 weeks for manufacturing'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            {data.donations.length === 0 && (
                <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest">No backed projects found</p>
                </div>
            )}
        </motion.div>
    );
};

export default BackedProjectsTab;
