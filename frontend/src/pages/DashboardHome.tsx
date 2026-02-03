import React, { useEffect, useState } from 'react';
import { tradeAPI, stockAPI } from '../services/api';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface Portfolio {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  current: number;
}

interface Indices {
  nifty: { value: number; change: number; changePercent: number };
  sensex: { value: number; change: number; changePercent: number };
}

const DashboardHome: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [indices, setIndices] = useState<Indices | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [portfolioRes, indicesRes] = await Promise.all([
        tradeAPI.getPortfolio(),
        stockAPI.getIndices()
      ]);
      setPortfolio(portfolioRes.data);
      setIndices(indicesRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const totalInvested = portfolio.reduce((sum, item) => sum + item.avgPrice * item.quantity, 0);
  const totalCurrent = portfolio.reduce((sum, item) => sum + item.current, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>

      {/* Market Indices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {indices && (
          <>
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">NIFTY 50</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {indices.nifty.value.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 ${indices.nifty.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {indices.nifty.change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    <span className="font-semibold">
                      {indices.nifty.change >= 0 ? '+' : ''}{indices.nifty.change.toFixed(2)}
                    </span>
                  </div>
                  <p className={`text-sm ${indices.nifty.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ({indices.nifty.changePercent >= 0 ? '+' : ''}{indices.nifty.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">SENSEX</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {indices.sensex.value.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 ${indices.sensex.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {indices.sensex.change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    <span className="font-semibold">
                      {indices.sensex.change >= 0 ? '+' : ''}{indices.sensex.change.toFixed(2)}
                    </span>
                  </div>
                  <p className={`text-sm ${indices.sensex.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ({indices.sensex.changePercent >= 0 ? '+' : ''}{indices.sensex.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Portfolio Summary */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="text-blue-400" />
          Portfolio Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-slate-400 text-sm">Total Invested</p>
            <p className="text-2xl font-bold text-white">₹{totalInvested.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Current Value</p>
            <p className="text-2xl font-bold text-white">₹{totalCurrent.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total P&L</p>
            <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toLocaleString('en-IN')}
              <span className="text-lg ml-2">
                ({totalPnL >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Your Holdings</h2>
        {portfolio.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-sm border-b border-slate-700">
                  <th className="text-left py-3">Symbol</th>
                  <th className="text-right py-3">Qty</th>
                  <th className="text-right py-3">Avg Price</th>
                  <th className="text-right py-3">Current</th>
                  <th className="text-right py-3">P&L</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item) => (
                  <tr key={item.symbol} className="border-b border-slate-700 text-white">
                    <td className="py-4 font-semibold">{item.symbol}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">₹{item.avgPrice.toFixed(2)}</td>
                    <td className="text-right">₹{item.currentPrice.toFixed(2)}</td>
                    <td className={`text-right font-semibold ${item.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.pnl >= 0 ? '+' : ''}₹{item.pnl.toFixed(2)}
                      <span className="text-sm ml-1">
                        ({item.pnl >= 0 ? '+' : ''}{item.pnlPercent.toFixed(2)}%)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">
            No holdings yet. Start trading to build your portfolio!
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
