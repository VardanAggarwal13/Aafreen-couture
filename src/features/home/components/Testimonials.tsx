'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TestimonialItem {
  id: string;
  name: string;
  initials: string;
  location: string;
  category: 'bridal' | 'suits' | 'indo-western' | 'bespoke';
  categoryLabel: string;
  outfit: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'All Stories' },
  { id: 'bridal', label: 'Bridal Lehengas' },
  { id: 'suits', label: 'Partywear & Suits' },
  { id: 'indo-western', label: 'Indo-Western & Co-ords' },
  { id: 'bespoke', label: 'Bespoke & Heirloom Trousseau' },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

const ALL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Dr. Priya Sharma',
    initials: 'PS',
    location: 'New Delhi, India',
    category: 'bridal',
    categoryLabel: 'Bridal Lehengas',
    outfit: 'Shahi Sindoori Red Handcrafted Zardozi Lehenga',
    rating: 5,
    text: 'My bridal lehenga from Aafreen Couture was the crown jewel of our wedding. The zardozi metal embroidery, hand-set dabka, and micro-velvet blouse fit like an absolute dream without needing a single alteration. Walking down the aisle, the silhouette caught the royal palace lights exquisitely.',
    date: 'March 2026',
    verified: true,
  },
  {
    id: 't-2',
    name: 'Kavita Reddy',
    initials: 'KR',
    location: 'Hyderabad, India',
    category: 'bridal',
    categoryLabel: 'Bridal Lehengas',
    outfit: 'Gulnar Crimson Velvet Handcrafted Lehenga',
    rating: 5,
    text: 'For our royal palace wedding in Hyderabad, the Gulnar velvet lehenga was an absolute showstopper. Pearl and the master karigars customized the cancan flare and dual dupatta drape to perfection. Every relative complimented the intricate zardozi and antique dabka craftsmanship.',
    date: 'February 2026',
    verified: true,
  },
  {
    id: 't-3',
    name: 'Meera Patel',
    initials: 'MP',
    location: 'Mumbai, India',
    category: 'indo-western',
    categoryLabel: 'Indo-Western & Co-ords',
    outfit: 'Sitara Emerald Pre-Draped Organza Cape Set',
    rating: 5,
    text: 'The structural draping on the Sitara cape set is sheer perfection. Modern, lightweight yet dripping in handcrafted luxury. I wore it for our sangeet night and danced for five hours effortlessly. Received dozens of inquiries about where I found such a regal outfit!',
    date: 'February 2026',
    verified: true,
  },
  {
    id: 't-4',
    name: 'Ritu Agarwal',
    initials: 'RA',
    location: 'Jaipur, India',
    category: 'suits',
    categoryLabel: 'Partywear & Suits',
    outfit: 'Afshan Lime Green Handcrafted Zari Silk Suit',
    rating: 5,
    text: 'The sheer richness of the pure mulberry silk and the delicate marodi border work are unmatched by any luxury boutique in Jaipur. The unstitched fabric came with ample margin and matching organza dupatta that drapes like liquid gold. Highly recommended for festive heirloom wear.',
    date: 'January 2026',
    verified: true,
  },
  {
    id: 't-5',
    name: 'Ananya Singhania',
    initials: 'AS',
    location: 'Kolkata, India',
    category: 'bridal',
    categoryLabel: 'Bridal Lehengas',
    outfit: 'Mehrunissa Ivory & Antique Gold Lehenga',
    rating: 5,
    text: 'For our day wedding, I wanted understated ivory royalty rather than traditional bright reds. The Mehrunissa lehenga with micro-pearls and champagne tilla work looked straight out of a regal portrait. The team treats every bride like royalty from consultation to doorstep unboxing.',
    date: 'January 2026',
    verified: true,
  },
  {
    id: 't-6',
    name: 'Simran Bhasin',
    initials: 'SB',
    location: 'Amritsar, India',
    category: 'suits',
    categoryLabel: 'Partywear & Suits',
    outfit: 'Yasmeen Peach Champagne Floral Silk Suit',
    rating: 5,
    text: 'Being from Punjab, our expectations for handcrafted suits are extremely demanding. Aafreen Couture sets the gold standard. The bullion knot roses and cutwork hem on the Yasmeen suit are breathtaking. You can immediately feel the weight of authentic heritage artistry.',
    date: 'December 2025',
    verified: true,
  },
  {
    id: 't-7',
    name: 'Sunita Singhal',
    initials: 'SS',
    location: 'Lucknow, India',
    category: 'bespoke',
    categoryLabel: 'Bespoke Trousseau',
    outfit: 'Custom Hand-Embroidered Velvet Trouser Ensemble',
    rating: 5,
    text: 'Coming from Lucknow, our appreciation for authentic hand embroidery and intricate tilla work is deeply personal. Aafreen Couture delivered unmatched royal tailoring. The heirloom gold-embossed trunk packaging and flawless shoulder-to-hem fit exceeded all expectations.',
    date: 'December 2025',
    verified: true,
  },
  {
    id: 't-8',
    name: 'Tanvi Shah',
    initials: 'TS',
    location: 'Ahmedabad, India',
    category: 'indo-western',
    categoryLabel: 'Indo-Western & Co-ords',
    outfit: 'Rohini Rani Pink Peplum & Flared Trouser Co-ord',
    rating: 5,
    text: 'Wore the Rohini peplum co-ord for my sister\'s sangeet in Ahmedabad. The pure fuchsia silk fabric and hand-sewn cutdana motifs caught every spotlight on the dance floor. Comfortable, feather-light, yet radiating unmatched royal grandeur.',
    date: 'November 2025',
    verified: true,
  },
  {
    id: 't-9',
    name: 'Ayesha Merchant',
    initials: 'AM',
    location: 'Udaipur, India',
    category: 'suits',
    categoryLabel: 'Partywear & Suits',
    outfit: 'Shabnam Ash Grey Pearl Embroidered Silk Suit',
    rating: 5,
    text: 'The subtle silver sheen of the mulberry silk paired with Kashmiri tilla and delicate seed pearls was breathtaking for our Lake Palace dinner. Delivered to our hotel in pristine heirloom trunks with exquisite garment care detailing.',
    date: 'November 2025',
    verified: true,
  },
  {
    id: 't-10',
    name: 'Radhika Deshmukh',
    initials: 'RD',
    location: 'Pune, India',
    category: 'bespoke',
    categoryLabel: 'Bespoke Trousseau',
    outfit: 'Custom Cocktail Reception Gown & Matching Dupatta',
    rating: 5,
    text: 'Pearl and her master tailors customized the neckline, sleeve flare, and dupatta drape specifically for our Pune grand reception. The hand embroidery shimmers like starlight under chandelier lights without feeling heavy. Truly bespoke couture excellence.',
    date: 'October 2025',
    verified: true,
  },
  {
    id: 't-11',
    name: 'Jaspreet Gill',
    initials: 'JG',
    location: 'Chandigarh, India',
    category: 'bridal',
    categoryLabel: 'Bridal Lehengas',
    outfit: 'Zarina Royal Emerald Velvet & Gold Zari Lehenga',
    rating: 5,
    text: 'The weight of the pure velvet, the authentic gold zari threads, and the layered double dupatta gave me the exact Maharani look I dreamed of since childhood. Five stars is not enough for the passion and care this maison pours into their brides.',
    date: 'October 2025',
    verified: true,
  },
  {
    id: 't-12',
    name: 'Natasha Roy',
    initials: 'NR',
    location: 'Bengaluru, India',
    category: 'indo-western',
    categoryLabel: 'Indo-Western & Co-ords',
    outfit: 'Zoya Midnight Navy Hand-Embroidered Cape Jumpsuit',
    rating: 5,
    text: 'Impeccable cut and structured shoulders. The hand-placed cutdana beadwork shimmered effortlessly during our cocktail party. Aafreen Couture represents the finest intersection of modern Indian fashion and timeless regal elegance.',
    date: 'September 2025',
    verified: true,
  },
];

