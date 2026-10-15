import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { Layers, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

const SpecializationsTab = () => {
    const [specializations, setSpecializations] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [symptomsInput, setSymptomsInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const fetchSpecialties = async () => {
        setLoading(true);
        try {
            const res = await api.get('/specializations');
            if (res.data.success) {
                setSpecializations(res.data.specializations || []);
            }
        } catch (err) {
            console.error('Error loading specialties:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpecialties();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');

        try {
            const symptoms = symptomsInput.split(',').map(s => s.trim()).filter(Boolean);
            const res = await api.post('/specializations', {
                name,
                description,
                popularSymptoms: symptoms
            });

            if (res.data.success) {
                setMessage('Medical department created successfully!');
                setName('');
                setDescription('');
                setSymptomsInput('');
                fetchSpecialties();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create specialization');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="pb-6 border-b border-slate-100">
                    <h2 className="text-2xl font-black text-slate-900">Medical Departments & Specializations</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Manage clinical taxonomies, patient symptom tags, and department descriptions.
                    </p>
                </div>

                {message && (
                    <div className="my-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        <span>{message}</span>
                    </div>
                )}

                {/* Add Specialization Form */}
                <form onSubmit={handleCreate} className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">Add New Medical Specialty</span>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Specialty Name *</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                                placeholder="e.g. Oncology, Endocrinology, Nephrology"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Common Symptoms (comma separated)</label>
                            <input
                                type="text"
                                value={symptomsInput}
                                onChange={(e) => setSymptomsInput(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                                placeholder="e.g. Hormonal imbalance, thyroid, fatigue"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Department Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                            placeholder="Clinical overview of treatments and diagnostics offered."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                        <Plus size={16} />
                        <span>{submitting ? 'Creating...' : 'Create Department'}</span>
                    </button>
                </form>

                {/* Specialties Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {specializations.map((spec) => (
                        <div key={spec._id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
                            <h4 className="font-bold text-slate-900 text-sm">{spec.name}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{spec.description}</p>
                            {spec.popularSymptoms && spec.popularSymptoms.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    {spec.popularSymptoms.map((sym, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold">
                                            {sym}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpecializationsTab;
