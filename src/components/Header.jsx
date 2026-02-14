import React from 'react';

const Header = () => {
    return (
        <header className="bg-white px-8 py-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    Website Development Lead Dashboard
                </h1>

                <div className="flex items-center gap-4">
                    <button className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-all">
                        <span className="text-base text-gray-600">🔍</span>
                    </button>

                    <div className="relative w-9 h-9">
                        <img
                            src="https://ui-avatars.com/api/?name=U&background=2563eb&color=fff&size=64"
                            alt="User"
                            className="w-full h-full rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
