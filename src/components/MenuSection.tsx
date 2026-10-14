import React, { useState } from 'react';
import { CATEGORIES, MenuItem } from '../data/menu';
import { DishCard } from './DishCard';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

interface MenuSectionProps {
  onSelectDish?: (dish: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectDish }) => {
  const { lang, t } = useLanguage();
  const { dishes } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'menu' | 'boissons'>('menu');

  // Filter categories that actually have dishes
  const categoriesWithItems = CATEGORIES.filter((cat) =>
    dishes.some((item) => item.category === cat.id)
  );

  // An individual tab is hidden if its category has no dishes.
  // Both tabs are hidden if there is only 1 category remaining.
  const showCategoryTabs = categoriesWithItems.length > 1;

  // Filter dishes by current active category (fallback to first available category if current has no items)
  const activeCategoryId = categoriesWithItems.some((c) => c.id === selectedCategory)
    ? selectedCategory
    : categoriesWithItems[0]?.id || 'menu';

  const visibleDishes = dishes.filter((item) => item.category === activeCategoryId);

  return (
    <section id="menu" className="py-14 sm:py-20 px-3 sm:px-6 max-w-6xl mx-auto scroll-mt-16">
      {/* Section Header: small white caps + large yellow cursive */}
      <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-10">
        <div className="flex items-baseline justify-center gap-2">
          <span className="font-baloo font-bold text-white text-xs sm:text-sm tracking-[0.25em] uppercase">
            {t('menuSectionKicker')}
          </span>
          <h2 className="font-script text-[#F2C21B] text-4xl sm:text-5xl md:text-6xl leading-tight drop-shadow-[0_2px_8px_rgba(242,194,27,0.35)]">
            {t('menuSectionTitle')}
          </h2>
        </div>

        {/* Category Tabs (pill shape, hidden if only 1 category has dishes) */}
        {showCategoryTabs && (
          <div className="flex items-center justify-center gap-3 mt-6" role="tablist">
            {categoriesWithItems.map((cat) => {
              const isSelected = activeCategoryId === cat.id;
              const label = lang === 'en' ? cat.labelEn : cat.labelFr;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`min-h-[44px] px-6 py-2 rounded-full font-baloo font-extrabold text-sm sm:text-base tracking-wide transition-all duration-200 active-press cursor-pointer ${
                    isSelected
                      ? 'bg-[#F2C21B] text-[#3B0710] shadow-md shadow-[#F2C21B]/20'
                      : 'border-2 border-[#F2C21B] text-[#F2C21B] hover:bg-[#F2C21B]/10'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Dishes Grid: exactly 2 cols on mobile (>=320px), 3 cols on tablet, 4 cols on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
        {visibleDishes.map((dish, idx) => (
          <DishCard key={dish.id} item={dish} index={idx} onSelect={onSelectDish} />
        ))}
      </div>
    </section>
  );
};
