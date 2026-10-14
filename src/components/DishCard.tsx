import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { MenuItem } from '../data/menu';
import { ClocheLineIcon } from './Logo';
import { useLanguage } from '../context/LanguageContext';

interface DishCardProps {
  item: MenuItem;
  index?: number;
  onSelect?: (item: MenuItem) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ item, index = 0, onSelect }) => {
  const { lang, t } = useLanguage();

  const displayName = lang === 'en' && item.nameEn ? item.nameEn : item.nameFr;
  const coverImage = item.thumbnailUrl || (item.images && item.images.length > 0 ? item.images[0] : item.imageUrl);
  const altText = `${displayName} – ${lang === 'en' ? 'African dish' : 'plat africain'}`;

  const handleOpenDish = () => {
    onSelect?.(item);
  };

  return (
    <div
      onClick={handleOpenDish}
      className="bg-[#2D050D]/85 border border-[#F2C21B]/30 rounded-[22px] sm:rounded-[26px] p-2.5 sm:p-3.5 flex flex-col justify-between shadow-lg hover-gold-glow transition-all duration-200 active-press select-none cursor-pointer"
    >
      {/* 4:3 Cover Image or SVG Cloche Fallback */}
      <div className="relative w-full aspect-[4/3] rounded-[18px] sm:rounded-[20px] overflow-hidden bg-gradient-to-br from-[#5A0E1A] to-[#250409] flex items-center justify-center border border-[#F2C21B]/20 shadow-inner">
        {coverImage ? (
          <img
            src={coverImage}
            alt={altText}
            width={300}
            height={225}
            className="w-full h-full object-cover pointer-events-none"
            loading={index < 4 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center" aria-hidden="true">
            <ClocheLineIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white/90 drop-shadow-md" />
          </div>
        )}
      </div>

      {/* Dish Name (max 2 lines, ~15px, white, bold) */}
      <div className="mt-2.5 mb-1 px-0.5 text-center">
        <h3
          className="text-[13px] sm:text-[15px] font-baloo font-bold text-white leading-snug line-clamp-2 min-h-[2.3rem] sm:min-h-[2.6rem] flex items-center justify-center hover:text-[#F2C21B] transition-colors"
          title={displayName}
        >
          {displayName}
        </h3>
      </div>

      {/* Price in AED (yellow, bold, tabular numbers) */}
      <div className="text-center my-0.5">
        <span className="text-[#F2C21B] font-baloo font-extrabold text-base sm:text-lg tabular-nums tracking-wide">
          {item.price} {t('currency')}
        </span>
      </div>

      {/* Compact Rounded Yellow "Commander" Button (min 44px height, burgundy text, bag icon) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(item);
        }}
        className="w-full min-h-[44px] h-[44px] rounded-full bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md active-press transition-colors hover:bg-[#ffcf33] focus:outline-none focus-visible:ring-2 focus-visible:ring-white mt-1 cursor-pointer"
        aria-label={`${t('orderButton')} ${displayName}`}
      >
        <ShoppingBag className="w-4 h-4 shrink-0 fill-current" strokeWidth={1.8} />
        <span>{t('orderButton')}</span>
      </button>
    </div>
  );
};
