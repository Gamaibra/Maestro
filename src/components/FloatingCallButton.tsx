import React from 'react';
import { Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const FloatingCallButton: React.FC = () => {
  const { t } = useLanguage();
  const { settings } = useApp();

  const cleanPhone = settings.phone.replace(/^\+/, '');

  return (
    <aside
      aria-label="Actions rapides"
      className="md:hidden"
    >
      {/* Floating Call Button on Bottom-Right */}
      <div
        className="fixed z-40"
        style={{
          bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))',
          right: 'calc(1rem + env(safe-area-inset-right, 0px))',
        }}
      >
        <a
          href={`tel:+${cleanPhone}`}
          className="w-14 h-14 rounded-full bg-[#F2C21B] text-[#3B0710] flex items-center justify-center shadow-2xl shadow-black/60 active-press hover-gold-glow border-2 border-[#FFF4DC]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
          aria-label={`${t('floatingCall')}: +${cleanPhone}`}
          title={t('floatingCall')}
        >
          <Phone className="w-6 h-6 fill-current" strokeWidth={2.2} />
        </a>
      </div>
    </aside>
  );
};
