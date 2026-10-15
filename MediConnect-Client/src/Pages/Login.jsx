import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { Mail, Lock, ArrowRight, Activity, ShieldCheck, HeartPulse } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login(email, password);
            if (res.success) {
                navigate(from, { replace: true });
            } else {
                setError(res.message || 'Invalid credentials');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex bg-slate-50">
            {/* Left Side: Healthcare Branding */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 text-white relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:20px_20px]"></div>
                
                <div className="relative z-10 max-w-lg space-y-6">
                    <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shadow-teal-500/20">
                        <Activity size={32} className="stroke-[2.5]" />
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
                        Seamless Healthcare <span className="text-teal-400">At Your Fingertips.</span>
                    </h1>

                    <p className="text-base text-slate-300 leading-relaxed">
                        Access appointments, digital prescriptions, patient health histories, and direct specialist communication in a secure, unified portal.
                    </p>

                    <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} className="text-teal-400" />
                            <span>HIPAA Compliant Records</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HeartPulse size={16} className="text-teal-400" />
                            <span>Verified Clinical Network</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="mb-8">
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Patient & Doctor Portal</span>
                        <h2 className="text-3xl font-black text-slate-900 mt-1">Sign In to Your Account</h2>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1">
                            Don't have an account? <Link to="/register" className="text-teal-600 font-bold hover:underline">Register here</Link>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white outline-none py-3.5 pl-11 pr-4 rounded-xl text-sm font-medium transition-all text-slate-900"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white outline-none py-3.5 pl-11 pr-4 rounded-xl text-sm font-medium transition-all text-slate-900"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 active:scale-[0.98] disabled:opacity-50 mt-6"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
