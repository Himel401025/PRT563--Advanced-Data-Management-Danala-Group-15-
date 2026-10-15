import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, CheckCircle, Newspaper, Trash2 } from 'lucide-react';

const UpdatesTab = ({ 
    handlePostUpdate, 
    updateForm, 
    setUpdateForm, 
    fetchUpdatesForCampaign, 
    data, 
    postingUpdate, 
    handleDeleteUpdate 
}) => {
    return (
        <motion.div key="updates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-black/5">
                <h2 className="text-2xl font-black text-custom-black mb-8 flex items-center gap-3">
                    <Rocket className="text-custom-yellow" /> Post Campaign Update
                </h2>
                <form onSubmit={handlePostUpdate} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Select Project</label>
                            <select 
                                required
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all"
                                value={updateForm.campaignId}
                                onChange={(e) => fetchUpdatesForCampaign(e.target.value)}
                            >
                                <option value="">-- Choose a Campaign --</option>
                                {data.campaigns.map(c => (
                                    <option key={c._id} value={c._id}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Update Title</label>
                            <input 
                                required
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all"
                                value={updateForm.title}
                                onChange={(e) => setUpdateForm({...updateForm, title: e.target.value})}
                                placeholder="e.g. Prototype is ready!"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Content</label>
                        <textarea 
                            required
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-6 rounded-3xl font-bold transition-all min-h-[160px]"
                            value={updateForm.content}
                            onChange={(e) => setUpdateForm({...updateForm, content: e.target.value})}
                            placeholder="Share the details with your backers..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Image URLs (comma separated)</label>
                        <input 
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all"
                            value={updateForm.images}
                            onChange={(e) => setUpdateForm({...updateForm, images: e.target.value})}
                            placeholder="https://image1.jpg, https://image2.jpg"
                        />
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer w-fit" onClick={() => setUpdateForm({...updateForm, isBackerOnly: !updateForm.isBackerOnly})}>
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${updateForm.isBackerOnly ? 'bg-custom-yellow border-custom-yellow' : 'border-gray-300'}`}>
                            {updateForm.isBackerOnly && <CheckCircle size={14} className="text-custom-black" />}
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Backers Only Update</span>
                    </div>
                    <button 
                        disabled={postingUpdate || !updateForm.campaignId}
                        type="submit"
                        className="w-full bg-custom-black text-custom-white py-5 rounded-2xl font-black text-lg hover:bg-custom-yellow hover:text-custom-black transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                    >
                        {postingUpdate ? 'POSTING...' : 'PUBLISH UPDATE'}
                    </button>
                </form>
            </div>

            {updateForm.campaignId && (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-custom-black ml-4">Existing Updates</h3>
                    {data.updates.length > 0 ? data.updates.map(upd => (
                        <div key={upd._id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 flex justify-between items-center">
                            <div className="flex gap-6 items-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-400">
                                    {upd.images?.[0] ? <img src={upd.images[0]} className="w-full h-full object-cover rounded-2xl" alt="" /> : <Newspaper />}
                                </div>
                                <div>
                                    <h4 className="font-black text-custom-black">{upd.title}</h4>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        {new Date(upd.createdAt).toLocaleDateString()} • {upd.isBackerOnly ? 'Backers Only' : 'Public'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDeleteUpdate(upd._id)}
                                className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    )) : (
                        <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                            <p className="text-gray-400 font-bold uppercase tracking-widest">No updates found for this project</p>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default UpdatesTab;
