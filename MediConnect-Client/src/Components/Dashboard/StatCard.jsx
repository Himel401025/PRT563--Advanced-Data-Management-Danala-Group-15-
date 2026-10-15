import React from 'react';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-black/5">
        <div className={`${color} mb-6`}>
            <Icon size={32} />
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-4xl font-black text-custom-black tracking-tight">{value}</p>
    </div>
);

export default StatCard;
