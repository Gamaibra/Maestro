import React, { useState, useRef } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, AlertTriangle, Upload, Check, Video } from 'lucide-react';
import { useApp, TikTokVideoItem } from '../../context/AppContext';
import { compressImage } from '../../utils/imageCompressor';

export const TikTokTab: React.FC = () => {
  const {
    tiktokVideos,
    addTikTokVideo,
    deleteTikTokVideo,
    moveTikTokVideo,
    settings,
    updateSettings,
  } = useApp();

  // Profile link state
  const [profileUrl, setProfileUrl] = useState(settings.tiktokProfileUrl);
  const [profileSaved, setProfileSaved] = useState(false);

  // Add video modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [isProcessingCover, setIsProcessingCover] = useState(false);

  // Video deletion confirm state
  const [videoToDelete, setVideoToDelete] = useState<TikTokVideoItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ tiktokProfileUrl: profileUrl.trim() });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleCoverUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if (!file.type.startsWith('image/')) return;

    setIsProcessingCover(true);
    try {
      // Cropped to 9:16 (360x640), WebP under 60 KB
      const cropped = await compressImage(file, {
        targetWidth: 360,
        targetHeight: 640,
        crop: 'cover',
        quality: 0.65,
        format: 'image/webp',
      });
      setCoverUrl(cropped);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingCover(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setWarningMessage('');

    const cleanUrl = videoUrl.trim();
    if (!cleanUrl) {
      setWarningMessage('Veuillez coller le lien de la vidéo TikTok.');
      return;
    }

    // Check if short link (e.g. vm.tiktok.com or tiktok.com/t/...)
    if (/vm\.tiktok\.com/i.test(cleanUrl) || /tiktok\.com\/t\//i.test(cleanUrl)) {
      setWarningMessage(
        'Collez le lien complet de la vidéo (celui qui contient /video/) / Paste the full video link (the one containing /video/)'
      );
      return;
    }

    // Must contain /video/ followed by digits
    const match = cleanUrl.match(/\/video\/(\d+)/);
    if (!match || !match[1]) {
      setWarningMessage(
        'Collez le lien complet de la vidéo (celui qui contient /video/) / Paste the full video link (the one containing /video/)'
      );
      return;
    }

    const videoId = match[1];
    const success = await addTikTokVideo({
      url: cleanUrl,
      videoId,
      caption: caption.trim() || undefined,
      coverUrl: coverUrl || undefined,
    });

    if (success) {
      setVideoUrl('');
      setCaption('');
      setCoverUrl(null);
      setWarningMessage('');
      setIsAddOpen(false);
    } else {
      setWarningMessage('Maximum 6 vidéos autorisées.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Profile Link Card */}
      <div className="bg-[#250409]/90 border border-[#F2C21B]/35 rounded-[26px] p-5 shadow-lg">
        <h2 className="font-baloo font-extrabold text-base text-white mb-2">
          Lien du profil TikTok
        </h2>
        <form onSubmit={handleSaveProfile} className="space-y-3">
          <input
            type="url"
            required
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@madame_dafe..."
            className="w-full min-h-[48px] px-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white text-sm font-baloo focus:outline-none focus:border-[#F2C21B]"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-baloo text-[#FFF4DC]/60">
              Affiché dans le pied de page du site
            </span>
            <button
              type="submit"
              className="min-h-[44px] px-5 rounded-full bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-xs uppercase tracking-wide active-press cursor-pointer flex items-center gap-1.5 shadow"
            >
              {profileSaved ? <Check className="w-4 h-4" /> : null}
              <span>{profileSaved ? 'Enregistré' : 'Enregistrer'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. TikTok Videos List Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="font-baloo font-extrabold text-lg text-white">
            Vidéos TikTok ({tiktokVideos.length}/6)
          </h2>
          <p className="font-baloo text-xs text-[#FFF4DC]/70">
            Mises en avant sur le site public
          </p>
        </div>

        {tiktokVideos.length < 6 && (
          <button
            type="button"
            onClick={() => {
              setWarningMessage('');
              setIsAddOpen(true);
            }}
            className="min-h-[44px] px-4 rounded-full bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-xs uppercase tracking-wide flex items-center gap-1.5 active-press cursor-pointer shadow hover:bg-[#ffcf33]"
          >
            <Plus className="w-4 h-4 stroke-[2.8]" />
            <span>Ajouter une vidéo</span>
          </button>
        )}
      </div>

      {/* Videos List */}
      {tiktokVideos.length === 0 ? (
        <div className="p-8 text-center rounded-[24px] bg-[#250409]/60 border border-[#F2C21B]/20">
          <Video className="w-10 h-10 text-[#F2C21B]/40 mx-auto mb-2" />
          <p className="font-baloo font-bold text-base text-white">Aucune vidéo ajoutée</p>
          <p className="font-baloo text-xs text-[#FFF4DC]/60 mt-1 max-w-xs mx-auto">
            Touchez "Ajouter une vidéo" pour coller le lien d'une vidéo TikTok Chez le Maestro.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tiktokVideos.map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#250409]/90 border border-[#F2C21B]/30 rounded-[22px] p-3.5 flex items-center gap-3.5 shadow-md"
            >
              {/* Cover thumbnail 9:16 */}
              <div className="w-16 h-24 rounded-xl overflow-hidden bg-black/60 border border-[#F2C21B]/30 shrink-0 flex items-center justify-center relative">
                {item.coverUrl ? (
                  <img
                    src={item.coverUrl}
                    alt={item.caption || 'TikTok'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Video className="w-6 h-6 text-[#F2C21B]/60" />
                )}
                <span className="absolute bottom-1 right-1 text-[9px] font-baloo font-bold bg-black/70 px-1 rounded text-white">
                  9:16
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-baloo font-bold text-sm text-white truncate">
                  {item.caption || `Vidéo #${item.videoId}`}
                </p>
                <p className="font-baloo text-xs text-[#F2C21B] mt-0.5 truncate">
                  ID: {item.videoId}
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-baloo text-[#FFF4DC]/60 hover:text-white mt-1"
                >
                  <span>Ouvrir sur TikTok</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Reorder and Delete Controls */}
              <div className="flex flex-col gap-1 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveTikTokVideo(item.id, 'up')}
                    className="w-8 h-8 rounded-lg bg-black/40 text-[#FFF4DC] hover:text-[#F2C21B] disabled:opacity-30 flex items-center justify-center active-press cursor-pointer"
                    title="Monter"
                    aria-label="Monter"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === tiktokVideos.length - 1}
                    onClick={() => moveTikTokVideo(item.id, 'down')}
                    className="w-8 h-8 rounded-lg bg-black/40 text-[#FFF4DC] hover:text-[#F2C21B] disabled:opacity-30 flex items-center justify-center active-press cursor-pointer"
                    title="Descendre"
                    aria-label="Descendre"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setVideoToDelete(item)}
                  className="w-full h-8 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300 hover:bg-red-900/60 flex items-center justify-center active-press cursor-pointer mt-0.5"
                  title="Supprimer"
                  aria-label="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Video Modal */}
      {isAddOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
        >
          <div className="relative w-full max-w-md bg-[#2D050D] border border-[#F2C21B]/40 rounded-[28px] p-5 sm:p-7 shadow-2xl text-[#FFF4DC]">
            <h3 className="font-baloo font-extrabold text-xl text-white pb-3 border-b border-[#F2C21B]/20">
              Ajouter une vidéo TikTok
            </h3>

            {/* Warning Message Pill */}
            {warningMessage && (
              <div className="mt-3.5 p-3 rounded-2xl bg-amber-950/80 border border-amber-500/50 flex items-start gap-2.5 text-xs font-baloo text-amber-200">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span className="leading-snug">{warningMessage}</span>
              </div>
            )}

            <form onSubmit={handleAddVideo} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#F2C21B] mb-1">
                  Lien complet de la vidéo TikTok *
                </label>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    setWarningMessage('');
                  }}
                  placeholder="https://www.tiktok.com/@madame_dafe/video/739..."
                  className="w-full min-h-[48px] px-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white placeholder-white/30 text-sm font-baloo focus:outline-none focus:border-[#F2C21B]"
                />
                <p className="text-[11px] font-baloo text-[#FFF4DC]/60 mt-1">
                  Doit contenir <code className="text-[#F2C21B]">/video/</code> suivi de l'identifiant numérique.
                </p>
              </div>

              <div>
                <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#FFF4DC]/80 mb-1">
                  Légende ou titre (Optionnel)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Ex: Préparation de l'Attiéké braisé"
                  className="w-full min-h-[48px] px-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white placeholder-white/30 text-sm font-baloo focus:outline-none focus:border-[#F2C21B]"
                />
              </div>

              {/* Cover Image (upload only, cropped to 9:16) */}
              <div>
                <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#F2C21B] mb-1">
                  Image de couverture 9:16 (Optionnel)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleCoverUpload(e.target.files)}
                />

                {coverUrl ? (
                  <div className="flex items-center gap-3 bg-[#1A0307] p-2 rounded-2xl border border-[#F2C21B]/30">
                    <div className="w-12 h-20 rounded-xl overflow-hidden bg-black/60 shrink-0">
                      <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-xs font-baloo">
                      <p className="text-white font-bold">Image prête (format 9:16)</p>
                      <button
                        type="button"
                        onClick={() => setCoverUrl(null)}
                        className="text-red-400 hover:text-red-300 font-bold mt-1 cursor-pointer"
                      >
                        Supprimer la photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full min-h-[48px] py-3 px-4 rounded-2xl border-2 border-dashed border-[#F2C21B]/40 bg-[#1A0307]/60 hover:bg-[#1A0307] text-[#F2C21B] font-baloo font-bold text-xs flex items-center justify-center gap-2 active-press cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choisir une image sur l'appareil (recadrée auto 9:16)</span>
                  </button>
                )}

                {isProcessingCover && (
                  <p className="text-[11px] font-baloo text-[#F2C21B] animate-pulse mt-1">
                    Recadrage et compression WebP en cours...
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 min-h-[48px] rounded-full border border-white/30 text-white font-baloo font-bold text-sm uppercase active-press cursor-pointer hover:bg-white/10"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isProcessingCover}
                  className="flex-1 min-h-[48px] rounded-full bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-sm uppercase tracking-wide active-press cursor-pointer shadow-lg hover:bg-[#ffcf33]"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {videoToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm bg-[#2D050D] border border-red-500/40 rounded-[26px] p-6 text-center text-[#FFF4DC] shadow-2xl">
            <h3 className="font-baloo font-extrabold text-lg text-white">
              Supprimer cette vidéo ?
            </h3>
            <p className="font-baloo text-xs text-[#FFF4DC]/70 mt-1">
              La vidéo sera retirée de la sélection TikTok du site.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={() => setVideoToDelete(null)}
                className="min-h-[48px] rounded-full border border-white/30 text-white font-baloo font-bold text-sm active-press cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteTikTokVideo(videoToDelete.id);
                  setVideoToDelete(null);
                }}
                className="min-h-[48px] rounded-full bg-red-600 text-white font-baloo font-extrabold text-sm active-press cursor-pointer shadow-lg hover:bg-red-500"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
