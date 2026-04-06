import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LeadsPage from './components/LeadsPage';
import TasksPage from './components/TasksPage';
import HospitalSearchModal from './components/HospitalSearchModal';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden ml-[70px] lg:ml-[240px] transition-all duration-300">
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <div className="flex-1 bg-gray-50">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'leads' && <LeadsPage />}
          {activeTab === 'tasks' && <TasksPage />}
          {activeTab !== 'dashboard' && activeTab !== 'leads' && activeTab !== 'tasks' && (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Coming Soon</h2>
              <p className="text-base text-gray-500">This section is under development</p>
            </div>
          )}
        </div>

        <footer className="bg-white border-t border-gray-200 px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p className="m-0">© 2026 LeadFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#help" className="hover:text-gray-900 transition-colors no-underline">
              Help
            </a>
            <a href="#privacy" className="hover:text-gray-900 transition-colors no-underline">
              Privacy Policy
            </a>
          </div>
        </footer>
      </div>

      <HospitalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(hospital) => console.log('Selected:', hospital)}
      />
    </div>
  );
}

export default App;
