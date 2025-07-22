import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
  direction: number;
}

export const FloatingParticles: React.FC<{
  count?: number;
  theme?: "safety" | "achievement" | "training";
}> = ({ count = 20, theme = "safety" }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const getThemeConfig = (theme: string) => {
    switch (theme) {
      case "achievement":
        return {
          colors: ["#FFD700", "#FFA500", "#FF6B6B", "#4ECDC4"],
          symbols: ["⭐", "✨", "🏆", "💎"],
          speed: [0.5, 1.5],
        };
      case "training":
        return {
          colors: ["#9013FE", "#FF8687", "#ECD6FF", "#FFD7D7"],
          symbols: ["🎯", "📚", "🧠", "⚡"],
          speed: [0.3, 1],
        };
      case "safety":
      default:
        return {
          colors: ["#9013FE", "#FF8687", "#6366F1", "#10B981"],
          symbols: ["🛡️", "🚨", "💪", "🌟"],
          speed: [0.2, 0.8],
        };
    }
  };

  useEffect(() => {
    const config = getThemeConfig(theme);

    const createParticle = (id: number): Particle => ({
      id,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 20 + 10,
      opacity: Math.random() * 0.3 + 0.1,
      speed:
        Math.random() * (config.speed[1] - config.speed[0]) + config.speed[0],
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      direction: Math.random() * Math.PI * 2,
    });

    const initialParticles = Array.from({ length: count }, (_, i) =>
      createParticle(i),
    );
    setParticles(initialParticles);

    let animationFrameId: number;

    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => {
          let newX = particle.x + Math.cos(particle.direction) * particle.speed;
          let newY = particle.y + Math.sin(particle.direction) * particle.speed;

          // Wrap around screen
          if (newX > window.innerWidth + 50) newX = -50;
          if (newX < -50) newX = window.innerWidth + 50;
          if (newY > window.innerHeight + 50) newY = -50;
          if (newY < -50) newY = window.innerHeight + 50;

          return {
            ...particle,
            x: newX,
            y: newY,
            direction: particle.direction + (Math.random() - 0.5) * 0.02, // Slight random movement
          };
        }),
      );

      animationFrameId = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [count, theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute transition-all duration-1000 ease-linear"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            color: particle.color,
            fontSize: `${particle.size}px`,
            transform: `rotate(${particle.direction}rad)`,
          }}
        >
          <div className="animate-pulse-soft">
            {theme === "achievement"
              ? "✨"
              : theme === "training"
                ? "⚡"
                : "🌟"}
          </div>
        </div>
      ))}
    </div>
  );
};

// Particle burst effect for specific events
export const ParticleBurst: React.FC<{
  x: number;
  y: number;
  onComplete: () => void;
  type?: "success" | "error" | "achievement";
}> = ({ x, y, onComplete, type = "success" }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const burstCount = 15;
    const config = {
      success: { colors: ["#10B981", "#34D399", "#6EE7B7"], symbol: "✓" },
      error: { colors: ["#EF4444", "#F87171", "#FCA5A5"], symbol: "✗" },
      achievement: { colors: ["#FFD700", "#FFA500", "#FF6B6B"], symbol: "⭐" },
    };

    const currentConfig = config[type];

    const burstParticles = Array.from({ length: burstCount }, (_, i) => ({
      id: i,
      x,
      y,
      size: Math.random() * 8 + 4,
      opacity: 1,
      speed: Math.random() * 3 + 2,
      color:
        currentConfig.colors[
          Math.floor(Math.random() * currentConfig.colors.length)
        ],
      direction: (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.5,
    }));

    setParticles(burstParticles);

    // Animate particles outward and fade
    let frame = 0;
    const animate = () => {
      frame++;

      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x:
            particle.x +
            Math.cos(particle.direction) * particle.speed * frame * 0.1,
          y:
            particle.y +
            Math.sin(particle.direction) * particle.speed * frame * 0.1,
          opacity: Math.max(0, 1 - frame * 0.02),
          size: particle.size * (1 + frame * 0.01),
        })),
      );

      if (frame < 100) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animate();
  }, [x, y, type, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute font-bold"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            fontSize: `${particle.size}px`,
            opacity: particle.opacity,
            color: particle.color,
            transform: `scale(${1 + (1 - particle.opacity)})`,
          }}
        >
          {type === "success" ? "✓" : type === "error" ? "✗" : "⭐"}
        </div>
      ))}
    </div>
  );
};
