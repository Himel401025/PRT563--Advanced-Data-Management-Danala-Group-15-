import React, { useState } from 'react';
import api from '../../../api/axios';
import { useAuth } from '../../../Contexts/AuthContext';
import { Clock, Calendar, DollarSign, Building2, Save, CheckCircle2, AlertCircle, Plus, Trash2, RotateCcw, Check, Sparkles } from 'lucide-react';

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Helper to convert time string (e.g. "09:30 AM") into total minutes from midnight for accurate chronological sorting
const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const startPart = timeStr.split('-')[0].trim();
    const match = startPart.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let [_, hours, minutes, meridiem] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    if (meridiem.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (meridiem.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
};

// Sort array of time slots sequentially from morning to evening
const sortTimeSlots = (slots) => {
    return [...slots].sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));
};

const defaultSlots = [
    '09:00 AM - 09:30 AM',
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '02:00 PM - 02:30 PM',
    '02:30 PM - 03:00 PM',
    '03:00 PM - 03:30 PM',
    '03:30 PM - 04:00 PM'
];

// Full standard 30-minute clinical slots from 8:00 AM to 8:00 PM
const allStandardPresets = [
    '08:00 AM - 08:30 AM',
    '08:30 AM - 09:00 AM',
    '09:00 AM - 09:30 AM',
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '11:00 AM - 11:30 AM',
    '11:30 AM - 12:00 PM',
    '12:00 PM - 12:30 PM',
    '12:30 PM - 01:00 PM',
    '01:00 PM - 01:30 PM',
    '01:30 PM - 02:00 PM',
    '02:00 PM - 02:30 PM',
    '02:30 PM - 03:00 PM',
    '03:00 PM - 03:30 PM',
    '03:30 PM - 04:00 PM',
    '04:00 PM - 04:30 PM',
    '04:30 PM - 05:00 PM',
    '05:00 PM - 05:30 PM',
    '05:30 PM - 06:00 PM',
    '06:00 PM - 06:30 PM',
    '06:30 PM - 07:00 PM',
    '07:00 PM - 07:30 PM',
    '07:30 PM - 08:00 PM'
];

