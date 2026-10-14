import React, { useState, useRef } from 'react';
import { Upload, RotateCcw, Check, KeyRound, MapPin, Phone, MessageSquare, Clock, Type, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../Logo';
import { compressImage } from '../../utils/imageCompressor';

export const SettingsTab: React.FC = () => {
  const { settings, updateSettings, restoreDefaultLogo } = useApp();

  // General fields local state
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [venueName, setVenueName] = useState(settings.venueName);
  const [venueFloor, setVenueFloor] = useState(settings.venueFloor);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(settings.googleMapsUrl);
  const [openingHoursFr, setOpeningHoursFr] = useState(settings.openingHoursFr);
  const [openingHoursEn, setOpeningHoursEn] = useState(settings.openingHoursEn);
  const [taglineFr, setTaglineFr] = useState(settings.taglineFr);
  const [taglineEn, setTaglineEn] = useState(settings.taglineEn);

  // Logo upload state
  const [tempLogo, setTempLogo] = useState<string | null>(null);
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Location photo upload state
  const [tempLocationPhoto, setTempLocationPhoto] = useState<string | null>(settings.locationPhotoUrl);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // PIN change state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Notification states
  const [savedGeneral, setSavedGeneral] = useState(false);
  const [savedLogoMsg, setSavedLogoMsg] = useState<string | null>(null);

  // Handle Logo Upload (keep transparency, max 1024px PNG)
  const handleLogoFile = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if (!file.type.startsWith('image/')) return;

    setIsProcessingLogo(true);
    try {
      const compressed = await compressImage(file, {
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.88,
        format: 'image/png', // Keeps alpha transparency
      });
      setTempLogo(compressed);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingLogo(false);
    }
  };

  const handleSaveLogo = () => {
    if (tempLogo) {
      updateSettings({ logoUrl: tempLogo });
      setTempLogo(null);
      setSavedLogoMsg('Nouveau logo enregistré avec succès.');
      setTimeout(() => setSavedLogoMsg(null), 3000);
    }
  };

  const handleRestoreLogo = () => {
    restoreDefaultLogo();
    setTempLogo(null);
    setSavedLogoMsg('Logo d’origine restauré.');
    setTimeout(() => setSavedLogoMsg(null), 3000);
  };

  // Handle Location Photo Upload (max 800px WebP)
  const handleLocationPhotoFile = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if (!file.type.startsWith('image/')) return;

    setIsProcessingPhoto(true);
    try {
      const compressed = await compressImage(file, {
        maxWidth: 800,
        quality: 0.65,
        format: 'image/webp',
      });
      setTempLocationPhoto(compressed);
      updateSettings({ locationPhotoUrl: compressed });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleRemoveLocationPhoto = () => {
    setTempLocationPhoto(null);
    updateSettings({ locationPhotoUrl: null });
  };

  // Handle General Settings Save
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      venueName: venueName.trim(),
      venueFloor: venueFloor.trim(),
      googleMapsUrl: googleMapsUrl.trim(),
      openingHoursFr: openingHoursFr.trim(),
      openingHoursEn: openingHoursEn.trim(),
      taglineFr: taglineFr.trim(),
      taglineEn: taglineEn.trim(),
    });
    setSavedGeneral(true);
    setTimeout(() => setSavedGeneral(false), 2500);
  };

  // Handle PIN Change
  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    if (!/^\d{6}$/.test(newPin)) {
      setPinError('Le code PIN doit comporter exactement 6 chiffres.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('Les deux codes PIN ne correspondent pas.');
      return;
    }
    updateSettings({ pin: newPin });
    setNewPin('');
    setConfirmPin('');
    setIsPinModalOpen(false);
    setSavedLogoMsg('Code PIN modifié avec succès.');
    setTimeout(() => setSavedLogoMsg(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Toast notification */}
      {savedLogoMsg && (
        <div className="p-4 rounded-2xl bg-[#250409] border border-[#F2C21B] text-white flex items-center gap-2.5 shadow-xl animate-fade-in-up">
          <Check className="w-5 h-5 text-[#F2C21B] shrink-0" />
          <span className="font-baloo font-bold text-sm text-[#FFF4DC]">{savedLogoMsg}</span>
        </div>
      )}

      {/* 1. Logo Card */}
      <div className="bg-[#250409]/90 border border-[#F2C21B]/35 rounded-[28px] p-5 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-baloo font-extrabold text-lg text-white">Logo du Restaurant</h2>
          <span className="text-xs font-baloo text-[#F2C21B] font-bold">Marque officielle</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Current Logo preview */}
          <div className="shrink-0 flex flex-col items-center">
            {tempLogo ? (
              <div className="w-40 h-40 rounded-[28px] border-2 border-[#F2C21B] overflow-hidden bg-black/50 p-2 flex items-center justify-center shadow-lg">
                <img src={tempLogo} alt="Aperçu nouveau logo" className="max-w-full max-h-full object-contain" />
              </div>
            ) : settings.logoUrl ? (
              <div className="w-40 h-40 rounded-[28px] border border-[#F2C21B]/40 overflow-hidden bg-black/50 p-2 flex items-center justify-center shadow-lg">
                <img src={settings.logoUrl} alt="Logo personnalisé" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <Logo size="md" className="scale-90" />
            )}
            <span className="text-[11px] font-baloo text-[#FFF4DC]/60 mt-1.5">
              {tempLogo ? 'Aperçu non enregistré' : settings.logoUrl ? 'Logo personnalisé' : 'Logo original'}
            </span>
          </div>

          {/* Logo Actions */}
          <div className="flex-1 w-full flex flex-col gap-2.5">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleLogoFile(e.target.files)}
            />

            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="min-h-[48px] px-5 rounded-2xl bg-[#F2C21B]/20 border border-[#F2C21B]/50 text-[#F2C21B] font-baloo font-bold text-sm flex items-center justify-center gap-2 active-press cursor-pointer hover:bg-[#F2C21B]/30"
            >
              <Upload className="w-4 h-4" />
              <span>Changer le logo</span>
            </button>

            {tempLogo && (
              <button
                type="button"
                onClick={handleSaveLogo}
                className="min-h-[48px] px-5 rounded-2xl bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-sm uppercase flex items-center justify-center gap-2 active-press cursor-pointer shadow hover:bg-[#ffcf33]"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer le nouveau logo</span>
              </button>
            )}

            {settings.logoUrl && (
              <button
                type="button"
                onClick={handleRestoreLogo}
                className="min-h-[44px] px-4 rounded-2xl bg-black/40 border border-white/20 text-[#FFF4DC]/70 hover:text-white font-baloo font-bold text-xs flex items-center justify-center gap-2 active-press cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Remettre le logo d'origine</span>
              </button>
            )}

            <p className="text-[11px] font-baloo text-[#FFF4DC]/60 mt-1 leading-relaxed">
              Mise à jour instantanée de l'accueil, du pied de page et de l'icône de l'application. Transparence conservée (max 1024px).
            </p>
          </div>
        </div>
      </div>

      {/* 2. Coordonnées & Informations */}
      <form onSubmit={handleSaveGeneral} className="bg-[#250409]/90 border border-[#F2C21B]/35 rounded-[28px] p-5 sm:p-6 shadow-lg space-y-4">
        <h2 className="font-baloo font-extrabold text-lg text-white mb-1">
          Coordonnées & Restaurant
        </h2>

        {/* Téléphone & WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#F2C21B] mb-1">
              Numéro pour Appels
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="971586120042"
                className="w-full min-h-[48px] pl-10 pr-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white font-baloo text-sm focus:outline-none focus:border-[#F2C21B]"
              />
              <Phone className="w-4 h-4 text-[#F2C21B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#F2C21B] mb-1">
              Numéro WhatsApp
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="971586120042"
                className="w-full min-h-[48px] pl-10 pr-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white font-baloo text-sm focus:outline-none focus:border-[#F2C21B]"
              />
              <MessageSquare className="w-4 h-4 text-[#25D366] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Nom du lieu & Étage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#FFF4DC]/80 mb-1">
              Nom du lieu
            </label>
            <input
              type="text"
              required
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder="Green Sea Plaza Restaurant"
              className="w-full min-h-[48px] px-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white font-baloo text-sm focus:outline-none focus:border-[#F2C21B]"
            />
          </div>

          <div>
            <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#FFF4DC]/80 mb-1">
              Étage / Adresse
            </label>
            <input
              type="text"
              required
              value={venueFloor}
              onChange={(e) => setVenueFloor(e.target.value)}
              placeholder="M - Floor"
              className="w-full min-h-[48px] px-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white font-baloo text-sm focus:outline-none focus:border-[#F2C21B]"
            />
          </div>
        </div>

        {/* Lien Google Maps */}
        <div>
          <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#F2C21B] mb-1">
            Lien Google Maps (Itinéraire)
          </label>
          <div className="relative">
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full min-h-[48px] pl-10 pr-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white font-baloo text-sm focus:outline-none focus:border-[#F2C21B]"
            />
            <MapPin className="w-4 h-4 text-[#F2C21B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <p className="text-[11px] font-baloo text-[#FFF4DC]/60 mt-1">
            Si renseigné, remplace l'itinéraire par défaut du bouton "Itinéraire".
          </p>
        </div>

        {/* Horaires d'ouverture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#FFF4DC]/80 mb-1">
              Horaires (FR)
            </label>
            <input
              type="text"
              value={openingHoursFr}
              onChange={(e) => setOpeningHoursFr(e.target.value)}
              placeholder="Tous les jours : 11h30 – 01h30"
              className="w-full min-h-[48px] px-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white font-baloo text-sm focus:outline-none focus:border-[#F2C21B]"
            />
          </div>

          <div>
            <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#FFF4DC]/80 mb-1">
              Horaires (EN)
            </label>
            <input
              type="text"
              value={openingHoursEn}
              onChange={(e) => setOpeningHoursEn(e.target.value)}
              placeholder="Open Daily: 11:30 AM – 01:30 AM"
              className="w-full min-h-[48px] px-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white font-baloo text-sm focus:outline-none focus:border-[#F2C21B]"
            />
          </div>
        </div>

        {/* Slogans FR & EN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#FFF4DC]/80 mb-1">
              Slogan (Français)
            </label>
            <input
              type="text"
              value={taglineFr}
              onChange={(e) => setTaglineFr(e.target.value)}
              className="w-full min-h-[48px] px-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white font-baloo text-sm focus:outline-none focus:border-[#F2C21B]"
            />
          </div>

          <div>
            <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#FFF4DC]/80 mb-1">
              Slogan (Anglais)
            </label>
            <input
              type="text"
              value={taglineEn}
              onChange={(e) => setTaglineEn(e.target.value)}
              className="w-full min-h-[48px] px-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white font-baloo text-sm focus:outline-none focus:border-[#F2C21B]"
            />
          </div>
        </div>

        {/* Photo du lieu (upload only, max 800px, WebP under 120 KB) */}
        <div className="pt-2 border-t border-[#F2C21B]/20">
          <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#F2C21B] mb-1.5">
            Photo du lieu (Optionnel - visible sur la carte localisation)
          </label>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleLocationPhotoFile(e.target.files)}
          />

          {tempLocationPhoto ? (
            <div className="flex items-center gap-3 bg-[#1A0307] p-2.5 rounded-2xl border border-[#F2C21B]/30">
              <div className="w-20 h-16 rounded-xl overflow-hidden bg-black/50 shrink-0">
                <img src={tempLocationPhoto} alt="Lieu" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-xs font-baloo">
                <p className="text-white font-bold">Photo enregistrée</p>
                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="text-[#F2C21B] hover:underline font-bold cursor-pointer"
                  >
                    Remplacer
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveLocationPhoto}
                    className="text-red-400 hover:underline font-bold cursor-pointer"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="w-full min-h-[48px] py-3 px-4 rounded-2xl border-2 border-dashed border-[#F2C21B]/40 bg-[#1A0307]/60 hover:bg-[#1A0307] text-[#F2C21B] font-baloo font-bold text-xs flex items-center justify-center gap-2 active-press cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Téléverser la photo du restaurant (compressée en WebP &lt; 120 KB)</span>
            </button>
          )}

          {isProcessingPhoto && (
            <p className="text-[11px] font-baloo text-[#F2C21B] animate-pulse mt-1">
              Optimisation de la photo en cours...
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            className="w-full min-h-[50px] rounded-full bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 active-press cursor-pointer shadow-lg hover:bg-[#ffcf33]"
          >
            {savedGeneral ? <Check className="w-4 h-4" /> : null}
            <span>{savedGeneral ? 'Modifications enregistrées !' : 'Enregistrer les réglages'}</span>
          </button>
        </div>
      </form>

      {/* 3. Sécurité : Changer le PIN */}
      <div className="bg-[#250409]/90 border border-[#F2C21B]/35 rounded-[28px] p-5 shadow-lg flex items-center justify-between">
        <div>
          <h3 className="font-baloo font-extrabold text-base text-white">Sécurité du compte</h3>
          <p className="font-baloo text-xs text-[#FFF4DC]/70">Code secret actuel à 6 chiffres</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setNewPin('');
            setConfirmPin('');
            setPinError('');
            setIsPinModalOpen(true);
          }}
          className="min-h-[44px] px-4 rounded-full bg-black/40 border border-[#F2C21B]/40 text-[#F2C21B] font-baloo font-bold text-xs uppercase flex items-center gap-1.5 active-press cursor-pointer hover:bg-black/70"
        >
          <KeyRound className="w-4 h-4" />
          <span>Changer le PIN</span>
        </button>
      </div>

      {/* PIN Change Modal */}
      {isPinModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm bg-[#2D050D] border border-[#F2C21B]/40 rounded-[28px] p-6 text-[#FFF4DC] shadow-2xl">
            <h3 className="font-baloo font-extrabold text-lg text-white mb-2">
              Modifier le code PIN
            </h3>
            <p className="font-baloo text-xs text-[#FFF4DC]/70 mb-4">
              Choisissez un nouveau code à 6 chiffres pour accéder à l'administration.
            </p>

            {pinError && (
              <p className="font-baloo font-bold text-xs text-red-400 bg-red-950/60 border border-red-500/40 p-2.5 rounded-xl mb-3">
                {pinError}
              </p>
            )}

            <form onSubmit={handleSavePin} className="space-y-3">
              <div>
                <label className="block text-xs font-baloo font-bold text-[#F2C21B] mb-1">
                  Nouveau code PIN (6 chiffres)
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full min-h-[48px] px-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white text-center text-xl tracking-widest font-baloo focus:outline-none focus:border-[#F2C21B]"
                />
              </div>

              <div>
                <label className="block text-xs font-baloo font-bold text-[#F2C21B] mb-1">
                  Confirmer le nouveau code PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full min-h-[48px] px-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white text-center text-xl tracking-widest font-baloo focus:outline-none focus:border-[#F2C21B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="min-h-[48px] rounded-full border border-white/30 text-white font-baloo font-bold text-sm active-press cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="min-h-[48px] rounded-full bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-sm uppercase active-press cursor-pointer shadow hover:bg-[#ffcf33]"
                >
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
