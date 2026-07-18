import { marked } from 'marked';
import markedKatex from "marked-katex-extension";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { modifyHtmlContent } from '@/lib/modify-html-content';

marked.setOptions({
    gfm: true,
    breaks: true,
});

const markedKatexOptions = {
    throwOnError: false
};

marked.use(gfmHeadingId());
marked.use(markedKatex(markedKatexOptions));

export function processMarkdownFiles(parsedFiles: Array<{ data: any, content: string, filename: string }>) {
    return parsedFiles.map(({ data, content, filename }) => {
        const htmlContent = marked.parse(content) as string;
        const newHtmlContent = modifyHtmlContent(htmlContent);

        const dateMatch = filename.match(/(\d{4})(\d{2})(\d{2})/);
        const updatedDate = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : '-';

        const title = data.title || '';
        const coverImage = data.coverImage || '';
        const excerpt = data.excerpt || '';
        return {
            ...data,
            htmlContent: newHtmlContent,
            title,
            coverImage,
            updatedDate,
            excerpt,
        };
    });
}
