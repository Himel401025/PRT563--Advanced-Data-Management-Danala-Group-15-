import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse, Clock, Award } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2 text-white">
                            <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center text-slate-900 shadow-md">
                                <Activity className="w-5 h-5 stroke-[2.5]" />
                            </div>
                            <span>Medi<span className="text-teal-400">Connect</span></span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Healthcare Patient Appointment Booking & Clinical Management Platform. Seamlessly connecting patients with verified medical specialists.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-lg w-fit">
                            <ShieldCheck size={16} /> Verified Clinical Network
                        </div>
                    </div>

                    {/* Medical Specialties */}
                    <div>
                        <h3 className="text-base font-bold mb-4 text-white uppercase tracking-wider text-xs">Medical Specialties</h3>
                        <ul className="space-y-2.5 text-slate-400 text-sm">
                            <li><Link to="/explore?specialization=General Medicine" className="hover:text-teal-400 transition-colors">General Medicine</Link></li>
                            <li><Link to="/explore?specialization=Cardiology" className="hover:text-teal-400 transition-colors">Cardiology & Heart Care</Link></li>
                            <li><Link to="/explore?specialization=Dermatology" className="hover:text-teal-400 transition-colors">Dermatology & Skin</Link></li>
                            <li><Link to="/explore?specialization=Pediatrics" className="hover:text-teal-400 transition-colors">Pediatrics & Child Care</Link></li>
                            <li><Link to="/explore?specialization=Orthopedics" className="hover:text-teal-400 transition-colors">Orthopedics & Joints</Link></li>
                        </ul>
                    </div>

                    {/* Patient Portal */}
                    <div>
                        <h3 className="text-base font-bold mb-4 text-white uppercase tracking-wider text-xs">Patient Resources</h3>
                        <ul className="space-y-2.5 text-slate-400 text-sm">
                            <li><Link to="/explore" className="hover:text-teal-400 transition-colors">Find a Doctor</Link></li>
                            <li><Link to="/how-it-works" className="hover:text-teal-400 transition-colors">How Booking Works</Link></li>
                            <li><Link to="/dashboard" className="hover:text-teal-400 transition-colors">My Medical Records</Link></li>
                            <li><Link to="/register" className="hover:text-teal-400 transition-colors">Doctor Registration</Link></li>
                        </ul>
                    </div>

                    {/* Clinical Hours & Contact */}
                    <div>
                        <h3 className="text-base font-bold mb-4 text-white uppercase tracking-wider text-xs">Emergency & Hours</h3>
                        <div className="space-y-3 text-slate-400 text-sm">
                            <p className="flex items-center gap-2">
                                <Clock size={16} className="text-teal-400" />
                                <span>Support: Mon - Sun, 24/7 Online</span>
                            </p>
                            <p className="text-xs text-slate-500">
                                In case of severe emergency, please call your local emergency service (000 / 911) immediately.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2026 MediConnect Healthcare Systems. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <span>PayPal Checkout Supported</span>
                        <span>•</span>
                        <span>HIPAA Compliant Record Handling</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;