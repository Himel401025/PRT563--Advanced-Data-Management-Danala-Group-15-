import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Heart, Star, TrendingUp, ArrowRight, Rocket, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const SuccessStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const res = await api.get('/success-stories');
            setStories(res.data);
        } catch (error) {
            console.error('Error fetching stories:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-custom-white min-h-screen">
            {/* Hero Section */}
            <section className="bg-custom-black text-custom-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-full h-full bg-grad-blue"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-custom-blue/10 border border-custom-blue/20 px-6 py-2 rounded-full text-custom-blue font-black text-sm uppercase tracking-widest mb-8"
                    >
                        <Star size={16} fill="currentColor" /> Community Impact <Star size={16} fill="currentColor" />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black mb-8 tracking-tighter"
                    >
                        SUCCESS <span className="text-custom-blue">STORIES</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium"
                    >
                        Real people, real impact. Discover how visionaries are changing 
                        the world through the power of community funding.
                    </motion.p>
                </div>
            </section>

            {/* Stories Grid */}
            <section className="py-24 max-w-7xl mx-auto px-4 min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-blue"></div>
                    </div>
                ) : stories.length > 0 ? (
                    <div className="space-y-24">
                        {stories.map((story, index) => (
                            <motion.div 
                                key={story._id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
                            >
                                <div className="lg:w-1/2 relative group">
                                    <div className="absolute -inset-4 bg-gray-100 rounded-[40px] transform group-hover:scale-105 transition-transform duration-500"></div>
                                    <img 
                                        src={story.image} 
                                        alt={story.title} 
                                        className="relative rounded-[32px] w-full h-[400px] object-cover shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                                    />
                                    <div className="absolute bottom-8 left-8 right-8 flex gap-4">
                                        <div className="bg-custom-black/80 backdrop-blur-md p-4 rounded-2xl flex-1 border border-white/10">
                                            <p className="text-custom-yellow font-black text-2xl">{story.raised}</p>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Raised</p>
                                        </div>
                                        <div className="bg-custom-black/80 backdrop-blur-md p-4 rounded-2xl flex-1 border border-white/10">
                                            <p className="text-custom-blue font-black text-2xl">{story.backers}</p>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Backers</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="lg:w-1/2 space-y-8">
                                    <div className="inline-block bg-gray-100 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-gray-500">
                                        {story.category}
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-custom-black leading-tight">
                                        {story.title}
                                    </h2>
                                    <div className="relative">
                                        <Quote className="absolute -left-8 -top-8 w-16 h-16 text-gray-100" />
                                        <p className="text-xl font-bold text-gray-700 leading-relaxed italic relative z-10">
                                            "{story.quote}"
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-custom-black rounded-full flex items-center justify-center text-custom-yellow font-black uppercase">
                                            {story.author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-custom-black uppercase tracking-tight">{story.author}</p>
                                            <p className="text-sm font-bold text-gray-500">{story.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Rocket size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-custom-black mb-2">Our Wall of Fame is Loading</h3>
                        <p className="text-gray-500 font-medium">Be the first to change the world and join our success stories.</p>
                        <Link to="/create-campaign" className="mt-8 text-custom-blue font-bold hover:underline inline-block">
                            Start your journey
                        </Link>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="bg-custom-yellow py-24 text-center overflow-hidden relative">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-24 -left-24 w-64 h-64 border-[40px] border-custom-black/5 rounded-full"
                ></motion.div>
                
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <h2 className="text-5xl md:text-7xl font-black text-custom-black mb-8 tracking-tighter uppercase leading-none">
                        WANT TO BE OUR NEXT <span className="bg-custom-black text-custom-yellow px-4 py-1 inline-block transform -rotate-2">SUCCESS</span>?
                    </h2>
                    <p className="text-xl font-bold text-custom-black/70 mb-12 max-w-2xl mx-auto">
                        The world is waiting for your big idea. Start your campaign today and 
                        join our wall of fame.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/create-campaign" className="bg-custom-black text-custom-white px-10 py-5 rounded-full font-black text-xl flex items-center gap-3 hover:scale-105 transition-transform shadow-2xl">
                            Start Campaign <Rocket size={24} />
                        </Link>
                        <Link to="/explore" className="text-custom-black font-black text-xl flex items-center gap-2 hover:gap-4 transition-all">
                            Browse More Projects <ArrowRight size={24} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SuccessStories;
