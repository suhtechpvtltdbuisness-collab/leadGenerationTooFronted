import React from 'react';

const InfoSection = ({ title, items, type = 'default', link }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 h-full">
            <h3 className="text-base font-bold text-gray-900 mb-4">{title}</h3>

            {type === 'website' && link ? (
                <div className="mt-2">
                    <a
                        href={`https://${link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1 transition-colors hover:underline"
                    >
                        {link} <span className="text-xs">↗</span>
                    </a>
                </div>
            ) : (
                <ul className="space-y-3">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                            <span className={`text-sm mt-0.5 flex-shrink-0 ${type === 'gain' ? 'text-green-600' : type === 'pain' ? 'text-red-500' : 'text-gray-400'
                                }`}>
                                ○
                            </span>
                            <span className="flex-1">{item}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default InfoSection;
