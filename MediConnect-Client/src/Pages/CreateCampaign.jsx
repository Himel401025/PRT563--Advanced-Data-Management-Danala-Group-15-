import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    PlusCircle, 
    Image as ImageIcon, 
    Type, 
    Target, 
    Calendar, 
    Gift, 
    CheckCircle2, 
    ChevronRight, 
    ChevronLeft,
    Trash2,
    Info,
    ShieldCheck
} from 'lucide-react';

const CreateCampaign = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        tagline: '',
        category: 'Technology',
        campaignType: 'reward',
        fundingGoal: '',
        fundingModel: 'all-or-nothing',
        deadline: '',
        description: '',
        thumbnail: '',
        rewardTiers: []
    });

    const [currentTier, setCurrentTier] = useState({
        title: '',
        description: '',
        minimumAmount: '',
        type: 'physical', // Added type
        isLimited: false,
        totalSlots: ''
    });

    const categories = ['Technology', 'Environment', 'Education', 'Social Cause', 'Health', 'Creative'];

    const validateStep = () => {
        if (step === 1) {
            return formData.title && formData.tagline && formData.fundingGoal && formData.deadline;
        }
        if (step === 2) {
            return formData.thumbnail && formData.description;
        }
        if (step === 3) {
            return formData.rewardTiers.length > 0;
        }
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addTier = () => {
        if (!currentTier.title || !currentTier.minimumAmount || !currentTier.description || (currentTier.isLimited && !currentTier.totalSlots)) {
            alert('Please fill in all reward tier fields');
            return;
        }
        setFormData(prev => ({
            ...prev,
            rewardTiers: [...prev.rewardTiers, { ...currentTier, id: Date.now() }]
        }));
        setCurrentTier({ title: '', description: '', minimumAmount: '', type: 'physical', isLimited: false, totalSlots: '' });
    };

    const removeTier = (id) => {
        setFormData(prev => ({
            ...prev,
            rewardTiers: prev.rewardTiers.filter(t => t.id !== id)
        }));
    };

    const handleSubmit = async () => {
        if (!validateStep()) {
            alert('Please complete all fields before launching.');
            return;
        }
        setLoading(true);
        try {
            // 1. Create the campaign
            const campaignRes = await api.post('/campaigns', {
                ...formData,
                fundingGoal: Number(formData.fundingGoal)
            });
            const campaignId = campaignRes.data.campaign._id;

            // 2. Add reward tiers if any
            if (formData.rewardTiers.length > 0) {
                for (const tier of formData.rewardTiers) {
                    await api.post(`/campaigns/${campaignId}/reward-tiers`, {
                        ...tier,
                        minimumAmount: Number(tier.minimumAmount),
                        availability: {
                            isLimited: tier.isLimited,
                            totalSlots: tier.isLimited ? Number(tier.totalSlots) : null
                        }
                    });
                }
            }
            setSubmitted(true);
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to create campaign. Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) return (
        <div className="min-h-screen bg-custom-white flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full text-center bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-black text-custom-black mb-4">SUBMITTED!</h2>
                <p className="text-gray-500 font-bold mb-8">Your vision is now in our hands. Our team will review your campaign and get it live within 24 hours.</p>
                <button onClick={() => navigate('/dashboard')} className="w-full bg-custom-black text-custom-white py-5 rounded-2xl font-black hover:bg-gray-900 transition-all">
                    Go to Dashboard
                </button>
            </motion.div>
        </div>
    );

    const handleNext = () => {
        if (validateStep()) {
            setStep(s => s + 1);
        } else {
            if (step === 3) {
                alert('Please add at least one reward tier.');
            } else {
                alert('Please fill in all required fields.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="bg-custom-black pt-20 pb-40">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-black text-custom-white mb-4 uppercase tracking-tighter">
                        Create Your <span className="text-custom-yellow">Legacy</span>
                    </h1>
                    <p className="text-gray-400 font-bold">Step {step} of 4: {['Basics', 'Story', 'Rewards', 'Review'][step-1]}</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/10 mt-8 rounded-full overflow-hidden">
                        <motion.div animate={{ width: `${(step/4)*100}%` }} className="h-full bg-custom-yellow shadow-[0_0_15px_rgba(255,204,0,0.5)]" />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-24">
                <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2"><Type size={14}/> Campaign Title</label>
                                        <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none py-4 px-6 rounded-2xl font-bold transition-all" placeholder="Enter a catchy title" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">Category</label>
                                        <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none py-4 px-6 rounded-2xl font-bold transition-all">
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">Short Tagline</label>
                                    <input required name="tagline" value={formData.tagline} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none py-4 px-6 rounded-2xl font-bold transition-all" placeholder="One sentence description" />
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2"><Target size={14}/> Funding Goal ($)</label>
                                        <input required type="number" name="fundingGoal" value={formData.fundingGoal} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none py-4 px-6 rounded-2xl font-bold transition-all" placeholder="5000" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2"><Calendar size={14}/> Deadline</label>
                                        <input required type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none py-4 px-6 rounded-2xl font-bold transition-all" />
                                    </div>
                                </div>
                                <div className="bg-custom-blue/5 p-6 rounded-3xl border border-custom-blue/10 flex gap-4">
                                    <Info className="text-custom-blue shrink-0" />
                                    <p className="text-sm font-bold text-custom-blue">Campaigns typically run for 30 days. Shorter campaigns create more urgency!</p>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2"><ImageIcon size={14}/> Thumbnail Image URL</label>
                                    <input required name="thumbnail" value={formData.thumbnail} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none py-4 px-6 rounded-2xl font-bold transition-all" placeholder="https://example.com/image.jpg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">Project Story</label>
                                    <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="8" className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none py-4 px-6 rounded-2xl font-bold transition-all resize-none" placeholder="Explain your vision in detail..." />
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                {/* Current Tiers List */}
                                <div className="grid gap-4 mb-8">
                                    {formData.rewardTiers.map(tier => (
                                        <div key={tier.id} className="bg-gray-50 p-6 rounded-3xl flex justify-between items-center border border-gray-100">
                                            <div>
                                                <h4 className="font-black text-custom-black">{tier.title}</h4>
                                                <p className="text-sm font-bold text-custom-blue">${tier.minimumAmount}+</p>
                                            </div>
                                            <button onClick={() => removeTier(tier.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20}/></button>
                                        </div>
                                    ))}
                                </div>

                                {/* Add New Tier Form */}
                                <div className="p-8 border-2 border-dashed border-gray-200 rounded-[30px] space-y-6">
                                    <div className="flex items-center gap-2 text-custom-black font-black uppercase tracking-widest text-sm mb-4">
                                        <Gift className="text-custom-yellow" /> Add Reward Tier
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <input required value={currentTier.title} onChange={(e) => setCurrentTier({...currentTier, title: e.target.value})} className="bg-gray-50 border-none outline-none py-3 px-4 rounded-xl font-bold" placeholder="Tier Title (e.g. Early Bird)" />
                                        <input required type="number" value={currentTier.minimumAmount} onChange={(e) => setCurrentTier({...currentTier, minimumAmount: e.target.value})} className="bg-gray-50 border-none outline-none py-3 px-4 rounded-xl font-bold" placeholder="Min. Amount ($)" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Reward Type</label>
                                        <select required value={currentTier.type} onChange={(e) => setCurrentTier({...currentTier, type: e.target.value})} className="w-full bg-gray-50 border-none outline-none py-3 px-4 rounded-xl font-bold">
                                            <option value="physical">Physical Product</option>
                                            <option value="email">Digital / Email Reward</option>
                                        </select>
                                    </div>
                                    <textarea required value={currentTier.description} onChange={(e) => setCurrentTier({...currentTier, description: e.target.value})} className="w-full bg-gray-50 border-none outline-none py-3 px-4 rounded-xl font-bold resize-none" placeholder="What do they get?" rows="3" />
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 font-bold text-sm cursor-pointer">
                                            <input type="checkbox" checked={currentTier.isLimited} onChange={(e) => setCurrentTier({...currentTier, isLimited: e.target.checked})} className="w-5 h-5 accent-custom-yellow" />
                                            Limited Availability
                                        </label>
                                        {currentTier.isLimited && (
                                            <input required type="number" value={currentTier.totalSlots} onChange={(e) => setCurrentTier({...currentTier, totalSlots: e.target.value})} className="bg-gray-50 border-none outline-none py-2 px-4 rounded-xl font-bold w-32" placeholder="Qty" />
                                        )}
                                    </div>
                                    <button onClick={addTier} className="w-full bg-custom-black text-custom-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                                        <PlusCircle size={18} /> Add Tier to List
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 space-y-6">
                                    <h3 className="text-2xl font-black text-custom-black">Review Summary</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Title</p>
                                            <p className="font-bold">{formData.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Goal</p>
                                            <p className="font-bold text-custom-blue">${formData.fundingGoal}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Category</p>
                                            <p className="font-bold">{formData.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rewards</p>
                                            <p className="font-bold">{formData.rewardTiers.length} tiers added</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-custom-yellow/10 rounded-3xl border border-custom-yellow/20 flex gap-4">
                                    <ShieldCheck className="text-custom-yellow shrink-0" />
                                    <p className="text-sm font-bold text-custom-black">By submitting, you agree to our creator terms and promise to deliver rewards to your backers. Honesty is everything!</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Nav */}
                    <div className="mt-12 pt-12 border-t border-gray-100 flex justify-between gap-4">
                        <button 
                            onClick={() => setStep(s => s - 1)} 
                            disabled={step === 1 || loading}
                            className={`flex items-center gap-2 font-black text-sm uppercase tracking-widest px-6 py-4 rounded-2xl transition-all ${step === 1 ? 'opacity-0' : 'hover:bg-gray-100'}`}
                        >
                            <ChevronLeft size={20} /> Back
                        </button>
                        
                        {step < 4 ? (
                            <button onClick={handleNext} className="bg-custom-black text-custom-white flex items-center gap-2 font-black text-sm uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-gray-900 transition-all active:scale-95 shadow-xl shadow-black/10">
                                Next Step <ChevronRight size={20} className="text-custom-yellow" />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={loading} className="bg-custom-yellow text-custom-black flex items-center gap-2 font-black text-sm uppercase tracking-widest px-10 py-4 rounded-2xl hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-yellow-500/20">
                                {loading ? 'Submitting...' : 'Launch Vision'} <CheckCircle2 size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCampaign;
