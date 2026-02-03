import React from 'react';
import { BookOpen, Target, TrendingUp, Shield } from 'lucide-react';

const Learning: React.FC = () => {
  const modules = [
    {
      title: 'Trading Basics',
      icon: BookOpen,
      lessons: [
        'What is Stock Market?',
        'Types of Orders (Market, Limit, Stop)',
        'Understanding Stock Exchanges',
        'How to Read Stock Quotes'
      ],
      color: 'blue'
    },
    {
      title: 'Technical Analysis',
      icon: TrendingUp,
      lessons: [
        'Chart Patterns',
        'Support and Resistance',
        'Moving Averages',
        'RSI and MACD Indicators'
      ],
      color: 'green'
    },
    {
      title: 'Risk Management',
      icon: Shield,
      lessons: [
        'Position Sizing',
        'Stop Loss Strategy',
        'Risk-Reward Ratio',
        'Portfolio Diversification'
      ],
      color: 'yellow'
    },
    {
      title: 'Trading Psychology',
      icon: Target,
      lessons: [
        'Emotional Control',
        'Avoiding Common Mistakes',
        'Developing Discipline',
        'Creating a Trading Plan'
      ],
      color: 'purple'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-500/20 border-blue-500 text-blue-400',
    green: 'bg-green-500/20 border-green-500 text-green-400',
    yellow: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    purple: 'bg-purple-500/20 border-purple-500 text-purple-400'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Learning Center</h1>
        <p className="text-slate-400">Master trading concepts with our comprehensive guides</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-6">
        <h2 className="text-xl font-bold text-blue-400 mb-2">📚 Welcome to Learning</h2>
        <p className="text-slate-300">
          Learn the fundamentals of trading with zero risk. Use virtual money to practice everything you learn here!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module, idx) => {
          const Icon = module.icon;
          return (
            <div key={idx} className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition">
              <div className={`inline-flex p-3 rounded-lg mb-4 ${colorClasses[module.color as keyof typeof colorClasses]}`}>
                <Icon size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">{module.title}</h3>
              
              <ul className="space-y-2">
                {module.lessons.map((lesson, lessonIdx) => (
                  <li key={lessonIdx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{lesson}</span>
                  </li>
                ))}
              </ul>

              <button className="mt-6 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition">
                Start Learning
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Trading Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700 rounded p-4">
            <h3 className="font-bold text-green-400 mb-2">✓ Do's</h3>
            <ul className="text-slate-300 space-y-1 text-sm">
              <li>• Always use stop loss</li>
              <li>• Research before trading</li>
              <li>• Diversify your portfolio</li>
              <li>• Keep emotions in check</li>
              <li>• Learn from mistakes</li>
            </ul>
          </div>
          <div className="bg-slate-700 rounded p-4">
            <h3 className="font-bold text-red-400 mb-2">✗ Don'ts</h3>
            <ul className="text-slate-300 space-y-1 text-sm">
              <li>• Don't invest borrowed money</li>
              <li>• Don't follow tips blindly</li>
              <li>• Don't panic sell</li>
              <li>• Don't overtrade</li>
              <li>• Don't ignore risk management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
