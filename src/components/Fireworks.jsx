import { useEffect, useRef } from 'react';
import './Fireworks.css';

const Fireworks = () => {
  const canvasRef = useRef(null);
  const fireworks = useRef([]);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.friction = 0.95;
        this.gravity = 0.2;
        this.size = Math.random() * 3 + 2;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
      }
    }

    class Firework {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height * 0.5);
        this.speed = 5;
        this.angle = Math.atan2(this.targetY - this.y, this.x - this.x);
        this.velocity = {
          x: 0,
          y: -this.speed
        };
        this.trail = [];
        this.trailLength = 5;
        this.exploded = false;
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
          const point = this.trail[i];
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = i / this.trailLength;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailLength) {
          this.trail.shift();
        }

        this.y += this.velocity.y;

        if (this.y <= this.targetY && !this.exploded) {
          this.explode();
        }
      }

      explode() {
        this.exploded = true;
        for (let i = 0; i < 100; i++) {
          particles.current.push(new Particle(this.x, this.y, this.color));
        }
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new fireworks
      if (Math.random() < 0.05) {
        fireworks.current.push(new Firework());
      }

      // Update and draw fireworks
      fireworks.current = fireworks.current.filter(firework => {
        firework.update();
        firework.draw();
        return !firework.exploded;
      });

      // Update and draw particles
      particles.current = particles.current.filter(particle => {
        particle.update();
        particle.draw();
        return particle.alpha > 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fireworks-canvas" />;
};

export default Fireworks; 