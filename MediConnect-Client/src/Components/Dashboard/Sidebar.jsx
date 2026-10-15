import React from 'react';
import { 
    LayoutDashboard, 
    Calendar, 
    FileText, 
    CreditCard, 
    Settings, 
    Stethoscope, 
    Clock, 
    Users, 
    ShieldCheck, 
    Layers, 
    Activity,
    FileCheck
} from 'lucide-react';

const Sidebar = ({ user, isDoctor, isAdmin, isPatient, activeTab, setActiveTab }) => {
    const SidebarLink = ({ id, icon: Icon, label, badge }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === id 
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            <div className="flex items-center gap-3">
                <Icon size={18} />
                <span>{label}</span>
            </div>
            {badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                    {badge}
                </span>
            )}
        </button>
    );

    return (
        <aside className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-1 text-slate-300 flex-shrink-0">
            {/* User Profile Mini Badge */}
            <div className="p-3 mb-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center font-bold text-white text-sm">
                    {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                    <span className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider block">
                        {user?.role} Portal
                    </span>
                </div>
            </div>

            <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Main Navigation</p>
            <SidebarLink id="overview" icon={LayoutDashboard} label="Overview" />

            {/* Patient Navigation */}
            {isPatient && (
                <>
                    <p className="px-3 pt-4 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Patient Care</p>
                    <SidebarLink id="appointments" icon={Calendar} label="My Appointments" />
                    <SidebarLink id="medical-records" icon={FileText} label="Medical Records" />
                    <SidebarLink id="payments" icon={CreditCard} label="Payment Invoices" />
                </>
            )}

            {/* Doctor Navigation */}
            {isDoctor && (
                <>
                    <p className="px-3 pt-4 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Doctor Studio</p>
                    <SidebarLink id="doctor-appointments" icon={Calendar} label="Patient Queue" />
                    <SidebarLink id="schedule" icon={Clock} label="Schedule & Slots" />
                    <SidebarLink id="issue-record" icon={FileCheck} label="Write Prescription" />
                    <SidebarLink id="doctor-earnings" icon={CreditCard} label="Consultation Fees" />
                </>
            )}

            {/* Admin Navigation */}
            {isAdmin && (
                <>
                    <p className="px-3 pt-4 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Administration</p>
                    <SidebarLink id="doctor-approvals" icon={ShieldCheck} label="Doctor Verification" />
                    <SidebarLink id="specialties" icon={Layers} label="Specializations" />
                    <SidebarLink id="all-appointments" icon={Calendar} label="All Appointments" />
                    <SidebarLink id="admin-finance" icon={CreditCard} label="Financial Audit" />
                </>
            )}

            <p className="px-3 pt-4 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Preferences</p>
            <SidebarLink id="settings" icon={Settings} label="Account Settings" />
        </aside>
    );
};

export default Sidebar;