const DoctorScheduleTab = () => {
    const { user, refreshUser } = useAuth();
    const docProfile = user?.doctorProfile || {};

    const [availableDays, setAvailableDays] = useState(docProfile.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    const [availableTimeSlots, setAvailableTimeSlots] = useState(() => {
        const initial = docProfile.availableTimeSlots && docProfile.availableTimeSlots.length > 0 ? docProfile.availableTimeSlots : defaultSlots;
        return sortTimeSlots(initial);
    });
    const [consultationFee, setConsultationFee] = useState(docProfile.consultationFee || 50);
    const [hospitalAffiliation, setHospitalAffiliation] = useState(docProfile.hospitalAffiliation || '');
    const [bio, setBio] = useState(docProfile.bio || '');
    
    // Custom Slot Input
    const [customSlot, setCustomSlot] = useState('');
    
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const toggleDay = (day) => {
        if (availableDays.includes(day)) {
            setAvailableDays(availableDays.filter(d => d !== day));
        } else {
            setAvailableDays([...availableDays, day]);
        }
    };

    // Toggle slot: add if absent, remove if already present, and auto-sort chronologically
    const handleTogglePresetSlot = (slot) => {
        setErrorMessage('');
        setSuccessMessage('');
        if (availableTimeSlots.includes(slot)) {
            setAvailableTimeSlots(prev => sortTimeSlots(prev.filter(s => s !== slot)));
        } else {
            setAvailableTimeSlots(prev => sortTimeSlots([...prev, slot]));
        }
    };

    // Add custom typed slot
    const handleAddCustomSlot = (e) => {
        if (e) e.preventDefault();
        const slot = customSlot.trim();
        
        if (!slot) {
            setErrorMessage('Please enter a time slot (e.g. 04:00 PM - 04:30 PM).');
            return;
        }

        if (availableTimeSlots.includes(slot)) {
            setErrorMessage(`Slot "${slot}" is already in your active schedule.`);
            return;
        }

        setAvailableTimeSlots(prev => sortTimeSlots([...prev, slot]));
        setCustomSlot('');
        setErrorMessage('');
    };

    const removeTimeSlot = (slotToRemove) => {
        setAvailableTimeSlots(prev => sortTimeSlots(prev.filter(s => s !== slotToRemove)));
    };

    const resetToDefaults = () => {
        setAvailableTimeSlots(sortTimeSlots(defaultSlots));
        setSuccessMessage('Reset to default morning and afternoon slots in chronological order.');
    };

    const selectAllPresets = () => {
        setAvailableTimeSlots(sortTimeSlots(allStandardPresets));
        setSuccessMessage('Added all standard 8:00 AM - 8:00 PM slots.');
    };

    const clearAllSlots = () => {
        setAvailableTimeSlots([]);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMessage('');
        setErrorMessage('');

        if (availableDays.length === 0) {
            setErrorMessage('Please select at least one available working day.');
            setSaving(false);
            return;
        }

        if (availableTimeSlots.length === 0) {
            setErrorMessage('Please configure at least one active appointment slot.');
            setSaving(false);
            return;
        }

        try {
            const sortedSlots = sortTimeSlots(availableTimeSlots);
            const res = await api.patch('/doctors/schedule/update', {
                availableDays,
                availableTimeSlots: sortedSlots,
                consultationFee: Number(consultationFee),
                hospitalAffiliation,
                bio
            });

            if (res.data.success) {
                setSuccessMessage('Schedule and clinical profile updated successfully!');
                await refreshUser();
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to update schedule');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            {/* Header */}
            <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Doctor Schedule & Slot Settings</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Configure your clinical consultation days, sequential appointment time slots, and consultation pricing.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={resetToDefaults}
                        className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <RotateCcw size={13} />
                        <span>Standard Default Slots</span>
                    </button>
                    <button
                        type="button"
                        onClick={clearAllSlots}
                        className="text-xs font-semibold text-slate-500 hover:text-red-600 px-2.5 py-1.5 rounded-xl hover:bg-red-50 transition-all cursor-pointer"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            {successMessage && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} className="flex-shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                {/* 1. Working Days Selector */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                        <Calendar size={16} className="text-teal-600" />
                        1. Weekly Clinical Consultation Days
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                        {allDays.map((day) => {
                            const isSelected = availableDays.includes(day);
                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => toggleDay(day)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                        isSelected
                                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-teal-400'
                                    }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Active Time Slots Manager (Sequentially Ordered) */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                            <Clock size={16} className="text-teal-600" />
                            2. Active Appointment Slots ({availableTimeSlots.length} Slots Sequentially Ordered)
                        </label>
                        <span className="text-[11px] text-slate-400 font-medium">
                            Automatically ordered from morning to evening
                        </span>
                    </div>
                    
                    {/* Active Sequential Slot Chips */}
                    <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl min-h-[90px] flex flex-wrap gap-2.5 items-center">
                        {availableTimeSlots.length === 0 ? (
                            <div className="text-center py-4 w-full">
                                <p className="text-xs text-slate-400 italic">No slots active. Click any preset below or add a custom slot to schedule.</p>
                            </div>
                        ) : (
                            availableTimeSlots.map((slot, index) => (
                                <div
                                    key={slot}
                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-slate-900 border border-slate-200 shadow-xs hover:border-teal-400 transition-all group"
                                >
                                    <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-black flex items-center justify-center border border-teal-200/60">
                                        {index + 1}
                                    </span>
                                    <span className="text-xs font-bold text-slate-800">{slot}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeTimeSlot(slot)}
                                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-full font-black text-sm ml-1 cursor-pointer transition-colors"
                                        title={`Remove slot ${slot}`}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Quick One-Click Presets Matrix with Green / Gray Status Indicators */}
                    <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-slate-200/80">
                            <div>
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-amber-500" />
                                    <span>Quick One-Click Slot Matrix</span>
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    Click any slot to toggle on/off. Green tags indicate active slots; gray tags are available to add.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 text-[11px] font-semibold">
                                <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></span>
                                    Active in Schedule
                                </span>
                                <span className="flex items-center gap-1.5 text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                    Not Added
                                </span>
                            </div>
                        </div>

                        {/* Presets Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {allStandardPresets.map((preset) => {
                                const isAdded = availableTimeSlots.includes(preset);
                                return (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => handleTogglePresetSlot(preset)}
                                        className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer text-left ${
                                            isAdded
                                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-xs'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-800'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            {isAdded ? (
                                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 flex-shrink-0"></span>
                                            ) : (
                                                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 flex-shrink-0"></span>
                                            )}
                                            <span className="truncate">{preset}</span>
                                        </div>

                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0 ${
                                            isAdded
                                                ? 'bg-emerald-200/80 text-emerald-900'
                                                : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            {isAdded ? 'Added' : '+ Add'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Custom Slot Addition Bar */}
                        <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                placeholder="Enter specific custom time slot (e.g. 07:45 AM - 08:15 AM)"
                                value={customSlot}
                                onChange={(e) => setCustomSlot(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddCustomSlot();
                                    }
                                }}
                                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 flex-1 shadow-2xs font-medium"
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomSlot}
                                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                            >
                                <Plus size={14} />
                                <span>Add Custom Slot</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Pricing & Hospital Affiliation */}
                <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                            <DollarSign size={16} className="text-teal-600" />
                            Consultation Fee ($ AUD)
                        </label>
                        <input
                            type="number"
                            min="10"
                            value={consultationFee}
                            onChange={(e) => setConsultationFee(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-teal-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                            <Building2 size={16} className="text-teal-600" />
                            Hospital / Clinic Affiliation
                        </label>
                        <input
                            type="text"
                            value={hospitalAffiliation}
                            onChange={(e) => setHospitalAffiliation(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                            placeholder="Royal Darwin Hospital"
                        />
                    </div>
                </div>

                {/* 4. Bio */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Professional Clinical Biography
                    </label>
                    <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        placeholder="Brief summary of clinical background, areas of expertise, and patient approach..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                    <Save size={18} />
                    <span>{saving ? 'Saving Schedule...' : 'Save Clinical Settings'}</span>
                </button>
            </form>
        </div>
    );
};

export default DoctorScheduleTab;
