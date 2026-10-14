import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, { fr: string; en: string }> = {
  // Header
  headerCall: { fr: 'Appeler', en: 'Call' },
  
  // Hero
  heroSlogan: {
    fr: 'Le goût authentique de l’Afrique. Une bouchée à la fois.',
    en: 'Authentic African Taste. One Bite at a Time!',
  },
  heroViewMenu: { fr: 'Voir le menu', en: 'View Menu' },
  heroCall: { fr: 'Appeler', en: 'Call Us' },
  heroLocation: { fr: 'Green Sea Plaza Restaurant · M - Floor', en: 'Green Sea Plaza Restaurant · M - Floor' },
  
  // Menu Section
  menuSectionKicker: { fr: 'NOTRE', en: 'OUR' },
  menuSectionTitle: { fr: 'Menu', en: 'Menu' },
  tabMenu: { fr: 'Menu', en: 'Menu' },
  tabDrinks: { fr: 'Boissons', en: 'Drinks' },
  orderButton: { fr: 'Commander', en: 'Order' },
  currency: { fr: 'AED', en: 'AED' },
  
  // Location Section
  locationSectionKicker: { fr: 'OÙ NOUS', en: 'WHERE TO' },
  locationSectionTitle: { fr: 'Trouver', en: 'Find Us' },
  locationName: { fr: 'Green Sea Plaza Restaurant', en: 'Green Sea Plaza Restaurant' },
  locationFloor: { fr: 'M - Floor', en: 'M - Floor' },
  directionsBtn: { fr: 'Itinéraire', en: 'Directions' },
  callBtn: { fr: 'Appeler', en: 'Call' },
  whatsappBtn: { fr: 'WhatsApp', en: 'WhatsApp' },
  openingHours: { fr: 'Tous les jours : 11h30 – 01h30', en: 'Open Daily: 11:30 AM – 01:30 AM' },
  
  // Footer
  tiktokHandle: { fr: 'TikTok @madame_dafe', en: 'TikTok @madame_dafe' },
  copyright: { fr: 'Chez le Maestro. Tous droits réservés.', en: 'Chez le Maestro. All rights reserved.' },
  
  // Floating button
  floatingCall: { fr: 'Appeler', en: 'Call' },

  // Dish Page
  similarDishes: { fr: 'Plats similaires', en: 'Similar dishes' },
  backButtonAria: { fr: 'Retour au menu', en: 'Back to menu' },
  prevImage: { fr: 'Image précédente', en: 'Previous image' },
  nextImage: { fr: 'Image suivante', en: 'Next image' },
  addToOrder: { fr: 'Ajouter à la commande', en: 'Add to order' },
  orderWithPrice: { fr: 'Commander', en: 'Order' },
  dishesSelected: { fr: 'plats sélectionnés', en: 'dishes selected' },
  remove: { fr: 'Retirer', en: 'Remove' },
  added: { fr: 'Ajouté', en: 'Added' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('chezlemaestro_lang');
      if (stored === 'en' || stored === 'fr') return stored;
    } catch {
      // ignore
    }
    return 'fr';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('chezlemaestro_lang', newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return item[lang] || item.fr || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
