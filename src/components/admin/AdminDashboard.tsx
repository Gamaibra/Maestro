import React, { useState } from 'react';
import { ArrowLeft, Utensils, Video, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DishesTab } from './DishesTab';
import { TikTokTab } from './TikTokTab';
import { SettingsTab } from './SettingsTab';
import { Wordmark } from '../Logo';

type ActiveTab = 'dishes' | 'tiktok' | 'settings';

export const AdminDashboard: React.FC = () => {
  const { setIsAdminRoute, logout } = useApp();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dishes');

  return (
    <div className="min-h-screen bg-marble-texture bg-[#3B0710] text-[#FFF4DC] flex flex-col font-baloo">
      {/* Fixed/Sticky Top Bar */}
      <header className="sticky top-0 z-40 bg-[#3B0710]/95 border-b border-[#F2C21B]/30 px-3.5 sm:px-6 py-3 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          {/* Logo / Title */}
          <div className="flex items-center gap-2">
            <Wordmark className="scale-95" />
            <span className="bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase">
              Admin
            </span>
          </div>

          {/* Action buttons: Voir le site + Logout */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAdminRoute(false)}
              className="min-h-[44px] px-3.5 rounded-full bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-xs uppercase flex items-center gap-1.5 shadow active-press hover:bg-[#ffcf33] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voir le site</span>
            </button>

            <button
              type="button"
              onClick={logout}
              title="Déconnexion"
              aria-label="Déconnexion"
              className="w-11 h-11 rounded-full bg-black/40 border border-[#F2C21B]/30 text-[#FFF4DC] hover:text-red-400 flex items-center justify-center active-press cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3.5 sm:px-6 pt-5">
        {/* Three Big Rounded Tabs (min 48px height) */}
        <div
          role="tablist"
          className="grid grid-cols-3 gap-2 p-1.5 rounded-[24px] bg-[#250409]/95 border border-[#F2C21B]/35 shadow-lg mb-6"
        >
          {/* Tab 1: Plats / Dishes */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'dishes'}
            onClick={() => setActiveTab('dishes')}
            className={`min-h-[48px] px-2 py-2 rounded-[18px] font-baloo font-extrabold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 transition-all active-press cursor-pointer ${
              activeTab === 'dishes'
                ? 'bg-[#F2C21B] text-[#3B0710] shadow-md'
                : 'text-[#FFF4DC]/80 hover:text-white'
            }`}
          >
            <Utensils className="w-4 h-4 shrink-0" />
            <span>Plats</span>
          </button>

          {/* Tab 2: TikTok */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tiktok'}
            onClick={() => setActiveTab('tiktok')}
            className={`min-h-[48px] px-2 py-2 rounded-[18px] font-baloo font-extrabold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 transition-all active-press cursor-pointer ${
              activeTab === 'tiktok'
                ? 'bg-[#F2C21B] text-[#3B0710] shadow-md'
                : 'text-[#FFF4DC]/80 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 shrink-0" />
            <span>TikTok</span>
          </button>

          {/* Tab 3: Réglages / Settings */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            className={`min-h-[48px] px-2 py-2 rounded-[18px] font-baloo font-extrabold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 transition-all active-press cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#F2C21B] text-[#3B0710] shadow-md'
                : 'text-[#FFF4DC]/80 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-4 h-4 shrink-0" />
            <span>Réglages</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'dishes' && <DishesTab />}
        {activeTab === 'tiktok' && <TikTokTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};
