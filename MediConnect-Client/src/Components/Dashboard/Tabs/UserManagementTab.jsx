import React from 'react';
import { motion } from 'framer-motion';
import { Eye, ShieldAlert, CheckCircle } from 'lucide-react';

const UserManagementTab = ({ 
    data, 
    processingUser, 
    handleToggleBan, 
    navigate 
}) => {
    return (
        <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.users.length > 0 ? (
                            data.users.map(u => (
                                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-custom-yellow/20 flex items-center justify-center font-black text-custom-yellow">
                                                {u.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-custom-black">{u.name}</p>
                                                <p className="text-xs font-bold text-gray-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-1">
                                            {u.role.map(r => (
                                                <span key={r} className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    {r}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {u.isBanned ? (
                                            <span className="text-red-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                                <ShieldAlert size={14} /> Banned
                                            </span>
                                        ) : (
                                            <span className="text-green-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                                <CheckCircle size={14} /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-gray-400">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6 text-right flex justify-end gap-2">
                                        <button 
                                            onClick={() => navigate(`/creator-profile/${u._id}`)}
                                            className="p-2 bg-gray-50 text-gray-400 hover:text-custom-black rounded-xl transition-all"
                                            title="View Profile"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button 
                                            disabled={processingUser === u._id}
                                            onClick={() => handleToggleBan(u._id)}
                                            className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                                processingUser === u._id 
                                                ? 'bg-gray-100 text-gray-400 cursor-wait'
                                                : u.isBanned 
                                                ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white' 
                                                : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                                            }`}
                                        >
                                            {processingUser === u._id ? 'Processing...' : (u.isBanned ? 'Unban' : 'Ban')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest">No users found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default UserManagementTab;
