"use client";

import Container from "@/app/_components/pages/container";
import { Intro } from "@/app/_components/pages/intro";
import { Content } from "@/app/_components/pages/content";
import { useEffect, useState } from "react";

export default function Index() {
  const [markdownContents, setMarkdownContents] = useState<
    { title: string; coverImage: string; date: string; excerpt: string; htmlContent: string }[]
  >([]);

  useEffect(() => {
    async function loadMarkdown() {
      try {
        const response = await fetch(`/api/fetch-markdown?slug=home`);
        if (!response.ok) {
          throw new Error("Failed to fetch markdown files");
        }
        const markdownFiles = await response.json();
        const contents = markdownFiles.map((file: any) => ({
          ...file,
          date: file.updatedDate,
          htmlContent: file.htmlContent,
        }));
        setMarkdownContents(contents);
      } catch (error) {
        console.error("Error loading markdown:", error);
      }
    }

    loadMarkdown();
  }, []);

  return (
    <main>
      <Intro />
      <div className="">
        {markdownContents.map((content, index) => (
          <div key={index} className={content.coverImage ? "pt-2 mt-8 pb-8 relative" : ""}>
            {(
              <div className={`absolute top-0 left-0 right-0 bottom-0 z-[-1] opacity-10`}
                style={{
                  backgroundImage: content.coverImage.startsWith('/assets') ? `url(${content.coverImage})` : "",
                  backgroundColor: content.coverImage.startsWith('rgba') || /^#[0-9A-Fa-f]{6}$/.test(content.coverImage) ? content.coverImage : "",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />
            )}
            
            <Container>
              <Content content={content.htmlContent} />
            </Container>
          </div>
        ))}
      </div>
    </main>
  );
}
