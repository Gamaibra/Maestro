import React, { useState, useRef, useMemo } from 'react';
import { X, Upload, Trash2, Star, Camera, AlertCircle, AlertTriangle } from 'lucide-react';
import { MenuItem } from '../../data/menu';
import { compressImage } from '../../utils/imageCompressor';

interface DishFormModalProps {
  mode: 'create' | 'edit';
  initialDish?: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dishData: Omit<MenuItem, 'id'>) => void;
}

export const DishFormModal: React.FC<DishFormModalProps> = ({
  mode,
  initialDish,
  isOpen,
  onClose,
  onSave,
}) => {
  // Mode-based initial state:
  // In create mode: all fields start completely BLANK and empty (price is empty, images are empty).
  // In edit mode: fields load ONLY this dish's data.
  const isEdit = mode === 'edit' && !!initialDish;

  const [nameFr, setNameFr] = useState<string>(() => (isEdit ? initialDish?.nameFr || '' : ''));
  const [nameEn, setNameEn] = useState<string>(() => (isEdit ? initialDish?.nameEn || '' : ''));
  const [descriptionFr, setDescriptionFr] = useState<string>(() =>
    isEdit ? initialDish?.descriptionFr || '' : ''
  );
  const [descriptionEn, setDescriptionEn] = useState<string>(() =>
    isEdit ? initialDish?.descriptionEn || '' : ''
  );
  const [price, setPrice] = useState<string>(() =>
    isEdit && initialDish && initialDish.price != null ? String(initialDish.price) : ''
  );
  const [category, setCategory] = useState<'menu' | 'boissons'>(() =>
    isEdit && initialDish ? initialDish.category : 'menu'
  );
  const [images, setImages] = useState<string[]>(() => {
    if (isEdit && initialDish) {
      if (initialDish.images && initialDish.images.length > 0) {
        return [...initialDish.images];
      }
      if (initialDish.imageUrl) {
        return [initialDish.imageUrl];
      }
    }
    return [];
  });

  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Field-specific validation errors
  const [nameError, setNameError] = useState<string>('');
  const [priceError, setPriceError] = useState<string>('');
  const [generalError, setGeneralError] = useState<string>('');

  // Confirmation dialog for unsaved changes ("Abandonner ?")
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Check if form has unsaved modifications
  const isDirty = useMemo(() => {
    if (!isEdit) {
      return (
        nameFr.trim() !== '' ||
        nameEn.trim() !== '' ||
        descriptionFr.trim() !== '' ||
        descriptionEn.trim() !== '' ||
        price.trim() !== '' ||
        category !== 'menu' ||
        images.length > 0
      );
    }
    if (!initialDish) return false;
    const initialImages =
      initialDish.images && initialDish.images.length > 0
        ? initialDish.images
        : initialDish.imageUrl
        ? [initialDish.imageUrl]
        : [];
    const sameImages =
      images.length === initialImages.length &&
      images.every((img, idx) => img === initialImages[idx]);

    return (
      nameFr !== (initialDish.nameFr || '') ||
      nameEn !== (initialDish.nameEn || '') ||
      descriptionFr !== (initialDish.descriptionFr || '') ||
      descriptionEn !== (initialDish.descriptionEn || '') ||
      price !== (initialDish.price != null ? String(initialDish.price) : '') ||
      category !== initialDish.category ||
      !sameImages
    );
  }, [isEdit, initialDish, nameFr, nameEn, descriptionFr, descriptionEn, price, category, images]);

  if (!isOpen) return null;

  const resetAllFields = () => {
    setNameFr('');
    setNameEn('');
    setDescriptionFr('');
    setDescriptionEn('');
    setPrice('');
    setCategory('menu');
    setImages([]);
    setNameError('');
    setPriceError('');
    setGeneralError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleAttemptClose = () => {
    if (isDirty) {
      setShowAbandonConfirm(true);
    } else {
      resetAllFields();
      onClose();
    }
  };

  const confirmAbandon = () => {
    setShowAbandonConfirm(false);
    resetAllFields();
    onClose();
  };

  // Process uploaded image files (compress to max 720px, WebP quality 0.65)
  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setGeneralError('');

    const filesArray = Array.from(fileList);
    const availableSlots = 5 - images.length;
    if (availableSlots <= 0) {
      setGeneralError('Maximum 5 photos par plat.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      return;
    }

    const filesToProcess = filesArray.slice(0, availableSlots);
    setIsProcessingImage(true);

    try {
      const processed: string[] = [];
      for (const file of filesToProcess) {
        if (!file.type.startsWith('image/')) continue;
        const compressedFull = await compressImage(file, {
          maxWidth: 720,
          quality: 0.65,
          format: 'image/webp',
        });
        processed.push(compressedFull);
      }
      setImages((prev) => [...prev, ...processed]);
    } catch (err) {
      console.error(err);
      setGeneralError('Erreur lors du traitement de l’image.');
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || isProcessingImage) return;

    let hasValidationError = false;
    setNameError('');
    setPriceError('');
    setGeneralError('');

    const trimmedNameFr = nameFr.trim();
    if (!trimmedNameFr) {
      setNameError('Le nom du plat (Français) est obligatoire.');
      hasValidationError = true;
    }

    const trimmedPrice = price.trim();
    const numPrice = parseFloat(trimmedPrice);
    if (!trimmedPrice) {
      setPriceError('Le prix en AED est obligatoire.');
      hasValidationError = true;
    } else if (isNaN(numPrice) || numPrice <= 0) {
      setPriceError('Le prix doit être un nombre valide supérieur à 0.');
      hasValidationError = true;
    }

    if (hasValidationError) {
      return;
    }

    setIsSaving(true);

    try {
      let coverThumb: string | undefined = undefined;

      // Generate cover thumbnail (400px wide, WebP 0.6) from images[0] if present
      if (images.length > 0) {
        try {
          const coverData = images[0];
          coverThumb = await new Promise<string>((resolve) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              let w = img.naturalWidth || img.width;
              let h = img.naturalHeight || img.height;
              if (w > 400) {
                h = Math.round((h * 400) / w);
                w = 400;
              }
              canvas.width = w;
              canvas.height = h;
              ctx?.drawImage(img, 0, 0, w, h);
              try {
                resolve(canvas.toDataURL('image/webp', 0.6));
              } catch {
                resolve(coverData);
              }
            };
            img.onerror = () => resolve(coverData);
            img.src = coverData;
          });
        } catch {
          coverThumb = images[0];
        }
      }

      onSave({
        nameFr: trimmedNameFr,
        nameEn: nameEn.trim() || undefined,
        descriptionFr: descriptionFr.trim() || undefined,
        descriptionEn: descriptionEn.trim() || undefined,
        price: numPrice,
        category,
        images: [...images],
        thumbnailUrl: coverThumb,
        imageUrl: images[0] || undefined,
      });

      resetAllFields();
    } catch (err) {
      console.error(err);
      setGeneralError('Erreur lors de l’enregistrement.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleAttemptClose();
          }
        }}
      >
        <div className="relative w-full max-w-lg bg-[#2D050D] border border-[#F2C21B]/40 rounded-[28px] p-5 sm:p-7 shadow-2xl my-auto text-[#FFF4DC] select-none">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F2C21B]/20">
            <h2 className="font-baloo font-extrabold text-xl text-white">
              {isEdit ? 'Modifier le plat' : 'Ajouter un plat'}
            </h2>
            <button
              type="button"
              onClick={handleAttemptClose}
              className="w-10 h-10 rounded-full bg-black/40 text-white hover:text-[#F2C21B] flex items-center justify-center active-press cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {generalError && (
            <div className="mt-4 p-3 rounded-2xl bg-red-950/70 border border-red-500/50 flex items-center gap-2 text-xs font-baloo text-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Nom FR & EN */}
            <div>
              <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#F2C21B] mb-1">
                Nom du plat (Français) *
              </label>
              <input
                type="text"
                value={nameFr}
                onChange={(e) => {
                  setNameFr(e.target.value);
                  if (nameError) setNameError('');
                }}
                placeholder="Ex: Atiéké poisson braisé"
                className={`w-full min-h-[48px] px-4 rounded-2xl bg-[#1A0307] border text-white placeholder-white/30 text-base font-baloo focus:outline-none transition-colors ${
                  nameError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-[#F2C21B]/30 focus:border-[#F2C21B]'
                }`}
              />
              {nameError && (
                <p className="text-red-400 text-xs font-baloo font-bold mt-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{nameError}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#FFF4DC]/80 mb-1">
                Nom du plat (Anglais - Optionnel)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Ex: Attiéké with braised fish"
                className="w-full min-h-[48px] px-4 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white placeholder-white/30 text-base font-baloo focus:outline-none focus:border-[#F2C21B]"
              />
            </div>

            {/* Catégorie : simple choix entre "Menu" et "Boissons / Drinks" */}
            <div>
              <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#F2C21B] mb-1.5">
                Catégorie *
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCategory('menu')}
                  className={`min-h-[48px] rounded-2xl font-baloo font-extrabold text-sm flex items-center justify-center active-press cursor-pointer border transition-all ${
                    category === 'menu'
                      ? 'bg-[#F2C21B] text-[#3B0710] border-[#F2C21B] shadow-md'
                      : 'bg-[#1A0307] text-[#FFF4DC] border-[#F2C21B]/30 hover:border-[#F2C21B]'
                  }`}
                >
                  Menu (Plats)
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('boissons')}
                  className={`min-h-[48px] rounded-2xl font-baloo font-extrabold text-sm flex items-center justify-center active-press cursor-pointer border transition-all ${
                    category === 'boissons'
                      ? 'bg-[#F2C21B] text-[#3B0710] border-[#F2C21B] shadow-md'
                      : 'bg-[#1A0307] text-[#FFF4DC] border-[#F2C21B]/30 hover:border-[#F2C21B]'
                  }`}
                >
                  Boissons / Drinks
                </button>
              </div>
            </div>

            {/* Prix en AED */}
            <div>
              <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#F2C21B] mb-1">
                Prix en AED *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (priceError) setPriceError('');
                  }}
                  placeholder="30"
                  className={`w-full min-h-[48px] px-4 pr-16 rounded-2xl bg-[#1A0307] border text-white font-baloo font-extrabold text-lg focus:outline-none transition-colors ${
                    priceError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[#F2C21B]/30 focus:border-[#F2C21B]'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-baloo font-bold text-sm text-[#F2C21B]">
                  AED
                </span>
              </div>
              {priceError && (
                <p className="text-red-400 text-xs font-baloo font-bold mt-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{priceError}</span>
                </p>
              )}
            </div>

            {/* Description (Optionnelle FR / EN) */}
            <div>
              <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#FFF4DC]/80 mb-1">
                Description (Français - Optionnel)
              </label>
              <textarea
                rows={2}
                value={descriptionFr}
                onChange={(e) => setDescriptionFr(e.target.value)}
                placeholder="Ingrédients, accompagnements, saveurs..."
                className="w-full p-3 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white placeholder-white/30 text-sm font-baloo focus:outline-none focus:border-[#F2C21B]"
              />
            </div>

            <div>
              <label className="block text-xs font-baloo font-bold uppercase tracking-wider text-[#FFF4DC]/80 mb-1">
                Description (Anglais - Optionnel)
              </label>
              <textarea
                rows={2}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="English description..."
                className="w-full p-3 rounded-2xl bg-[#1A0307] border border-[#F2C21B]/30 text-white placeholder-white/30 text-sm font-baloo focus:outline-none focus:border-[#F2C21B]"
              />
            </div>

            {/* IMAGES (Up to 5, upload from device / drag & drop only, NO URL field) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-baloo font-bold uppercase tracking-wider text-[#F2C21B]">
                  Photos du plat ({images.length}/5)
                </label>
                <span className="text-[11px] font-baloo text-[#FFF4DC]/60">
                  1ère = Photo de couverture
                </span>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              {/* Drop / Tap Zone */}
              {images.length < 5 && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFiles(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed border-[#F2C21B]/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-[#1A0307]/60 hover:bg-[#1A0307] transition-colors cursor-pointer mb-3"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="min-h-[44px] px-4 rounded-xl bg-[#F2C21B]/20 border border-[#F2C21B]/40 text-[#F2C21B] font-baloo font-bold text-xs flex items-center gap-1.5 active-press cursor-pointer hover:bg-[#F2C21B]/30"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choisir fichier</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="min-h-[44px] px-4 rounded-xl bg-white/10 border border-white/20 text-white font-baloo font-bold text-xs flex items-center gap-1.5 active-press cursor-pointer hover:bg-white/20"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Prendre photo</span>
                    </button>
                  </div>
                  <p className="text-[11px] font-baloo text-[#FFF4DC]/50 mt-2">
                    Glissez-déposez ou touchez pour ajouter (compressé auto en WebP)
                  </p>
                </div>
              )}

              {isProcessingImage && (
                <p className="text-xs font-baloo text-[#F2C21B] animate-pulse text-center my-2">
                  Optimisation des images en cours...
                </p>
              )}

              {/* Previews List with set-as-cover and remove */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative rounded-2xl overflow-hidden border-2 aspect-[4/3] bg-black/40 group shadow ${
                        idx === 0 ? 'border-[#F2C21B]' : 'border-white/20'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Aperçu ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Badge Cover */}
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow">
                          Couverture
                        </span>
                      )}

                      {/* Action buttons over thumbnail */}
                      <div className="absolute inset-0 bg-black/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(idx)}
                            className="w-8 h-8 rounded-full bg-[#F2C21B] text-[#3B0710] flex items-center justify-center shadow active-press cursor-pointer"
                            title="Définir comme couverture"
                            aria-label="Définir comme couverture"
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow active-press cursor-pointer"
                          title="Supprimer cette image"
                          aria-label="Supprimer cette image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-[#F2C21B]/20 flex items-center gap-3">
              <button
                type="button"
                onClick={handleAttemptClose}
                disabled={isSaving}
                className="flex-1 min-h-[48px] rounded-full border border-white/30 text-white font-baloo font-bold text-sm uppercase active-press cursor-pointer hover:bg-white/10 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving || isProcessingImage}
                className="flex-1 min-h-[48px] rounded-full bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-sm uppercase tracking-wider active-press cursor-pointer shadow-lg hover:bg-[#ffcf33] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal: Abandon unsaved changes */}
      {showAbandonConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm bg-[#2D050D] border border-[#F2C21B]/40 rounded-[26px] p-6 text-center text-[#FFF4DC] shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#1A0307] border border-[#F2C21B]/40 text-[#F2C21B] flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-baloo font-extrabold text-lg text-white">
              Abandonner ?
            </h3>
            <p className="font-baloo text-xs text-[#FFF4DC]/70 mt-1">
              Les modifications apportées au formulaire ne seront pas enregistrées.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAbandonConfirm(false)}
                className="min-h-[46px] rounded-full border border-white/30 text-white font-baloo font-bold text-xs sm:text-sm active-press cursor-pointer hover:bg-white/10"
              >
                Continuer
              </button>
              <button
                type="button"
                onClick={confirmAbandon}
                className="min-h-[46px] rounded-full bg-red-600 text-white font-baloo font-extrabold text-xs sm:text-sm active-press cursor-pointer shadow-lg hover:bg-red-500"
              >
                Abandonner
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
