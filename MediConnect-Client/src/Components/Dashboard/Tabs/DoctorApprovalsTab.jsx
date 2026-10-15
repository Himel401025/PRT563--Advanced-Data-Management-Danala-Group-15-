import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { ShieldCheck, Check, X, Stethoscope, AlertCircle, CheckCircle2 } from 'lucide-react';

const DoctorApprovalsTab = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // 'pending', 'approved', 'all'
    const [actionLoading, setActionLoading] = useState(null);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const res = await api.get('/doctors/admin/all');
            if (res.data.success) {
                setDoctors(res.data.doctors || []);
            }
        } catch (err) {
            console.error('Error fetching doctors for admin:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleApproval = async (doctorId, isApproved) => {
        setActionLoading(doctorId);
        try {
            const res = await api.patch(`/doctors/admin/${doctorId}/approval`, { isApproved });
            if (res.data.success) {
                fetchDoctors();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update approval status');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredDoctors = doctors.filter((doc) => {
        const approved = doc.doctorProfile?.isApproved;
        if (filter === 'pending') return !approved;
        if (filter === 'approved') return approved;
        return true;
    });

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Doctor Credential Approvals</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Verify physician medical licenses, qualifications, and authorize clinical booking.
                    </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            filter === 'pending' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'
                        }`}
                    >
                        Pending ({doctors.filter(d => !d.doctorProfile?.isApproved).length})
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            filter === 'approved' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'
                        }`}
                    >
                        Approved ({doctors.filter(d => d.doctorProfile?.isApproved).length})
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            filter === 'all' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'
                        }`}
                    >
                        All Doctors ({doctors.length})
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-16 text-center text-teal-600 text-xs">Loading doctor verification requests...</div>
            ) : filteredDoctors.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                    No doctor applications found matching filter ({filter}).
                </div>
            ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                                <th className="p-4">Doctor</th>
                                <th className="p-4">Specialty & License</th>
                                <th className="p-4">Qualifications</th>
                                <th className="p-4">Experience & Fee</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredDoctors.map((doc) => {
                                const profile = doc.doctorProfile || {};
                                const isApproved = profile.isApproved;

                                return (
                                    <tr key={doc._id} className="hover:bg-slate-50/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={doc.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                                                    alt={doc.name}
                                                    className="w-10 h-10 rounded-xl object-cover"
                                                />
                                                <div>
                                                    <p className="font-bold text-slate-900">Dr. {doc.name}</p>
                                                    <p className="text-[11px] text-slate-400">{doc.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <p className="font-bold text-teal-700">{profile.specializationName || 'General Medicine'}</p>
                                            <p className="text-[11px] font-mono text-slate-500">Lic: {profile.licenseNumber || 'N/A'}</p>
                                        </td>

                                        <td className="p-4 text-slate-600">
                                            {profile.qualifications?.join(', ') || 'MBBS'}
                                        </td>

                                        <td className="p-4">
                                            <p className="text-slate-800 font-semibold">{profile.experienceYears || 0} Yrs</p>
                                            <p className="text-[11px] text-slate-400">${profile.consultationFee || 50}/visit</p>
                                        </td>

                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                isApproved
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                            }`}>
                                                {isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>

                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!isApproved ? (
                                                    <button
                                                        disabled={actionLoading === doc._id}
                                                        onClick={() => handleApproval(doc._id, true)}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                                                    >
                                                        <Check size={14} />
                                                        <span>Approve</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled={actionLoading === doc._id}
                                                        onClick={() => handleApproval(doc._id, false)}
                                                        className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all"
                                                    >
                                                        Revoke
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DoctorApprovalsTab;
