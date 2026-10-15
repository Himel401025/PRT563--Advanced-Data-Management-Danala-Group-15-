import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, Rocket, DollarSign, Clock, CheckCircle, ShieldAlert, ArrowUpRight } from 'lucide-react';

const WithdrawalsTab = ({ 
    selectedCampaignForWithdrawal, 
    setSelectedCampaignForWithdrawal, 
    data, 
    fetchWithdrawalStats, 
    withdrawalStats, 
    setShowPayoutModal 
}) => {
    const [expandedWithdrawal, setExpandedWithdrawal] = useState(null);

    return (
        <motion.div key="withdrawals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {!selectedCampaignForWithdrawal ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {data.campaigns.map(c => (
                        <div key={c._id} onClick={() => fetchWithdrawalStats(c._id)} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-black/5 cursor-pointer hover:border-custom-yellow transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-black text-custom-black group-hover:text-custom-yellow transition-colors">{c.title}</h3>
                                <ArrowUpRight className="text-gray-300 group-hover:text-custom-yellow" />
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Raised</p>
                                    <p className="text-2xl font-black text-custom-blue">${c.totalRaised}</p>
                                </div>
                                <div className="w-px h-10 bg-gray-100" />
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-xl font-black text-custom-yellow uppercase tracking-tight">{c.status}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-10">
                    <button onClick={() => { setSelectedCampaignForWithdrawal(null); }} className="flex items-center gap-2 text-gray-400 font-black uppercase text-xs tracking-widest hover:text-custom-black transition-all">
                        <XCircle size={16} /> Back to Projects
                    </button>

                    {/* Financial Studio Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-custom-black p-10 rounded-[40px] text-custom-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Available for Withdrawal Now</p>
                                    <p className="text-6xl font-black text-custom-yellow tracking-tighter">${withdrawalStats?.currentAvailable?.toLocaleString()}</p>
                                    <div className="mt-8 flex flex-wrap gap-4">
                                        <button 
                                            onClick={() => setShowPayoutModal(true)}
                                            className="bg-custom-yellow text-custom-black px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-yellow-500/20"
                                        >
                                            <ArrowUpRight size={24} /> Request Payout
                                        </button>
                                    </div>
                                </div>
                                <DollarSign className="absolute right-[-20px] bottom-[-20px] text-white/5 w-64 h-64 rotate-12" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={`p-8 rounded-[32px] border-2 transition-all ${withdrawalStats?.stage1?.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stage 1: Operation Funds (70%)</p>
                                        {withdrawalStats?.stage1?.unlocked ? <CheckCircle className="text-green-500" /> : <Clock className="text-gray-300" />}
                                    </div>
                                    <p className="text-3xl font-black text-custom-black">${withdrawalStats?.stage1?.total?.toLocaleString()}</p>
                                    <p className="text-xs font-bold text-gray-500 mt-2">Unlocked when campaign ends successfully.</p>
                                </div>
                                <div className={`p-8 rounded-[32px] border-2 transition-all ${withdrawalStats?.stage2?.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stage 2: Final Payout (30%)</p>
                                        {withdrawalStats?.stage2?.unlocked ? <CheckCircle className="text-green-500" /> : <ShieldAlert className="text-red-300" />}
                                    </div>
                                    <p className="text-3xl font-black text-custom-black">${withdrawalStats?.stage2?.total?.toLocaleString()}</p>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            <span>Backer Confirmations</span>
                                            <span>{withdrawalStats?.stage2?.confirmationRate}% / 80%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-custom-blue transition-all" style={{ width: `${Math.min(100, (withdrawalStats?.stage2?.confirmationRate / 80) * 100)}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5">
                                <h4 className="text-sm font-black text-custom-black uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Funding Summary</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 font-bold">Gross Raised</span>
                                        <span className="font-black text-custom-black">${withdrawalStats?.totalRaised?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 font-bold">Platform Fee (10%)</span>
                                        <span className="font-black text-red-500">-${(withdrawalStats?.totalRaised - withdrawalStats?.netFunds)?.toLocaleString()}</span>
                                    </div>
                                    <div className="h-px bg-gray-100 my-2" />
                                    <div className="flex justify-between text-lg">
                                        <span className="text-custom-black font-black uppercase tracking-tighter">Net Funds</span>
                                        <span className="font-black text-custom-blue">${withdrawalStats?.netFunds?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-400 mt-4">
                                        <span className="font-bold italic">Total Withdrawn</span>
                                        <span className="font-black">${withdrawalStats?.totalWithdrawn?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-8 rounded-[32px] border border-blue-100">
                                <div className="flex items-center gap-3 mb-4 text-custom-blue">
                                    <ShieldAlert size={20} />
                                    <h4 className="font-black text-xs uppercase tracking-widest">Trust Policy</h4>
                                </div>
                                <p className="text-xs font-bold text-blue-800 leading-relaxed">
                                    Funds are released in a 70/30 split to protect backers. Confirm your rewards are delivered to unlock the final 30%.
                                </p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-custom-black flex items-center gap-3 ml-4">
                        <Clock className="text-custom-blue" /> Project Transaction History
                    </h2>
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Payout</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Breakdown</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-[13px]">
                                {data.withdrawals.filter(w => w.campaignId?._id === selectedCampaignForWithdrawal).length > 0 ? (
                                    data.withdrawals.filter(w => w.campaignId?._id === selectedCampaignForWithdrawal).map(w => (
                                        <React.Fragment key={w._id}>
                                            <tr 
                                                onClick={() => setExpandedWithdrawal(expandedWithdrawal === w._id ? null : w._id)}
                                                className={`hover:bg-gray-50/50 transition-all cursor-pointer ${expandedWithdrawal === w._id ? 'bg-gray-50/80' : ''}`}
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-black text-custom-black">${w.netAmount?.toLocaleString()}</p>
                                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                                                            w.stage === 1 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                                        }`}>
                                                            Stage {w.stage || 1} ({w.stage === 2 ? '30%' : '70%'})
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <div className="flex flex-col items-center gap-0.5">
                                                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Gross: ${w.requestedAmount?.toLocaleString()}</p>
                                                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Fee: -${w.platformFee?.toLocaleString()}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{w.method} • {w.accountNumber}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${
                                                            w.status === 'completed' ? 'bg-green-100 text-green-600' : 
                                                            w.status === 'rejected' ? 'bg-red-100 text-red-600' : 
                                                            w.status === 'approved' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                                                        }`}>
                                                            {w.status}
                                                        </span>
                                                        {(w.paymentProof || w.adminComment || w.rejectionReason) && (
                                                            <span className="text-[8px] font-black text-custom-blue uppercase tracking-widest flex items-center gap-1">
                                                                {expandedWithdrawal === w._id ? 'Click to hide details' : 'Click to view details'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right text-xs font-bold text-gray-400">
                                                    {new Date(w.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                            
                                            {/* Expandable Details Row */}
                                            <AnimatePresence>
                                                {expandedWithdrawal === w._id && (
                                                    <tr>
                                                        <td colSpan="5" className="px-8 py-0 border-none overflow-hidden">
                                                            <motion.div 
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                                className="py-6 border-t border-gray-100"
                                                            >
                                                                <div className="grid md:grid-cols-2 gap-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                                                    {w.status === 'rejected' ? (
                                                                        <div className="col-span-full">
                                                                            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Rejection Reason</p>
                                                                            <p className="text-sm font-bold text-gray-600 bg-red-50/50 p-4 rounded-xl border border-red-100">
                                                                                {w.rejectionReason || 'No reason provided'}
                                                                            </p>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            {w.adminComment && (
                                                                                <div>
                                                                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Admin Comment</p>
                                                                                    <p className="text-sm font-bold text-gray-600">{w.adminComment}</p>
                                                                                </div>
                                                                            )}
                                                                            {w.paymentProof && (
                                                                                <div>
                                                                                    <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">Payment Proof / Reference</p>
                                                                                    <p className="text-sm font-black text-custom-black bg-white p-3 rounded-lg border border-gray-100 shadow-sm w-fit">{w.paymentProof}</p>
                                                                                </div>
                                                                            )}
                                                                            {(!w.adminComment && !w.paymentProof && w.status === 'completed') && (
                                                                                <p className="col-span-full text-xs font-bold text-gray-400 italic">No additional details provided for this transaction.</p>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </AnimatePresence>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <p className="text-gray-400 font-bold uppercase tracking-widest">No transaction history yet</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default WithdrawalsTab;
