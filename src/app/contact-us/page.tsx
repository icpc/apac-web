"use client";

import { useState, useEffect } from "react";
import Container from "@/app/_components/pages/container";
import { Content } from "@/app/_components/pages/content";
import InstagramEmbed from "@/app/_components/pages/instagram-embed";

export default function ContactUs() {
  const [markdownContent, setMarkdownContent] = useState<{
    title: string;
    htmlContent: string;
  } | null>(null);

  useEffect(() => {
    async function loadContactContent() {
      try {
        const response = await fetch(`/api/fetch-markdown?slug=contact-us`);
        if (!response.ok) {
          throw new Error("Failed to fetch contact content");
        }
        const data = await response.json();
        
        if (data.length > 0) {
          setMarkdownContent({
            title: data[0].title || "Contact Us",
            htmlContent: data[0].htmlContent || ""
          });
        }
      } catch (error) {
        console.error("Error loading contact content:", error);
      }
    }

    loadContactContent();
  }, []);

  if (!markdownContent) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryAccent"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-4xl font-bold text-text-header-secondary mb-8">
          {markdownContent.title}
        </h1>
        <Content content={markdownContent.htmlContent} />
        
        <div className="mt-12 w-full">
          <InstagramEmbed />
        </div>
      </div>
    </Container>
  );
}