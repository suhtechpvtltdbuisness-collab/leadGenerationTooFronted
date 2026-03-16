import React, { useState } from 'react';
import HospitalSearchModal from './HospitalSearchModal';
import ToastMessage from './ToastMessage';

const Header = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleHospitalSelect = (hospital) => {
        console.log('Selected Hospital:', hospital);
        showToast(`You selected: ${hospital.name}`, 'success');
        setIsSearchOpen(false);
    };

    return (
        <header className="bg-white px-8 py-4 sticky top-0 z-40 border-b border-gray-100 shadow-sm">
            <ToastMessage message={toast?.message} type={toast?.type} />
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Website Development Lead Dashboard
                </h1>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all cursor-pointer shadow-sm group"
                        title="Search Hospitals"
                    >
                        <span className="text-lg group-hover:scale-110 transition-transform">🔍</span>
                    </button>

                    <div className="relative w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-100 rounded-full transition-all">
                        <img
                            src="https://ui-avatars.com/api/?name=U&background=2563eb&color=fff&size=64"
                            alt="User"
                            className="w-full h-full rounded-full object-cover border border-gray-100"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                </div>
            </div>

            <HospitalSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelect={handleHospitalSelect}
            />
        </header>
    );
};

export default Header;
