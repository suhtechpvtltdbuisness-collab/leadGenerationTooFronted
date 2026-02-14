import React from 'react';

const StatsCard = ({ title, value, description, change, icon }) => {
    const isPositive = change && change.startsWith('+');

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
                <span className="text-xl opacity-30">{icon}</span>
            </div>

            <div className="text-4xl font-bold text-gray-900 mb-2 leading-none">{value}</div>

            <p className="text-xs text-gray-600 mb-3 leading-relaxed">{description}</p>

            {change && (
                <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-gray-500'
                    }`}>
                    <span className="text-sm">↗</span>
                    <span>{change}</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
