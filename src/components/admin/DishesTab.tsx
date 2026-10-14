import React, { useState } from 'react';
import { Plus, Trash2, Edit2, RotateCcw, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem } from '../../data/menu';
import { DishFormModal } from './DishFormModal';
import { ClocheLineIcon } from '../Logo';

export const DishesTab: React.FC = () => {
  const { dishes, addDish, updateDish, deleteDish, clearAllDishes, importSampleDishes } = useApp();

  // State for Modal Form:
  // editingDishId: null means "create" mode, string means "edit" mode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [modalSession, setModalSession] = useState<number>(0);

  // Confirmation modals
  const [dishToDelete, setDishToDelete] = useState<MenuItem | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importNotification, setImportNotification] = useState<string | null>(null);

  // Mode create: explicitly set editingDishId to null, increment key session, open modal
  const handleOpenAdd = () => {
    setEditingDishId(null);
    setModalSession((prev) => prev + 1);
    setIsModalOpen(true);
  };

  // Mode edit: set editingDishId to this specific dish ID, increment key session, open modal
  const handleOpenEdit = (dish: MenuItem) => {
    setEditingDishId(dish.id);
    setModalSession((prev) => prev + 1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDishId(null);
  };

  const handleSaveDish = (dishData: Omit<MenuItem, 'id'>) => {
    if (editingDishId) {
      updateDish(editingDishId, dishData);
    } else {
      addDish(dishData);
    }
    handleCloseModal();
  };

  const confirmDelete = () => {
    if (dishToDelete) {
      deleteDish(dishToDelete.id);
      setDishToDelete(null);
    }
  };

  const confirmClearAll = () => {
    clearAllDishes();
    setShowClearConfirm(false);
  };

  const handleImport = () => {
    const res = importSampleDishes();
    setImportNotification(
      `Importation réussie : ${res.imported} plats ajoutés (${res.skipped} déjà présents).`
    );
    setTimeout(() => {
      setImportNotification(null);
    }, 4500);
  };

  // Look up dish to edit only in edit mode
  const dishToEdit = editingDishId ? dishes.find((d) => d.id === editingDishId) || null : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Main Action: Big "Ajouter un plat" Button (min 48px) */}
      <div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-[#F2C21B] text-[#3B0710] font-baloo font-extrabold text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active-press hover:bg-[#ffcf33] cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.8]" />
          <span>Ajouter un plat</span>
        </button>
      </div>

      {/* Import & Clear buttons bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Importer le menu Chez le Maestro */}
        <button
          type="button"
          onClick={handleImport}
          className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#250409] border border-[#F2C21B]/40 text-[#FFF4DC] hover:text-[#F2C21B] hover:border-[#F2C21B] font-baloo font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active-press cursor-pointer shadow"
        >
          <Sparkles className="w-4 h-4 text-[#F2C21B]" />
          <span>Importer le menu Chez le Maestro</span>
        </button>

        {/* Tout vider */}
        <button
          type="button"
          onClick={() => setShowClearConfirm(true)}
          className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-black/40 border border-red-500/30 text-red-300 hover:text-red-200 hover:border-red-500/60 font-baloo font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active-press cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Tout vider</span>
        </button>
      </div>

      {/* Notification Toast for Import */}
      {importNotification && (
        <div className="p-4 rounded-2xl bg-[#250409] border border-[#F2C21B] text-white flex items-center gap-3 shadow-xl animate-fade-in-up">
          <CheckCircle className="w-5 h-5 text-[#F2C21B] shrink-0" />
          <p className="font-baloo font-bold text-xs sm:text-sm leading-tight text-[#FFF4DC]">
            {importNotification}
          </p>
        </div>
      )}

      {/* Dishes Count header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="font-baloo font-extrabold text-lg text-white">
          Plats au menu ({dishes.length})
        </h2>
      </div>

      {/* 2-Column Compact Cards Grid (from 320px up) */}
      {dishes.length === 0 ? (
        <div className="p-8 text-center rounded-[24px] bg-[#250409]/60 border border-[#F2C21B]/20">
          <ClocheLineIcon className="w-12 h-12 text-[#F2C21B]/40 mx-auto mb-2" />
          <p className="font-baloo font-bold text-base text-white">Aucun plat dans le menu</p>
          <p className="font-baloo text-xs text-[#FFF4DC]/60 mt-1 max-w-xs mx-auto">
            Touchez "Ajouter un plat" ou "Importer le menu Chez le Maestro" pour commencer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3.5">
          {dishes.map((dish) => {
            const thumb = dish.thumbnailUrl || (dish.images && dish.images[0]) || dish.imageUrl;

            return (
              <div
                key={dish.id}
                className="bg-[#250409]/90 border border-[#F2C21B]/30 rounded-[22px] p-2.5 flex flex-col justify-between shadow-md relative"
              >
                {/* Thumbnail Cover 4:3 */}
                <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden bg-gradient-to-br from-[#5A0E1A] to-[#1A0307] flex items-center justify-center border border-[#F2C21B]/20">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={dish.nameFr}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <ClocheLineIcon className="w-9 h-9 text-white/80" />
                  )}
                </div>

                {/* Name */}
                <div className="mt-2 mb-1 px-0.5 text-center">
                  <h3 className="font-baloo font-bold text-xs sm:text-sm text-white line-clamp-2 min-h-[2.1rem] leading-tight">
                    {dish.nameFr}
                  </h3>
                  <p className="font-baloo font-extrabold text-[#F2C21B] text-xs sm:text-sm mt-0.5 tabular-nums">
                    {dish.price} AED
                  </p>
                </div>

                {/* Actions: Modifier & Supprimer */}
                <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-[#F2C21B]/20">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(dish)}
                    className="min-h-[44px] rounded-xl bg-[#F2C21B]/20 border border-[#F2C21B]/40 text-[#F2C21B] font-baloo font-bold text-xs flex items-center justify-center gap-1 active-press hover:bg-[#F2C21B]/30 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Modifier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDishToDelete(dish)}
                    className="min-h-[44px] rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 font-baloo font-bold text-xs flex items-center justify-center gap-1 active-press hover:bg-red-950/70 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Suppr.</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dish Form Modal:
          Re-mounts completely at each opening with a fresh key (mode + session key)
          so React destroys any previous state or inputs completely.
      */}
      {isModalOpen && (
        <DishFormModal
          key={editingDishId ? `edit-${editingDishId}-${modalSession}` : `new-${modalSession}`}
          mode={editingDishId ? 'edit' : 'create'}
          initialDish={dishToEdit}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveDish}
        />
      )}

      {/* Confirmation Modal: Delete single dish */}
      {dishToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm bg-[#2D050D] border border-red-500/40 rounded-[26px] p-6 text-center text-[#FFF4DC] shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-baloo font-extrabold text-lg text-white">
              Supprimer ce plat ?
            </h3>
            <p className="font-baloo text-xs text-[#FFF4DC]/70 mt-1">
              "{dishToDelete.nameFr}" sera retiré du menu.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDishToDelete(null)}
                className="min-h-[48px] rounded-full border border-white/30 text-white font-baloo font-bold text-sm active-press cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="min-h-[48px] rounded-full bg-red-600 text-white font-baloo font-extrabold text-sm active-press cursor-pointer shadow-lg hover:bg-red-500"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Clear all dishes */}
      {showClearConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm bg-[#2D050D] border border-red-500/50 rounded-[26px] p-6 text-center text-[#FFF4DC] shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-red-950 border border-red-500 text-red-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="font-baloo font-extrabold text-xl text-white">
              Vider tout le menu ?
            </h3>
            <p className="font-baloo text-xs text-[#FFF4DC]/80 mt-2 leading-relaxed">
              Attention : cette action effacera l'ensemble des {dishes.length} plats du site. Vous pourrez réimporter le menu de base à tout moment.
            </p>
            <div className="flex flex-col gap-2.5 mt-6">
              <button
                type="button"
                onClick={confirmClearAll}
                className="w-full min-h-[48px] rounded-full bg-red-600 text-white font-baloo font-extrabold text-sm uppercase tracking-wide active-press cursor-pointer shadow-lg hover:bg-red-500"
              >
                Oui, tout supprimer
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="w-full min-h-[48px] rounded-full border border-white/30 text-white font-baloo font-bold text-sm active-press cursor-pointer hover:bg-white/10"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
