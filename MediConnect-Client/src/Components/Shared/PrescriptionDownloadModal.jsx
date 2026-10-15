import React, { useRef } from 'react';
import { useAuth } from '../../Contexts/AuthContext';
import { X, Printer, ShieldCheck, Stethoscope, Pill, FlaskConical, HeartPulse, User, Calendar, Clock, CheckCircle2 } from 'lucide-react';

const PrescriptionDownloadModal = ({ isOpen, onClose, record }) => {
    const { user: currentUser } = useAuth();
    const prescriptionRef = useRef();

    if (!isOpen || !record) return null;

    // Resolve Doctor Information
    const doctor = record.doctorId || {};
    const doctorProfile = doctor.doctorProfile || {};
    const doctorName = doctor.name ? (doctor.name.toLowerCase().startsWith('dr.') ? doctor.name : `Dr. ${doctor.name}`) : 'Dr. Attending Specialist';
    const specialization = doctorProfile.specializationName || 'General Medicine';
    const licenseNumber = doctorProfile.licenseNumber || 'MED-AU-90214';
    const hospital = doctorProfile.hospitalAffiliation || 'Royal Darwin Hospital';
    const qualifications = Array.isArray(doctorProfile.qualifications) && doctorProfile.qualifications.length > 0 
        ? doctorProfile.qualifications.join(', ') 
        : 'MBBS, MD, FRACP';
    const doctorPhone = doctor.phone || '+61 (08) 8946 6666';
    const doctorEmail = doctor.email || 'clinical.records@mediconnect.com';

    // Resolve Patient Information
    const patient = (typeof record.patientId === 'object' && record.patientId?.name) 
        ? record.patientId 
        : (currentUser?.role === 'patient' ? currentUser : null);

    const patientProfile = patient?.patientProfile || currentUser?.patientProfile || {};
    const patientName = patient?.name || currentUser?.name || 'Registered Patient';
    const patientEmail = patient?.email || currentUser?.email || 'patient@mediconnect.com';
    const patientPhone = patient?.phone || currentUser?.phone || '+61 400 000 000';
    const patientBloodGroup = patientProfile.bloodGroup || 'O+';
    const patientGender = patientProfile.gender || 'Not specified';
    const patientCity = patient?.address?.city || currentUser?.address?.city || 'Darwin, NT, Australia';

    const rxNo = `RX-${record._id.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}`;
    const encounterDate = new Date(record.createdAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
    const encounterTime = new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const vitals = record.vitalSigns || {};
    const prescriptions = record.prescriptions || [];
    const labTests = record.labTestsRecommended || [];

    const handlePrintPrescription = () => {
        const printWindow = window.open('', '_blank', 'width=920,height=950');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>${rxNo}_MediConnect_Prescription</title>
                    <style>
                        @page {
                            size: A4;
                            margin: 12mm;
                        }
                        * {
                            box-sizing: border-box;
                            margin: 0;
                            padding: 0;
                        }
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                            color: #0f172a;
                            background: #ffffff;
                            padding: 24px;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        .rx-card {
                            border: 2px solid #cbd5e1;
                            border-radius: 16px;
                            padding: 32px;
                            max-width: 820px;
                            margin: 0 auto;
                            position: relative;
                            background: #ffffff;
                        }
                        .header-row {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            border-bottom: 2px solid #0d9488;
                            padding-bottom: 20px;
                            margin-bottom: 20px;
                        }
                        .brand-area {
                            display: flex;
                            align-items: center;
                            gap: 14px;
                        }
                        .logo-svg {
                            width: 48px;
                            height: 48px;
                            flex-shrink: 0;
                        }
                        .brand-name {
                            font-size: 22px;
                            font-weight: 900;
                            color: #0f172a;
                            letter-spacing: -0.5px;
                        }
                        .brand-sub {
                            font-size: 11px;
                            font-weight: 700;
                            color: #0d9488;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                        .clinic-meta {
                            font-size: 11px;
                            color: #64748b;
                            margin-top: 6px;
                            line-height: 1.4;
                        }
                        .doctor-header-box {
                            text-align: right;
                        }
                        .badge-rx {
                            display: inline-block;
                            background: #ccfbf1;
                            color: #0f766e;
                            border: 1px solid #99f6e4;
                            font-size: 10px;
                            font-weight: 800;
                            padding: 4px 12px;
                            border-radius: 9999px;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            margin-bottom: 6px;
                        }
                        .doc-name {
                            font-size: 16px;
                            font-weight: 900;
                            color: #0f172a;
                        }
                        .doc-qual {
                            font-size: 11px;
                            color: #0d9488;
                            font-weight: 700;
                        }
                        .doc-meta {
                            font-size: 11px;
                            color: #475569;
                            line-height: 1.4;
                        }
                        .patient-strip {
                            display: grid;
                            grid-template-columns: 2fr 1fr 1fr 1fr;
                            gap: 12px;
                            background: #f8fafc;
                            border: 1px solid #e2e8f0;
                            border-radius: 12px;
                            padding: 14px 18px;
                            margin-bottom: 20px;
                            font-size: 11px;
                        }
                        .patient-strip strong {
                            color: #0f172a;
                            display: block;
                            font-size: 12px;
                        }
                        .vitals-grid {
                            display: grid;
                            grid-template-columns: repeat(4, 1fr);
                            gap: 10px;
                            background: #f0fdfa;
                            border: 1px solid #ccfbf1;
                            border-radius: 10px;
                            padding: 12px;
                            margin-bottom: 20px;
                            text-align: center;
                        }
                        .vitals-col span {
                            display: block;
                            font-size: 10px;
                            color: #0f766e;
                            font-weight: 700;
                            text-transform: uppercase;
                        }
                        .vitals-col strong {
                            font-size: 13px;
                            color: #042f2e;
                            font-weight: 800;
                        }
                        .diag-box {
                            margin-bottom: 20px;
                            padding: 14px 18px;
                            background: #ffffff;
                            border: 1px solid #cbd5e1;
                            border-left: 4px solid #0d9488;
                            border-radius: 8px;
                        }
                        .diag-title {
                            font-size: 10px;
                            font-weight: 800;
                            color: #0d9488;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            margin-bottom: 4px;
                        }
                        .diag-text {
                            font-size: 15px;
                            font-weight: 900;
                            color: #0f172a;
                        }
                        .symptoms-text {
                            font-size: 11px;
                            color: #475569;
                            margin-top: 4px;
                        }
                        .rx-symbol {
                            font-size: 28px;
                            font-weight: 900;
                            font-family: serif;
                            color: #0d9488;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            margin-bottom: 10px;
                        }
                        .table-wrap {
                            border: 1px solid #cbd5e1;
                            border-radius: 10px;
                            overflow: hidden;
                            margin-bottom: 20px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 12px;
                        }
                        th {
                            background: #f1f5f9;
                            color: #334155;
                            font-weight: 700;
                            text-align: left;
                            padding: 10px 12px;
                            border-bottom: 1px solid #cbd5e1;
                        }
                        td {
                            padding: 10px 12px;
                            border-bottom: 1px solid #e2e8f0;
                            color: #1e293b;
                        }
                        .med-name {
                            font-weight: 800;
                            color: #0f172a;
                        }
                        .section-title {
                            font-size: 11px;
                            font-weight: 800;
                            color: #0f172a;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            margin-bottom: 8px;
                        }
                        .labs-wrap {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 6px;
                            margin-bottom: 20px;
                        }
                        .lab-pill {
                            background: #f1f5f9;
                            border: 1px solid #cbd5e1;
                            color: #1e293b;
                            font-size: 11px;
                            font-weight: 700;
                            padding: 4px 10px;
                            border-radius: 6px;
                        }
                        .advice-box {
                            background: #f8fafc;
                            border: 1px dashed #cbd5e1;
                            border-radius: 10px;
                            padding: 12px 16px;
                            margin-bottom: 24px;
                            font-size: 11px;
                            color: #334155;
                            line-height: 1.5;
                        }
                        .footer-row {
                            border-top: 1px solid #cbd5e1;
                            padding-top: 18px;
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-end;
                            font-size: 10px;
                            color: #64748b;
                        }
                        .sig-line {
                            width: 180px;
                            border-bottom: 1px solid #94a3b8;
                            padding-bottom: 4px;
                            text-align: center;
                            font-family: Georgia, serif;
                            font-style: italic;
                            font-size: 14px;
                            color: #0f172a;
                        }
                    </style>
                </head>
                <body onload="window.print();">
                    <div class="rx-card">
                        <!-- Header & Doctor Credentials -->
                        <div class="header-row">
                            <div>
                                <div class="brand-area">
                                    <svg class="logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="100" height="100" rx="24" fill="#0d9488" />
                                        <path d="M50 20V80M20 50H80" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>
                                        <circle cx="50" cy="50" r="14" fill="#042f2e"/>
                                        <path d="M43 50L48 55L57 44" stroke="#5eead4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <div>
                                        <div class="brand-name">MediConnect Healthcare</div>
                                        <div class="brand-sub">Official Digital Prescription & Clinical Record</div>
                                    </div>
                                </div>
                                <div class="clinic-meta">
                                    Charles Darwin University Health Precinct<br>
                                    Ellengowan Dr, Casuarina NT 0810, Australia<br>
                                    Emergency / Inquiries: +61 (08) 8946 6666
                                </div>
                            </div>

                            <div class="doctor-header-box">
                                <span class="badge-rx">Verified Medical Practitioner</span>
                                <div class="doc-name">${doctorName}</div>
                                <div class="doc-qual">${qualifications}</div>
                                <div class="doc-meta"><strong>Specialty:</strong> ${specialization}</div>
                                <div class="doc-meta"><strong>License No:</strong> ${licenseNumber}</div>
                                <div class="doc-meta"><strong>Hospital:</strong> ${hospital}</div>
                            </div>
                        </div>

                        <!-- Patient Demographics Strip -->
                        <div class="patient-strip">
                            <div>
                                <span style="color: #64748b;">Patient Name:</span>
                                <strong>${patientName}</strong>
                                <span style="color: #64748b; font-size: 10px;">${patientCity}</span>
                            </div>
                            <div>
                                <span style="color: #64748b;">Blood Group:</span>
                                <strong>${patientBloodGroup}</strong>
                            </div>
                            <div>
                                <span style="color: #64748b;">Contact:</span>
                                <strong>${patientPhone}</strong>
                            </div>
                            <div>
                                <span style="color: #64748b;">Date & Rx No:</span>
                                <strong>${encounterDate}</strong>
                                <span style="font-size: 10px; color: #0d9488; font-weight: 700;">${rxNo}</span>
                            </div>
                        </div>

                        <!-- Patient Vitals Strip -->
                        <div class="vitals-grid">
                            <div class="vitals-col">
                                <span>Blood Pressure</span>
                                <strong>${vitals.bloodPressure || '120/80 mmHg'}</strong>
                            </div>
                            <div class="vitals-col">
                                <span>Pulse Rate</span>
                                <strong>${vitals.pulseRate || '72 bpm'}</strong>
                            </div>
                            <div class="vitals-col">
                                <span>Body Temperature</span>
                                <strong>${vitals.temperature || '98.6 °F'}</strong>
                            </div>
                            <div class="vitals-col">
                                <span>Body Weight</span>
                                <strong>${vitals.weight || '70 kg'}</strong>
                            </div>
                        </div>

                        <!-- Diagnosis -->
                        <div class="diag-box">
                            <div class="diag-title">Primary Clinical Diagnosis</div>
                            <div class="diag-text">${record.diagnosis}</div>
                            ${record.symptoms ? `<div class="symptoms-text"><strong>Presenting Symptoms:</strong> ${record.symptoms}</div>` : ''}
                        </div>

                        <!-- Prescriptions Table -->
                        <div class="rx-symbol">
                            <span>℞</span>
                            <span style="font-size: 13px; font-family: sans-serif; font-weight: 800; color: #0f172a; text-transform: uppercase;">
                                Prescribed Medications
                            </span>
                        </div>

                        <div class="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th style="width: 40px;">#</th>
                                        <th>Medicine Name</th>
                                        <th>Dosage</th>
                                        <th>Frequency</th>
                                        <th>Duration</th>
                                        <th>Instructions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${prescriptions.map((med, idx) => `
                                        <tr>
                                            <td style="font-weight: 700;">${idx + 1}</td>
                                            <td class="med-name">${med.medicineName}</td>
                                            <td><strong>${med.dosage}</strong></td>
                                            <td style="color: #0d9488; font-weight: 700;">${med.frequency}</td>
                                            <td>${med.duration}</td>
                                            <td style="font-size: 11px; color: #475569;">${med.instructions || 'As directed'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <!-- Recommended Lab Tests -->
                        ${labTests.length > 0 ? `
                            <div style="margin-bottom: 20px;">
                                <div class="section-title">🔬 Recommended Lab & Pathology Diagnostics</div>
                                <div class="labs-wrap">
                                    ${labTests.map(test => `<span class="lab-pill">${test}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Doctor Advice & Lifestyle -->
                        <div class="advice-box">
                            <strong style="color: #0f172a; display: block; margin-bottom: 2px;">Doctor Advice & Instructions:</strong>
                            ${record.doctorAdvice || 'Take prescribed medications as directed. Ensure adequate rest and hydration.'}
                            ${record.followUpDate ? `<div style="margin-top: 6px; font-weight: 800; color: #0d9488;">Scheduled Follow-Up: ${record.followUpDate}</div>` : ''}
                        </div>

                        <!-- Footer & Physician Sign-off -->
                        <div class="footer-row">
                            <div>
                                <strong>Legal Medical Notice:</strong><br>
                                • This prescription is electronically signed under Australian National e-Health standards.<br>
                                • Valid for dispensing at registered community and hospital pharmacies across Australia.
                            </div>

                            <div style="text-align: right;">
                                <div class="sig-line">${doctorName}</div>
                                <div style="font-size: 9px; text-transform: uppercase; margin-top: 2px; color: #475569;">
                                    ${specialization} • Lic: ${licenseNumber}
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-8 flex flex-col">
                {/* Modal Top Control Bar */}
                <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Digital Prescription & Clinical Record</span>
                        <span className="text-xs text-slate-400">• {rxNo}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrintPrescription}
                            className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                        >
                            <Printer size={14} />
                            <span>Print / Save PDF</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Modal Visual Sheet */}
                <div className="p-6 sm:p-10 overflow-y-auto max-h-[80vh] bg-slate-50">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-teal-600 gap-6">
                            <div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="100" height="100" rx="24" fill="#0d9488" />
                                        <path d="M50 20V80M20 50H80" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>
                                        <circle cx="50" cy="50" r="14" fill="#042f2e"/>
                                        <path d="M43 50L48 55L57 44" stroke="#5eead4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <div>
                                        <h1 className="text-xl font-black text-slate-900 tracking-tight">MediConnect Healthcare</h1>
                                        <p className="text-[11px] text-teal-700 font-bold uppercase tracking-wider">Official Medical Prescription (Rx)</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    Charles Darwin University Health Precinct<br />
                                    Ellengowan Dr, Casuarina NT 0810, Australia
                                </p>
                            </div>

                            <div className="sm:text-right space-y-1">
                                <span className="inline-block bg-teal-50 text-teal-800 border border-teal-200 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                                    Verified Prescription
                                </span>
                                <p className="text-sm font-black text-slate-900">{doctorName}</p>
                                <p className="text-xs text-slate-600"><strong>Specialty:</strong> {specialization}</p>
                                <p className="text-xs text-slate-600"><strong>License:</strong> {licenseNumber}</p>
                                <p className="text-xs text-slate-600"><strong>Hospital:</strong> {hospital}</p>
                            </div>
                        </div>

                        {/* Patient Strip */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name</span>
                                <strong className="text-slate-900 text-sm">{patientName}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
                                <strong className="text-slate-900">{patientBloodGroup}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Encounter Date</span>
                                <strong className="text-slate-900">{encounterDate}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Prescription ID</span>
                                <strong className="text-teal-700 font-mono">{rxNo}</strong>
                            </div>
                        </div>

                        {/* Vitals Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-teal-50/50 border border-teal-200/60 rounded-xl text-center text-xs">
                            <div>
                                <span className="text-[10px] text-teal-800 font-bold uppercase block">Blood Pressure</span>
                                <strong className="text-slate-900">{vitals.bloodPressure || '120/80 mmHg'}</strong>
                            </div>
                            <div>
                                <span className="text-[10px] text-teal-800 font-bold uppercase block">Pulse Rate</span>
                                <strong className="text-slate-900">{vitals.pulseRate || '74 bpm'}</strong>
                            </div>
                            <div>
                                <span className="text-[10px] text-teal-800 font-bold uppercase block">Temperature</span>
                                <strong className="text-slate-900">{vitals.temperature || '98.6 °F'}</strong>
                            </div>
                            <div>
                                <span className="text-[10px] text-teal-800 font-bold uppercase block">Weight</span>
                                <strong className="text-slate-900">{vitals.weight || '70 kg'}</strong>
                            </div>
                        </div>

                        {/* Diagnosis */}
                        <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-teal-600 rounded-xl">
                            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">Clinical Diagnosis</span>
                            <h3 className="text-base font-black text-slate-900 mt-0.5">{record.diagnosis}</h3>
                            {record.symptoms && (
                                <p className="text-xs text-slate-600 mt-1"><strong>Symptoms:</strong> {record.symptoms}</p>
                            )}
                        </div>

                        {/* Prescriptions Table */}
                        {prescriptions.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    <span className="text-lg text-teal-700 font-serif font-black">℞</span>
                                    <span>Prescribed Medications</span>
                                </div>
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                            <tr>
                                                <th className="p-3">#</th>
                                                <th className="p-3">Medicine</th>
                                                <th className="p-3">Dosage</th>
                                                <th className="p-3">Frequency</th>
                                                <th className="p-3">Duration</th>
                                                <th className="p-3">Instructions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {prescriptions.map((med, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-3 font-bold">{idx + 1}</td>
                                                    <td className="p-3 font-bold text-slate-900">{med.medicineName}</td>
                                                    <td className="p-3 text-slate-700 font-semibold">{med.dosage}</td>
                                                    <td className="p-3 text-teal-700 font-bold">{med.frequency}</td>
                                                    <td className="p-3 text-slate-600">{med.duration}</td>
                                                    <td className="p-3 text-slate-500">{med.instructions}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Lab Tests */}
                        {labTests.length > 0 && (
                            <div className="space-y-1.5">
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Recommended Lab Diagnostics</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {labTests.map((test, idx) => (
                                        <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-800 px-3 py-1 rounded-lg text-xs font-semibold">
                                            {test}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Advice */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                            <strong className="text-slate-800">Doctor Advice: </strong>
                            <span className="text-slate-600">{record.doctorAdvice || 'Rest adequately, maintain hydration, and take medications as directed.'}</span>
                            {record.followUpDate && (
                                <p className="mt-1 font-bold text-teal-700">Follow-up Consultation: {record.followUpDate}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionDownloadModal;
