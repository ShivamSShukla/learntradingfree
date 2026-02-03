import React, { useState, useEffect } from 'react';
import { stockAPI, tradeAPI } from '../services/api';
import { useAuthStore } from '../store/useStore';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
}

interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

const Trading: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user, updateBalance } = useAuthStore();

  useEffect(() => {
    if (searchQuery.length > 1) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedStock) {
      fetchQuote();
    }
  }, [selectedStock]);

  const handleSearch = async () => {
    try {
      const response = await stockAPI.search(searchQuery);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  const fetchQuote = async () => {
    try {
      const response = await stockAPI.getQuote(selectedStock);
      setQuote(response.data);
    } catch (error) {
      console.error('Failed to fetch quote', error);
      setMessage('Failed to fetch stock price');
    }
  };

  const handleTrade = async () => {
    if (!quote) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await tradeAPI.executeTrade({
        symbol: selectedStock,
        type: tradeType,
        quantity,
        price: quote.price
      });
      
      setMessage(`${tradeType} order executed successfully!`);
      updateBalance(response.data.balance);
      setQuantity(1);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  const totalValue = quote ? quote.price * quantity : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Trading</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search & Selection */}
        <div className="lg:col-span-1 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Search Stocks</h2>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NSE stocks..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => {
                    setSelectedStock(stock.symbol);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded text-white transition"
                >
                  <p className="font-semibold">{stock.symbol}</p>
                  <p className="text-sm text-slate-400">{stock.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stock Info & Trading */}
        <div className="lg:col-span-2 space-y-6">
          {selectedStock && quote ? (
            <>
              {/* Stock Quote */}
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">{selectedStock}</h2>
                  <div className={`flex items-center gap-2 ${quote.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {quote.change >= 0 ? <TrendingUp /> : <TrendingDown />}
                    <span className="text-sm font-semibold">
                      {quote.change >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Current Price</p>
                    <p className="text-2xl font-bold text-white">₹{quote.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Open</p>
                    <p className="text-lg text-white">₹{quote.open.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">High</p>
                    <p className="text-lg text-green-400">₹{quote.high.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Low</p>
                    <p className="text-lg text-red-400">₹{quote.low.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Trading Panel */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Place Order</h3>

                {message && (
                  <div className={`mb-4 p-3 rounded ${
                    message.includes('success') 
                      ? 'bg-green-500/10 border border-green-500 text-green-500' 
                      : 'bg-red-500/10 border border-red-500 text-red-500'
                  }`}>
                    {message}
                  </div>
                )}

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setTradeType('BUY')}
                    className={`flex-1 py-3 rounded font-semibold transition ${
                      tradeType === 'BUY'
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    BUY
                  </button>
                  <button
                    onClick={() => setTradeType('SELL')}
                    className={`flex-1 py-3 rounded font-semibold transition ${
                      tradeType === 'SELL'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    SELL
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-slate-300 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="mb-4 p-4 bg-slate-700 rounded">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">Price per share:</span>
                    <span className="text-white font-semibold">₹{quote.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total Value:</span>
                    <span className="text-white font-bold text-lg">₹{totalValue.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleTrade}
                  disabled={loading || !selectedStock}
                  className={`w-full py-3 rounded font-semibold transition ${
                    tradeType === 'BUY'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Processing...' : `${tradeType} ${selectedStock}`}
                </button>

                <p className="text-slate-400 text-sm mt-4">
                  Available Balance: ₹{user?.balance.toLocaleString('en-IN')}
                </p>
              </div>
            </>
          ) : (
            <div className="bg-slate-800 rounded-lg p-12 text-center">
              <p className="text-slate-400 text-lg">
                Search and select a stock to start trading
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trading;
