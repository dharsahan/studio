"use client";

import React, { useEffect, useState } from 'react';

type Sparkle = {
  id: string;
  top: string;
  left: string;
  delay: string;
};

const Sparkles: React.FC<{ count?: number; children?: React.ReactNode, className?: string }> = ({ count = 20, children, className }) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = Array.from({ length: count }).map((_, i) => ({
        id: `sparkle-${i}-${Date.now()}`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 1.5}s`,
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 2000);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className={`relative ${className || ''}`}>
      {children}
      <div className="sparkle-container">
        {sparkles.map(({ id, top, left, delay }) => (
          <div
            key={id}
            className="sparkle"
            style={{
              top,
              left,
              animationDelay: delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Sparkles;
