import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, FileText, ShieldCheck, HeartPulse, CreditCard, Stethoscope, Clock, Activity } from 'lucide-react';

const HowItWorks = () => {
    return (
        <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-16">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200 mb-4">
                        <HeartPulse size={14} className="text-teal-600" />
                        <span>Platform Guide & Rules</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                        How MediConnect Works
                    </h1>
                    <p className="text-slate-500 text-base mt-3">
                        A seamless, transparent guide for patients seeking medical consultations and doctors managing their clinical practice.
                    </p>
                </div>

                {/* Patient Workflow */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                        <div className="w-10 h-10 bg-teal-500 text-white rounded-xl flex items-center justify-center font-bold">
                            P
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">For Patients</h2>
                            <p className="text-slate-500 text-xs">Easy appointment booking and clinical records tracking.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                                <Search size={20} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">1. Search & Filter</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Browse certified specialists by medical department, doctor reviews, consultation fee, and available days.
                            </p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                                <Calendar size={20} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">2. Pick Slot & Pay</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Select a convenient date and active time slot. Complete instant checkout via PayPal with automatic confirmation.
                            </p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">3. Digital Prescriptions</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Attend your in-person clinical consultation. Access official prescriptions, doctor advice, and lab orders in your health dashboard.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Doctor Workflow */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">
                            D
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">For Medical Practitioners</h2>
                            <p className="text-slate-500 text-xs">Manage appointments, schedule slots, and author patient records.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                            <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
                                <ShieldCheck size={20} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">1. Credential Verification</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Register with your medical license number and qualifications. Admin audits ensure all practicing doctors are verified.
                            </p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                            <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
                                <Clock size={20} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">2. Set Schedule & Fees</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Configure your working days, morning/afternoon appointment durations, and consultation pricing in real time.
                            </p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                            <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
                                <Stethoscope size={20} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">3. Patient Queue & Rx</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                View upcoming consultations, accept/complete sessions, and write structured medication prescriptions with automatic delivery.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to action */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-10 text-white text-center shadow-lg">
                    <h2 className="text-2xl sm:text-3xl font-black">Ready to Take Control of Your Healthcare?</h2>
                    <p className="text-teal-100 text-sm max-w-xl mx-auto mt-2">
                        Get started in seconds. Book your first appointment or join our qualified practitioner network.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Link to="/explore" className="bg-white text-slate-900 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-slate-50 transition-all">
                            Find a Doctor
                        </Link>
                        <Link to="/register" className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
                            Register Today
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
