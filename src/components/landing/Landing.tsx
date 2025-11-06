import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import DemoSection from "./DemoSection";
import Features from "./Features";
import Pricing from "./Pricing";
import About from "./About";
import Testimonials from "./Testimonials";
import LoginSection from "./LoginSection";

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-slate-950 overflow-x-hidden">
      <Navbar scrollY={scrollY} />
      <HeroSection />
      <HowItWorks />
      <DemoSection />
      <Features />
      <Pricing />
      <About />
      <Testimonials />
      <LoginSection />
      
      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              INspec
            </h3>
            <p className="text-slate-400 mt-2">Controle inteligente e ético sobre sua operação</p>
          </div>
          <div className="flex justify-center gap-8 mb-6 text-sm text-slate-400">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#demo" className="hover:text-white transition-colors">Demonstração</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <a href="#sobre" className="hover:text-white transition-colors">Sobre</a>
          </div>
          <div className="text-xs text-slate-500">
            © 2025 INspec. Todos os direitos reservados. Em conformidade com a LGPD.
          </div>
        </div>
      </footer>
    </div>
  );
}