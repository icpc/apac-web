'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import sponsorStyles from '@/app/_styles/sponsors-styles.module.css';

// Internal representation of a sponsor's properties
interface Sponsor {
    size: number;
    filename: string;
}

// Format of a single sponsor entry in the new JSON array
// e.g., { "Optiver": { "size": 6, "filename": "..." } }
type SponsorEntry = {
    [name: string]: Sponsor;
};

// Format of a single level entry in the new JSON array
// e.g., { "local": [ { "Optiver": ... }, { "HRT": ... } ] }
type LevelEntry = {
    [level: string]: SponsorEntry[];
};

// The new format for the entire sponsors.json file
type SponsorsData = LevelEntry[];

interface SponsorsGridProps {
    year: string;
}

// Structure to hold processed information for each sponsor level
interface ProcessedLevelDetails {
    levelKey: string;
    title: string;
    linesOfImages: Array<Array<[string, Sponsor]>>; // Logos grouped into lines for this level
    levelTotalSize: number; // Sum of all sponsor.size for this level
}

export default function SponsorsGrid({ year }: SponsorsGridProps) {
    // State will now store an array of these ProcessedLevelDetails objects, in render order
    let initialMaxLength = 30;

    const [displayableLevels, setDisplayableLevels] = useState<ProcessedLevelDetails[]>([]);
    const [maxLength, setMaxLength] = useState(initialMaxLength);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const calculateMaxLength = () => {
            if (containerRef.current) {
                let containerWidth = containerRef.current.offsetWidth;
                let newMaxLength = Math.floor(containerWidth / initialMaxLength); 
                setMaxLength(newMaxLength < 12 ? 12 : newMaxLength);
            }
        };

        calculateMaxLength();
        window.addEventListener('resize', calculateMaxLength);

        return () => {
            window.removeEventListener('resize', calculateMaxLength);
        };
    }, []);

    useEffect(() => {
        fetch(`/pages/championship/${year}/sponsors/sponsors.json`)
            .then(response => response.json())
            .then((data: SponsorsData) => {
                console.log('Loaded sponsors data:', data);

                const allProcessedLevels = data.map(levelEntry => {
                    const levelKey = Object.keys(levelEntry)[0];
                    const sponsorsInLevel = levelEntry[levelKey];

                    if (!sponsorsInLevel || sponsorsInLevel.length === 0) return null;

                    const levelSponsorsEntries: Array<[string, Sponsor]> = sponsorsInLevel.map(sponsorEntry => {
                        const name = Object.keys(sponsorEntry)[0];
                        const details = sponsorEntry[name];
                        return [name, details];
                    });

                    const linesOfImagesForLevel: Array<Array<[string, Sponsor]>> = [];
                    let currentImageLine: Array<[string, Sponsor]> = [];
                    let currentImageLineSizeSum = 0;
                    const calculatedLevelTotalSize = levelSponsorsEntries.reduce((acc, [, sponsor]) => acc + sponsor.size, 0);

                    levelSponsorsEntries.forEach(sponsorEntry => {
                        const sponsor = sponsorEntry[1];

                        if (currentImageLine.length > 0 && (currentImageLineSizeSum + sponsor.size) > maxLength) {
                            linesOfImagesForLevel.push(currentImageLine);
                            currentImageLine = [];
                            currentImageLineSizeSum = 0;
                        }
                        currentImageLine.push(sponsorEntry);
                        currentImageLineSizeSum += sponsor.size;
                    });
                    
                    if (currentImageLine.length > 0) {
                        linesOfImagesForLevel.push(currentImageLine);
                    }
                    
                    return {
                        levelKey: levelKey,
                        title: levelKey,
                        linesOfImages: linesOfImagesForLevel,
                        levelTotalSize: calculatedLevelTotalSize
                    };
                }).filter((l): l is ProcessedLevelDetails => l !== null);
                
                console.log('All processed level details:', allProcessedLevels);
                setDisplayableLevels(allProcessedLevels);
            })
            .catch(error => {
                console.error('Error loading or processing sponsors:', error);
            });
    }, [year]);


    const renderSponsorImages = (sponsorsInLine: Array<[string, Sponsor]>, lineKey: string) => {
        if (!sponsorsInLine || sponsorsInLine.length === 0) {
            return null;
        }

        console.log("newMaxLength", maxLength);

        return (
            <div key={lineKey} className={sponsorStyles.sponsorLine}>
                {sponsorsInLine.map(([name, sponsor]) => {
                    const style: React.CSSProperties = {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '0 1rem',
                        width: `${Math.min(sponsor.size, maxLength) * 1.8}rem`,
                        maxWidth: '100%',
                        flexShrink: 0,
                    };

                    return (
                        <div key={name} style={style}>
                            <Image
                                src={sponsor.filename}
                                alt={`${name} logo`}
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{
                                    objectFit: 'contain',
                                    width: '100%',
                                    height: 'auto',
                                    marginTop: '0.5rem',
                                    marginBottom: '0.5rem',
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        );
    };

    // Logic to group cards (ProcessedLevelDetails) into rows for display
    const rowsOfCards: Array<ProcessedLevelDetails[]> = [];
    if (displayableLevels.length > 0) {
        let currentRow: ProcessedLevelDetails[] = [];
        let currentRowCombinedSize = 0;

        displayableLevels.forEach(levelInfo => {
            // If current row is not empty AND adding this card would exceed MAX_LENGTH
            if (currentRow.length > 0 && (currentRowCombinedSize + levelInfo.levelTotalSize) > maxLength) {
                rowsOfCards.push([...currentRow]); // Finalize current row of cards
                currentRow = [levelInfo];          // Start new row with current card
                currentRowCombinedSize = levelInfo.levelTotalSize;
            } else {
                // Either current row is empty, or this card fits
                currentRow.push(levelInfo);
                currentRowCombinedSize += levelInfo.levelTotalSize;
            }
        });
        // Add the last accumulated row if it has any cards
        if (currentRow.length > 0) {
            rowsOfCards.push([...currentRow]);
        }
    }

    return (
        <div className="w-full py-4" ref={containerRef}>
            <div className="w-full mx-auto">
                {rowsOfCards.map((cardRow, rowIndex) => (
                    <div key={`card-row-${rowIndex}`} className="flex flex-wrap justify-start gap-4 mb-4">
                        {cardRow.map(levelDetails => {
                            const cardBaseClasses = `min-w-0`;

                            let className: string;
                            let style: React.CSSProperties | undefined;

                            if (cardRow.length > 1) {
                                // For multiple cards, they should grow proportionally based on their total size.
                                // `basis-0` ensures that flex-grow works from a zero basis, making it proportional.
                                className = `${cardBaseClasses} flex-1 basis-0`;
                                style = { flexGrow: levelDetails.levelTotalSize };
                            } else {
                                // For a single card, it should take up the full width.
                                className = `${cardBaseClasses} w-full`;
                            }
                            
                            return (
                                <Card key={levelDetails.levelKey} className={className} style={style}>
                                    <CardContent className="h-full p-4 flex flex-col">
                                        <div className={`${sponsorStyles.sponsorSection} text-center`}>
                                            <p className={sponsorStyles.sectionTitle}>{levelDetails.title}</p>
                                        </div>
                                        <div className="flex-grow flex flex-col justify-center items-center">
                                            <div
                                                className={sponsorStyles.levelContainer}
                                                style={cardRow.length === 1 ? { width: `${Math.min(100, (levelDetails.levelTotalSize / maxLength) * 100)}%` } : {}}
                                            >
                                                {levelDetails.linesOfImages.map((sponsorsInLine, imgLineIndex) => (
                                                    renderSponsorImages(sponsorsInLine, `${levelDetails.levelKey}-imgline-${imgLineIndex}`)
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}