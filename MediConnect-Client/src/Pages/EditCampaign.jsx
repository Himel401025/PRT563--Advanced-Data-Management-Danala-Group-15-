import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { 
    Image as ImageIcon, 
    Type, 
    Target, 
    Calendar, 
    CheckCircle2, 
    ChevronLeft,
    Info,
    Save,
    Lock,
    ShieldAlert,
    Clock
} from 'lucide-react';

const EditCampaign = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        tagline: '',
        category: '',
        fundingGoal: '',
        deadline: '',
        description: '',
        thumbnail: ''
    });

    const categories = ['Technology', 'Environment', 'Education', 'Social Cause', 'Health', 'Creative'];

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await api.get(`/campaigns/${id}`);
                const { campaign } = response.data;
                setFormData({
                    title: campaign.title,
                    tagline: campaign.tagline,
                    category: campaign.category,
                    fundingGoal: campaign.fundingGoal,
                    deadline: campaign.deadline.split('T')[0],
                    description: campaign.description,
                    thumbnail: campaign.thumbnail
                });
            } catch (error) {
                console.error('Error fetching campaign:', error);
                alert('Failed to load campaign data');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            // Remove title and fundingGoal from the update payload
            const { title, fundingGoal, ...updateData } = formData;
            
            await api.patch(`/campaigns/${id}`, updateData);
            alert('Campaign updated successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update campaign.');
        } finally {
            setUpdating(false);
        }
    };

    const handleExpireNow = async () => {
        if (!window.confirm('DEV ONLY: This will set the deadline to NOW and mark the project as successful. Proceed?')) return;
        try {
            await api.patch(`/campaigns/${id}/test/expire-now`);
            alert('Campaign expired! You can now test post-campaign features.');
            navigate('/dashboard?tab=my-projects');
        } catch (error) {
            alert('Action failed');
        }
    };

    const handleResetDeadline = async () => {
        if (!window.confirm('DEV ONLY: This will reset the deadline to 30 days from now and set status to active. Proceed?')) return;
        try {
            await api.patch(`/campaigns/${id}/test/reset-deadline`);
            alert('Campaign deadline reset! The project is now active again.');
            navigate('/dashboard?tab=my-projects');
        } catch (error) {
            alert('Action failed');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-custom-black text-custom-yellow">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-yellow"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="bg-custom-black pt-20 pb-40">
                <div className="max-w-4xl mx-auto px-4">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-400 hover:text-custom-white flex items-center gap-2 mb-8 font-bold text-sm uppercase tracking-widest transition-colors"
                    >
                        <ChevronLeft size={16} /> Back to Dashboard
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black text-custom-white mb-4 uppercase tracking-tighter">
                        Edit <span className="text-custom-yellow">Campaign</span>
                    </h1>
                    <p className="text-gray-400 font-bold">Update your project details to keep your backers informed.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-24">
                <form onSubmit={handleSubmit} className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 md:p-12 space-y-10">
                    {/* Fixed Info Section */}
                    <div className="grid md:grid-cols-2 gap-8 p-8 bg-gray-50 rounded-3xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Lock size={120} />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                <Lock size={12} className="text-gray-400" /> Campaign Title
                            </label>
                            <p className="text-xl font-black text-gray-800">{formData.title}</p>
                            <p className="text-[10px] font-bold text-gray-400">Title cannot be changed after submission.</p>
                        </div>
                        <div className="space-y-2 relative z-10">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                <Lock size={12} className="text-gray-400" /> Funding Goal
                            </label>
                            <p className="text-xl font-black text-custom-blue">${formData.fundingGoal}</p>
                            <p className="text-[10px] font-bold text-gray-400">Goal cannot be changed after submission.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">Category</label>
                            <select 
                                required
                                name="category" 
                                value={formData.category} 
                                onChange={handleInputChange} 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none py-4 px-6 rounded-2xl font-bold transition-all"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2"><Calendar size={14}/> Deadline</label>
                            <input 
                                required
                                type="date" 
                                name="deadline" 
                                value={formData.deadline} 
                                onChange={handleInputChange} 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none py-4 px-6 rounded-2xl font-bold transition-all" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Short Tagline</label>
                        <input 
                            required
                            name="tagline" 
                            value={formData.tagline} 
                            onChange={handleInputChange} 
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none py-4 px-6 rounded-2xl font-bold transition-all" 
                            placeholder="One sentence description" 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2"><ImageIcon size={14}/> Thumbnail Image URL</label>
                        <input 
                            required
                            name="thumbnail" 
                            value={formData.thumbnail} 
                            onChange={handleInputChange} 
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none py-4 px-6 rounded-2xl font-bold transition-all" 
                            placeholder="https://example.com/image.jpg" 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Project Story</label>
                        <textarea 
                            required
                            name="description" 
                            value={formData.description} 
                            onChange={handleInputChange} 
                            rows="12" 
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none py-4 px-6 rounded-2xl font-bold transition-all resize-none" 
                            placeholder="Explain your vision in detail..." 
                        />
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex justify-end">
                        <button 
                            type="submit"
                            disabled={updating}
                            className="bg-custom-yellow text-custom-black flex items-center gap-3 font-black text-lg uppercase tracking-widest px-12 py-5 rounded-2xl hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-yellow-500/20 disabled:opacity-50"
                        >
                            {updating ? 'Saving Changes...' : 'Save Changes'} <Save size={20} />
                        </button>
                    </div>

                    {/* Developer Test Tools */}
                    <div className="pt-10 mt-10 border-t-4 border-dashed border-red-100 p-8 rounded-[40px] bg-red-50/30">
                        <div className="flex items-center gap-3 mb-6 text-red-400">
                            <ShieldAlert size={24} />
                            <h2 className="text-xl font-black uppercase tracking-widest">Developer Test Tools</h2>
                        </div>
                        <p className="text-sm font-bold text-gray-500 mb-6 italic">Use these tools to bypass platform time constraints for testing purposes only.</p>
                        <div className="flex flex-wrap gap-4">
                            <button 
                                type="button"
                                onClick={handleExpireNow}
                                className="bg-red-500 text-white flex items-center gap-3 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                            >
                                <Clock size={16} /> Set Deadline to NOW & Mark Successful
                            </button>
                            <button 
                                type="button"
                                onClick={handleResetDeadline}
                                className="bg-blue-500 text-white flex items-center gap-3 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                            >
                                <Clock size={16} /> Reset Deadline (30 Days) & Set Active
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCampaign;
