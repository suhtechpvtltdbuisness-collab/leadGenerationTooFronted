import React from 'react';

const LeadAnalysisCard = () => {
    return (
        <div className="bg-white border border-gray-100 rounded-4xl p-6 shadow-sm flex flex-col h-full ring-1 ring-black/5">
            {/* Header */}
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-gray-900 leading-tight">Al Baik</h2>
                    <div className="flex items-center gap-1.5 ml-1">
                        <span className="text-red-500 text-sm">🔥</span>
                        <span className="text-red-500 text-sm font-bold tracking-tight">Hot</span>
                    </div>
                </div>
                <div className="relative">
                    <select className="bg-[#f8fafc] border border-transparent hover:border-gray-200 text-gray-600 text-sm font-bold rounded-2xl block px-5 py-2.5 pr-10 appearance-none focus:outline-none transition-all shadow-sm cursor-pointer">
                        <option>New</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-400 font-semibold mb-4">Chicken restaurant</p>

            <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-1.5">
                    <span className="text-yellow-400 text-xl">⭐</span>
                    <span className="text-base font-black text-gray-700">4 <span className="text-gray-300 font-bold ml-1">(183)</span></span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.828a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-base font-bold text-gray-400">saudi arab</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-3">
                <div>
                    <p className="text-[11px] font-black text-[#bfc3d0] uppercase tracking-widest mb-2">Match Score</p>
                    <p className="text-3xl font-black text-[#10b981]">80%</p>
                </div>
                <div>
                    <p className="text-[11px] font-black text-[#bfc3d0] uppercase tracking-widest mb-2">Conversion</p>
                    <p className="text-3xl font-black text-[#9333ea]">60%</p>
                </div>
            </div>

            <div className="h-1.5 w-full bg-[#f1f5f9] rounded-full mb-6 overflow-hidden">
                <div className="h-full bg-[#10b981] rounded-full transition-all duration-1000 ease-out" style={{ width: '80%' }}></div>
            </div>

            <div className="bg-[#f8faff] border border-[#eef2ff] rounded-3xl p-5 pt-8 relative mt-4 shadow-inner">
                <div className="absolute top-0 transform -translate-y-1/2 left-8">
                    <span className="bg-[#1e293b] text-white text-[10px] font-black px-5 py-2 rounded-xl uppercase tracking-[0.15em] shadow-lg">AI Strategy</span>
                </div>

                <h3 className="text-sm font-black text-[#334155] mb-4 leading-relaxed">High rating and many reviews, but no website</h3>

                <div className="bg-white border border-[#f1f5f9] rounded-2xl p-4 space-y-4 shadow-sm">
                    <div>
                        <p className="text-[10px] font-black text-[#cbd5e1] uppercase tracking-widest mb-2">Primary Hook</p>
                        <p className="text-[14px] text-[#475569] font-bold italic leading-relaxed">
                            "Get more customers with a professional website and online presence!"
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#cbd5e1] uppercase tracking-widest mb-2">Follow-up</p>
                        <p className="text-[14px] text-[#475569] font-bold italic leading-relaxed">
                            "Hi, I wanted to follow up on our previous conversation about creating a website for Al Baik. Is now a good time to discuss further?"
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2.5 mt-6">
                    <span className="bg-[#f1f5f9] text-[#64748b] text-[11px] font-black px-4 py-2 rounded-xl border border-[#e2e8f0] uppercase tracking-wider">Website development</span>
                    <span className="bg-[#f1f5f9] text-[#64748b] text-[11px] font-black px-4 py-2 rounded-xl border border-[#e2e8f0] uppercase tracking-wider">Digital marketing</span>
                </div>
            </div>

            <div className="flex justify-between items-center mt-auto pt-6 border-t border-[#f1f5f9]">
                <span className="text-[13px] font-black text-[#cbd5e1]">01/02/2026</span>
                <a 
                    href="https://www.google.com/maps" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[13px] font-black text-[#6366f1] cursor-pointer hover:underline uppercase tracking-widest"
                >
                    Google Maps
                </a>
            </div>
        </div>
    );
};

export default LeadAnalysisCard;