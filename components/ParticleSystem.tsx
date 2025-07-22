import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: "small" | "medium" | "large";
  delay: number;
}

const ParticleSystem: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const particleCount = Math.floor(window.innerWidth / 100); // Responsive particle count

      for (let i = 0; i < particleCount; i++) {
        const sizes: Array<"small" | "medium" | "large"> = [
          "small",
          "medium",
          "large",
        ];
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: sizes[Math.floor(Math.random() * sizes.length)],
          delay: Math.random() * 8, // Random animation delay
        });
      }

      setParticles(newParticles);
    };

    generateParticles();

    const handleResize = () => {
      generateParticles();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Floating particles */}
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`particle particle-${particle.size}`}
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Ambient glow effects */}
      <div
        className="ambient-glow glow-primary"
        style={{
          width: "400px",
          height: "400px",
          top: "10%",
          left: "15%",
        }}
      />

      <div
        className="ambient-glow glow-secondary"
        style={{
          width: "300px",
          height: "300px",
          top: "60%",
          right: "20%",
        }}
      />

      <div
        className="ambient-glow glow-accent"
        style={{
          width: "500px",
          height: "500px",
          top: "30%",
          left: "60%",
        }}
      />
    </>
  );
};

export default ParticleSystem;
