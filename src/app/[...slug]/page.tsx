"use client";

import { redirect } from "next/navigation";
import Container from "@/app/_components/pages/container";
import { Content } from "@/app/_components/pages/content";
import { PageHeader } from "@/app/_components/pages/header";
import { notFound } from 'next/navigation';
import { useEffect, useState } from "react";
import React from 'react';
import { marked } from 'marked';
import diff from 'html-diff-ts';
import DateFormatter from "@/app/_components/pages/date-formatter";
import InstagramEmbed from "@/app/_components/pages/instagram-embed";
import Divider from "@/app/_components/Divider";

marked.setOptions({
    gfm: true,
    breaks: true,
});

interface Params {
    slug: string[];
}

interface MarkdownContent {
    title: string;
    coverImage: string;
    updatedDate: string;
    htmlContent: string;
}

function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

export default function DynamicPage({ params }: { params: Promise<Params> }) {
    const [resolvedParams, setResolvedParams] = useState<Params | null>(null);
    const [markdownContent, setMarkdownContent] = useState<MarkdownContent>({
        title: "Loading the title...",
        coverImage: "Loading the cover image...",
        updatedDate: "Loading the date...",
        htmlContent: "Loading the content..."
    });
    const [history, setHistory] = useState<MarkdownContent[]>([markdownContent]);
    const [index, setIndex] = useState(0);
    const [isValidPage, setIsValidPage] = useState(true);

    useEffect(() => {
        async function resolveParams() {
            try {
                const result = await params;
                setResolvedParams(result);
            } catch (error) {
                console.error('Error resolving params:', error);
                setIsValidPage(false);
            }
        }

        resolveParams();
    }, [params]);

    useEffect(() => {
        if (!resolvedParams) return;

        const { slug } = resolvedParams;
        const slugArray = Array.isArray(slug) ? slug : [slug];

        if (slugArray.length > 0 && slugArray[0] === 'championship') {
            notFound();
            return;
        }

        if (slugArray.join('/') === 'home') {
            redirect('/');
            return;
        }

        async function loadMarkdown() {
            try {
                const slugPath = slugArray.join('%2F');
                const response = await fetch('/api/fetch-markdown?slug=' + slugPath, {cache:"no-store"});
                if (!response.ok) {
                    console.error('Error fetching markdown:', response.statusText);
                    setIsValidPage(false);
                } else {
                    const content = await response.json();
                    setHistory(content);
                }
            } catch (error) {
                console.error('Error loading markdown:', error);
            }
        }

        loadMarkdown();
    }, [resolvedParams]);

    useEffect(() => {
        if (isValidPage && history.length > 0) {
            const resolvedContent = {
                ...history[0],
                htmlContent: history[0].htmlContent,
            };
            if (index > 0) {
                const prevContent = {
                    ...history[index],
                    htmlContent: history[index].htmlContent,
                }

                const diffResult = diff(prevContent.htmlContent, resolvedContent.htmlContent);
                resolvedContent.htmlContent = diffResult;
            }
            setMarkdownContent(resolvedContent);
        }
    }, [isValidPage, index, history]);

    if (!resolvedParams) {
        return <div>Loading...</div>;
    } else if (!isValidPage) {
        return notFound();
    }

    console.log("Markdown Content:", markdownContent);

    return (
        <main suppressHydrationWarning>
            <PageHeader title={markdownContent.title} coverImage={markdownContent.coverImage} />
            <Container>
                <div className="flex flex-col lg:flex-row lg:space-x-8 my-4">
                    <div className="lg:w-4/5 my-auto">
                        <p>Last updated on: <DateFormatter dateString={markdownContent.updatedDate} /></p>
                    </div>
                    <div className="lg:text-right mt-3 mb-1 lg:my-auto">
                        <span className={history.length === 1 ? "opacity-50 dark:opacity-30" : ""}>
                            <span>
                                Compare with version: {" "}
                                <select 
                                    onChange={(e) => setIndex(Number(e.target.value))} 
                                    value={index} 
                                    className="text-text-body bg-grey-300 rounded-lg py-1"
                                    disabled={history.length === 1}
                                >
                                    {history.map((item, idx) => (
                                        <option 
                                            key={idx} 
                                            value={idx}
                                            className="text-text-body"
                                        >
                                            {history.length === 1 && idx === 0 
                                                ? 'No previous versions available' 
                                                : `${idx === 0 ? '-' : formatDate(item.updatedDate)}`
                                            }
                                        </option>
                                    ))}
                                </select>
                            </span>
                        </span>
                    </div>
                </div>
                <Divider />

                <Content content={markdownContent.htmlContent} />
                
                {/* TODO improve embedd instagram to the contact page */}
                <div className={`${markdownContent.title === 'Contact Us' ? 'block mb-16' : 'hidden'}`}>
                    <InstagramEmbed />
                </div>
            </Container>
        </main>
    );
}
