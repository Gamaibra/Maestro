import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="a-propos"
      className="py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto text-center"
      aria-labelledby="about-heading"
    >
      <div className="bg-[#250409]/70 border border-[#F2C21B]/25 rounded-[26px] p-6 sm:p-8 shadow-xl">
        <h2
          id="about-heading"
          className="font-baloo font-bold text-lg sm:text-xl md:text-2xl text-[#F2C21B] mb-4 tracking-wide"
        >
          À propos de Chez le Maestro
        </h2>

        {/* French version */}
        <p
          lang="fr"
          className="font-baloo text-sm sm:text-base text-[#FFF4DC]/90 leading-relaxed max-w-3xl mx-auto mb-4"
        >
          Chez le Maestro est un restaurant africain situé à Deira, à Dubaï, au Green Sea Plaza Hotel (M-Floor). Authentic African Taste. One Bite at a Time ! Découvrez une cuisine africaine généreuse : atiéké poisson braisé ou grillé, atiéké choucouya poulet ou mouton, garba, foutou sauce graine aubergine, placali, tchep poulet ou poisson, riz arachide sauce tomate, riz sauce de feuille, soupes africaines, haricot, lafri et alloco avec viande grillée. Parcourez le menu, choisissez plusieurs plats et envoyez votre commande en un seul message WhatsApp au +971 58 612 0042.
        </p>

        {/* English version (slightly smaller muted style) */}
        <p
          lang="en"
          className="font-baloo text-xs sm:text-sm text-[#FFF4DC]/70 leading-relaxed max-w-3xl mx-auto"
        >
          Chez le Maestro is an African restaurant in Deira, Dubai, at Green Sea Plaza Hotel (M-Floor). Authentic African Taste. One Bite at a Time! Enjoy hearty African dishes such as attiéké with braised or grilled fish, attiéké choucouya with chicken or mutton, garba, foutou with palm nut and eggplant sauce, placali, tchep with chicken or fish, peanut rice with tomato sauce, leaf sauce rice, African soups, beans, lafri and alloco with grilled meat. Browse the menu, pick several dishes and send your order in one WhatsApp message to +971 58 612 0042.
        </p>
      </div>
    </section>
  );
};
