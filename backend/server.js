const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trading-terminal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  balance: { type: Number, default: 500000 },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Portfolio Schema
const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  avgPrice: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// Trade Schema
const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Trade = mongoose.model('Trade', tradeSchema);

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key');
    res.status(201).json({ token, user: { id: user._id, email, name, balance: user.balance } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, balance: user.balance } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Stock Data Routes
app.get('/api/stocks/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?interval=1d`);
    
    const data = response.data.chart.result[0];
    const quote = data.meta;
    const latestPrice = data.indicators.quote[0].close[data.indicators.quote[0].close.length - 1];
    
    res.json({
      symbol: symbol,
      price: latestPrice || quote.regularMarketPrice,
      change: quote.regularMarketPrice - quote.chartPreviousClose,
      changePercent: ((quote.regularMarketPrice - quote.chartPreviousClose) / quote.chartPreviousClose * 100),
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      open: quote.regularMarketOpen,
      previousClose: quote.chartPreviousClose
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stock data', error: error.message });
  }
});

app.get('/api/stocks/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const response = await axios.get(`https://query1.finance.yahoo.com/v1/finance/search?q=${query}&quotesCount=10&newsCount=0`);
    
    const stocks = response.data.quotes.filter(q => q.exchange === 'NSI').map(stock => ({
      symbol: stock.symbol.replace('.NS', ''),
      name: stock.longname || stock.shortname,
      exchange: stock.exchange
    }));
    
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

app.get('/api/stocks/indices', async (req, res) => {
  try {
    const niftyResponse = await axios.get('https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1d');
    const sensexResponse = await axios.get('https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN?interval=1d');
    
    const nifty = niftyResponse.data.chart.result[0].meta;
    const sensex = sensexResponse.data.chart.result[0].meta;
    
    res.json({
      nifty: {
        value: nifty.regularMarketPrice,
        change: nifty.regularMarketPrice - nifty.chartPreviousClose,
        changePercent: ((nifty.regularMarketPrice - nifty.chartPreviousClose) / nifty.chartPreviousClose * 100)
      },
      sensex: {
        value: sensex.regularMarketPrice,
        change: sensex.regularMarketPrice - sensex.chartPreviousClose,
        changePercent: ((sensex.regularMarketPrice - sensex.chartPreviousClose) / sensex.chartPreviousClose * 100)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch indices', error: error.message });
  }
});

// Trading Routes
app.post('/api/trade', verifyToken, async (req, res) => {
  try {
    const { symbol, type, quantity, price } = req.body;
    const userId = req.userId;
    
    const user = await User.findById(userId);
    const total = quantity * price;
    
    if (type === 'BUY') {
      if (user.balance < total) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      
      user.balance -= total;
      
      let portfolio = await Portfolio.findOne({ userId, symbol });
      if (portfolio) {
        portfolio.avgPrice = ((portfolio.avgPrice * portfolio.quantity) + total) / (portfolio.quantity + quantity);
        portfolio.quantity += quantity;
      } else {
        portfolio = new Portfolio({ userId, symbol, quantity, avgPrice: price });
      }
      await portfolio.save();
      
    } else if (type === 'SELL') {
      const portfolio = await Portfolio.findOne({ userId, symbol });
      if (!portfolio || portfolio.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient shares to sell' });
      }
      
      user.balance += total;
      portfolio.quantity -= quantity;
      
      if (portfolio.quantity === 0) {
        await Portfolio.deleteOne({ _id: portfolio._id });
      } else {
        await portfolio.save();
      }
    }
    
    await user.save();
    
    const trade = new Trade({ userId, symbol, type, quantity, price, total });
    await trade.save();
    
    res.json({ 
      message: `${type} order executed successfully`,
      balance: user.balance,
      trade
    });
  } catch (error) {
    res.status(500).json({ message: 'Trade execution failed', error: error.message });
  }
});

// Portfolio Routes
app.get('/api/portfolio', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const portfolio = await Portfolio.find({ userId });
    
    const portfolioWithPrices = await Promise.all(portfolio.map(async (item) => {
      try {
        const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}.NS?interval=1d`);
        const currentPrice = response.data.chart.result[0].meta.regularMarketPrice;
        
        return {
          symbol: item.symbol,
          quantity: item.quantity,
          avgPrice: item.avgPrice,
          currentPrice,
          invested: item.quantity * item.avgPrice,
          current: item.quantity * currentPrice,
          pnl: (currentPrice - item.avgPrice) * item.quantity,
          pnlPercent: ((currentPrice - item.avgPrice) / item.avgPrice * 100)
        };
      } catch (error) {
        return {
          symbol: item.symbol,
          quantity: item.quantity,
          avgPrice: item.avgPrice,
          currentPrice: item.avgPrice,
          invested: item.quantity * item.avgPrice,
          current: item.quantity * item.avgPrice,
          pnl: 0,
          pnlPercent: 0
        };
      }
    }));
    
    res.json(portfolioWithPrices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch portfolio', error: error.message });
  }
});

app.get('/api/trades', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const trades = await Trade.find({ userId }).sort({ timestamp: -1 }).limit(50);
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trades', error: error.message });
  }
});

app.get('/api/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
