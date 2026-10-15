import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { Menu, X, Calendar, PlusCircle } from 'lucide-react';

// Healthcare Tabs
import Sidebar from '../Components/Dashboard/Sidebar';
import OverviewTab from '../Components/Dashboard/Tabs/OverviewTab';
import AppointmentsTab from '../Components/Dashboard/Tabs/AppointmentsTab';
import MedicalRecordsTab from '../Components/Dashboard/Tabs/MedicalRecordsTab';
import DoctorScheduleTab from '../Components/Dashboard/Tabs/DoctorScheduleTab';
import IssueRecordTab from '../Components/Dashboard/Tabs/IssueRecordTab';
import DoctorApprovalsTab from '../Components/Dashboard/Tabs/DoctorApprovalsTab';
import SpecializationsTab from '../Components/Dashboard/Tabs/SpecializationsTab';
import PaymentsTab from '../Components/Dashboard/Tabs/PaymentsTab';
import SettingsTab from '../Components/Dashboard/Tabs/SettingsTab';

const Dashboard = () => {
    const { user, isDoctor, isAdmin, isPatient } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const activeTab = searchParams.get('tab') || 'overview';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedAppointmentForRecord, setSelectedAppointmentForRecord] = useState(null);

    const handleSetActiveTab = (tabId) => {
        setSearchParams({ tab: tabId });
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-900 flex flex-col lg:flex-row text-slate-800">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 text-white">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">Dashboard</span>
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full uppercase">
                        {user?.role}
                    </span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-1 text-slate-400 hover:text-white"
                >
                    {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Sidebar (Desktop + Responsive Mobile) */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block flex-shrink-0`}>
                <Sidebar
                    user={user}
                    isDoctor={isDoctor}
                    isAdmin={isAdmin}
                    isPatient={isPatient}
                    activeTab={activeTab}
                    setActiveTab={handleSetActiveTab}
                />
            </div>

            {/* Main Content Area */}
            <main className="flex-grow bg-slate-50 p-6 sm:p-8 lg:p-10 overflow-y-auto min-h-[600px]">
                <div className="max-w-6xl mx-auto">
                    {activeTab === 'overview' && (
                        <OverviewTab setActiveTab={handleSetActiveTab} />
                    )}

                    {(activeTab === 'appointments' || activeTab === 'doctor-appointments' || activeTab === 'all-appointments') && (
                        <AppointmentsTab
                            setActiveTab={handleSetActiveTab}
                            setSelectedAppointmentForRecord={setSelectedAppointmentForRecord}
                        />
                    )}

                    {activeTab === 'medical-records' && (
                        <MedicalRecordsTab />
                    )}

                    {activeTab === 'schedule' && (
                        <DoctorScheduleTab />
                    )}

                    {activeTab === 'issue-record' && (
                        <IssueRecordTab
                            selectedAppointmentForRecord={selectedAppointmentForRecord}
                            setActiveTab={handleSetActiveTab}
                        />
                    )}

                    {activeTab === 'doctor-approvals' && (
                        <DoctorApprovalsTab />
                    )}

                    {activeTab === 'specialties' && (
                        <SpecializationsTab />
                    )}

                    {(activeTab === 'payments' || activeTab === 'doctor-earnings' || activeTab === 'admin-finance') && (
                        <PaymentsTab />
                    )}

                    {activeTab === 'settings' && (
                        <SettingsTab />
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
