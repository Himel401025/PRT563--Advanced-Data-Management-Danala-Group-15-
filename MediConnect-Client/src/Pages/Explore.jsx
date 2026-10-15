import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import DoctorCard from '../Components/Shared/DoctorCard';
import { Search, Filter, Stethoscope, RefreshCw, X } from 'lucide-react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Explore = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [doctors, setDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters state
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [specialization, setSpecialization] = useState(searchParams.get('specialization') || 'all');
    const [selectedDay, setSelectedDay] = useState(searchParams.get('day') || 'all');
    const [maxFee, setMaxFee] = useState(Number(searchParams.get('maxFee')) || 300);
    const [minExp, setMinExp] = useState(Number(searchParams.get('minExp')) || 0);

    // Sync with URL query parameters when navigation occurs
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        const urlSpec = searchParams.get('specialization') || 'all';
        const urlDay = searchParams.get('day') || 'all';
        setSearch(urlSearch);
        setSpecialization(urlSpec);
        setSelectedDay(urlDay);
    }, [searchParams]);

    // Load specializations
    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const res = await api.get('/specializations');
                if (res.data.success) {
                    setSpecializations(res.data.specializations || []);
                }
            } catch (err) {
                console.error('Error fetching specialties:', err);
            }
        };
        fetchSpecialties();
    }, []);

    // Load Doctors based on filters
    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (specialization && specialization !== 'all') params.append('specialization', specialization);
            if (selectedDay && selectedDay !== 'all') params.append('day', selectedDay);
            if (maxFee < 300) params.append('maxFee', maxFee);
            if (minExp > 0) params.append('minExp', minExp);

            const res = await api.get(`/doctors?${params.toString()}`);
            if (res.data.success) {
                setDoctors(res.data.doctors || []);
            } else if (Array.isArray(res.data)) {
                setDoctors(res.data);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, [specialization, selectedDay, maxFee, minExp]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchDoctors();
    };

    const handleResetFilters = () => {
        setSearch('');
        setSpecialization('all');
        setSelectedDay('all');
        setMaxFee(300);
        setMinExp(0);
        setSearchParams({});
    };

    return (
        <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Doctor Directory</span>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">Find & Book a Specialist</h1>
                    <p className="text-slate-500 text-sm mt-1">Filter by specialty, availability, consultation fees, and experience.</p>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24 space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                                    <Filter size={18} className="text-teal-600" />
                                    <span>Filter Doctors</span>
                                </div>
                                <button
                                    onClick={handleResetFilters}
                                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                                >
                                    <RefreshCw size={12} />
                                    Reset
                                </button>
                            </div>

                            {/* Specialty Filter */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Specialty
                                </label>
                                <select
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                                >
                                    <option value="all">All Specialties</option>
                                    {specializations.map((spec) => (
                                        <option key={spec._id} value={spec.name}>
                                            {spec.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Available Day Filter */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Available On Day
                                </label>
                                <select
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                                >
                                    <option value="all">Any Day</option>
                                    {daysOfWeek.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Max Consultation Fee */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Max Fee ($)
                                    </label>
                                    <span className="text-sm font-black text-teal-600">${maxFee}</span>
                                </div>
                                <input
                                    type="range"
                                    min="20"
                                    max="300"
                                    step="5"
                                    value={maxFee}
                                    onChange={(e) => setMaxFee(Number(e.target.value))}
                                    className="w-full accent-teal-600 cursor-pointer"
                                />
                                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                                    <span>$20</span>
                                    <span>$300</span>
                                </div>
                            </div>

                            {/* Min Experience */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Minimum Experience
                                </label>
                                <select
                                    value={minExp}
                                    onChange={(e) => setMinExp(Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                                >
                                    <option value={0}>Any Experience</option>
                                    <option value={3}>3+ Years</option>
                                    <option value={5}>5+ Years</option>
                                    <option value={10}>10+ Years</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Doctors Listing Grid */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="flex gap-3">
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by doctor name, hospital, or qualification..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 shadow-sm text-slate-800"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => { setSearch(''); fetchDoctors(); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex-shrink-0"
                            >
                                Search
                            </button>
                        </form>

                        {/* Active Filter Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Active Filters:</span>
                            {specialization !== 'all' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                                    Specialty: {specialization}
                                    <button onClick={() => setSpecialization('all')} className="hover:text-teal-900"><X size={12} /></button>
                                </span>
                            )}
                            {selectedDay !== 'all' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                    Day: {selectedDay}
                                    <button onClick={() => setSelectedDay('all')} className="hover:text-slate-900"><X size={12} /></button>
                                </span>
                            )}
                            {minExp > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                    Exp: {minExp}+ Yrs
                                    <button onClick={() => setMinExp(0)} className="hover:text-slate-900"><X size={12} /></button>
                                </span>
                            )}
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-teal-600">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600 mb-4"></div>
                                <p className="text-sm font-medium text-slate-500">Finding available doctors...</p>
                            </div>
                        ) : doctors.length === 0 ? (
                            /* Empty State */
                            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Stethoscope size={28} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">No Doctors Found</h3>
                                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                                    We couldn't find any verified specialists matching your criteria. Try adjusting your filters or search keywords.
                                </p>
                                <button
                                    onClick={handleResetFilters}
                                    className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-all"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            /* Doctor Cards Grid */
                            <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                                {doctors.map((doctor) => (
                                    <DoctorCard key={doctor._id || doctor.id} doctor={doctor} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Explore;
