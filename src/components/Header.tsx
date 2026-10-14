import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { Wordmark } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { lang, setLang } = useLanguage();
  const { settings } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cleanPhone = settings.phone.replace(/^\+/, '');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        isScrolled
          ? 'bg-[#3B0710] border-b border-[#F2C21B]/25 shadow-lg shadow-black/40 py-2 sm:py-2.5'
          : 'bg-transparent border-b border-transparent py-2.5 sm:py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-2.5 sm:px-6 flex items-center justify-between gap-1.5 sm:gap-2.5">
        {/* Brand Wordmark (Compact Text Only) */}
        <a
          href="#accueil"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21B] rounded-xl transition-transform active:scale-95 shrink-0"
          aria-label="Chez le Maestro Accueil"
        >
          <Wordmark />
        </a>

        {/* Header Right Actions */}
        <nav aria-label="Navigation principale" className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Bilingual Switcher: FR | EN */}
          <div
            className="flex items-center bg-[#250409]/80 border border-[#F2C21B]/40 rounded-full p-0.5 text-xs font-baloo font-bold select-none shadow-sm shrink-0"
            role="group"
            aria-label="Sélection de la langue"
          >
            <button
              type="button"
              onClick={() => setLang('fr')}
              className={`min-h-[44px] px-2 sm:px-3 rounded-full transition-all duration-150 active-press cursor-pointer flex items-center justify-center ${
                lang === 'fr'
                  ? 'bg-[#F2C21B] text-[#3B0710] shadow-sm'
                  : 'text-[#FFF4DC]/80 hover:text-white'
              }`}
              aria-pressed={lang === 'fr'}
            >
              FR
            </button>
            <span className="text-[#F2C21B]/40 select-none text-[10px]">|</span>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`min-h-[44px] px-2 sm:px-3 rounded-full transition-all duration-150 active-press cursor-pointer flex items-center justify-center ${
                lang === 'en'
                  ? 'bg-[#F2C21B] text-[#3B0710] shadow-sm'
                  : 'text-[#FFF4DC]/80 hover:text-white'
              }`}
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
          </div>

          {/* Round Yellow "Appeler" Button */}
          <a
            href={`tel:+${cleanPhone}`}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#F2C21B] text-[#3B0710] flex items-center justify-center shadow-md active-press hover-gold-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0 cursor-pointer"
            aria-label="Appeler Chez le Maestro : +971 58 612 0042"
            title="Appeler Chez le Maestro : +971 58 612 0042"
          >
            <Phone className="w-5 h-5 fill-current" strokeWidth={2.2} />
          </a>
        </nav>
      </div>
    </header>
  );
};
