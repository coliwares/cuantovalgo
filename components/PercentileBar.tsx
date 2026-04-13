'use client';

import { useEffect, useState } from 'react';

interface PercentileBarProps {
  percentile: number;
  recommendation: 'bajo' | 'mercado' | 'sobre';
}

export default function PercentileBar({ percentile, recommendation }: PercentileBarProps) {
  const [animatedPercentile, setAnimatedPercentile] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentile(percentile);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentile]);

  const getColor = () => {
    if (recommendation === 'bajo') return 'bg-red-500';
    if (recommendation === 'sobre') return 'bg-neon';
    return 'bg-yellow-500';
  };

  const getBadgeColor = () => {
    if (recommendation === 'bajo') return 'bg-red-500/20 text-red-400 border border-red-500/30';
    if (recommendation === 'sobre') return 'bg-neon/20 text-neon border border-neon/30';
    return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
  };

  const getBadgeText = () => {
    if (recommendation === 'bajo') return '📉 Bajo mercado';
    if (recommendation === 'sobre') return '📈 Sobre mercado';
    return '✓ En mercado';
  };

  return (
    <div data-testid="percentile-bar" className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-white text-xl">Tu posición en el mercado</h3>
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${getBadgeColor()}`}>
          {getBadgeText()}
        </span>
      </div>

      <div className="relative pt-2">
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${getColor()}`}
            style={{ width: `${animatedPercentile}%` }}
          />
        </div>
        <div
          className="absolute top-10 transform -translate-x-1/2 text-center"
          style={{ left: `${animatedPercentile}%` }}
        >
          <div className="bg-white text-black px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
            {Math.round(percentile)}%
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-8">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
