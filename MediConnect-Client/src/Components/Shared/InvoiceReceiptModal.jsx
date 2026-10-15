import React, { useRef } from 'react';
import { useAuth } from '../../Contexts/AuthContext';
import { X, Printer, ShieldCheck, CheckCircle2, Building2, Calendar, Clock, User, Phone, Mail, Award } from 'lucide-react';

const InvoiceReceiptModal = ({ isOpen, onClose, transaction, appointment }) => {
    const { user: currentUser } = useAuth();
    const invoiceRef = useRef();

    if (!isOpen) return null;

    // 1. Comprehensive Doctor Resolver
    const docObj = (typeof transaction?.doctorId === 'object' && transaction?.doctorId?.name)
        ? transaction.doctorId
        : (typeof appointment?.doctorId === 'object' && appointment?.doctorId?.name)
        ? appointment.doctorId
        : null;

    const docProfile = docObj?.doctorProfile || appointment?.doctorProfile || {};

    const rawDocName = docObj?.name || (typeof appointment?.doctorId === 'string' ? '' : '') || 'Emily Watson';
    const doctorName = rawDocName.toLowerCase().startsWith('dr.') ? rawDocName : `Dr. ${rawDocName}`;
    const specialization = docProfile.specializationName || appointment?.specializationName || 'Specialist Consultation';
    const licenseNumber = docProfile.licenseNumber || 'MED-AU-90214';
    const hospital = docProfile.hospitalAffiliation || 'Royal Darwin Hospital';
    const docQualifications = Array.isArray(docProfile.qualifications) && docProfile.qualifications.length > 0 
        ? docProfile.qualifications.join(', ') 
        : 'MBBS, MD, FRACP';
    const docEmail = docObj?.email || 'clinical.support@mediconnect.com';
    const docPhone = docObj?.phone || '+61 (08) 8946 6666';

    // 2. Comprehensive Patient Resolver
    const patObj = (typeof transaction?.patientId === 'object' && transaction?.patientId?.name)
        ? transaction.patientId
        : (typeof appointment?.patientId === 'object' && appointment?.patientId?.name)
        ? appointment.patientId
        : (currentUser?.role === 'patient' ? currentUser : null);

    const patProfile = patObj?.patientProfile || currentUser?.patientProfile || {};

    const patientName = patObj?.name || currentUser?.name || 'Registered Patient';
    const patientEmail = patObj?.email || currentUser?.email || 'patient@mediconnect.com';
    const patientPhone = patObj?.phone || currentUser?.phone || '+61 400 000 000';
    const patientBloodGroup = patProfile.bloodGroup || 'O+';
    const patientCity = patObj?.address?.city || currentUser?.address?.city || 'Darwin, NT, Australia';

    // 3. Billing & Appointment Meta
    const amount = (transaction?.amount || appointment?.consultationFee || 50).toFixed(2);
    const tranId = transaction?.transactionId || appointment?.paymentDetails?.transactionId || `PAYPAL-${Date.now()}`;
    const invoiceNo = `INV-${tranId.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}`;

    const rawDate = transaction?.createdAt || appointment?.paymentDetails?.paidAt || new Date();
    const formattedDate = new Date(rawDate).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = new Date(rawDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const appDate = appointment?.appointmentDate || formattedDate;
    const appSlot = appointment?.timeSlot || '09:00 AM - 09:30 AM';
    const consultType = 'In-Person Clinic Examination';

    const handlePrintInvoice = () => {
        const printWindow = window.open('', '_blank', 'width=920,height=950');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>${invoiceNo}_MediConnect_Official_Receipt</title>
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
                        .invoice-card {
                            border: 2px solid #cbd5e1;
                            border-radius: 16px;
                            padding: 32px;
                            max-width: 820px;
                            margin: 0 auto;
                            position: relative;
                        }
                        .header-row {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            border-bottom: 2px solid #0d9488;
                            padding-bottom: 20px;
                            margin-bottom: 24px;
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
                            margin-top: 8px;
                            line-height: 1.4;
                        }
                        .invoice-meta-box {
                            text-align: right;
                        }
                        .badge-tax {
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
                        .meta-text {
                            font-size: 11px;
                            color: #475569;
                            line-height: 1.5;
                        }
                        .meta-text strong {
                            color: #0f172a;
                        }
                        .info-grid {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 16px;
                            background: #f8fafc;
                            border: 1px solid #e2e8f0;
                            border-radius: 12px;
                            padding: 18px;
                            margin-bottom: 24px;
                        }
                        .info-col h4 {
                            font-size: 10px;
                            font-weight: 800;
                            color: #0d9488;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            margin-bottom: 8px;
                        }
                        .info-name {
                            font-size: 15px;
                            font-weight: 900;
                            color: #0f172a;
                            margin-bottom: 4px;
                        }
                        .info-line {
                            font-size: 11px;
                            color: #475569;
                            line-height: 1.5;
                        }
                        .info-line strong {
                            color: #1e293b;
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
                            padding: 10px 14px;
                            border-bottom: 1px solid #cbd5e1;
                        }
                        td {
                            padding: 12px 14px;
                            border-bottom: 1px solid #e2e8f0;
                            color: #1e293b;
                        }
                        .amount-col {
                            text-align: right;
                            font-weight: 700;
                        }
                        .totals-box {
                            display: flex;
                            justify-content: flex-end;
                            margin-bottom: 24px;
                        }
                        .totals-table {
                            width: 280px;
                            font-size: 12px;
                        }
                        .totals-table div {
                            display: flex;
                            justify-content: space-between;
                            padding: 4px 0;
                            color: #475569;
                        }
                        .total-highlight {
                            border-top: 2px solid #0f172a;
                            margin-top: 6px;
                            padding-top: 8px !important;
                            font-size: 15px !important;
                            font-weight: 900;
                            color: #0d9488 !important;
                        }
                        .paid-stamp {
                            display: inline-block;
                            border: 2px solid #059669;
                            color: #059669;
                            font-weight: 900;
                            font-size: 13px;
                            padding: 4px 12px;
                            border-radius: 6px;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                            transform: rotate(-3deg);
                        }
                        .footer-row {
                            border-top: 1px dashed #cbd5e1;
                            padding-top: 16px;
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-end;
                            font-size: 10px;
                            color: #64748b;
                        }
                        .sig-line {
                            width: 170px;
                            border-bottom: 1px solid #94a3b8;
                            padding-bottom: 4px;
                            text-align: center;
                            font-family: Georgia, serif;
                            font-style: italic;
                            font-size: 13px;
                            color: #1e293b;
                        }
                    </style>
                </head>
                <body onload="window.print();">
                    <div class="invoice-card">
                        <!-- Header -->
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
                                        <div class="brand-sub">Clinical Patient Consultations</div>
                                    </div>
                                </div>
                                <div class="clinic-meta">
                                    Charles Darwin University Health Precinct<br>
                                    Ellengowan Dr, Casuarina NT 0810, Australia<br>
                                    Phone: +61 (08) 8946 6666 • billing@mediconnect.com
                                </div>
                            </div>

                            <div class="invoice-meta-box">
                                <span class="badge-tax">Official Tax Invoice</span>
                                <div class="meta-text"><strong>Invoice No:</strong> ${invoiceNo}</div>
                                <div class="meta-text"><strong>Issue Date:</strong> ${formattedDate} (${formattedTime})</div>
                                <div class="meta-text"><strong>Transaction ID:</strong> ${tranId}</div>
                                <div class="meta-text"><strong>Payment Gateway:</strong> PayPal (Sandbox Verified)</div>
                                <div style="margin-top: 8px;">
                                    <span class="paid-stamp">✓ PAID IN FULL</span>
                                </div>
                            </div>
                        </div>

                        <!-- Info Grid: Patient & Attending Doctor -->
                        <div class="info-grid">
                            <!-- Patient Column -->
                            <div class="info-col">
                                <h4>Patient Information (Billed To)</h4>
                                <div class="info-name">${patientName}</div>
                                <div class="info-line"><strong>Email:</strong> ${patientEmail}</div>
                                <div class="info-line"><strong>Phone:</strong> ${patientPhone}</div>
                                <div class="info-line"><strong>Blood Group:</strong> ${patientBloodGroup}</div>
                                <div class="info-line"><strong>Location:</strong> ${patientCity}</div>
                            </div>

                            <!-- Doctor Column -->
                            <div class="info-col" style="border-left: 1px solid #e2e8f0; padding-left: 16px;">
                                <h4>Attending Medical Specialist</h4>
                                <div class="info-name">${doctorName}</div>
                                <div class="info-line"><strong>Department:</strong> ${specialization}</div>
                                <div class="info-line"><strong>Qualifications:</strong> ${docQualifications}</div>
                                <div class="info-line"><strong>License Number:</strong> ${licenseNumber}</div>
                                <div class="info-line"><strong>Hospital Affiliation:</strong> ${hospital}</div>
                            </div>
                        </div>

                        <!-- Itemized Table -->
                        <div class="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th style="width: 40px;">#</th>
                                        <th>Service Description</th>
                                        <th>Consultation Format</th>
                                        <th>Scheduled Date & Time Slot</th>
                                        <th class="amount-col">Fee (AUD)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>
                                            <strong>Specialist Clinical Consultation & Diagnostic Examination</strong>
                                            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
                                                Physician: ${doctorName} (${specialization})<br>
                                                Reason for Visit: ${appointment?.reasonForVisit || 'Standard Clinical Consultation'}
                                            </div>
                                        </td>
                                        <td><strong style="color: #0d9488;">${consultType}</strong></td>
                                        <td>${appDate}<br><span style="font-size: 10px; color: #64748b;">${appSlot}</span></td>
                                        <td class="amount-col">$${amount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Financial Summary -->
                        <div class="totals-box">
                            <div class="totals-table">
                                <div><span>Consultation Subtotal</span><strong>$${amount}</strong></div>
                                <div><span>Medical GST Exemption (0%)</span><span>$0.00</span></div>
                                <div><span>Payment Processing Fee</span><span>$0.00</span></div>
                                <div class="total-highlight"><span>Total Amount Paid</span><span>$${amount} AUD</span></div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="footer-row">
                            <div>
                                <strong>Medicare / Private Insurance Compliance:</strong><br>
                                • Keep this official receipt for Australian Medicare or private health fund rebates.<br>
                                • Generated electronically by MediConnect Clinical Management Engine.
                            </div>

                            <div style="text-align: right;">
                                <div class="sig-line">MediConnect Accounts</div>
                                <div style="font-size: 9px; text-transform: uppercase; margin-top: 2px;">Authorized Digital Signature</div>
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
                {/* Modal Header Controls */}
                <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Official Clinical Receipt</span>
                        <span className="text-xs text-slate-400">• {invoiceNo}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrintInvoice}
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

                {/* Modal Visual Invoice Sheet */}
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
                                        <p className="text-[11px] text-teal-700 font-bold uppercase tracking-wider">Clinical Patient Consultations</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    Charles Darwin University Health Precinct<br />
                                    Ellengowan Dr, Casuarina NT 0810, Australia
                                </p>
                            </div>

                            <div className="sm:text-right space-y-1">
                                <span className="inline-block bg-teal-50 text-teal-800 border border-teal-200 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                                    Official Tax Invoice
                                </span>
                                <p className="text-xs text-slate-600"><strong>Invoice:</strong> {invoiceNo}</p>
                                <p className="text-xs text-slate-600"><strong>Date:</strong> {formattedDate}</p>
                                <p className="text-xs text-slate-600"><strong>TxID:</strong> {tranId}</p>
                                <div className="pt-1">
                                    <span className="inline-block border border-emerald-600 text-emerald-600 font-black text-[10px] px-2 py-0.5 rounded tracking-widest uppercase">
                                        ✓ PAID IN FULL
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Patient & Attending Doctor Box */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                            {/* Patient Info */}
                            <div className="space-y-1">
                                <h3 className="font-bold text-teal-700 uppercase text-[10px] tracking-wider">Patient Information (Billed To)</h3>
                                <p className="text-sm font-black text-slate-900">{patientName}</p>
                                <p className="text-slate-600"><strong>Email:</strong> {patientEmail}</p>
                                <p className="text-slate-600"><strong>Phone:</strong> {patientPhone}</p>
                                <p className="text-slate-600"><strong>Blood Group:</strong> {patientBloodGroup}</p>
                                <p className="text-slate-600"><strong>Location:</strong> {patientCity}</p>
                            </div>

                            {/* Attending Doctor Info */}
                            <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
                                <h3 className="font-bold text-teal-700 uppercase text-[10px] tracking-wider">Attending Medical Specialist</h3>
                                <p className="text-sm font-black text-slate-900">{doctorName}</p>
                                <p className="text-slate-600"><strong>Department:</strong> {specialization}</p>
                                <p className="text-slate-600"><strong>Qualifications:</strong> {docQualifications}</p>
                                <p className="text-slate-600"><strong>License No:</strong> {licenseNumber}</p>
                                <p className="text-slate-600"><strong>Hospital:</strong> {hospital}</p>
                            </div>
                        </div>

                        {/* Itemized Table */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-3">#</th>
                                        <th className="p-3">Service Description</th>
                                        <th className="p-3">Format</th>
                                        <th className="p-3">Date & Slot</th>
                                        <th className="p-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    <tr>
                                        <td className="p-3 font-bold">1</td>
                                        <td className="p-3">
                                            <p className="font-semibold text-slate-900">Specialist Medical Consultation & Diagnostic Evaluation</p>
                                            <p className="text-[10px] text-slate-400">
                                                Attending: {doctorName} ({specialization})<br />
                                                Reason: {appointment?.reasonForVisit || 'Standard Clinical Session'}
                                            </p>
                                        </td>
                                        <td className="p-3 font-bold text-teal-700">{consultType}</td>
                                        <td className="p-3">
                                            {appDate} <br />
                                            <span className="text-[10px] text-slate-400">{appSlot}</span>
                                        </td>
                                        <td className="p-3 text-right font-black text-slate-900">${amount} AUD</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end pt-2">
                            <div className="w-60 space-y-1.5 text-xs">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">${amount}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>GST (0% Medical Exemption)</span>
                                    <span className="font-semibold">$0.00</span>
                                </div>
                                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                                    <span>Total Paid</span>
                                    <span className="text-teal-700">${amount} AUD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceReceiptModal;
