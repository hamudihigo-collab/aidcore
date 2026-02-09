import React from 'react';
import { Navbar, Sidebar } from '../components/Layout.jsx';
import { Card, Button } from '../components/UI.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { caseService } from '../services/caseService.js';

export const DashboardPage = () => {
    const { data: stats } = useFetch(() => caseService.getCaseStatistics(), []);

    const totalCases = stats?.reduce((sum, stat) => sum + (stat.count || 0), 0) || 0;
    const openCases = stats?.find((s) => s.status === 'open')?.count || 0;
    const resolutionRate = totalCases > 0 ? Math.round((stats?.find((s) => s.status === 'resolved')?.count || 0) / totalCases * 100) : 0;

    return (
        <div>
            <Navbar />
            <div className="flex">
                <Sidebar active="dashboard" />
                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <p className="text-gray-600 text-sm mb-2">Total Cases</p>
                            <p className="text-4xl font-bold">{totalCases}</p>
                        </Card>
                        <Card>
                            <p className="text-gray-600 text-sm mb-2">Open Cases</p>
                            <p className="text-4xl font-bold text-yellow-600">{openCases}</p>
                        </Card>
                        <Card>
                            <p className="text-gray-600 text-sm mb-2">Resolution Rate</p>
                            <p className="text-4xl font-bold text-green-600">{resolutionRate}%</p>
                        </Card>
                    </div>

                    <Card>
                        <h2 className="text-2xl font-bold mb-4">Case Status Distribution</h2>
                        {stats && stats.length > 0 ? (
                            <div className="space-y-3">
                                {stats.map((stat) => (
                                    <div key={stat.status} className="flex items-center justify-between">
                                        <span className="capitalize">{stat.status.replace(/_/g, ' ')}</span>
                                        <div className="w-48 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full"
                                                style={{ width: `${(stat.count / totalCases * 100) || 0}%` }}
                                            />
                                        </div>
                                        <span className="font-bold">{stat.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No cases yet</p>
                        )}
                    </Card>

                    <div className="mt-8">
                        <Button onClick={() => window.location.href = '/cases'}>
                            View All Cases
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
};
