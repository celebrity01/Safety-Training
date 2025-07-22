import React, { useEffect, useRef } from "react";

interface RippleEffectProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const RippleButton: React.FC<RippleEffectProps> = ({
  children,
  className = "",
  onClick,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createRipple = (event: React.MouseEvent) => {
    const button = buttonRef.current;
    if (!button) return;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");

    // Remove existing ripples
    const ripples = button.getElementsByClassName("ripple");
    Array.from(ripples).forEach((ripple) => ripple.remove());

    button.appendChild(circle);

    // Remove ripple after animation
    setTimeout(() => {
      circle.remove();
    }, 600);

    if (onClick) onClick(event);
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 70%, transparent 100%);
        transform: scale(0);
        animation: ripple-expand 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        z-index: 10;
      }
      
      @keyframes ripple-expand {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onClick={createRipple}
      style={{ position: "relative" }}
    >
      {children}
    </button>
  );
};

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const MagneticHover: React.FC<MagneticProps> = ({
  children,
  strength = 0.3,
  className = "",
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    const element = elementRef.current;
    if (!element) return;

    element.style.transform = "translate(0px, 0px) scale(1)";
  };

  return (
    <div
      ref={elementRef}
      className={`transition-transform duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const TiltCard: React.FC<TiltProps> = ({
  children,
  className = "",
  intensity = 10,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (rect.height / 2)) * intensity;
    const rotateY = (mouseX / (rect.width / 2)) * intensity;

    card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div
      ref={cardRef}
      className={`transition-transform duration-300 ease-out transform-gpu ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
};

interface GlowTrailProps {
  children: React.ReactNode;
  className?: string;
}

export const GlowTrail: React.FC<GlowTrailProps> = ({
  children,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    container.style.setProperty("--mouse-x", `${x}px`);
    container.style.setProperty("--mouse-y", `${y}px`);
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .glow-trail {
        position: relative;
        overflow: hidden;
      }
      
      .glow-trail::before {
        content: "";
        position: absolute;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        left: var(--mouse-x, 50%);
        top: var(--mouse-y, 50%);
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
        z-index: 0;
      }
      
      .glow-trail:hover::before {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`glow-trail ${className}`}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
};

export default {
  RippleButton,
  MagneticHover,
  TiltCard,
  GlowTrail,
};
