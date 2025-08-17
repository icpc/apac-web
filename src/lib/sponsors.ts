// src/lib/sponsors.ts
import { promises as fs } from 'fs';
import { marked } from 'marked';

export async function getSponsors(sponsorsFilePath) {
    try {
        const fileContents = await fs.readFile(sponsorsFilePath, 'utf8');
        const htmlContent = marked(fileContents);
        const imageSources = fileContents.match(/!\[.*?\]\((.*?)\)/g)?.map(img => img.match(/\((.*?)\)/)[1]) || [];
        return {
            htmlContent,
            imageSources,
        };
    } catch (error) {
        console.error("Error reading sponsors file:", error);
        return null;
    }
}