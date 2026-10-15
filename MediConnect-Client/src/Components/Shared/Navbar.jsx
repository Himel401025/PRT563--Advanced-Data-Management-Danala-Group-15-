import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { User, LogOut, LayoutDashboard, Settings, Calendar, Stethoscope, Activity, Shield } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout, isDoctor, isAdmin, isPatient } = useAuth();
    const navigate = useNavigate();

    // Auto-close profile menu after 4 seconds
    useEffect(() => {
        let timer;
        if (isProfileOpen) {
            timer = setTimeout(() => {
                setIsProfileOpen(false);
            }, 4000);
        }
        return () => clearTimeout(timer);
    }, [isProfileOpen]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Find Doctors', path: '/explore' },
        { name: 'How it Works', path: '/how-it-works' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 backdrop-blur-md bg-opacity-95 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2.5 group">
                            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-slate-900 transition-transform group-hover:scale-105 shadow-md shadow-teal-500/20">
                                <Activity className="w-6 h-6 stroke-[2.5]" />
                            </div>
                            <span className="text-white">Medi<span className="text-teal-400 group-hover:text-emerald-300 transition-colors">Connect</span></span>
                            <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">Clinical Portal</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-6">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-3 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all relative group ${
                                            isActive ? 'text-teal-400 font-bold' : 'text-slate-300 hover:text-white'
                                        }`
                                    }
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 transition-all group-hover:w-full"></span>
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link 
                            to="/explore" 
                            className="bg-transparent border border-teal-500/40 hover:bg-teal-500/10 text-teal-300 hover:text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 active:scale-95"
                        >
                            <Calendar size={16} className="text-teal-400" />
                            Book Appointment
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <NotificationBell />
                                
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2.5 bg-slate-800/80 px-3.5 py-1.5 rounded-full hover:bg-slate-700 transition-all border border-slate-700"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                                            {user.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="text-left hidden lg:block">
                                            <p className="text-xs font-bold leading-tight truncate max-w-[100px]">{user.name?.split(' ')[0]}</p>
                                            <span className="text-[10px] text-teal-400 font-medium uppercase tracking-wider">
                                                {user.role}
                                            </span>
                                        </div>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-3 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 overflow-hidden backdrop-blur-xl z-50">
                                            <div className="px-4 py-3 border-b border-slate-800">
                                                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Signed in as</p>
                                                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                                                    {user.role} Account
                                                </span>
                                            </div>
                                            <Link 
                                                to="/dashboard" 
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-slate-800 transition-colors text-slate-200 hover:text-teal-400"
                                            >
                                                <LayoutDashboard size={16} />
                                                Healthcare Dashboard
                                            </Link>
                                            {isDoctor && (
                                                <Link 
                                                    to="/dashboard?tab=schedule" 
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-slate-800 transition-colors text-slate-200 hover:text-teal-400"
                                                >
                                                    <Stethoscope size={16} />
                                                    Manage Slots & Schedule
                                                </Link>
                                            )}
                                            <Link 
                                                to="/dashboard?tab=settings" 
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-slate-800 transition-colors text-slate-200 hover:text-teal-400"
                                            >
                                                <Settings size={16} />
                                                Account Settings
                                            </Link>
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-red-500/10 transition-colors text-red-400 border-t border-slate-800"
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-slate-300 hover:text-white px-4 py-2 text-sm font-semibold transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-md shadow-teal-500/20 active:scale-95">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        {user && <NotificationBell />}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
                        >
                            {isOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3`}>
                {navLinks.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-base font-semibold ${
                                isActive ? 'text-teal-400 bg-slate-800' : 'text-slate-300 hover:text-white'
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
                <div className="pt-2 flex flex-col gap-2.5">
                    {user ? (
                        <>
                            <Link 
                                to="/dashboard" 
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-teal-500/10 border border-teal-500/30 text-teal-300 px-4 py-2.5 rounded-xl font-semibold text-center"
                            >
                                Healthcare Dashboard ({user.role})
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="w-full bg-red-500/10 text-red-400 px-4 py-2.5 rounded-xl font-semibold text-center"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-teal-500 text-slate-900 px-4 py-2.5 rounded-xl font-bold text-center"
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/register" 
                                onClick={() => setIsOpen(false)}
                                className="w-full border border-slate-700 text-white px-4 py-2.5 rounded-xl font-semibold text-center"
                            >
                                Create Account
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;