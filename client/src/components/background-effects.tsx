import { useEffect, useState } from "react";

export function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const particleCount = 8;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 10,
    }));
    setParticles(newParticles);
  }, []);

  const particleColors = [
    'bg-pink-300/30',
    'bg-blue-300/30', 
    'bg-green-300/30',
    'bg-orange-300/30',
    'bg-purple-300/30',
    'bg-cyan-300/30'
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute w-1 h-1 rounded-full animate-pulse ${particleColors[particle.id % particleColors.length]}`}
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            animation: `particleFloat ${particle.duration}s linear infinite ${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function BackgroundGlow() {
  return (
    <>
      {/* Light mode - subtle corner gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden dark:hidden">
        {/* Top left corner */}
        <div 
          className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-pink-300/8 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '0s' }}
        />
        {/* Top right corner */}
        <div 
          className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-bl from-blue-300/6 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
        {/* Bottom left corner */}
        <div 
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-green-300/5 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '4s' }}
        />
        {/* Bottom right corner */}
        <div 
          className="absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-tl from-orange-300/7 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '1s' }}
        />
        {/* Left side */}
        <div 
          className="absolute top-1/2 -left-24 w-48 h-48 bg-gradient-to-r from-purple-300/4 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '3s' }}
        />
        {/* Right side */}
        <div 
          className="absolute top-1/3 -right-24 w-48 h-48 bg-gradient-to-l from-red-300/5 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '5s' }}
        />
      </div>
       
      {/* Dark mode gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden dark:block hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-500/8 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
        <div 
          className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-tl from-cyan-500/6 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '4s' }}
        />
      </div>
      <FloatingParticles />
    </>
  );
}