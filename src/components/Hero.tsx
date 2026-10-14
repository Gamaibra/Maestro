import React from 'react';
import { Phone, Utensils, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const Hero: React.FC = () => {
  const { lang, t } = useLanguage();
  const { dishes, settings } = useApp();

  // Check if any dishes have images for the 3-photo collage
  const dishesWithImages = dishes
    .map((item) => ({
      ...item,
      cover: item.thumbnailUrl || (item.images && item.images.length > 0 ? item.images[0] : item.imageUrl),
    }))
    .filter((item) => Boolean(item.cover))
    .slice(0, 3);
  const showCollage = dishesWithImages.length >= 1;

  const currentSlogan =
    lang === 'en'
      ? settings.taglineEn || t('heroSlogan')
      : settings.taglineFr || t('heroSlogan');

  const locationSubtitle = `${settings.venueName} · ${settings.venueFloor}`;

  return (
    <section
      id="accueil"
      className="relative min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4 text-center overflow-hidden"
    >
      {/* Exactly one H1 on the page: sr-only for optimal SEO without changing visual styling */}
      <h1 className="sr-only">Chez le Maestro – Restaurant africain à Deira, Dubaï</h1>

      <div className="max-w-xl mx-auto flex flex-col items-center animate-fade-in-up">
        {/* Brand Logo Box (28px rounded, fine gold border, reads settings.logoUrl) */}
        <div className="transition-transform duration-200 hover:scale-[1.02]">
          <Logo size="md" customLogoUrl={settings.logoUrl} />
        </div>

        {/* Optional 3-photo collage (only shown if dishes have images) */}
        {showCollage && (
          <div className="flex items-center justify-center gap-3 my-6 py-2 overflow-visible">
            {dishesWithImages.map((dish, idx) => {
              const rotations = ['-rotate-4', 'rotate-3', '-rotate-2'];
              const altText = `${dish.nameFr} – ${lang === 'en' ? 'African dish' : 'plat africain'}`;
              return (
                <div
                  key={dish.id}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-[22px] overflow-hidden border-2 border-[#F2C21B] shadow-xl ${rotations[idx % 3]} transition-transform hover:rotate-0`}
                >
                  <img
                    src={dish.cover}
                    alt={altText}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Cursive Yellow Slogan */}
        <p className="font-script text-[#F2C21B] text-2xl sm:text-3xl md:text-4xl mt-6 px-2 leading-relaxed drop-shadow-[0_2px_8px_rgba(242,194,27,0.3)] max-w-lg">
          {currentSlogan}
        </p>

        {/* Location Subtitle */}
        <p className="font-baloo font-semibold text-[#FFF4DC]/90 text-sm sm:text-base mt-2 tracking-wide">
          {locationSubtitle}
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 mt-7 w-full max-w-xs sm:max-w-sm">
          {/* Main Primary CTA: Voir le menu (Yellow with soft pulsing glow) */}
          <a
            href="#menu"
            className="w-full sm:flex-1 min-h-[48px] py-3 px-6 rounded-full bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-base tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg animate-gold-pulse active-press focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Utensils className="w-5 h-5 text-[#3B0710]" strokeWidth={2.4} />
            <span>{t('heroViewMenu')}</span>
          </a>

          {/* Secondary CTA: Appeler (White outline) */}
          <a
            href={`tel:+${settings.phone.replace(/^\+/, '')}`}
            aria-label="Appeler Chez le Maestro : +971 58 612 0042"
            className="w-full sm:flex-1 min-h-[48px] py-3 px-6 rounded-full border-2 border-white text-white font-baloo font-bold text-base tracking-wider uppercase flex items-center justify-center gap-2 active-press hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21B]"
          >
            <Phone className="w-4 h-4 text-white fill-current" strokeWidth={2} />
            <span>{t('heroCall')}</span>
          </a>
        </div>
      </div>

      {/* Discreet Chevron to invite scrolling */}
      <a
        href="#menu"
        aria-label="Défiler vers le menu"
        className="mt-10 sm:mt-12 text-[#F2C21B]/70 hover:text-[#F2C21B] transition-colors p-2 rounded-full active-press animate-bounce"
      >
        <ChevronDown className="w-6 h-6 stroke-[2.5]" />
      </a>
    </section>
  );
};
