import React from 'react';
import { motion } from 'framer-motion';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';

const SuccessStoriesTab = ({ 
    data, 
    storyForm, 
    setStoryForm, 
    uploadingStory, 
    editStoryId, 
    setEditStoryId, 
    handleCreateStory, 
    handleEditStory, 
    handleDeleteStory 
}) => {
    return (
        <motion.div key="stories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            {/* Upload Form */}
            <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-black/5">
                <h2 className="text-2xl font-black text-custom-black mb-8 flex items-center gap-3">
                    {editStoryId ? <Pencil className="text-custom-yellow" /> : <PlusCircle className="text-custom-yellow" />} 
                    {editStoryId ? 'Edit Success Story' : 'Upload New Story'}
                </h2>
                <form onSubmit={handleCreateStory} className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Story Title</label>
                        <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={storyForm.title} onChange={e => setStoryForm({...storyForm, title: e.target.value})} placeholder="e.g. The Solar Revolution" />
                            </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Category</label>
                        <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={storyForm.category} onChange={e => setStoryForm({...storyForm, category: e.target.value})} placeholder="e.g. Technology" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Amount Raised</label>
                        <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={storyForm.raised} onChange={e => setStoryForm({...storyForm, raised: e.target.value})} placeholder="e.g. $124,500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Total Backers</label>
                        <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={storyForm.backers} onChange={e => setStoryForm({...storyForm, backers: e.target.value})} placeholder="e.g. 1,240" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Thumbnail URL</label>
                        <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={storyForm.image} onChange={e => setStoryForm({...storyForm, image: e.target.value})} placeholder="https://..." />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Inspirational Quote</label>
                        <textarea required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-6 rounded-3xl font-bold transition-all min-h-[120px]" value={storyForm.quote} onChange={e => setStoryForm({...storyForm, quote: e.target.value})} placeholder="Share the impact..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Author Name</label>
                        <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={storyForm.author} onChange={e => setStoryForm({...storyForm, author: e.target.value})} placeholder="e.g. John Doe" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Author Role</label>
                        <input required className="w-full bg-gray-50 border-2 border-transparent focus:border-custom-yellow outline-none px-6 py-4 rounded-2xl font-bold transition-all" value={storyForm.role} onChange={e => setStoryForm({...storyForm, role: e.target.value})} placeholder="e.g. CEO, EcoTech" />
                    </div>
                    <div className="md:col-span-2 flex gap-4">
                        <button disabled={uploadingStory} type="submit" className="flex-grow bg-custom-black text-custom-white py-5 rounded-2xl font-black text-lg hover:bg-custom-yellow hover:text-custom-black transition-all shadow-xl shadow-black/10 disabled:opacity-50">
                            {uploadingStory ? 'SAVING...' : (editStoryId ? 'UPDATE STORY' : 'PUBLISH SUCCESS STORY')}
                        </button>
                        {editStoryId && (
                            <button type="button" onClick={() => { setEditStoryId(null); setStoryForm({ title: '', category: '', raised: '', backers: '', image: '', quote: '', author: '', role: '' }); }} className="bg-gray-200 text-gray-600 px-8 py-5 rounded-2xl font-black text-lg hover:bg-gray-300 transition-all">
                                CANCEL
                            </button>
                        )}
                    </div>
                </form>
            </section>

            {/* Stories List */}
            <div className="grid md:grid-cols-2 gap-8">
                {data.stories.map(story => (
                    <div key={story._id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 flex gap-6 items-center">
                        <img src={story.image} className="w-24 h-24 rounded-2xl object-cover" alt="" />
                        <div className="flex-grow">
                            <h3 className="font-black text-custom-black leading-tight mb-1">{story.title}</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{story.category}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEditStory(story)} className="p-4 bg-gray-50 text-gray-400 hover:text-custom-black rounded-2xl transition-all"><Pencil size={20}/></button>
                            <button onClick={() => handleDeleteStory(story._id)} className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"><Trash2 size={20}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default SuccessStoriesTab;
