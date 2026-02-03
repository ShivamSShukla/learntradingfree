# Trading Terminal 📈

A free, open-source paper trading platform for learning stock market trading with virtual money. Practice trading NSE/BSE stocks with real market data without any financial risk.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb)

## ✨ Features

- 🎯 **Paper Trading** - Practice with ₹5,00,000 virtual money
- 📊 **Real Market Data** - Live NSE/BSE stock prices via Yahoo Finance API
- 💼 **Portfolio Management** - Track your holdings and P&L
- 📈 **Trading Terminal** - Buy/sell stocks with market orders
- 📚 **Learning Center** - Educational modules on trading concepts
- 📱 **Mobile App** - Available as Android APK
- 🌐 **Web App** - Fully responsive web interface

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/trading-terminal.git
cd trading-terminal
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Configure backend**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

4. **Start development servers**

Terminal 1 (Backend):
```bash
npm run dev:backend
```

Terminal 2 (Frontend):
```bash
npm run dev:frontend
```

5. **Open your browser**
```
http://localhost:3000
```

## 📱 Building Android APK

### Prerequisites
- Android Studio installed
- Java JDK 11 or higher

### Steps

1. **Build frontend**
```bash
cd frontend
npm run build
```

2. **Initialize Capacitor**
```bash
cd ..
npx cap add android
```

3. **Sync with Android project**
```bash
npx cap sync
```

4. **Open in Android Studio**
```bash
npx cap open android
```

5. **Build APK in Android Studio**
- Go to `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
- APK will be in `android/app/build/outputs/apk/debug/`

### Quick Build Script
```bash
cd frontend
npm run build
cd ..
npx cap sync android
```

## 🌐 Deployment

### Frontend (Vercel/Netlify)

**Vercel:**
```bash
cd frontend
vercel --prod
```

**Netlify:**
```bash
cd frontend
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### Backend (Railway/Render)

**Railway:**
1. Connect your GitHub repo
2. Set environment variables (MONGODB_URI, JWT_SECRET, PORT)
3. Deploy automatically

**Render:**
1. New Web Service
2. Connect repository
3. Build Command: `cd backend && npm install`
4. Start Command: `cd backend && npm start`
5. Add environment variables

### Environment Variables

Backend `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trading-terminal
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

Frontend `.env`:
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 🏗️ Project Structure

```
trading-terminal/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── store/           # Zustand state management
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Node.js + Express backend
│   ├── server.js            # Express server & API routes
│   ├── package.json
│   └── .env.example
├── capacitor.config.ts      # Capacitor configuration
├── package.json             # Root package.json
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Capacitor** - Mobile app framework

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Yahoo Finance API** - Stock data

## 📖 API Documentation

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/user` - Get user profile (protected)

### Stock Data
- `GET /api/stocks/quote/:symbol` - Get stock quote
- `GET /api/stocks/search/:query` - Search stocks
- `GET /api/stocks/indices` - Get Nifty/Sensex data

### Trading
- `POST /api/trade` - Execute trade (protected)
- `GET /api/portfolio` - Get portfolio (protected)
- `GET /api/trades` - Get trade history (protected)

## 🎓 Learning Resources

The app includes educational modules covering:
- Trading Basics
- Technical Analysis
- Risk Management
- Trading Psychology

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This is a paper trading platform for educational purposes only. It uses virtual money and should not be considered as financial advice. Always consult with financial advisors before making real investment decisions.

## 🙏 Acknowledgments

- Yahoo Finance for providing free stock data API
- NSE/BSE for market data
- All contributors and users

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@tradeterminal.com

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐!

---

Made with ❤️ for aspiring traders
