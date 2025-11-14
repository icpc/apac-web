'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

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

export function SponsorsCarousel({ 
  dataPath, 
  sizeMultiplier = 1.8,
  scrollSpeed = 1
}: SponsorsCarouselProps) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const duplicatedSponsors = useRef<Sponsor[]>([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch(dataPath);
        const sponsorsData = await response.json();
        setSponsors(sponsorsData);
        duplicatedSponsors.current = [...sponsorsData, ...sponsorsData];
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
        setIsLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  useEffect(() => {
    if (isLoading || sponsors.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    let position = 0;
    const containerWidth = container.scrollWidth / 2;
    
    const animate = () => {
      if (!container) return;
      
      position -= scrollSpeed;
      
      if (position <= -containerWidth) {
        position = 0;
      }
      
      container.style.transform = `translateX(${position}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLoading, sponsors.length]);

  if (isLoading) {
    return <div className="h-24 flex items-center justify-center">Loading sponsors...</div>;
  }

  if (sponsors.length === 0) {
    return <div className="h-24 flex items-center justify-center">No sponsors available</div>;
  }

  return (
    <div className="w-full">
      <div className="w-full max-w-screen-2xl mx-auto py-8 px-4">
        <div className="bg-white dark:bg-background flex flex-col gap-6 rounded-xl border border-border/60 dark:border-border/30 py-2">
          {/* <p className="text-center text-lg text-text-header-primary font-medium pt-2">Our Global Sponsors:</p> */}
          <div className="relative w-full h-32 flex items-center overflow-x-hidden px-6">
            <div 
              ref={containerRef}
              className="flex items-center absolute left-0 h-full will-change-transform"
            >
              {duplicatedSponsors.current.map((sponsor, index) => {
                const [sponsorName, sponsorData] = Object.entries(sponsor)[0];
                const { filename } = sponsorData;
                const size = sponsorData.size;
                
                return (
                  <div 
                    key={`${sponsorName}-${index}`} 
                    className="flex-shrink-0 flex flex-col items-center justify-center px-8"
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
                        src={filename}
                        alt={sponsorName}
                        width={size * 10 * sizeMultiplier}
                        height={80}
                        className="object-contain"
                        priority={index < sponsors.length}
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
}
