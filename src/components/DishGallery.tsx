import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ClocheLineIcon } from './Logo';

interface DishGalleryProps {
  images?: string[];
  dishName: string;
}

export const DishGallery: React.FC<DishGalleryProps> = ({ images = [], dishName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Mouse drag state for desktop
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const hasMultiple = images.length > 1;

  const scrollToSlide = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const clampedIndex = Math.max(0, Math.min(index, images.length - 1));
    const target = slideRefs.current[clampedIndex];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      setActiveIndex(clampedIndex);
    }
  }, [images.length]);

  // Synchronize active dot with IntersectionObserver
  useEffect(() => {
    if (!hasMultiple || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idxStr = entry.target.getAttribute('data-index');
            if (idxStr !== null) {
              const idx = parseInt(idxStr, 10);
              if (!Number.isNaN(idx)) {
                setActiveIndex(idx);
              }
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.55,
      }
    );

    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [hasMultiple, images]);

  // Keyboard left/right arrow navigation
  useEffect(() => {
    if (!hasMultiple) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        scrollToSlide(activeIndex - 1);
      } else if (e.key === 'ArrowRight') {
        scrollToSlide(activeIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasMultiple, activeIndex, scrollToSlide]);

  // Desktop mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!hasMultiple || !containerRef.current) return;
    isDownRef.current = true;
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDownRef.current = false;
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-b-[28px] overflow-hidden min-w-0 bg-[#250409] select-none border-b border-[#F2C21B]/30 shadow-xl">
      {/* If dish has no images: burgundy placeholder with cloche icon */}
      {images.length === 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#5A0E1A] to-[#250409] p-6 text-center">
          <ClocheLineIcon className="w-20 h-20 text-white/90 drop-shadow-lg" />
        </div>
      ) : (
        /* Horizontal scroll container with scroll snap */
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="w-full h-full flex overflow-x-auto min-w-0 no-scrollbar"
          style={{
            scrollSnapType: 'x mandatory',
            touchAction: 'pan-x pan-y',
            overscrollBehaviorX: 'contain',
            cursor: hasMultiple ? 'grab' : 'default',
          }}
        >
          {images.map((imgSrc, index) => (
            <div
              key={index}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              data-index={index}
              className="flex-[0_0_100%] min-w-full w-full h-full relative"
              style={{
                scrollSnapAlign: 'center',
              }}
            >
              <img
                src={imgSrc}
                alt={`${dishName} – plat africain`}
                draggable={false}
                className="w-full h-full object-cover pointer-events-none"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          ))}
        </div>
      )}

      {/* Desktop Previous/Next 40px rounded buttons (hidden on mobile and if single/no image) */}
      {hasMultiple && (
        <>
          {activeIndex > 0 && (
            <button
              type="button"
              onClick={() => scrollToSlide(activeIndex - 1)}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-[#F2C21B]/50 text-[#F2C21B] items-center justify-center hover-gold-glow active-press z-20 cursor-pointer shadow-lg"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}

          {activeIndex < images.length - 1 && (
            <button
              type="button"
              onClick={() => scrollToSlide(activeIndex + 1)}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-[#F2C21B]/50 text-[#F2C21B] items-center justify-center hover-gold-glow active-press z-20 cursor-pointer shadow-lg"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}

          {/* Tiny rounded yellow dots at bottom */}
          <div className="absolute bottom-3.5 left-0 right-0 flex justify-center items-center gap-1.5 z-20 pointer-events-auto">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToSlide(i)}
                className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                  activeIndex === i
                    ? 'w-5 bg-[#F2C21B] shadow-sm shadow-[#F2C21B]/50'
                    : 'w-2 bg-[#FFF4DC]/40 hover:bg-[#FFF4DC]/70'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