export function Testimonials() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return ALL_TESTIMONIALS;
    return ALL_TESTIMONIALS.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  // Ensure minimum count of 4 items for smooth infinite carousel mechanics
  const baseItems = useMemo(() => {
    if (filteredItems.length === 0) return ALL_TESTIMONIALS;
    if (filteredItems.length < 4) {
      // Repeat to reach at least 4 items
      return [...filteredItems, ...filteredItems, ...filteredItems].slice(0, 4);
    }
    return filteredItems;
  }, [filteredItems]);

  const M = baseItems.length;

  // Tripled list for infinite looping: [Set 1, Set 2 (Current), Set 3]
  const displayItems = useMemo(() => {
    return [...baseItems, ...baseItems, ...baseItems];
  }, [baseItems]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const [visibleCount, setVisibleCount] = useState<number>(3);

  // Responsive visible count and container measurement
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      // Show 3 wide cards on desktop (>=1280px), 2 generous cards on tablet/small laptops (640-1279px), 1.08 on mobile
      if (w >= 1280) setVisibleCount(3);
      else if (w >= 640) setVisibleCount(2);
      else setVisibleCount(1.08);

      if (containerRef.current && containerRef.current.clientWidth > 0) {
        const cs = window.getComputedStyle(containerRef.current);
        const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
        const innerW = Math.max(280, Math.floor(containerRef.current.clientWidth - padX));
        setContainerWidth(innerW);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const crWidth = Math.floor(entry.contentRect.width);
        if (crWidth > 0) {
          setContainerWidth((prev) => (Math.abs(prev - crWidth) > 1 ? crWidth : prev));
        }
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);

    // Pause autoplay when browser tab is inactive / backgrounded
    const onVisibilityChange = () => {
      setIsHovered(document.hidden);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      ro.disconnect();
    };
  }, []);

  const gap = visibleCount >= 3 ? 22 : visibleCount >= 2 ? 20 : 14;
  const cardWidth = Math.floor(Math.max(280, (containerWidth - (visibleCount - 1) * gap) / visibleCount));
  const step = cardWidth + gap;

  // Carousel State: start at middle set (index M)
  const [currentIndex, setCurrentIndex] = useState<number>(M);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Swipe / Drag State
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);

  // Recovery Guard: instantly normalizes currentIndex if it drifts outside [M, 2M-1] when not transitioning
  useEffect(() => {
    if (isTransitioning) return;
    if (currentIndex >= 2 * M || currentIndex < M) {
      const norm = ((currentIndex % M) + M) % M;
      setCurrentIndex(M + norm);
    }
  }, [isTransitioning, currentIndex, M]);

  // Fallback Timer: guarantees transition ends even if browser throttles CSS events
  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setCurrentIndex((prev) => {
        if (prev >= 2 * M) return prev - M;
        if (prev < M) return prev + M;
        return prev;
      });
    }, 700);
    return () => clearTimeout(timer);
  }, [isTransitioning, M]);

  // Reset to first matching item when category changes
  const handleCategorySelect = (catId: CategoryId) => {
    if (catId === activeCategory) return;
    setActiveCategory(catId);
    setIsTransitioning(false);
    setDragOffset(0);
    // Determine new base count
    const nextFiltered = catId === 'all' ? ALL_TESTIMONIALS : ALL_TESTIMONIALS.filter((t) => t.category === catId);
    const nextM = nextFiltered.length < 4 ? Math.min(4, nextFiltered.length * 2) : nextFiltered.length;
    setCurrentIndex(nextM);
  };

  // Navigation handlers
  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Jump to specific dot
  const handleDotClick = (dotIndex: number) => {
    setIsTransitioning(true);
    setCurrentIndex(M + dotIndex);
  };

  // Autoplay effect (every 5.5 seconds, advance one testimonial)
  const isPaused = isHovered || isFocused || isDragging;

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, activeCategory]);

  // Seamless infinite loop boundary handler (executed when transition finishes)
  const handleTransitionEnd = (e?: React.TransitionEvent<HTMLDivElement>) => {
    // Ignore bubbling events from child cards (like hover / scale 300ms transitions)
    if (e && e.target !== e.currentTarget) return;
    if (e && e.propertyName && e.propertyName !== 'transform') return;

    setIsTransitioning(false);
    setCurrentIndex((prev) => {
      if (prev >= 2 * M) return prev - M;
      if (prev < M) return prev + M;
      return prev;
    });
  };

  // Determine active slot index for highlight
  // On desktop (3 cards): center card is active (slot 1: currentIndex + 1)
  // On tablet / mobile: first visible card is active (slot 0: currentIndex)
  const activeSlot = visibleCount >= 3 ? currentIndex + 1 : currentIndex;
  const activeDotIndex = ((activeSlot % M) + M) % M;

  // Pointer drag/swipe gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
    setDragStartY(e.clientY);
    setIsDragging(true);
    setDragOffset(0);
    isHorizontalSwipeRef.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || dragStartX === null || dragStartY === null) return;
    const diffX = e.clientX - dragStartX;
    const diffY = e.clientY - dragStartY;

    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        isHorizontalSwipeRef.current = Math.abs(diffX) >= Math.abs(diffY);
      }
    }

    if (isHorizontalSwipeRef.current === true) {
      setDragOffset(diffX);
    }
  };

  const handlePointerEnd = () => {
    if (!isDragging) return;
    if (isHorizontalSwipeRef.current === true) {
      if (dragOffset < -50) {
        handleNext();
      } else if (dragOffset > 50) {
        handlePrev();
      }
    }
    setIsDragging(false);
    setDragOffset(0);
    setDragStartX(null);
    setDragStartY(null);
    isHorizontalSwipeRef.current = null;
  };

  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-[#FAF7F2] border-b border-[#E8D8C8] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-5 sm:mb-7 text-center sm:text-left">
          <p className="font-display text-[10.5px] sm:text-[11px] uppercase font-bold tracking-[0.35em] text-[#C49A5A] mb-1.5">
            Client Testimonials
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#221617] tracking-tight">
            What Our Brides Say
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6A66] mt-1 font-sans">
            Heirloom memories and real experiences from our celebrated brides across India.
          </p>
        </div>

        {/* Category Tabs — Dynamic instant filtering without page reload */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-5 sm:mb-7 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={cn(
                  'text-xs font-sans px-3.5 py-1.5 rounded-full border transition-all whitespace-nowrap cursor-pointer',
                  isSelected
                    ? 'bg-[#2E221C] text-white border-[#2E221C] shadow-xs font-semibold'
                    : 'bg-white/80 hover:bg-white text-[#705646] border-[#DDD2C5] hover:border-[#C49A5A] font-medium'
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Carousel Container with optimized gutter padding to maximize card width */}
        <div className="relative px-5 sm:px-7 lg:px-8">
          {/* Left Arrow Button — floats cleanly in the side gutter */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="absolute left-0 sm:-left-1 lg:-left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-[#2E221C] hover:text-[#C49A5A] border border-[#DDD2C5] shadow-[0_4px_16px_rgba(46,34,28,0.14)] hover:shadow-[0_6px_22px_rgba(46,34,28,0.22)] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 hover:scale-105"
          >
            <ChevronLeft size={18} className="sm:w-4.5 sm:h-4.5 -translate-x-0.5 text-[#2E221C]" />
          </button>

          {/* Right Arrow Button — floats cleanly in the side gutter */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="absolute right-0 sm:-right-1 lg:-right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-[#2E221C] hover:text-[#C49A5A] border border-[#DDD2C5] shadow-[0_4px_16px_rgba(46,34,28,0.14)] hover:shadow-[0_6px_22px_rgba(46,34,28,0.22)] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 hover:scale-105"
          >
            <ChevronRight size={18} className="sm:w-4.5 sm:h-4.5 translate-x-0.5 text-[#2E221C]" />
          </button>

          {/* Infinite Carousel Viewport with micro padding to preserve outer card radius and elevation */}
          <div
            ref={containerRef}
            className="relative overflow-hidden w-full py-4 select-none touch-pan-y cursor-grab active:cursor-grabbing px-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              if (isDragging) handlePointerEnd();
            }}
            onFocusCapture={() => setIsFocused(true)}
            onBlurCapture={() => setIsFocused(false)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            <div
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(${-currentIndex * step + dragOffset}px)`,
                transition: isDragging
                  ? 'none'
                  : isTransitioning
                  ? 'transform 650ms cubic-bezier(0.25, 1, 0.5, 1)'
                  : 'none',
                display: 'flex',
                gap: `${gap}px`,
                width: 'max-content',
              }}
            >
              {displayItems.map((t, idx) => {
                const isCardActive = idx === activeSlot;
                return (
                  <div
                    key={`${t.id}-${idx}`}
                    style={{ width: `${cardWidth}px`, flexShrink: 0 }}
                    className="flex flex-col"
                  >
                    <article
                      className={cn(
                        'h-full min-h-[265px] sm:min-h-[275px] bg-white rounded-[20px] p-5 sm:p-6 lg:p-7 flex flex-col justify-between border transition-all duration-300',
                        isCardActive
                          ? '-translate-y-1 border-[#C49A5A] shadow-[0_16px_36px_-6px_rgba(46,34,28,0.12),0_6px_18px_rgba(196,154,90,0.2)] ring-1 ring-[#C49A5A]/35'
                          : 'translate-y-0 border-[#DDD2C5]/85 shadow-[0_4px_16px_rgba(46,34,28,0.04)] hover:border-[#C49A5A]/45 hover:shadow-[0_8px_24px_rgba(46,34,28,0.08)]'
                      )}
                    >
                      {/* Top Row: Stars & Verified Badge */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: t.rating }, (_, starIdx) => (
                              <Star
                                key={starIdx}
                                size={14}
                                fill="#C49A5A"
                                stroke="#C49A5A"
                              />
                            ))}
                          </div>
                          {t.verified && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50/90 border border-emerald-200/90 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans shrink-0">
                              <CheckCircle2 size={10} className="text-emerald-600" /> Verified Bride
                            </span>
                          )}
                        </div>

                        {/* Outfit Mention */}
                        <p className="text-[10.5px] uppercase font-bold tracking-[0.25em] text-[#C49A5A] line-clamp-1 mb-1 font-sans">
                          {t.categoryLabel}
                        </p>
                        <h3 className="font-serif text-sm sm:text-base font-semibold text-[#221617] line-clamp-2 mb-3 tracking-tight">
                          {t.outfit}
                        </h3>

                        {/* Review Text */}
                        <div className="relative">
                          <Quote size={14} className="text-[#C49A5A]/35 absolute -left-1 -top-0.5 pointer-events-none" />
                          <p className="text-[12.5px] sm:text-[13px] text-[#554338] font-serif italic leading-[1.65] line-clamp-4 pl-3.5">
                            &ldquo;{t.text}&rdquo;
                          </p>
                        </div>
                      </div>

                      {/* Bottom Row: Client Identity */}
                      <div className="mt-auto pt-4 border-t border-[#F2EAE0] flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#FAF7F2] to-[#F3ECE2] border border-[#DDD2C5] flex items-center justify-center font-serif text-xs sm:text-sm font-semibold text-[#2E221C] shadow-2xs shrink-0">
                          {t.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-serif font-semibold text-[#221617] tracking-wide truncate">
                            {t.name}
                          </p>
                          <p className="text-[11px] text-[#8C7362] font-sans truncate mt-0.5">
                            {t.location} · {t.date}
                          </p>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pagination Indicators — Minimal ivory dots and one elongated royal espresso active pill */}
        <div className="flex items-center justify-center gap-2 mt-5 sm:mt-7">
          {baseItems.map((_, i) => {
            const isActive = i === activeDotIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDotClick(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={cn(
                  'transition-all duration-300 cursor-pointer h-2',
                  isActive
                    ? 'w-7 sm:w-8 rounded-full bg-[#2E221C] shadow-xs'
                    : 'w-2 rounded-full bg-[#DDD2C5] hover:bg-[#C49A5A]/60'
                )}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}
