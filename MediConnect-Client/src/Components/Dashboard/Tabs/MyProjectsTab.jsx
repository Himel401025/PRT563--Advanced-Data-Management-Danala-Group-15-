import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Users as UsersIcon } from 'lucide-react';

const MyProjectsTab = ({ 
    data, 
    navigate, 
    setSearchParams, 
    setStoryForm, 
    user 
}) => {
    return (
        <motion.div key="projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-8">
            {data.campaigns.length > 0 ? data.campaigns.map(campaign => (
                <div key={campaign._id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            campaign.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-custom-yellow/20 text-custom-yellow'
                        }`}>
                            {campaign.status}
                        </div>
                        <button 
                            onClick={() => navigate(`/edit-campaign/${campaign._id}`)}
                            className="text-gray-400 hover:text-custom-black transition-all"
                        >
                            <Settings size={20}/>
                        </button>
                    </div>
                    <h3 className="text-2xl font-black text-custom-black mb-4">{campaign.title}</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm font-bold">
                            <span className="text-gray-400 uppercase tracking-widest">Raised</span>
                            <span className="text-custom-blue">${campaign.totalRaised} / ${campaign.fundingGoal}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-custom-blue" style={{ width: `${(campaign.totalRaised/campaign.fundingGoal)*100}%` }} />
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <UsersIcon size={16} className="text-gray-400" />
                            <span className="font-bold text-sm text-gray-500">{campaign.backerCount} Backers</span>
                        </div>
                        <div className="flex gap-4">
                            {campaign.status === 'successful' && (
                                <button 
                                    onClick={() => {
                                        setSearchParams({ tab: 'success-stories' });
                                        setStoryForm({
                                            title: `Success: ${campaign.title}`,
                                            category: campaign.category,
                                            raised: `$${campaign.totalRaised}`,
                                            backers: campaign.backerCount,
                                            image: campaign.thumbnail,
                                            quote: '',
                                            author: user?.name,
                                            role: 'Project Creator'
                                        });
                                    }}
                                    className="bg-green-500 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all"
                                >
                                    Promote to Success Story
                                </button>
                            )}
                            <button onClick={() => navigate(`/campaign/${campaign._id}`)} className="text-custom-black font-black text-sm hover:underline">View Public Page</button>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest">No projects found</p>
                </div>
            )}
        </motion.div>
    );
};

export default MyProjectsTab;
