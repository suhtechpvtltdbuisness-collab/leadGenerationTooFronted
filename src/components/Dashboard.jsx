import React from 'react';
import StatsCard from './StatsCard';
import InfoSection from './InfoSection';
import ActivityFeed from './ActivityFeed';
import LeadAnalysisCard from './LeadAnalysisCard';

const Dashboard = () => {
    // ... statsData remains the same ...
    const statsData = [
        {
            title: 'Hot Leads',
            value: '28',
            description: 'Leads with high intent for website projects',
            change: '+5.2% this week',
            icon: '👁️'
        },
        {
            title: 'Total Leads',
            value: '452',
            description: 'New leads captured for web services',
            change: '+12% last month',
            icon: '👥'
        },
        {
            title: 'Ongoing Leads',
            value: '135',
            description: 'Leads actively being pursued for sales',
            change: '% 0% change',
            icon: '📈'
        },
        {
            title: 'Closed Leads',
            value: '48',
            description: 'Website development projects secured',
            change: '+8.5% quarter over quarter',
            icon: '💰'
        }
    ];

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Detailed Analysis Section (Left/Center) */}
                <div className="lg:col-span-8">
                    <LeadAnalysisCard />
                </div>

                {/* Sidebar Info Section (Right) */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <InfoSection
                        title="Lead Website Presence"
                        type="website"
                        link="websolutionsinc.com"
                    />
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
