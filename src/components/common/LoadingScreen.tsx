// src/components/common/LoadingScreen.tsx
// VERSÃO FINAL DE RESOLUÇÃO DE CONGELAMENTO (TIMEOUT 0)

import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Configuração ---
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
  const [show, setShow] = useState(true); 

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const resizeHandler = useRef<(() => void) | null>(null);
  
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const messageTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const onLoadedRef = useRef(onLoaded);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  // Função de Saída Final (Garante a transição)
  const finishLoading = useCallback(() => {
      console.log('LOG: LOADING_SCREEN - DISPARANDO SAÍDA FINAL (FinishLoading).');
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (messageTimeout.current) clearTimeout(messageTimeout.current);
      
      setMessage('Bem-vindo(a)!');
      setProgress(100);
      
      // Inicia o fade-out visual
      setTimeout(() => {
          console.log('LOG: LOADING_SCREEN - Chamando setShow(false) para fade-out.');
          setShow(false);
          // Notifica App.tsx após o tempo do fade-out
          setTimeout(() => {
              console.log('LOG: LOADING_SCREEN - Chamando onLoaded() no final.');
              onLoadedRef.current(); 
          }, 550); 
      }, 500); 
  }, []);

  // --- Lógica de Animação das Partículas (omitida) ---
  const initParticles = () => {
    // ... (Manter a função initParticles intacta do seu código anterior) ...
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
  // --- Fim da Lógica de Animação das Partículas ---


  // --- Lógica Principal de Loading ---
  const startLoadingAnimation = () => {
    console.log(`LOG: LOADING_SCREEN - START. Estado inicial isLoading=${isLoading}.`);

    // 1. Limpeza de ciclos anteriores
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (messageTimeout.current) clearTimeout(messageTimeout.current);

    // 2. LÓGICA DE SAÍDA IMEDIATA (Se o AuthContext já terminou ao montar - F5)
    if (!isLoading) {
        console.log('LOG: LOADING_SCREEN - RÁPIDO: Auth já terminou. Chamando finishLoading.');
        finishLoading();
        return;
    }

    // 3. LÓGICA DE PROGRESSO SIMULADO (Se o AuthContext AINDA está ativo)
    setShow(true); 
    setProgress(0);
    setMessage('Iniciando conexão segura...');
    let messageIndex = 0;

    // Simulação do progresso (Atinge 95% em 2 segundos)
    const totalDuration = 2000;
    const steps = 95;
    const stepDuration = totalDuration / steps;

    let currentStep = 0;
    console.log('LOG: LOADING_SCREEN - Iniciando progressInterval de simulação...');

    progressInterval.current = setInterval(() => {
      if (currentStep < steps) {
        setProgress(currentStep + 1);
        currentStep++;
      } else {
        console.log('LOG: LOADING_SCREEN - progressInterval PAROU (atingiu 95%).');
        clearInterval(progressInterval.current!);
      }
    }, stepDuration);


    // 4. Lógica de Mensagem
    const updateMessage = () => {
      if (progress < 95) { // Verifica se ainda não travou no 95%
        setMessage(messages[messageIndex % messages.length]);
        messageIndex++;
      }
      messageTimeout.current = setTimeout(updateMessage, 2000);
    };
    messageTimeout.current = setTimeout(updateMessage, 1800);
  };
  

  // ==================================================================
  // HOOK 1: Inicia a animação (Roda apenas na montagem)
  // ==================================================================
  useEffect(() => {
    console.log('LOG: LOADING_SCREEN - useEffect []. Montagem/Remontagem. Disparando init.');
    startLoadingAnimation();
    initParticles();
    
    // Cleanup: Limpa timers e event listeners
    return () => {
      console.log('LOG: LOADING_SCREEN - Cleanup hooks rodando.');
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (messageTimeout.current) clearTimeout(messageTimeout.current);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (resizeHandler.current) {
        window.removeEventListener('resize', resizeHandler.current);
      }
    };
  }, []); 


  // ==================================================================
  // HOOK 2: Observa a conclusão do carregamento real (Gatilho de Saída)
  // ==================================================================
  useEffect(() => {
    console.log(`LOG: LOADING_SCREEN - useEffect [isLoading] rodou. Novo isLoading: ${isLoading}.`);
    
    // Se o AuthContext terminou o carregamento.
    if (!isLoading) { 
        console.log('LOG: LOADING_SCREEN - Detecção CRÍTICA: Auth terminou. Forçando saída via Hook 2.');
        
        // A CORREÇÃO FINAL: Usamos setTimeout(0) para garantir que a função de saída
        // seja chamada no próximo tick da fila de eventos, quebrando o bloqueio.
        setTimeout(() => {
  if (progress < 95) {
    setProgress(95);
  }
  finishLoading();
}, 150);
    }
  }, [isLoading, finishLoading]); // Apenas reage à prop isLoading

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        
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
        
        #particle-canvas {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 3;
            opacity: 0.3;
        }

        .loading-content {
          position: relative; 
          z-index: 4;
          text-align: center;
          display: flex; 
          flex-direction: column;
          align-items: center;
          margin-bottom: 20vh;
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

        .loading-logo-box {
          width: 80px; height: 80px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem; 
          font-weight: bold;
          color: white;
          border-radius: 1.25rem; 
          background-image: linear-gradient(to bottom right, #a855f7, #60a5fa); 
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
        <canvas id="particle-canvas" ref={canvasRef}></canvas>

        <div className="loading-content">
          <div className="logo-container">
            <div className="loading-logo-box">
              IN
            </div>
          </div>
          <p key={message} className="loading-message">
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