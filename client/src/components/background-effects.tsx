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

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
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
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
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