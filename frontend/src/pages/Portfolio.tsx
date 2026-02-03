import React, { useEffect, useState } from 'react';
import { tradeAPI } from '../services/api';
import { Briefcase, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface Portfolio {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  invested: number;
  current: number;
  pnl: number;
  pnlPercent: number;
}

interface Trade {
  _id: string;
  symbol: string;
  type: string;
  quantity: number;
  price: number;
  total: number;
  timestamp: string;
}

const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [portfolioRes, tradesRes] = await Promise.all([
        tradeAPI.getPortfolio(),
        tradeAPI.getTrades()
      ]);
      setPortfolio(portfolioRes.data);
      setTrades(tradesRes.data);
    } catch (error) {
      console.error('Failed to fetch portfolio', error);
    } finally {
      setLoading(false);
    }
  };

  const totalInvested = portfolio.reduce((sum, item) => sum + item.invested, 0);
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
      <h1 className="text-3xl font-bold text-white flex items-center gap-2">
        <Briefcase className="text-blue-400" />
        Portfolio
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-1">Total Invested</p>
          <p className="text-3xl font-bold text-white">₹{totalInvested.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-1">Current Value</p>
          <p className="text-3xl font-bold text-white">₹{totalCurrent.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-1">Total P&L</p>
          <div className="flex items-center gap-2">
            {totalPnL >= 0 ? <TrendingUp className="text-green-400" /> : <TrendingDown className="text-red-400" />}
            <p className={`text-3xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toLocaleString('en-IN')}
            </p>
          </div>
          <p className={`text-sm mt-1 ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ({totalPnL >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Holdings</h2>
        {portfolio.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-sm border-b border-slate-700">
                  <th className="text-left py-3 px-4">Symbol</th>
                  <th className="text-right py-3 px-4">Quantity</th>
                  <th className="text-right py-3 px-4">Avg Price</th>
                  <th className="text-right py-3 px-4">Current Price</th>
                  <th className="text-right py-3 px-4">Invested</th>
                  <th className="text-right py-3 px-4">Current Value</th>
                  <th className="text-right py-3 px-4">P&L</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item) => (
                  <tr key={item.symbol} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                    <td className="py-4 px-4">
                      <span className="font-bold text-white">{item.symbol}</span>
                    </td>
                    <td className="text-right text-white px-4">{item.quantity}</td>
                    <td className="text-right text-white px-4">₹{item.avgPrice.toFixed(2)}</td>
                    <td className="text-right text-white px-4">₹{item.currentPrice.toFixed(2)}</td>
                    <td className="text-right text-white px-4">₹{item.invested.toLocaleString('en-IN')}</td>
                    <td className="text-right text-white px-4">₹{item.current.toLocaleString('en-IN')}</td>
                    <td className={`text-right font-bold px-4 ${item.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.pnl >= 0 ? '+' : ''}₹{item.pnl.toFixed(2)}
                      <div className="text-xs">
                        ({item.pnl >= 0 ? '+' : ''}{item.pnlPercent.toFixed(2)}%)
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-16 w-16 text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg">Your portfolio is empty</p>
            <p className="text-slate-500 text-sm mt-2">Start trading to build your portfolio</p>
          </div>
        )}
      </div>

      {/* Trade History */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="text-blue-400" />
          Recent Trades
        </h2>
        {trades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-sm border-b border-slate-700">
                  <th className="text-left py-3 px-4">Date & Time</th>
                  <th className="text-left py-3 px-4">Symbol</th>
                  <th className="text-center py-3 px-4">Type</th>
                  <th className="text-right py-3 px-4">Quantity</th>
                  <th className="text-right py-3 px-4">Price</th>
                  <th className="text-right py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade._id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                    <td className="py-4 px-4 text-slate-300 text-sm">
                      {new Date(trade.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="text-white font-semibold px-4">{trade.symbol}</td>
                    <td className="text-center px-4">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        trade.type === 'BUY' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="text-right text-white px-4">{trade.quantity}</td>
                    <td className="text-right text-white px-4">₹{trade.price.toFixed(2)}</td>
                    <td className="text-right text-white font-semibold px-4">₹{trade.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="mx-auto h-16 w-16 text-slate-600 mb-4" />
            <p className="text-slate-400">No trades yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
