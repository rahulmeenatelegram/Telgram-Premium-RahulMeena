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
      {/* Animated gradient orbs - Light mode colorful */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Pink gradient orb */}
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/12 via-rose-200/8 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '0s' }}
        />
        {/* Blue gradient orb */}
        <div 
          className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-300/10 via-sky-200/6 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
        {/* Green gradient orb */}
        <div 
          className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-tl from-green-300/8 via-emerald-200/5 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '4s' }}
        />
        {/* Orange gradient orb */}
        <div 
          className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-orange-300/6 via-amber-200/4 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '1s' }}
        />
        {/* Purple gradient orb */}
        <div 
          className="absolute bottom-32 left-10 w-80 h-80 bg-gradient-to-tr from-purple-300/7 via-violet-200/4 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '3s' }}
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