import React from 'react';
import { Phone, Lock } from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { lang, t } = useLanguage();
  const { settings, setIsAdminRoute } = useApp();
  const currentYear = new Date().getFullYear();

  const currentSlogan =
    lang === 'en'
      ? settings.taglineEn || t('heroSlogan')
      : settings.taglineFr || t('heroSlogan');

  const tiktokUrl = 'https://www.tiktok.com/@madame_dafe';

  return (
    <footer className="relative bg-[#250409] text-[#FFF4DC] border-t border-[#F2C21B]/25 pt-14 pb-24 sm:pb-14 px-4 text-center select-none">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        {/* Brand Logo in Footer */}
        <div className="mb-4">
          <Logo size="sm" customLogoUrl={settings.logoUrl} />
        </div>

        {/* Slogan */}
        <p className="font-script text-[#F2C21B] text-xl sm:text-2xl mt-2 leading-relaxed">
          {currentSlogan}
        </p>

        {/* TikTok Link */}
        <div className="mt-5">
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Profil TikTok officiel Chez le Maestro @madame_dafe"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/40 border border-[#F2C21B]/40 text-[#FFF4DC] hover:text-[#F2C21B] hover:border-[#F2C21B] font-baloo font-bold text-sm tracking-wide transition-all active-press"
          >
            {/* TikTok SVG Icon */}
            <svg
              className="w-4 h-4 fill-current text-[#F2C21B]"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
            <span>{t('tiktokHandle')}</span>
          </a>
        </div>

        {/* Phone number */}
        <div className="mt-4">
          <a
            href="tel:+971586120042"
            aria-label="Appeler Chez le Maestro : +971 58 612 0042"
            className="inline-flex items-center gap-2 text-[#FFF4DC]/90 hover:text-[#F2C21B] font-baloo font-bold text-base tracking-wide transition-colors"
          >
            <Phone className="w-4 h-4 text-[#F2C21B] fill-current" />
            <span>+971 58 612 0042</span>
          </a>
        </div>

        {/* Short Copyright Line */}
        <p className="font-baloo text-xs text-[#FFF4DC]/60 mt-6 tracking-wider">
          © {currentYear} {t('copyright')}
        </p>

        {/* Discrete Admin Link for Owner */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setIsAdminRoute(true)}
            className="inline-flex items-center gap-1.5 text-[11px] font-baloo font-semibold text-[#FFF4DC]/30 hover:text-[#F2C21B] transition-colors cursor-pointer"
          >
            <Lock className="w-3 h-3 opacity-60" />
            <span>Espace Patron</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
