"use client";

import { useState, useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  delay?: number;
}

export const useIntersectionObserver = (
  elementIds: string[],
  options: UseIntersectionObserverOptions = {}
): Set<string> => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const {
      root = null,
      rootMargin = '0px',
      threshold = 0,
      delay = 0
    } = options;

    // Clear existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Get elements by IDs
    const elements = elementIds
      .map(id => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (delay > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          const visible = new Set<string>();
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              visible.add(entry.target.id);
            }
          });
          setVisibleElements(visible);
        }, delay);
      } else {
        const visible = new Set<string>();
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          }
        });
        setVisibleElements(visible);
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      root,
      rootMargin,
      threshold
    });

    elements.forEach(element => {
      observerRef.current?.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [elementIds, options]);

  return visibleElements;
};