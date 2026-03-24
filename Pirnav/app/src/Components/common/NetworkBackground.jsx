import { useEffect, useRef } from "react";

const NetworkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    let animationFrame;
    let particles = [];
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const resize = () => {
      const { offsetWidth, offsetHeight } = canvas.parentElement || canvas;
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(offsetWidth * pixelRatio));
      canvas.height = Math.max(1, Math.floor(offsetHeight * pixelRatio));
      canvas.style.width = `${offsetWidth}px`;
      canvas.style.height = `${offsetHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const area = Math.max(1, offsetWidth * offsetHeight);
      const count = Math.max(16, Math.floor(area / 30000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * offsetWidth,
        y: Math.random() * offsetHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    const draw = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      context.clearRect(0, 0, width, height);

      const maxDistance = 140;
      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.hypot(dx, dy);
          if (distance < maxDistance) {
            const alpha = 0.25 * (1 - distance / maxDistance);
            context.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
      }

      context.fillStyle = "rgba(37, 99, 235, 0.35)";
      particles.forEach((particle) => {
        context.beginPath();
        context.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        context.fill();
      });
    };

    const update = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      particles = particles.map((particle) => {
        let nextX = particle.x + particle.vx;
        let nextY = particle.y + particle.vy;
        let nextVx = particle.vx;
        let nextVy = particle.vy;

        if (nextX <= 0 || nextX >= width) {
          nextVx *= -1;
          nextX = Math.max(0, Math.min(width, nextX));
        }

        if (nextY <= 0 || nextY >= height) {
          nextVy *= -1;
          nextY = Math.max(0, Math.min(height, nextY));
        }

        return { x: nextX, y: nextY, vx: nextVx, vy: nextVy };
      });
    };

    const animate = () => {
      update();
      draw();
      animationFrame = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resize();
      draw();
    };

    resize();
    draw();

    if (!prefersReducedMotion) {
      animationFrame = window.requestAnimationFrame(animate);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className="network-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="network-canvas" />
    </div>
  );
};

export default NetworkBackground;
