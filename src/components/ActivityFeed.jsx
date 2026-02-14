import React from 'react';

const ActivityFeed = () => {
    const activities = [
        {
            id: 1,
            icon: '⚡',
            text: 'New lead "Web Solutions Inc." qualified.',
            time: '2 hours ago'
        },
        {
            id: 2,
            icon: '📄',
            text: 'Sent proposal to "Creative Designs Ltd." for SEO package.',
            time: 'Yesterday'
        },
        {
            id: 3,
            icon: '📞',
            text: 'Follow-up call with "Tech Innovations Corp." scheduled.',
            time: '2 days ago'
        },
        {
            id: 4,
            icon: '🌐',
            text: 'Updated "E-commerce Hub" website presence.',
            time: '3 days ago'
        }
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-base font-bold text-gray-900 mb-6">Recent Lead Activity</h3>

            <div className="flex flex-col gap-4">
                {activities.map((activity, index) => (
                    <div
                        key={activity.id}
                        className={`flex gap-3 pb-4 ${index !== activities.length - 1 ? 'border-b border-gray-100' : ''
                            }`}
                    >
                        <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                            {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 mb-1 leading-relaxed">
                                {activity.text}
                            </p>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;
