import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LeadsPage from './components/LeadsPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        <Header />

        <div className="flex-1 bg-gray-50">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'leads' && <LeadsPage />}
          {activeTab !== 'dashboard' && activeTab !== 'leads' && (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Coming Soon</h2>
              <p className="text-base text-gray-500">This section is under development</p>
            </div>
          )}
        </div>

        <footer className="bg-white border-t border-gray-200 px-8 py-4 flex justify-between items-center text-xs text-gray-500">
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
    </div>
  );
}

export default App;
