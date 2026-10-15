import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, Rocket, ArrowUpRight } from 'lucide-react';

const BackerManagementTab = ({ 
    selectedCampaignForBackers, 
    setSelectedCampaignForBackers, 
    data, 
    handleFetchBackers, 
    handleUpdateCampaignProgress, 
    updatingCampaignProgress, 
    backerStatusFilter, 
    setBackerStatusFilter, 
    updatingBackerStatus, 
    handleUpdateBackerStatus 
}) => {
    return (
        <motion.div key="backer-management" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {!selectedCampaignForBackers ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {data.campaigns.map(c => (
                        <div key={c._id} onClick={() => handleFetchBackers(c._id)} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-black/5 cursor-pointer hover:border-custom-yellow transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-black text-custom-black group-hover:text-custom-yellow transition-colors">{c.title}</h3>
                                <ArrowUpRight className="text-gray-300 group-hover:text-custom-yellow" />
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Backers</p>
                                    <p className="text-2xl font-black text-custom-black">{c.backerCount}</p>
                                </div>
                                <div className="w-px h-10 bg-gray-100" />
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Raised</p>
                                    <p className="text-2xl font-black text-custom-blue">${c.totalRaised}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-10">
                    <button onClick={() => setSelectedCampaignForBackers(null)} className="flex items-center gap-2 text-gray-400 font-black uppercase text-xs tracking-widest hover:text-custom-black transition-all">
                        <XCircle size={16} /> Back to Projects
                    </button>

                    {/* Campaign Progress Control */}
                    <section className="bg-custom-black p-10 rounded-[40px] text-custom-white">
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <Rocket className="text-custom-yellow" /> Global Fulfillment Progress
                        </h3>
                        <form onSubmit={handleUpdateCampaignProgress} className="grid md:grid-cols-3 gap-6 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Current Stage</label>
                                <select name="status" className="w-full bg-white/5 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all text-custom-white" defaultValue={data.campaignBackers?.campaign?.rewardProgressStatus || 'not_started'}>
                                    <option value="not_started" className="bg-custom-black">Not Started</option>
                                    <option value="manufacturing" className="bg-custom-black">Manufacturing</option>
                                    <option value="warehouse" className="bg-custom-black">In Warehouse</option>
                                    <option value="transported" className="bg-custom-black">Transported to Destination</option>
                                    <option value="delivered" className="bg-custom-black">All Delivered</option>
                                </select>
                            </div>
                            <div className="space-y-2 md:col-span-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Estimated Info / Note</label>
                                <input name="note" className="w-full bg-white/5 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all text-custom-white" defaultValue={data.campaignBackers?.campaign?.rewardProgressNote || ''} placeholder="e.g. Estimated 2-3 days" />
                            </div>
                            <button disabled={updatingCampaignProgress} type="submit" className="bg-custom-yellow text-custom-black py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-yellow-500/20">
                                {updatingCampaignProgress ? 'Updating...' : 'Update Progress'}
                            </button>
                        </form>
                    </section>

                    {/* Backer Tabs */}
                    <div className="flex gap-4 p-1 bg-gray-200/50 rounded-2xl w-fit">
                        <button onClick={() => setBackerStatusFilter('remaining')} className={`px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${backerStatusFilter === 'remaining' ? 'bg-white text-custom-black shadow-md' : 'text-gray-500 hover:text-custom-black'}`}>Remaining</button>
                        <button onClick={() => setBackerStatusFilter('sent')} className={`px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${backerStatusFilter === 'sent' ? 'bg-white text-custom-black shadow-md' : 'text-gray-500 hover:text-custom-black'}`}>Rewards Sent</button>
                    </div>

                    {/* Backer List grouped by Tier */}
                    <div className="space-y-12">
                        {data.campaignBackers?.rewardTiers.map(tier => {
                            const tierBackers = data.campaignBackers?.backers.filter(b => 
                                b.matchedTiers.some(t => t._id === tier._id) &&
                                (backerStatusFilter === 'sent' 
                                    ? b.donations.some(d => (d.rewardDelivery.status === 'sent' || d.rewardDelivery.status === 'delivered'))
                                    : b.donations.some(d => (d.rewardDelivery.status === 'pending' || d.rewardDelivery.status === 'shipped'))
                                )
                            );

                            if (tierBackers.length === 0) return null;

                            return (
                                <div key={tier._id} className="space-y-6">
                                    <div className="flex items-center gap-4 ml-4">
                                        <div className="w-12 h-12 rounded-2xl bg-custom-yellow/20 flex items-center justify-center font-black text-custom-yellow text-xl">
                                            ${tier.minimumAmount}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-custom-black uppercase tracking-tighter">{tier.title}</h4>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{tier.type} Reward • {tierBackers.length} Backers</p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Backer</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Info</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {tierBackers.map(b => (
                                                    <tr key={b.backer._id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-8 py-6">
                                                            <p className="font-black text-custom-black">{b.backer.name}</p>
                                                            <p className="text-xs font-bold text-gray-400">{b.backer.email}</p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            {tier.type === 'email' ? (
                                                                <span className="text-xs font-bold text-custom-blue">Will be sent to email</span>
                                                            ) : (
                                                                <p className="text-xs font-bold text-gray-500 max-w-[200px] leading-snug">{b.backer.address || 'No address provided'}</p>
                                                            )}
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <p className="font-black text-custom-black">${b.totalContributed}</p>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            {b.donations.map(d => {
                                                                const isFulfilled = d.rewardDelivery?.fulfilledRewardTierIds?.includes(tier._id);
                                                                return (
                                                                    <button 
                                                                        key={d._id}
                                                                        disabled={updatingBackerStatus === `${d._id}-${tier._id}`}
                                                                        onClick={() => handleUpdateBackerStatus(d._id, tier._id, !isFulfilled)}
                                                                        className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                                                            isFulfilled
                                                                            ? 'bg-green-50 text-green-600 border border-green-100'
                                                                            : 'bg-custom-yellow text-custom-black hover:scale-105'
                                                                        }`}
                                                                    >
                                                                        {updatingBackerStatus === `${d._id}-${tier._id}` ? '...' : (isFulfilled ? 'FULFILLED' : `MARK AS ${tier.type === 'email' ? 'SENT' : 'DELIVERED'}`)}
                                                                    </button>
                                                                );
                                                            })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default BackerManagementTab;
