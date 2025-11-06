// src/components/landing/Navbar.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom"; // 1. IMPORTADO O LINK

export default function Navbar({ scrollY }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isScrolled = scrollY > 50;
  
  const menuItems = [
    { label: "Recursos", href: "#recursos" },
    { label: "Demonstração", href: "#demo" },
    { label: "Planos", href: "#planos" },
    { label: "Sobre", href: "#sobre" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IN</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              spec
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
            {/* 2. LINK ATUALIZADO */}
            <Link
              to="/auth"
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            {/* 2. LINK ATUALIZADO */}
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6">
                Começar Teste Grátis
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-slate-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            {/* 2. LINK ATUALIZADO */}
            <Link
              to="/auth"
              className="block text-slate-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            {/* 2. LINK ATUALIZADO */}
            <Link to="/auth" className="block" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                Começar Teste Grátis
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}