'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { getAssetUrl } from '@/lib/base-path';

// Preload images function
const preloadImages = (sponsors: Sponsor[]) => {
  if (typeof window === 'undefined') return;

  sponsors.forEach(sponsor => {
    const [_, { filename }] = Object.entries(sponsor)[0];
    const img = new window.Image();
    img.src = getAssetUrl(filename);
  });
};

// Carousel that shows multiple logos with smooth sliding animation
const useCarousel = <T,>(items: T[], visibleCount = 4, scrollSpeed = 1) => {
  const [offset, setOffset] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [displayItems, setDisplayItems] = useState<T[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const itemWidth = 300;
  const minVisibleItems = 6; // Minimum number of items to show

  // Initialize display items with enough duplicates to fill the screen
  useEffect(() => {
    if (items.length > 0) {
      // Create 3 copies for smoother infinite loop
      const duplicatedItems = [...items, ...items, ...items];
      setDisplayItems(duplicatedItems);
      setOffset(0);
    }
  }, [items, minVisibleItems]);

  // Animation loop
  useEffect(() => {
    if (displayItems.length === 0 || items.length === 0) return;


    const singleSetWidth = items.length * itemWidth; // Width of one set of items
    let animationFrameId: number | null = null;
    let lastTimestamp = performance.now();
    let currentOffset = 0;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // Calculate new offset (continuous right movement)
      currentOffset += Math.floor(scrollSpeed * delta) / 8;

      // Reset after the first item of the 2nd array has fully shown
      const resetPoint = singleSetWidth;

      if (currentOffset >= resetPoint) {
        currentOffset = -8;
        setIsResetting(true);
        setTimeout(() => setIsResetting(false), 150); // Re-enable transition after brief moment
      }

      setOffset(currentOffset);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [displayItems.length, items.length, scrollSpeed]);

  // Update container transform with smooth transition
  useEffect(() => {
    if (containerRef.current) {
      // Use smooth transition only when not resetting position
      containerRef.current.style.transition = isResetting ? 'none' : 'transform 0.1s linear';
      containerRef.current.style.transform = `translateX(-${offset}px)`;
    }
  }, [offset, isResetting]);

  return { containerRef, displayItems, isResetting, itemWidth };
};

interface Sponsor {
  [key: string]: {
    size: number;
    filename: string;
    year?: string;
  };
}

interface SponsorsCarouselProps {
  dataPath: string;
  sizeMultiplier?: number;
  scrollSpeed?: number;
}

// Memoize the component to prevent unnecessary re-renders
export const SponsorsCarousel = React.memo(function SponsorsCarousel({
  dataPath,
  sizeMultiplier = 1.8,
  scrollSpeed = 1
}: SponsorsCarouselProps) {
  const [sponsorsData, setSponsorsData] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { containerRef, displayItems, itemWidth } = useCarousel(sponsorsData, 4, scrollSpeed);

  // Fetch sponsors data
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        // Try to get from cache first
        const cached = sessionStorage.getItem(`sponsors-${dataPath}`);
        if (cached) {
          const data = JSON.parse(cached);
          setSponsorsData(data);
          preloadImages(data);
        }

        // Then fetch fresh data
        const response = await fetch(getAssetUrl(dataPath), { cache: 'force-cache' });
        const data = await response.json();

        if (JSON.stringify(sponsorsData) !== JSON.stringify(data)) {
          setSponsorsData(data);
          sessionStorage.setItem(`sponsors-${dataPath}`, JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSponsors();
  }, [dataPath]);

  // Show loading state only if we have no data
  if (isLoading || sponsorsData.length === 0) {
    return (
      <div className="w-full">
        <div className="w-full max-w-screen-2xl mx-auto py-4 md:py-8 px-2 md:px-4">
          <div className="bg-white dark:bg-background flex items-center justify-center h-32 rounded-xl border border-border/60 dark:border-border/30">
            {isLoading ? 'Loading sponsors...' : 'No sponsors available'}
          </div>
        </div>
      </div>
    );
  }

  // Calculate how many logos to show based on container width (4-6 logos)
  const visibleCount = Math.min(Math.max(4, Math.floor(window.innerWidth / itemWidth)), 6);

  return (
    <div className="w-full">
      <div className="w-full max-w-screen-2xl mx-auto py-4 md:py-8 px-2 md:px-4">
        <div className="bg-white dark:bg-background flex flex-col gap-6 rounded-xl border border-border/60 dark:border-border/30 py-4">
          <div className="relative w-full h-40 overflow-hidden">
            <div
              ref={containerRef}
              className="absolute top-0 left-0 h-full flex items-center will-change-transform"
              style={{
                minWidth: '200%', // Ensure there's always content to show
                transition: 'transform 0.1s linear'
              }}
            >
              {displayItems.map((sponsor, index) => {
                const [sponsorName, sponsorData] = Object.entries(sponsor || {})[0] || [];
                const { filename = '', size = 0 } = sponsorData || {};

                return (
                  <div
                    key={`${sponsorName}-${index}`}
                    className="flex-shrink-0 flex flex-col items-center justify-center"
                    style={{ width: '300px' }}
                  >
                    <div
                      className="relative flex items-center justify-center"
                      style={{
                        height: '80px',
                        width: `${size * sizeMultiplier}rem`,
                        minWidth: '4rem',
                        position: 'relative'
                      }}
                    >
                      <Image
                        src={getAssetUrl(filename)}
                        alt={sponsorName}
                        width={size * 10 * sizeMultiplier}
                        height={80}
                        className="object-contain"
                        priority={index < visibleCount}
                      />
                    </div>
                    <p className={`mt-2 text-center opacity-80 max-w-[120px] md:max-w-none text-text-header-primary ${sizeMultiplier < 1.5 ? 'text-xxs' : 'text-xs'}`}>
                      {sponsorName}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
