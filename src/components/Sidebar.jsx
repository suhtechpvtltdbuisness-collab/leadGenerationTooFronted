import React, { useState, useEffect } from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [recentLeads, setRecentLeads] = useState([]);

  const fetchRecentLeads = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(`${baseUrl}/api/leads`);
      const data = await response.json();
      if (data.success) {
        setRecentLeads(data.leads.slice(0, 5)); // Show only top 5
      }
    } catch (error) {
      console.error("Error fetching leads in sidebar:", error);
    }
  };

  useEffect(() => {
    fetchRecentLeads();
  }, []);

  const menuItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "leads", icon: "👥", label: "Leads" },
    { id: "clients", icon: "📋", label: "Clients" },
    { id: "campaigns", icon: "☰", label: "Campaigns" },
    { id: "data-enrichment", icon: "🔄", label: "Data Enrichment" },
    { id: "emails", icon: "✉️", label: "Emails" },
    { id: "calls", icon: "📞", label: "Calls" },
    { id: "meetings", icon: "📅", label: "Meetings" },
    { id: "conversations", icon: "💬", label: "Conversations" },
    { id: "deals", icon: "💰", label: "Deals" },
    { id: "tasks", icon: "📝", label: "Tasks" },
    { id: "workflows", icon: "⚡", label: "Workflows" },
    { id: "analytics", icon: "📊", label: "Analytics" },
  ];

  return (
    <div className="w-[240px] h-screen bg-white flex flex-col fixed left-0 top-0 overflow-hidden border-r border-gray-200">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-2 flex-shrink-0">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
          ⚡
        </div>
        <span className="text-sm font-bold text-blue-600">LeadFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-hide">
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-3 mb-2">
            Menu
          </div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 mb-0.5 text-xs transition-all rounded-lg ${
                activeTab === item.id
                  ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-100"
                  : "text-gray-700 hover:bg-gray-50 font-normal"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="text-sm w-4">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Leads Section */}
        <div className="mt-6">
          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-3 mb-2 flex justify-between items-center">
            <span>Recent Leads</span>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="px-1 space-y-1">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead, idx) => (
                <div
                  key={lead._id || idx}
                  className="px-3 py-2 rounded-lg hover:bg-blue-50 group cursor-pointer transition-all border border-transparent hover:border-blue-100"
                >
                  <div className="text-[11px] font-semibold text-gray-900 truncate group-hover:text-blue-700">
                    {lead.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] text-yellow-600 font-bold">
                      ⭐ {lead.rating}
                    </span>
                    <span className="text-[9px] text-gray-400">•</span>
                    <span className="text-[9px] text-gray-400 truncate">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-center">
                <p className="text-[10px] text-gray-400 italic">
                  No leads stored yet
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        {/* Onboarding Hub */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3 relative">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm leading-none">
            ×
          </button>
          <div className="text-[10px] font-semibold text-gray-900 mb-1">
            Onboarding Hub
          </div>
          <div className="text-[9px] text-gray-500 mb-2">
            3 / 5 tasks completed (85%)
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full"
              style={{ width: "85%" }}
            ></div>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <img
            src="https://ui-avatars.com/api/?name=Samantha+Green&background=2563eb&color=fff&size=64"
            alt="User"
            className="w-7 h-7 rounded-full"
          />
          <span className="flex-1 text-[11px] font-medium text-gray-900">
            Samantha Green
          </span>
          <span className="text-xs text-gray-400">›</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
