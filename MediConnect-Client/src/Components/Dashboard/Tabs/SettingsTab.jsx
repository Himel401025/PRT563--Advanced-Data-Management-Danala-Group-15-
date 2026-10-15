import React, { useState } from 'react';
import api from '../../../api/axios';
import { useAuth } from '../../../Contexts/AuthContext';
import { Settings, Lock, User, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const SettingsTab = () => {
    const { user, refreshUser, isPatient, isDoctor } = useAuth();

    // Profile State
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [city, setCity] = useState(user?.address?.city || '');
    const [bloodGroup, setBloodGroup] = useState(user?.patientProfile?.bloodGroup || 'Unknown');
    const [allergies, setAllergies] = useState(user?.patientProfile?.allergies?.join(', ') || '');
    
    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileError, setProfileError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileSuccess('');
        setProfileError('');

        try {
            const updates = {
                name,
                phone,
                avatar,
                address: { city }
            };

            if (isPatient) {
                updates.patientProfile = {
                    bloodGroup,
                    allergies: allergies.split(',').map(a => a.trim()).filter(Boolean)
                };
            }

            const res = await api.patch('/auth/profile', updates);
            if (res.data.success) {
                setProfileSuccess('Profile updated successfully!');
                await refreshUser();
            }
        } catch (err) {
            setProfileError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordSuccess('');
        setPasswordError('');

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        setSavingPassword(true);

        try {
            const res = await api.post('/auth/change-password', {
                currentPassword,
                newPassword
            });

            if (res.data.success) {
                setPasswordSuccess('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Profile Settings */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="pb-6 border-b border-slate-100">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <Settings size={22} className="text-teal-600" />
                        <span>Personal Profile & Clinical Details</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage your contact details and patient medical profile.</p>
                </div>

                {profileSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        <span>{profileSuccess}</span>
                    </div>
                )}

                {profileError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span>{profileError}</span>
                    </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-semibold focus:outline-none focus:border-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Avatar Image URL</label>
                            <input
                                type="url"
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">City / Location</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                            />
                        </div>
                    </div>

                    {/* Patient Specific */}
                    {isPatient && (
                        <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Blood Group</label>
                                <select
                                    value={bloodGroup}
                                    onChange={(e) => setBloodGroup(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                                >
                                    {['Unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Known Allergies</label>
                                <input
                                    type="text"
                                    value={allergies}
                                    onChange={(e) => setAllergies(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                                    placeholder="e.g. Penicillin, Peanuts"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={savingProfile}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                        <Save size={15} />
                        <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                    </button>
                </form>
            </div>

            {/* Password Change */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="pb-6 border-b border-slate-100">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <Lock size={22} className="text-teal-600" />
                        <span>Change Account Password</span>
                    </h2>
                </div>

                {passwordSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        <span>{passwordSuccess}</span>
                    </div>
                )}

                {passwordError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span>{passwordError}</span>
                    </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Current Password</label>
                        <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">New Password</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={savingPassword}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                    >
                        {savingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsTab;
