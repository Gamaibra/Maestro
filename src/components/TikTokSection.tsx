import React, { useState } from 'react';
import { ExternalLink, Play, X, UserPlus } from 'lucide-react';
import { useApp, TikTokVideoItem } from '../context/AppContext';

export const TikTokSection: React.FC = () => {
  const { tiktokVideos, settings } = useApp();
  const [activeVideo, setActiveVideo] = useState<TikTokVideoItem | null>(null);

  if (!tiktokVideos || tiktokVideos.length === 0) {
    return null;
  }

  return (
    <section id="tiktok" className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-16 select-none">
      {/* Section Header with Follow Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="text-center sm:text-left">
          <div className="flex items-baseline justify-center sm:justify-start gap-2">
            <span className="font-baloo font-bold text-white text-xs sm:text-sm tracking-[0.25em] uppercase">
              RETROUVEZ-NOUS SUR
            </span>
            <h2 className="font-script text-[#F2C21B] text-4xl sm:text-5xl leading-tight drop-shadow-[0_2px_8px_rgba(242,194,27,0.35)]">
              TikTok
            </h2>
          </div>
          <p className="font-baloo text-xs sm:text-sm text-[#FFF4DC]/80 mt-1 max-w-md">
            Plongez au cœur de nos cuisines et découvrez nos plats en vidéo.
          </p>
        </div>

        {/* Follow Button opening profile link */}
        <a
          href={settings.tiktokProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-5 py-2 rounded-full bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 active-press shadow-md hover:bg-[#ffcf33] shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Suivre @madame_dafe</span>
        </a>
      </div>

      {/* Videos Row: horizontal scroll on mobile, responsive grid on tablet/desktop */}
      <div
        className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-3.5 overflow-x-auto min-w-0 no-scrollbar pb-3"
        style={{
          scrollSnapType: 'x mandatory',
          touchAction: 'pan-x pan-y',
          overscrollBehaviorX: 'contain',
        }}
      >
        {tiktokVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="flex-[0_0_160px] sm:flex-[0_0_190px] md:flex-initial aspect-[9/16] rounded-[24px] overflow-hidden bg-[#250409] border border-[#F2C21B]/35 shadow-xl relative group active-press hover-gold-glow flex flex-col justify-end p-3 transition-transform cursor-pointer select-none"
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* Background Cover or gradient */}
            {video.coverUrl ? (
              <img
                src={video.coverUrl}
                alt={video.caption || 'Vidéo TikTok Chez le Maestro'}
                width={190}
                height={338}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#3B0710]/80 to-[#14134F]/90 flex items-center justify-center">
                <Play className="w-10 h-10 text-[#F2C21B]/80 fill-current opacity-80 group-hover:scale-110 transition-transform" />
              </div>
            )}

            {/* Gradient Scrim for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Top Badge: TikTok Icon */}
            <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full bg-black/60 border border-[#F2C21B]/40 flex items-center justify-center text-[#F2C21B]">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </div>

            {/* Bottom Caption */}
            <div className="relative z-10">
              <p className="font-baloo font-bold text-xs text-white line-clamp-2 leading-snug drop-shadow">
                {video.caption || `Vidéo #${video.videoId}`}
              </p>
              <div className="flex items-center gap-1 text-[10px] font-baloo text-[#F2C21B] font-bold mt-1">
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Regarder</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Player Modal (Loaded ONLY after tap, zero third-party scripts before tap) */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm"
        >
          {/* Backdrop click to close */}
          <div className="fixed inset-0" onClick={() => setActiveVideo(null)} aria-hidden="true" />

          <div className="relative z-10 w-full max-w-sm rounded-[28px] bg-[#250409] border border-[#F2C21B]/40 p-4 shadow-2xl flex flex-col items-center animate-fade-in-up">
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-2.5 border-b border-[#F2C21B]/20 mb-3">
              <p className="font-baloo font-extrabold text-sm text-white truncate max-w-[220px]">
                {activeVideo.caption || `TikTok #${activeVideo.videoId}`}
              </p>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="w-9 h-9 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center active-press cursor-pointer hover:text-[#F2C21B]"
                aria-label="Fermer la vidéo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TikTok Embed Player iframe (loaded on-demand only after tap) */}
            <div className="w-full aspect-[9/16] max-h-[65vh] rounded-[22px] overflow-hidden bg-black border border-[#F2C21B]/30 shadow-inner">
              <iframe
                src={`https://www.tiktok.com/embed/v2/${activeVideo.videoId}?lang=fr-FR`}
                title={activeVideo.caption || 'Vidéo TikTok Chez le Maestro'}
                className="w-full h-full border-0"
                allow="encrypted-media;"
                loading="eager"
              />
            </div>

            {/* Open on TikTok link */}
            <div className="w-full mt-3 flex items-center justify-between">
              <a
                href={activeVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-baloo font-bold text-[#F2C21B] hover:underline flex items-center gap-1"
              >
                <span>Ouvrir sur TikTok</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="min-h-[38px] px-4 rounded-full bg-black/40 border border-white/20 text-[#FFF4DC] font-baloo font-bold text-xs active-press cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
