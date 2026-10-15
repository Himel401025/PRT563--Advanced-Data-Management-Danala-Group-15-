import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../Contexts/AuthContext';
import CampaignCard from '../Components/Shared/CampaignCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Globe, 
    Mail, 
    Calendar, 
    Award, 
    Users, 
    TrendingUp,
    Edit3,
    X,
    Settings
} from 'lucide-react';
import { 
    FaFacebook, 
    FaTwitter, 
    FaLinkedin 
} from 'react-icons/fa';

const CreatorProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [creator, setCreator] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [profileForm, setProfileForm] = useState({
        bio: '',
        website: '',
        socialLinks: {
            facebook: '',
            twitter: '',
            linkedin: ''
        }
    });

    const isOwner = user && (user.id === id || user._id === id);

    const ensureAbsoluteUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    };

    const fetchCreatorData = async () => {
        try {
            const [creatorRes, campaignsRes] = await Promise.all([
                api.get(`/auth/creator/${id}`),
                api.get(`/campaigns?creatorId=${id}&status=active`)
            ]);
            setCreator(creatorRes.data);
            setCampaigns(campaignsRes.data);
            
            // Sync form state
            if (creatorRes.data) {
                setProfileForm({
                    bio: creatorRes.data.creatorProfile?.bio || '',
                    website: creatorRes.data.creatorProfile?.website || '',
                    socialLinks: {
                        facebook: creatorRes.data.creatorProfile?.socialLinks?.facebook || '',
                        twitter: creatorRes.data.creatorProfile?.socialLinks?.twitter || '',
                        linkedin: creatorRes.data.creatorProfile?.socialLinks?.linkedin || ''
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching creator profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCreatorData();
    }, [id]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await api.patch('/auth/update-profile', profileForm);
            await fetchCreatorData(); // Refresh data
            setIsEditModalOpen(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Profile update failed');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-yellow"></div>
        </div>
    );

    if (!creator) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black text-2xl uppercase tracking-tighter">
            Creator Not Found
        </div>
    );

    const totalBackers = campaigns.reduce((acc, c) => acc + c.backerCount, 0);
    const totalRaised = campaigns.reduce((acc, c) => acc + c.totalRaised, 0);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header / Hero */}
            <header className="bg-custom-black text-custom-white pt-24 pb-48 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-custom-yellow rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-custom-blue rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:items-end">
                        <div className="relative">
                            <img 
                                src={creator.profilePicture || `https://ui-avatars.com/api/?name=${creator.name}&background=random&size=200`} 
                                alt={creator.name} 
                                className="w-40 h-40 md:w-56 md:h-56 rounded-[40px] object-cover border-8 border-custom-black shadow-2xl"
                            />
                            <div className="absolute -bottom-4 -right-4 bg-custom-yellow text-custom-black p-4 rounded-2xl shadow-xl">
                                <Award size={24} />
                            </div>
                        </div>

                        <div className="flex-grow text-center md:text-left mb-4">
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase">
                                {creator.name}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <div className="flex items-center gap-2 text-gray-400 font-bold bg-white/5 px-4 py-2 rounded-xl">
                                    <Calendar size={16} /> Joined {new Date(creator.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 font-bold bg-white/5 px-4 py-2 rounded-xl">
                                    <Mail size={16} /> {creator.email}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-4 items-center">
                            {isOwner && (
                                <button 
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="p-4 bg-custom-yellow text-custom-black hover:scale-105 transition-all rounded-2xl shadow-xl flex items-center gap-2 font-black uppercase text-xs tracking-widest"
                                >
                                    <Edit3 size={18} /> Edit Profile
                                </button>
                            )}
                            
                            {creator.creatorProfile?.socialLinks?.facebook && (
                                <a href={ensureAbsoluteUrl(creator.creatorProfile.socialLinks.facebook)} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 hover:bg-custom-yellow hover:text-custom-black transition-all rounded-2xl text-gray-400 shadow-xl">
                                    <FaFacebook size={24} />
                                </a>
                            )}
                            {creator.creatorProfile?.socialLinks?.twitter && (
                                <a href={ensureAbsoluteUrl(creator.creatorProfile.socialLinks.twitter)} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 hover:bg-custom-yellow hover:text-custom-black transition-all rounded-2xl text-gray-400 shadow-xl">
                                    <FaTwitter size={24} />
                                </a>
                            )}
                            {creator.creatorProfile?.socialLinks?.linkedin && (
                                <a href={ensureAbsoluteUrl(creator.creatorProfile.socialLinks.linkedin)} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 hover:bg-custom-yellow hover:text-custom-black transition-all rounded-2xl text-gray-400 shadow-xl">
                                    <FaLinkedin size={24} />
                                </a>
                            )}
                            {creator.creatorProfile?.website && (
                                <a href={ensureAbsoluteUrl(creator.creatorProfile.website)} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 hover:bg-custom-yellow hover:text-custom-black transition-all rounded-2xl text-gray-400 shadow-xl">
                                    <Globe size={24} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatBox 
                        icon={TrendingUp} 
                        label="Total Raised" 
                        value={`$${totalRaised.toLocaleString()}`} 
                        color="text-green-500" 
                    />
                    <StatBox 
                        icon={Users} 
                        label="Total Backers" 
                        value={totalBackers.toLocaleString()} 
                        color="text-custom-blue" 
                    />
                    <StatBox 
                        icon={Calendar} 
                        label="Campaigns Launched" 
                        value={campaigns.length} 
                        color="text-custom-yellow" 
                    />
                </div>
            </div>

            {/* Content Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-3 gap-12">
                {/* About Section */}
                <div className="lg:col-span-1 space-y-8">
                    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-black/5">
                        <h2 className="text-2xl font-black text-custom-black mb-6 uppercase tracking-tight">Biography</h2>
                        <p className="text-gray-500 font-bold leading-relaxed text-lg">
                            {creator.creatorProfile?.bio || "This visionary creator is dedicated to bringing innovative projects to life. Stay tuned for more impactful visions."}
                        </p>
                    </section>

                    <section className="bg-custom-black p-10 rounded-[40px] text-custom-white shadow-2xl">
                        <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Support Policy</h2>
                        <p className="text-gray-400 font-bold text-sm leading-relaxed">
                            By backing this creator, you are supporting independent innovation. 
                            Rewards are fulfilled directly by the creator according to their timeline.
                        </p>
                    </section>
                </div>

                {/* Campaigns List */}
                <div className="lg:col-span-2 space-y-12">
                    <header className="flex items-center justify-between">
                        <h2 className="text-4xl font-black text-custom-black uppercase tracking-tighter">Active Projects</h2>
                        <div className="h-px flex-grow mx-8 bg-gray-200 hidden md:block"></div>
                        <span className="text-gray-400 font-black text-sm uppercase tracking-widest">{campaigns.length} Projects</span>
                    </header>

                    <div className="grid md:grid-cols-2 gap-8">
                        {campaigns.length > 0 ? campaigns.map((campaign, idx) => (
                            <motion.div 
                                key={campaign._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <CampaignCard campaign={campaign} />
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                                <p className="text-gray-400 font-black uppercase tracking-widest">No active projects found</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-custom-black/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 md:p-12">
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-3xl font-black text-custom-black uppercase tracking-tighter flex items-center gap-3">
                                        <Settings className="text-custom-yellow" /> Edit Your Profile
                                    </h2>
                                    <button 
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="p-3 bg-gray-50 text-gray-400 hover:text-custom-black rounded-2xl transition-all"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Website URL</label>
                                        <input 
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" 
                                            value={profileForm.website} 
                                            onChange={e => setProfileForm({...profileForm, website: e.target.value})}
                                            placeholder="https://yourwebsite.com" 
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Biography</label>
                                        <textarea 
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-6 rounded-3xl font-bold transition-all min-h-[160px]" 
                                            value={profileForm.bio} 
                                            onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                                            placeholder="Share your story and vision with the community..." 
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Facebook</label>
                                            <input 
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all text-xs" 
                                                value={profileForm.socialLinks.facebook} 
                                                onChange={e => setProfileForm({...profileForm, socialLinks: {...profileForm.socialLinks, facebook: e.target.value}})}
                                                placeholder="Profile URL" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Twitter</label>
                                            <input 
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all text-xs" 
                                                value={profileForm.socialLinks.twitter} 
                                                onChange={e => setProfileForm({...profileForm, socialLinks: {...profileForm.socialLinks, twitter: e.target.value}})}
                                                placeholder="Profile URL" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">LinkedIn</label>
                                            <input 
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all text-xs" 
                                                value={profileForm.socialLinks.linkedin} 
                                                onChange={e => setProfileForm({...profileForm, socialLinks: {...profileForm.socialLinks, linkedin: e.target.value}})}
                                                placeholder="Profile URL" 
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        disabled={updating}
                                        type="submit" 
                                        className="w-full bg-custom-black text-custom-white py-5 rounded-2xl font-black text-lg hover:bg-custom-yellow hover:text-custom-black transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                                    >
                                        {updating ? 'SAVING CHANGES...' : 'UPDATE PROFILE'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatBox = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 flex items-center gap-6">
        <div className={`p-4 rounded-2xl bg-gray-50 ${color}`}>
            <Icon size={32} />
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black text-custom-black tracking-tight">{value}</p>
        </div>
    </div>
);

export default CreatorProfile;
