import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
        { id: 'leads', icon: '👥', label: 'Leads' },
        { id: 'clients', icon: '📋', label: 'Clients' },
        { id: 'campaigns', icon: '☰', label: 'Campaigns' },
        { id: 'data-enrichment', icon: '🔄', label: 'Data Enrichment' },
        { id: 'emails', icon: '✉️', label: 'Emails' },
        { id: 'calls', icon: '📞', label: 'Calls' },
        { id: 'meetings', icon: '📅', label: 'Meetings' },
        { id: 'conversations', icon: '💬', label: 'Conversations' },
        { id: 'deals', icon: '💰', label: 'Deals' },
        { id: 'tasks', icon: '📝', label: 'Tasks' },
        { id: 'workflows', icon: '⚡', label: 'Workflows' },
        { id: 'analytics', icon: '📊', label: 'Analytics' },
    ];

    return (
        <div className="w-[240px] h-screen bg-white flex flex-col fixed left-0 top-0 overflow-y-auto border-r border-gray-200">
            {/* Header */}
            <div className="px-4 py-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    ⚡
                </div>
                <span className="text-sm font-bold text-blue-600">LeadFlow</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 mb-0.5 text-xs transition-all rounded-lg ${activeTab === item.id
                            ? 'bg-blue-600 text-white font-medium'
                            : 'text-gray-700 hover:bg-gray-50 font-normal'
                            }`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span className="text-sm w-4">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100">
                {/* Onboarding Hub */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3 relative">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm leading-none">
                        ×
                    </button>
                    <div className="text-[10px] font-semibold text-gray-900 mb-1">Onboarding Hub</div>
                    <div className="text-[9px] text-gray-500 mb-2">3 / 5 tasks completed (85%)</div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <img
                        src="https://ui-avatars.com/api/?name=Samantha+Green&background=2563eb&color=fff&size=64"
                        alt="User"
                        className="w-7 h-7 rounded-full"
                    />
                    <span className="flex-1 text-[11px] font-medium text-gray-900">Samantha Green</span>
                    <span className="text-xs text-gray-400">›</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
