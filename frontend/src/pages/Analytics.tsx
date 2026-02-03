import React from 'react';
import { BarChart3, PieChart, Activity } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white flex items-center gap-2">
        <BarChart3 className="text-blue-400" />
        Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-blue-400" />
            <p className="text-slate-400 text-sm">Win Rate</p>
          </div>
          <p className="text-3xl font-bold text-white">--</p>
          <p className="text-slate-500 text-sm mt-1">Coming soon</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="text-green-400" />
            <p className="text-slate-400 text-sm">Best Performer</p>
          </div>
          <p className="text-3xl font-bold text-white">--</p>
          <p className="text-slate-500 text-sm mt-1">Coming soon</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="text-yellow-400" />
            <p className="text-slate-400 text-sm">Total Trades</p>
          </div>
          <p className="text-3xl font-bold text-white">--</p>
          <p className="text-slate-500 text-sm mt-1">Coming soon</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-12 text-center">
        <BarChart3 className="mx-auto h-24 w-24 text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Advanced Analytics Coming Soon</h2>
        <p className="text-slate-400">
          We're working on powerful analytics tools to help you track and improve your trading performance.
        </p>
        <ul className="mt-6 text-slate-300 space-y-2 max-w-md mx-auto text-left">
          <li>• Performance charts and graphs</li>
          <li>• Sector-wise breakdown</li>
          <li>• Profit/Loss trends</li>
          <li>• Trading statistics</li>
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
