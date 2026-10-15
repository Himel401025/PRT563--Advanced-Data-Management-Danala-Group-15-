import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, Clock } from 'lucide-react';
import { useNotifications } from '../../Contexts/NotificationContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'APPOINTMENT_BOOKED': return '📅';
            case 'APPOINTMENT_CONFIRMED': return '✅';
            case 'APPOINTMENT_CANCELLED': return '❌';
            case 'APPOINTMENT_COMPLETED': return '🏥';
            case 'RECORD_ADDED': return '💊';
            case 'PAYMENT_SUCCESS': return '💳';
            case 'DOCTOR_APPROVED': return '🩺';
            case 'REMINDER_APPOINTMENT': return '⏰';
            default: return '🔔';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-all"
                title="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-black text-slate-950 border-2 border-slate-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-white">Healthcare Alerts</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
                            >
                                <Check size={13} /> Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[380px] overflow-y-auto">
                        {loading && notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                                <p className="text-xs text-slate-400 font-medium">Checking alerts...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-10 text-center">
                                <Bell size={36} className="mx-auto text-slate-700 mb-3 opacity-30" />
                                <p className="text-sm font-bold text-slate-400">All caught up!</p>
                                <p className="text-xs text-slate-500 mt-0.5">No new clinical notifications.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800/60">
                                {notifications.map((n) => (
                                    <div 
                                        key={n._id}
                                        className={`p-4 hover:bg-slate-800/40 transition-colors group relative ${!n.isRead ? 'bg-teal-500/5' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="text-xl mt-0.5">{getTypeIcon(n.type)}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <p className={`text-xs font-bold truncate pr-4 ${!n.isRead ? 'text-white' : 'text-slate-400'}`}>
                                                        {n.title}
                                                    </p>
                                                    {!n.isRead && (
                                                        <span className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0 mt-1"></span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                                    {n.message}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                                        <Clock size={10} /> {formatDistanceToNow(new Date(n.createdAt))} ago
                                                    </span>
                                                    {n.link && (
                                                        <Link 
                                                            to={n.link} 
                                                            onClick={() => {
                                                                setIsOpen(false);
                                                                markAsRead(n._id);
                                                            }}
                                                            className="text-[10px] text-teal-400 hover:underline font-bold flex items-center gap-1 uppercase"
                                                        >
                                                            Open <ExternalLink size={10} />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-2.5 border-t border-slate-800 bg-slate-800/20 text-center">
                        <Link 
                            to="/dashboard" 
                            onClick={() => setIsOpen(false)}
                            className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors"
                        >
                            Open Healthcare Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
