/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { TikTokSection } from './components/TikTokSection';
import { LocationSection } from './components/LocationSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { FloatingCallButton } from './components/FloatingCallButton';
import { DishDetailModal } from './components/DishDetailModal';
import { MenuItem } from './data/menu';

// Speed optimization: Lazy-load admin area as a separate chunk
const AdminLogin = lazy(() =>
  import('./components/admin/AdminLogin').then((mod) => ({ default: mod.AdminLogin }))
);
const AdminDashboard = lazy(() =>
  import('./components/admin/AdminDashboard').then((mod) => ({ default: mod.AdminDashboard }))
);

function MainRouter() {
  const { isAdminRoute, isAuthenticated, dishes } = useApp();
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  // Check if current route is unknown (neither home nor admin)
  const isUnknownRoute =
    !isAdminRoute &&
    window.location.pathname !== '/' &&
    window.location.pathname !== '' &&
    !window.location.hash.startsWith('#');

  // Dynamic meta robots based on active route
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
    }

    if (isAdminRoute) {
      robotsMeta.content = 'noindex, nofollow';
    } else if (isUnknownRoute) {
      robotsMeta.content = 'noindex';
    } else {
      robotsMeta.content = 'index, follow, max-image-preview:large, max-snippet:-1';
    }
  }, [isAdminRoute, isUnknownRoute]);

  // Check URL hash on initial load for deep links (e.g. #dish-xyz)
  useEffect(() => {
    if (isAdminRoute) return;
    const hash = window.location.hash;
    if (hash.startsWith('#dish-')) {
      const dishId = hash.replace('#dish-', '');
      const matched = dishes.find((d) => d.id === dishId);
      if (matched) {
        setSelectedDish(matched);
      }
    }
  }, [isAdminRoute, dishes]);

  // Dynamic Menu JSON-LD Structured Data
  useEffect(() => {
    if (!dishes || dishes.length === 0) return;

    const validDishes = dishes.filter(
      (d) => d.nameFr && typeof d.price === 'number' && !isNaN(d.price)
    );
    if (validDishes.length === 0) return;

    const menuSections: any[] = [];

    // Category: Menu (Plats)
    const plats = validDishes.filter((d) => d.category !== 'boissons');
    if (plats.length > 0) {
      menuSections.push({
        '@type': 'MenuSection',
        name: 'Menu',
        hasMenuItem: plats.map((dish) => {
          const item: any = {
            '@type': 'MenuItem',
            name: dish.nameFr,
            offers: {
              '@type': 'Offer',
              price: dish.price,
              priceCurrency: 'AED',
            },
          };
          if (dish.descriptionFr) {
            item.description = dish.descriptionFr;
          }
          return item;
        }),
      });
    }

    // Category: Boissons (Drinks)
    const boissons = validDishes.filter((d) => d.category === 'boissons');
    if (boissons.length > 0) {
      menuSections.push({
        '@type': 'MenuSection',
        name: 'Boissons',
        hasMenuItem: boissons.map((dish) => {
          const item: any = {
            '@type': 'MenuItem',
            name: dish.nameFr,
            offers: {
              '@type': 'Offer',
              price: dish.price,
              priceCurrency: 'AED',
            },
          };
          if (dish.descriptionFr) {
            item.description = dish.descriptionFr;
          }
          return item;
        }),
      });
    }

    const menuJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Menu',
      '@id': 'https://chez-maestro.com/#menu-data',
      name: 'Menu Chez le Maestro',
      inLanguage: ['fr', 'en'],
      hasMenuSection: menuSections,
    };

    let scriptEl = document.getElementById('menu-jsonld') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'menu-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(menuJsonLd);
  }, [dishes]);

  const handleCloseDish = () => {
    setSelectedDish(null);
    if (window.location.hash.startsWith('#dish-')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  // Unknown route friendly 404
  if (isUnknownRoute) {
    return (
      <div className="min-h-screen bg-marble-texture bg-[#3B0710] text-[#FFF4DC] flex flex-col items-center justify-center p-6 text-center font-baloo">
        <div className="w-16 h-16 rounded-full bg-[#250409] border border-[#F2C21B]/40 text-[#F2C21B] flex items-center justify-center mb-4 text-2xl font-extrabold shadow-lg">
          404
        </div>
        <h1 className="font-baloo font-extrabold text-2xl sm:text-3xl text-white mb-2">
          Page introuvable
        </h1>
        <p className="text-[#FFF4DC]/80 text-sm sm:text-base max-w-md mb-6">
          Oups ! La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <a
          href="/"
          className="min-h-[48px] px-6 py-2.5 rounded-full bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center shadow-lg active-press hover:bg-[#ffcf33] cursor-pointer"
        >
          Retour à l'accueil
        </a>
      </div>
    );
  }

  // If on /admin route: Lazy loaded separate chunk
  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#3B0710]" />}>
        {!isAuthenticated ? <AdminLogin /> : <AdminDashboard />}
      </Suspense>
    );
  }

  // Public Restaurant Site
  return (
    <div className="min-h-screen bg-marble-texture text-[#FFF4DC] flex flex-col font-baloo relative selection:bg-[#F2C21B] selection:text-[#3B0710]">
      {/* Fixed Header */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Section 1: Accueil / Hero */}
        <Hero />

        {/* Section 2: Notre Menu */}
        <MenuSection onSelectDish={(dish) => setSelectedDish(dish)} />

        {/* Optional Section: TikTok Showcase (rendered if videos exist) */}
        <TikTokSection />

        {/* Section 3: Où Nous Trouver (Navy background with diagonal cut) */}
        <LocationSection />

        {/* Section 4: À propos de Chez le Maestro (Discreet local text) */}
        <AboutSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Floating Quick Call Button */}
      <FloatingCallButton />

      {/* Full-Screen Sliding Dish Detail Page */}
      <DishDetailModal
        dish={selectedDish}
        onClose={handleCloseDish}
        onSelectDish={(dish) => setSelectedDish(dish)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <LanguageProvider>
        <MainRouter />
      </LanguageProvider>
    </AppProvider>
  );
}
