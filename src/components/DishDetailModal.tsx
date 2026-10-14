import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Phone, ShoppingBag, Plus, Check } from 'lucide-react';
import { MenuItem } from '../data/menu';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { DishGallery } from './DishGallery';
import { ClocheLineIcon } from './Logo';
import { getSimilarDishes } from '../utils/similarity';

interface DishDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
  onSelectDish: (dish: MenuItem) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  onClose,
  onSelectDish,
}) => {
  const { lang, t } = useLanguage();
  const { dishes, settings } = useApp();
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Multi-selection: extra dishes selected along with the main dish
  const [selectedAdditionalDishes, setSelectedAdditionalDishes] = useState<MenuItem[]>([]);

  // Reset extra selections when viewing a different dish from root
  useEffect(() => {
    setSelectedAdditionalDishes([]);
  }, [dish?.id]);

  // Manage body scroll lock and browser history popstate
  useEffect(() => {
    if (!dish) return;

    // Lock page scroll behind the overlay without changing scroll position
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Update history state so phone back button closes the page
    const currentHash = `#dish-${dish.id}`;
    if (window.location.hash !== currentHash) {
      window.history.pushState({ dishModal: true, dishId: dish.id }, '', currentHash);
    }

    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.dishId) {
        const targetDish = dishes.find((d) => d.id === e.state.dishId);
        if (targetDish) {
          onSelectDish(targetDish);
          if (modalScrollRef.current) {
            modalScrollRef.current.scrollTop = 0;
          }
          return;
        }
      }
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('popstate', handlePopState);
    };
  }, [dish?.id, onClose, onSelectDish, dishes]);

  // All dishes included in this order: main dish + all selected additional dishes
  const allSelectedDishes = useMemo(() => {
    if (!dish) return [];
    return [dish, ...selectedAdditionalDishes];
  }, [dish, selectedAdditionalDishes]);

  // Sum total amount
  const totalPrice = useMemo(() => {
    return allSelectedDishes.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }, [allSelectedDishes]);

  if (!dish) {
    return (
      <div
        className="fixed inset-0 z-50 transform translate-x-full pointer-events-none transition-transform duration-300 ease-out"
        aria-hidden="true"
      />
    );
  }

  const displayName = lang === 'en' && dish.nameEn ? dish.nameEn : dish.nameFr;
  const description =
    lang === 'en' && dish.descriptionEn ? dish.descriptionEn : dish.descriptionFr;

  // Resolve slides: explicit images array, fallback to imageUrl, or empty
  const galleryImages = dish.images && dish.images.length > 0
    ? dish.images
    : dish.imageUrl
    ? [dish.imageUrl]
    : [];

  const similarDishes = getSimilarDishes(dish, dishes, 6);

  const handleBack = () => {
    if (window.location.hash.startsWith('#dish-')) {
      window.history.back();
    } else {
      onClose();
    }
  };

  const handleSwitchDish = (newDish: MenuItem) => {
    // If the new dish was already in additional selected, remove it from extras so it doesn't duplicate
    setSelectedAdditionalDishes((prev) => prev.filter((d) => d.id !== newDish.id));
    window.history.replaceState({ dishModal: true, dishId: newDish.id }, '', `#dish-${newDish.id}`);
    onSelectDish(newDish);
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle selection of a similar dish into the order
  const toggleSelectSimilarDish = (simDish: MenuItem) => {
    setSelectedAdditionalDishes((prev) => {
      const exists = prev.some((d) => d.id === simDish.id);
      if (exists) {
        return prev.filter((d) => d.id !== simDish.id);
      } else {
        return [...prev, simDish];
      }
    });
  };

  // Build clean WhatsApp message with all selected items and grand total
  const cleanPhone = (settings.whatsapp || settings.phone || '971586120042').replace(/[^0-9]/g, '');

  const itemsListFormatted = allSelectedDishes
    .map((item) => {
      const name = lang === 'en' && item.nameEn ? item.nameEn : item.nameFr;
      return `• ${name} - ${item.price} AED`;
    })
    .join('\n');

  const orderMessage =
    lang === 'en'
      ? `Hello Chez le Maestro, I would like to order:\n\n${itemsListFormatted}\n\nTotal: ${totalPrice} AED\n\nThank you!`
      : `Bonjour Chez le Maestro, je souhaite passer une commande :\n\n${itemsListFormatted}\n\nTotal : ${totalPrice} AED\n\nMerci !`;

  const whatsappOrderUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(orderMessage)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={displayName}
      className="fixed inset-0 z-50 flex flex-col bg-[#3B0710] bg-marble-texture transform translate-x-0 transition-transform duration-300 ease-out"
    >
      {/* Top Bar with Floating Rounded Back Button */}
      <button
        type="button"
        onClick={handleBack}
        className="absolute top-4 left-4 z-40 w-11 h-11 rounded-full bg-black/60 border border-[#F2C21B]/40 text-[#FFF4DC] hover:text-[#F2C21B] flex items-center justify-center shadow-lg active-press focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21B] cursor-pointer"
        aria-label={t('backButtonAria')}
      >
        <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Scrollable Container (Overlay scrolls on its own) */}
      <div
        ref={modalScrollRef}
        className="flex-1 overflow-y-auto min-w-0 pb-36 focus:outline-none"
      >
        <div className="max-w-2xl mx-auto min-w-0">
          {/* 1. IMAGE GALLERY CAROUSEL (Full width, 4:3, rounded bottom 28px) */}
          <DishGallery images={galleryImages} dishName={displayName} />

          {/* Dish Details */}
          <div className="px-4 sm:px-6 pt-5">
            {/* 2. Dish Name: Baloo 2 extra-bold, white, ~28px */}
            <h2 className="font-baloo font-extrabold text-white text-2xl sm:text-[28px] leading-tight">
              {displayName}
            </h2>

            {/* Price in AED: Yellow script, large */}
            <div className="mt-1">
              <span className="font-script text-[#F2C21B] text-3xl sm:text-4xl leading-tight drop-shadow-[0_2px_6px_rgba(242,194,27,0.35)]">
                {dish.price} {t('currency')}
              </span>
            </div>

            {/* Description (optional: show nothing if empty) */}
            {description && (
              <p className="font-baloo font-normal text-[#FFF4DC]/90 text-sm sm:text-base leading-relaxed mt-3 max-w-xl">
                {description}
              </p>
            )}

            {/* 4. Plats similaires / Similar dishes with multi-selection */}
            {similarDishes.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#F2C21B]/20 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-baloo font-bold text-base sm:text-lg text-white tracking-wide">
                    {t('similarDishes')}
                  </h3>
                  <span className="text-[11px] font-baloo text-[#F2C21B]/80 font-semibold">
                    Touchez + pour ajouter
                  </span>
                </div>

                {/* Horizontal scrolling row with scroll-snap and min-width: 0 */}
                <div
                  className="w-full flex gap-3 overflow-x-auto min-w-0 no-scrollbar pb-2"
                  style={{
                    scrollSnapType: 'x mandatory',
                    touchAction: 'pan-x pan-y',
                    overscrollBehaviorX: 'contain',
                  }}
                >
                  {similarDishes.map((simDish) => {
                    const simName =
                      lang === 'en' && simDish.nameEn ? simDish.nameEn : simDish.nameFr;
                    const simThumb =
                      simDish.thumbnailUrl ||
                      (simDish.images && simDish.images[0]) ||
                      simDish.imageUrl;
                    const isSelected = selectedAdditionalDishes.some((d) => d.id === simDish.id);
                    const simAlt = `${simName} – ${lang === 'en' ? 'African dish' : 'plat africain'}`;

                    return (
                      <div
                        key={simDish.id}
                        onClick={() => handleSwitchDish(simDish)}
                        className={`flex-[0_0_145px] sm:flex-[0_0_165px] min-w-[145px] sm:min-w-[165px] rounded-[20px] p-2.5 flex flex-col justify-between shadow-md active-press transition-all select-none cursor-pointer border ${
                          isSelected
                            ? 'bg-[#350710] border-[#F2C21B] ring-2 ring-[#F2C21B]/40 shadow-[#F2C21B]/20'
                            : 'bg-[#2A050D] border-[#F2C21B]/30 hover-gold-glow'
                        }`}
                        style={{ scrollSnapAlign: 'start' }}
                      >
                        {/* Cover thumbnail */}
                        <div className="relative w-full aspect-[4/3] rounded-[14px] overflow-hidden bg-gradient-to-br from-[#5A0E1A] to-[#250409] flex items-center justify-center border border-[#F2C21B]/15">
                          {simThumb ? (
                            <img
                              src={simThumb}
                              alt={simAlt}
                              width={165}
                              height={124}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <ClocheLineIcon className="w-7 h-7 text-white/80" />
                          )}
                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-[10px] px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>{t('added')}</span>
                            </span>
                          )}
                        </div>

                        {/* Name */}
                        <h3 className="font-baloo font-bold text-xs text-white line-clamp-2 mt-2 leading-tight min-h-[2rem]">
                          {simName}
                        </h3>

                        {/* Price & Add button */}
                        <div className="flex items-center justify-between mt-2 pt-1">
                          <span className="font-baloo font-extrabold text-[#F2C21B] text-xs sm:text-sm tabular-nums">
                            {simDish.price} {t('currency')}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelectSimilarDish(simDish);
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center shadow active-press focus:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#F2C21B] text-[#3B0710] ring-2 ring-white/50 scale-105'
                                : 'bg-[#F2C21B] text-[#3B0710] hover:bg-[#ffcf33]'
                            }`}
                            aria-label={
                              isSelected
                                ? `${t('remove')} ${simName}`
                                : `${t('addToOrder')} ${simName}`
                            }
                            title={
                              isSelected
                                ? `${t('remove')} ${simName}`
                                : `${t('addToOrder')} ${simName}`
                            }
                          >
                            {isSelected ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : (
                              <Plus className="w-4 h-4 stroke-[2.8]" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. STICKY BOTTOM ACTION BAR (safe-area aware, burgundy with thin golden top border) */}
      <aside
        aria-label="Actions du plat"
        className="sticky bottom-0 left-0 right-0 z-30 bg-[#3B0710] border-t border-[#F2C21B]/35 shadow-2xl px-4 pt-3 flex flex-col items-center justify-center"
        style={{
          paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="max-w-2xl w-full flex flex-col gap-2">
          {/* Multi-selection live summary row */}
          {selectedAdditionalDishes.length > 0 && (
            <div className="flex items-center justify-between text-xs font-baloo px-1 text-[#FFF4DC]/90 animate-fade-in pb-1.5 border-b border-[#F2C21B]/20">
              <div className="flex items-center gap-1.5 overflow-hidden pr-2">
                <span className="font-bold text-[#F2C21B] shrink-0">
                  {allSelectedDishes.length} {t('dishesSelected')} :
                </span>
                <span className="truncate text-white/80">
                  {allSelectedDishes
                    .map((d) => (lang === 'en' && d.nameEn ? d.nameEn : d.nameFr))
                    .join(' + ')}
                </span>
              </div>
              <span className="font-extrabold text-[#F2C21B] shrink-0 tabular-nums text-sm">
                {totalPrice} {t('currency')}
              </span>
            </div>
          )}

          <div className="w-full flex items-center gap-3">
            {/* Left: Round "Appeler / Call" button */}
            <a
              href={`tel:${settings.phone}`}
              className="w-12 h-12 rounded-full border border-[#F2C21B]/50 bg-[#250409] text-[#F2C21B] flex items-center justify-center shrink-0 shadow-md active-press hover-gold-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21B]"
              aria-label={`${t('headerCall')}: ${settings.phone}`}
              title={t('headerCall')}
            >
              <Phone className="w-5 h-5 fill-current" />
            </a>

            {/* Right: Large yellow rounded button: Commander · {totalPrice} AED */}
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-h-[48px] px-6 rounded-full bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-sm sm:text-base tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg active-press hover:bg-[#ffcf33] focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-5 h-5 fill-current shrink-0" strokeWidth={1.8} />
              <span>
                {t('orderWithPrice')} {allSelectedDishes.length > 1 ? `(${allSelectedDishes.length})` : ''} · {totalPrice} {t('currency')}
              </span>
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
};
