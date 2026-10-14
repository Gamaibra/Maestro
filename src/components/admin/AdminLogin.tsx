import React, { useState } from 'react';
import { Delete, Eye, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Wordmark } from '../Logo';

export const AdminLogin: React.FC = () => {
  const { login, setIsAdminRoute } = useApp();
  const [pin, setPin] = useState<string>('');
  const [errorShake, setErrorShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDigit = async (digit: string) => {
    if (pin.length >= 6) return;
    const nextPin = pin + digit;
    setPin(nextPin);
    setErrorMessage('');

    if (nextPin.length === 6) {
      const ok = await login(nextPin);
      if (!ok) {
        setErrorShake(true);
        setErrorMessage('Code PIN incorrect');
        setTimeout(() => {
          setPin('');
          setErrorShake(false);
        }, 600);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-marble-texture bg-[#3B0710] text-[#FFF4DC] flex flex-col justify-between px-4 py-6 max-w-md mx-auto select-none">
      {/* Top Header: Back to public site */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsAdminRoute(false)}
          className="min-h-[48px] px-4 rounded-full bg-black/40 border border-[#F2C21B]/30 text-[#FFF4DC] hover:text-[#F2C21B] flex items-center gap-2 text-sm font-baloo font-bold active-press cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voir le site</span>
        </button>
        <span className="text-xs font-baloo uppercase tracking-wider text-[#F2C21B]/80 font-bold">
          Espace Patron
        </span>
      </div>

      {/* Main Login Display */}
      <div className="flex flex-col items-center justify-center my-auto py-4">
        <Wordmark className="scale-110 mb-2" />
        <h1 className="font-baloo font-extrabold text-2xl text-white mt-3 text-center">
          Accès Administration
        </h1>
        <p className="font-baloo text-xs sm:text-sm text-[#FFF4DC]/70 text-center mt-1">
          Entrez votre code secret à 6 chiffres
        </p>

        {/* 6 Rounded Dots */}
        <div
          className={`flex items-center gap-3.5 my-7 ${
            errorShake ? 'animate-bounce text-red-400' : ''
          }`}
          role="status"
          aria-label={`${pin.length} chiffres saisis sur 6`}
        >
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const isFilled = idx < pin.length;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                  isFilled
                    ? 'bg-[#F2C21B] border-[#F2C21B] scale-110 shadow-md shadow-[#F2C21B]/50'
                    : 'bg-[#250409] border-[#F2C21B]/40'
                }`}
              />
            );
          })}
        </div>

        {errorMessage && (
          <p className="font-baloo font-bold text-xs text-red-400 bg-red-950/60 border border-red-500/40 px-3 py-1.5 rounded-full mb-2">
            {errorMessage}
          </p>
        )}
      </div>

      {/* Thumb-sized Numeric Keypad */}
      <div className="w-full max-w-xs mx-auto pb-6">
        <div className="grid grid-cols-3 gap-3.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="h-16 rounded-[22px] bg-[#250409]/90 border border-[#F2C21B]/35 text-white font-baloo font-extrabold text-2xl flex items-center justify-center shadow-lg active-press hover:bg-[#F2C21B]/15 hover:border-[#F2C21B] cursor-pointer"
            >
              {num}
            </button>
          ))}

          {/* Clear button */}
          <button
            type="button"
            onClick={handleClear}
            className="h-16 rounded-[22px] bg-black/40 border border-[#F2C21B]/20 text-[#FFF4DC]/60 font-baloo font-bold text-xs uppercase flex items-center justify-center active-press cursor-pointer hover:text-white"
          >
            Effacer
          </button>

          {/* Zero */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-16 rounded-[22px] bg-[#250409]/90 border border-[#F2C21B]/35 text-white font-baloo font-extrabold text-2xl flex items-center justify-center shadow-lg active-press hover:bg-[#F2C21B]/15 hover:border-[#F2C21B] cursor-pointer"
          >
            0
          </button>

          {/* Backspace / Delete */}
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Supprimer un chiffre"
            className="h-16 rounded-[22px] bg-black/40 border border-[#F2C21B]/20 text-[#F2C21B] font-baloo font-bold flex items-center justify-center active-press cursor-pointer hover:bg-black/60"
          >
            <Delete className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
