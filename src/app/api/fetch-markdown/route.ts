import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import markedKatex from "marked-katex-extension";
import { type NextRequest } from 'next/server'

import { gfmHeadingId } from "marked-gfm-heading-id";
import { processMarkdownFiles } from '@/lib/markdown-utils';

marked.setOptions({
    gfm: true,
    breaks: true,
});

const markedKatexOptions = {
  throwOnError: false
};

marked.use(gfmHeadingId());
marked.use(markedKatex(markedKatexOptions));

export function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const slugQuery = searchParams.get('slug')
        if (!slugQuery) {
            return new Response('No slug provided', { status: 400 });
        }
        const slug = slugQuery.replace(/%2F/g, '/');
        console.log(slug);

        if (slug.startsWith('assets')) {
            const filePath = path.join(process.cwd(), 'public', slug);
            if (fs.existsSync(filePath)) {
                const fileContents = fs.readFileSync(filePath);
                const fileType = path.extname(filePath).substring(1);
                
                return new Response(fileContents, {
                    status: 200,
                    headers: {
                        'Content-Type': `application/${fileType}`,
                        'Content-Disposition': `inline; filename="${path.basename(filePath)}"`,
                    },
                });
            } else {
                return new Response('File not found', { status: 404 });
            }
        }

        const parsedFiles = getMarkdownFiles(slug);
        if (parsedFiles.length === 0) {
            return new Response('No markdown files found', { status: 400 });
        }

        const responseFiles = processMarkdownFiles(parsedFiles);

        return new Response(JSON.stringify(responseFiles), { status: 200 });
    } catch (error) {
        console.error('Error reading markdown files:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

function getMarkdownFiles(slug: string) {
    const directoryPath = path.join(process.cwd(), 'public/pages', slug);
    const filenames = fs.readdirSync(directoryPath);
    
    const filesWithIdentifiers = filenames
        .map(filename => {
            const identifierMatch = slug === 'home' ? filename.match(/(\d{2})_(\d{2})/) : filename.match(/(\d{4})(\d{2})(\d{2})/);
            const identifier = identifierMatch ? `${identifierMatch[1]}-${identifierMatch[2]}-${identifierMatch[3]}` : '';
            return { filename, order: identifier };
        })
        .filter(file => file.order);

    const sortedFilesByIdentifier = filesWithIdentifiers.sort((a, b) => {
        if (slug === 'home') {
            return a.order.localeCompare(b.order); // Ascending order
        } else {
            return b.order.localeCompare(a.order); // Descending order
        }
    });

    return sortedFilesByIdentifier.map(({ filename }) => {
        const filePath = path.join(directoryPath, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        return { data, content, filename };
    });
}
