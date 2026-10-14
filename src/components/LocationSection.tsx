import React from 'react';
import { MapPin, Navigation, Phone, MessageSquare, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const LocationSection: React.FC = () => {
  const { lang, t } = useLanguage();
  const { settings } = useApp();

  const venueName = settings.venueName || 'Green Sea Plaza Hotel';
  const venueFloor = settings.venueFloor || 'M-Floor';
  const photoUrl = settings.locationPhotoUrl;
  const hours =
    lang === 'en'
      ? settings.openingHoursEn || t('openingHours')
      : settings.openingHoursFr || t('openingHours');
  const mapsUrl =
    settings.googleMapsUrl ||
    'https://www.google.com/maps/search/?api=1&query=Green+Sea+Plaza+Hotel+Deira+Dubai';

  return (
    <section
      id="localisation"
      className="relative bg-[#14134F] text-[#FFF4DC] pt-20 pb-20 px-4 sm:px-6 clip-diagonal-top scroll-mt-12"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="flex items-baseline justify-center gap-2">
            <span className="font-baloo font-bold text-white text-xs sm:text-sm tracking-[0.25em] uppercase">
              {t('locationSectionKicker')}
            </span>
            <h2 className="font-script text-[#F2C21B] text-4xl sm:text-5xl md:text-6xl leading-tight drop-shadow-[0_2px_8px_rgba(242,194,27,0.35)]">
              {t('locationSectionTitle')}
            </h2>
          </div>
        </div>

        {/* Rounded Location Card */}
        <div className="bg-[#0D0C38]/90 border border-[#F2C21B]/35 rounded-[26px] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle gold accent aura */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2C21B]/5 rounded-full blur-3xl pointer-events-none" />

          <address className="not-italic relative z-10 flex flex-col items-center text-center">
            {/* Map Pin Icon Badge */}
            <div className="w-14 h-14 rounded-full bg-[#F2C21B] text-[#14134F] flex items-center justify-center shadow-lg mb-4">
              <MapPin className="w-7 h-7 stroke-[2.2]" />
            </div>

            {/* Place Title & Floor */}
            <h3 className="font-baloo font-extrabold text-white text-2xl sm:text-3xl leading-snug">
              Chez le Maestro
            </h3>
            <p className="font-baloo font-semibold text-[#F2C21B] text-lg sm:text-xl mt-1 tracking-wide">
              {venueName}, {venueFloor}, Deira, Dubaï
            </p>
            <p className="font-baloo text-xs sm:text-sm text-[#FFF4DC]/70 mt-0.5">
              United Arab Emirates
            </p>

            {/* Optional Photo Zone (hidden if empty) */}
            {photoUrl && (
              <div className="w-full max-w-md h-48 sm:h-64 rounded-[22px] overflow-hidden my-6 border border-[#F2C21B]/30 shadow-md">
                <img
                  src={photoUrl}
                  alt={`${venueName} – Chez le Maestro à Deira, Dubaï`}
                  width={448}
                  height={256}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}

            {/* Opening Hours (hidden if empty) */}
            {hours && (
              <div className="flex items-center justify-center gap-2 mt-5 text-sm sm:text-base font-baloo text-[#FFF4DC]/90 bg-[#14134F]/70 px-4 py-2 rounded-full border border-[#F2C21B]/20">
                <Clock className="w-4 h-4 text-[#F2C21B] shrink-0" />
                <span>{hours}</span>
              </div>
            )}

            {/* Three Action Buttons: Itinéraire, Appeler, WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 w-full max-w-lg">
              {/* Button 1: Itinéraire (Google Maps) */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Itinéraire Google Maps Chez le Maestro"
                className="min-h-[48px] py-3 px-4 rounded-full bg-[#F2C21B] text-[#14134F] font-baloo font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-md active-press hover-gold-glow cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Navigation className="w-4 h-4 shrink-0 fill-current" />
                <span>{t('directionsBtn')}</span>
              </a>

              {/* Button 2: Appeler (Phone) */}
              <a
                href="tel:+971586120042"
                aria-label="Appeler Chez le Maestro : +971 58 612 0042"
                className="min-h-[48px] py-3 px-4 rounded-full border-2 border-white text-white font-baloo font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-sm active-press hover:bg-white/10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21B]"
              >
                <Phone className="w-4 h-4 shrink-0 fill-current" />
                <span>{t('callBtn')}</span>
              </a>

              {/* Button 3: WhatsApp */}
              <a
                href="https://wa.me/971586120042"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Commander sur WhatsApp Chez le Maestro"
                className="min-h-[48px] py-3 px-4 rounded-full bg-[#25D366] text-white font-baloo font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-md active-press hover:brightness-105 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MessageSquare className="w-4 h-4 shrink-0 fill-current" />
                <span>{t('whatsappBtn')}</span>
              </a>
            </div>
          </address>
        </div>
      </div>
    </section>
  );
};
