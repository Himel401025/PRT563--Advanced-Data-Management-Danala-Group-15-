import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useAuth } from '../../../Contexts/AuthContext';
import { 
    FileText, 
    Calendar, 
    User, 
    Stethoscope, 
    Printer, 
    Activity, 
    Pill, 
    FlaskConical, 
    HeartPulse,
    ShieldCheck,
    Download
} from 'lucide-react';
import PrescriptionDownloadModal from '../../Shared/PrescriptionDownloadModal';

const MedicalRecordsTab = () => {
    const { user, isDoctor, isPatient } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showDownloadModal, setShowDownloadModal] = useState(false);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await api.get('/medical-records/my-records');
                if (res.data.success) {
                    setRecords(res.data.records || []);
                    if (res.data.records?.length > 0) {
                        setSelectedRecord(res.data.records[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching medical records:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    const handleOpenDownloadModal = (recordToDownload) => {
        if (recordToDownload) {
            setSelectedRecord(recordToDownload);
        }
        setShowDownloadModal(true);
    };

    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-teal-600">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600 mb-3"></div>
                <p className="text-xs text-slate-500 font-medium">Loading clinical records & prescriptions...</p>
            </div>
        );
    }

    if (records.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
                <FileText size={36} className="text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No Medical Records Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Your digital prescriptions and clinical encounter notes will appear here as consultations are completed.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Digital Prescriptions & Medical Records</h2>
                    <p className="text-xs sm:text-sm text-slate-500">Official medical history, vital signs, and doctor prescriptions.</p>
                </div>
                {selectedRecord && (
                    <button
                        onClick={() => handleOpenDownloadModal(selectedRecord)}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer flex-shrink-0"
                    >
                        <Printer size={15} />
                        <span>Download / Print Prescription</span>
                    </button>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left List of Records */}
                <div className="lg:col-span-1 space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clinical Encounters</p>
                    {records.map((rec) => {
                        const isSelected = selectedRecord?._id === rec._id;
                        return (
                            <div
                                key={rec._id}
                                onClick={() => setSelectedRecord(rec)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                                    isSelected
                                        ? 'bg-teal-50/70 border-teal-500 shadow-sm'
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-teal-700">
                                        Dr. {rec.doctorId?.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(rec.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 mt-1 truncate">
                                    {rec.diagnosis}
                                </h4>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                                    <p className="text-[11px] text-slate-500">
                                        {rec.prescriptions?.length || 0} medications prescribed
                                    </p>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenDownloadModal(rec);
                                        }}
                                        className="text-[11px] text-teal-600 hover:text-teal-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                                    >
                                        <Download size={12} />
                                        <span>Download PDF</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Prescription / Record Sheet */}
                {selectedRecord && (
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                        {/* Prescription Header */}
                        <div className="flex justify-between items-start pb-6 border-b border-slate-200">
                            <div>
                                <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
                                    <Stethoscope size={18} />
                                    <span>Dr. {selectedRecord.doctorId?.name}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {selectedRecord.doctorId?.doctorProfile?.specializationName || 'Specialist Physician'} • {selectedRecord.doctorId?.doctorProfile?.hospitalAffiliation || 'Central Hospital'}
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                    License: {selectedRecord.doctorId?.doctorProfile?.licenseNumber || 'MED-VERIFIED'}
                                </p>
                            </div>

                            <div className="text-right">
                                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full uppercase">
                                    Official Clinical Note
                                </span>
                                <p className="text-xs text-slate-500 mt-1.5">
                                    Date: <strong>{new Date(selectedRecord.createdAt).toLocaleDateString()}</strong>
                                </p>
                            </div>
                        </div>

                        {/* Vital Signs Strip */}
                        {selectedRecord.vitalSigns && (
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-medium block">Blood Pressure</span>
                                    <strong className="text-xs text-slate-800">{selectedRecord.vitalSigns.bloodPressure || '120/80 mmHg'}</strong>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-medium block">Pulse Rate</span>
                                    <strong className="text-xs text-slate-800">{selectedRecord.vitalSigns.pulseRate || '74 bpm'}</strong>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-medium block">Temperature</span>
                                    <strong className="text-xs text-slate-800">{selectedRecord.vitalSigns.temperature || '98.6 °F'}</strong>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-medium block">Body Weight</span>
                                    <strong className="text-xs text-slate-800">{selectedRecord.vitalSigns.weight || '72 kg'}</strong>
                                </div>
                            </div>
                        )}

                        {/* Diagnosis & Clinical Symptoms */}
                        <div className="space-y-3">
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Clinical Diagnosis</span>
                                <p className="text-base font-black text-slate-900 mt-0.5">{selectedRecord.diagnosis}</p>
                            </div>

                            {selectedRecord.symptoms && (
                                <div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Symptoms / Observations</span>
                                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{selectedRecord.symptoms}</p>
                                </div>
                            )}
                        </div>

                        {/* Prescribed Medications Table */}
                        {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    <Pill size={15} className="text-teal-600" />
                                    <span>Prescribed Medications (Rx)</span>
                                </div>

                                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                            <tr>
                                                <th className="p-3">Medicine Name</th>
                                                <th className="p-3">Dosage</th>
                                                <th className="p-3">Frequency</th>
                                                <th className="p-3">Duration</th>
                                                <th className="p-3">Instructions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {selectedRecord.prescriptions.map((med, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50">
                                                    <td className="p-3 font-bold text-slate-900">{med.medicineName}</td>
                                                    <td className="p-3 text-slate-600">{med.dosage}</td>
                                                    <td className="p-3 text-teal-700 font-semibold">{med.frequency}</td>
                                                    <td className="p-3 text-slate-600">{med.duration}</td>
                                                    <td className="p-3 text-slate-500">{med.instructions || 'With food'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Recommended Lab Tests */}
                        {selectedRecord.labTestsRecommended && selectedRecord.labTestsRecommended.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    <FlaskConical size={15} className="text-teal-600" />
                                    <span>Recommended Lab Diagnostics</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRecord.labTestsRecommended.map((test, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                                            {test}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Doctor Advice & Follow Up */}
                        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                            <div>
                                <span className="text-slate-400 font-medium">Doctor Advice: </span>
                                <span className="text-slate-700 font-semibold">{selectedRecord.doctorAdvice || 'Rest adequately, maintain hydration, and take medications as directed.'}</span>
                            </div>
                            {selectedRecord.followUpDate && (
                                <div className="bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 text-teal-800 font-bold flex-shrink-0">
                                    Follow-up: {selectedRecord.followUpDate}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Dedicated Prescription Download & Print Modal */}
            <PrescriptionDownloadModal
                isOpen={showDownloadModal}
                onClose={() => setShowDownloadModal(false)}
                record={selectedRecord}
            />
        </div>
    );
};

export default MedicalRecordsTab;
