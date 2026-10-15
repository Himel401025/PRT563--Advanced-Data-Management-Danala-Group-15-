import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useAuth } from '../../../Contexts/AuthContext';
import { FileCheck, Pill, Plus, Trash2, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

const IssueRecordTab = ({ selectedAppointmentForRecord, setActiveTab }) => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(
        selectedAppointmentForRecord?._id || ''
    );

    const [diagnosis, setDiagnosis] = useState('');
    const [symptoms, setSymptoms] = useState('');
    
    // Vitals
    const [bp, setBp] = useState('120/80 mmHg');
    const [pulse, setPulse] = useState('72 bpm');
    const [temp, setTemp] = useState('98.6 °F');
    const [weight, setWeight] = useState('70 kg');

    // Prescriptions List
    const [prescriptions, setPrescriptions] = useState([
        { medicineName: '', dosage: '500mg', frequency: '1-0-1 (Twice daily)', duration: '5 days', instructions: 'After meals' }
    ]);

    // Lab Tests
    const [labTestInput, setLabTestInput] = useState('');
    const [labTestsRecommended, setLabTestsRecommended] = useState([]);

    const [doctorAdvice, setDoctorAdvice] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch doctor's active appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await api.get('/appointments/my-appointments');
                if (res.data.success) {
                    setAppointments(res.data.appointments || []);
                    if (!selectedAppointmentId && res.data.appointments?.length > 0) {
                        setSelectedAppointmentId(res.data.appointments[0]._id);
                    }
                }
            } catch (err) {
                console.error('Error fetching appointments for record:', err);
            }
        };
        fetchAppointments();
    }, []);

    const addPrescriptionRow = () => {
        setPrescriptions([
            ...prescriptions,
            { medicineName: '', dosage: '1 tablet', frequency: '1-0-1', duration: '7 days', instructions: 'Take with water' }
        ]);
    };

    const updatePrescriptionField = (index, field, value) => {
        const updated = [...prescriptions];
        updated[index][field] = value;
        setPrescriptions(updated);
    };

    const removePrescriptionRow = (index) => {
        setPrescriptions(prescriptions.filter((_, i) => i !== index));
    };

    const addLabTest = () => {
        if (labTestInput && !labTestsRecommended.includes(labTestInput)) {
            setLabTestsRecommended([...labTestsRecommended, labTestInput]);
            setLabTestInput('');
        }
    };

    const removeLabTest = (test) => {
        setLabTestsRecommended(labTestsRecommended.filter(t => t !== test));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedAppointmentId) {
            setError('Please select an appointment to attach this clinical record.');
            return;
        }

        if (!diagnosis.trim()) {
            setError('Clinical diagnosis is required.');
            return;
        }

        setSaving(true);

        try {
            const validPrescriptions = prescriptions.filter(p => p.medicineName.trim() !== '');

            const payload = {
                appointmentId: selectedAppointmentId,
                diagnosis,
                symptoms,
                vitalSigns: {
                    bloodPressure: bp,
                    pulseRate: pulse,
                    temperature: temp,
                    weight
                },
                prescriptions: validPrescriptions,
                labTestsRecommended,
                doctorAdvice,
                followUpDate
            };

            const res = await api.post('/medical-records', payload);
            if (res.data.success) {
                setSuccess('Prescription and medical record published successfully to patient portal!');
                setTimeout(() => {
                    if (setActiveTab) setActiveTab('doctor-appointments');
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to issue medical record.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="pb-6 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-900">Author Clinical Record & Prescription (Rx)</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Generate an official digital prescription, record clinical observations, and order lab tests.
                </p>
            </div>

            {success && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{success}</span>
                </div>
            )}

            {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Appointment Selection */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        1. Select Patient & Appointment
                    </label>
                    <select
                        value={selectedAppointmentId}
                        onChange={(e) => setSelectedAppointmentId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-teal-500"
                        required
                    >
                        <option value="">-- Choose Consultation --</option>
                        {appointments.map((app) => (
                            <option key={app._id} value={app._id}>
                                {app.patientId?.name} — {app.appointmentDate} ({app.timeSlot}) [{app.status}]
                            </option>
                        ))}
                    </select>
                </div>

                {/* Vitals Strip */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        2. Patient Vital Signs
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                            <span className="text-[11px] text-slate-400 font-medium block">Blood Pressure</span>
                            <input
                                type="text"
                                value={bp}
                                onChange={(e) => setBp(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                                placeholder="120/80 mmHg"
                            />
                        </div>
                        <div>
                            <span className="text-[11px] text-slate-400 font-medium block">Pulse Rate</span>
                            <input
                                type="text"
                                value={pulse}
                                onChange={(e) => setPulse(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                                placeholder="72 bpm"
                            />
                        </div>
                        <div>
                            <span className="text-[11px] text-slate-400 font-medium block">Temperature</span>
                            <input
                                type="text"
                                value={temp}
                                onChange={(e) => setTemp(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                                placeholder="98.6 °F"
                            />
                        </div>
                        <div>
                            <span className="text-[11px] text-slate-400 font-medium block">Weight</span>
                            <input
                                type="text"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                                placeholder="70 kg"
                            />
                        </div>
                    </div>
                </div>

                {/* Diagnosis & Symptoms */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            3. Clinical Diagnosis *
                        </label>
                        <input
                            type="text"
                            required
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-teal-500"
                            placeholder="e.g. Acute Viral Bronchitis / Hypertension Stage 1"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Symptoms & Observations
                        </label>
                        <input
                            type="text"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                            placeholder="e.g. Productive cough, fatigue for 4 days"
                        />
                    </div>
                </div>

                {/* Prescriptions Dynamic List */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <Pill size={16} className="text-teal-600" />
                            4. Medication Prescriptions (Rx)
                        </label>
                        <button
                            type="button"
                            onClick={addPrescriptionRow}
                            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                        >
                            <Plus size={14} />
                            <span>Add Medicine</span>
                        </button>
                    </div>

                    <div className="space-y-2.5">
                        {prescriptions.map((med, idx) => (
                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-6 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 items-center">
                                <div className="sm:col-span-2">
                                    <input
                                        type="text"
                                        placeholder="Medicine Name (e.g. Amoxicillin)"
                                        value={med.medicineName}
                                        onChange={(e) => updatePrescriptionField(idx, 'medicineName', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Dosage (e.g. 500mg)"
                                        value={med.dosage}
                                        onChange={(e) => updatePrescriptionField(idx, 'dosage', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Freq (e.g. 1-0-1)"
                                        value={med.frequency}
                                        onChange={(e) => updatePrescriptionField(idx, 'frequency', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Duration (5 days)"
                                        value={med.duration}
                                        onChange={(e) => updatePrescriptionField(idx, 'duration', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Instructions"
                                        value={med.instructions}
                                        onChange={(e) => updatePrescriptionField(idx, 'instructions', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                                    />
                                    {prescriptions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removePrescriptionRow(idx)}
                                            className="text-slate-400 hover:text-red-600 p-1"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lab Diagnostics Recommendations */}
                <div className="pt-4 border-t border-slate-100">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        5. Recommended Lab Diagnostics
                    </label>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                        {labTestsRecommended.map((test) => (
                            <span key={test} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-teal-200">
                                <span>{test}</span>
                                <button type="button" onClick={() => removeLabTest(test)} className="hover:text-red-600">×</button>
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-2 max-w-sm">
                        <input
                            type="text"
                            placeholder="e.g. Complete Blood Count (CBC)"
                            value={labTestInput}
                            onChange={(e) => setLabTestInput(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 flex-1"
                        />
                        <button
                            type="button"
                            onClick={addLabTest}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800"
                        >
                            Add Test
                        </button>
                    </div>
                </div>

                {/* Advice & Follow Up Date */}
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Doctor Advice & Instructions
                        </label>
                        <textarea
                            rows={2}
                            value={doctorAdvice}
                            onChange={(e) => setDoctorAdvice(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                            placeholder="e.g. Bed rest for 3 days, drink warm fluids, avoid cold exposure."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Follow-Up Consultation Date
                        </label>
                        <input
                            type="date"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                    <FileCheck size={18} />
                    <span>{saving ? 'Publishing Medical Record...' : 'Publish Prescription & Complete Encounter'}</span>
                </button>
            </form>
        </div>
    );
};

export default IssueRecordTab;
