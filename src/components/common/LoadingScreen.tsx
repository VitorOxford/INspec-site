// src/components/common/LoadingScreen.tsx
// VERSÃO 5 - CORREÇÃO DEFINITIVA DO LOOP E AJUSTES DE DESIGN

import React, { useState, useEffect, useRef } from 'react';

// --- Configuração ---
// VÍDEOS REMOVIDOS
const messages = [
  'Autenticando credenciais...',
  'Carregando recursos essenciais...',
  'Otimizando workspace...',
  'Sincronizando dados em tempo real...',
  'Finalizando configurações de ambiente...',
  'Preparando painel de controle...',
  'Aguarde um instante...',
];

interface LoadingScreenProps {
  isLoading: boolean;
  onLoaded: () => void;
}

export default function LoadingScreen({ isLoading, onLoaded }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Iniciando conexão segura...');
  const [show, setShow] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const resizeHandler = useRef<(() => void) | null>(null);
  
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const messageTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const onLoadedRef = useRef(onLoaded);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  // --- Lógica de Animação das Partículas ---
  const initParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles: any[] = [];
    const particleCount = 80;
    const connectionDistance = 120;
    const brandColors = [
      [168, 85, 247], [124, 58, 237], [59, 130, 246], [37, 99, 235]
    ];
    class Particle {
      x: number; y: number; radius: number; color: number[]; speedX: number; speedY: number;
      constructor(x: number, y: number, color: number[]) {
        this.x = x; this.y = y; this.radius = Math.random() * 2 + 1;
        this.color = color; this.speedX = Math.random() * 3 - 1.5; this.speedY = Math.random() * 3 - 1.5;
      }
      update() {
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        this.x += this.speedX; this.y += this.speedY;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 0.8)`;
        ctx.fill(); ctx.closePath();
      }
    }
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(
          Math.random() * canvas.width, Math.random() * canvas.height, brandColors[i % brandColors.length]
        ));
      }
    };
    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${particles[i].color[0]}, ${particles[i].color[1]}, ${particles[i].color[2]}, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke(); ctx.closePath();
          }
        }
      }
    };
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      animationFrameId.current = requestAnimationFrame(animate);
    };
    createParticles();
    animate();
    resizeHandler.current = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      createParticles();
    };
    window.addEventListener('resize', resizeHandler.current);
  };

  // --- Lógica Principal de Loading ---
  const startLoadingAnimation = () => {
    setShow(true);
    setProgress(0);
    setMessage('Iniciando conexão segura...');
    let messageIndex = 0;

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval.current!);
          setMessage('Bem-vindo(a)!');
          setTimeout(() => {
            setShow(false);
            setTimeout(() => onLoadedRef.current(), 600); 
          }, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    const changeMessage = () => {
      setProgress(prevProgress => {
        if (prevProgress < 95) {
          setMessage(messages[messageIndex % messages.length]);
          messageIndex++;
          messageTimeout.current = setTimeout(changeMessage, 2000);
        }
        return prevProgress;
      });
    };
    messageTimeout.current = setTimeout(changeMessage, 1800);
  };

  // ==================================================================
  // CORREÇÃO DEFINITIVA DO LOOP:
  // O array de dependências agora está VAZIO.
  // Este useEffect só vai rodar UMA VEZ, na montagem.
  // ==================================================================
  useEffect(() => {
    if (isLoading) {
      startLoadingAnimation();
      initParticles();
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (messageTimeout.current) clearTimeout(messageTimeout.current);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (resizeHandler.current) {
        window.removeEventListener('resize', resizeHandler.current);
      }
    };
  }, []); // <-- ARRAY DE DEPENDÊNCIAS VAZIO.

  return (
    <>
      <style>{`
        .loading-overlay {
          position: fixed; top: 0; left: 0;
          width: 100vw; height: 100vh;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: #fff;
          background-color: #000;
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
        }
        .loading-overlay.visible {
          opacity: 1;
        }

        /* VÍDEOS E FILTRO REMOVIDOS */

        #particle-canvas {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 3;
          /* AJUSTE NA OPACIDADE PARA O FUNDO PRETO */
          opacity: 0.3;
        }

        .loading-content {
          position: relative; z-index: 4;
          text-align: center;
          display: flex; flex-direction: column;
          align-items: center;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        }

        .logo-container {
          position: relative;
          margin-bottom: 40px;
        }
        .logo-container::before {
          content: '';
          position: absolute; top: 50%; left: 50%;
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: glow-pulse 3s infinite ease-in-out;
        }
        @keyframes glow-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        }

        /* NOVO ESTILO PARA O "IN" LOGO */
        .loading-logo-box {
          width: 80px; height: 80px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem; /* 40px */
          font-weight: bold;
          color: white;
          border-radius: 1.25rem; /* 20px */
          background-image: linear-gradient(to bottom right, #a855f7, #60a5fa); /* purple-500 to blue-400 */
          filter: drop-shadow(0 0 20px rgba(192, 132, 252, 0.6));
        }

        .loading-message {
          font-size: 1.1rem;
          margin-bottom: 24px;
          min-height: 25px;
          font-weight: 500;
          letter-spacing: 0.5px;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .loading-message-enter { opacity: 0; transform: translateY(10px); }
        .loading-message-exit { opacity: 0; transform: translateY(-10px); }

        .progress-bar-container {
          position: relative;
          width: 320px; height: 4px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(to right, #a855f7, #60a5fa);
          border-radius: 2px;
          transition: width 0.15s linear;
          box-shadow: 0 0 10px #a855f7, 0 0 20px #60a5fa;
        }

        .loading-info {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 16px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
      `}</style>

      <div className={`loading-overlay ${show ? 'visible' : ''}`}>
        {/* VÍDEO CONTAINER REMOVIDO */}

        <canvas id="particle-canvas" ref={canvasRef}></canvas>

        <div className="loading-content">
          <div className="logo-container">
            {/* LOGO ATUALIZADA */}
            <div className="loading-logo-box">
              IN
            </div>
          </div>
          <p key={message} className="loading-message loading-message-enter">
            {message}
          </p>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="loading-info">INspec • Carregando sistema</p>
        </div>
      </div>
    </>
  );
}