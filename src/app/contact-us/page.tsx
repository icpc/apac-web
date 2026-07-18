import Container from "@/components/common/container";
import { Content } from "@/app/_components/pages/content";
import InstagramEmbed from "@/app/_components/pages/instagram-embed";
import { getMarkdownContent } from "@/lib/get-markdown-content";

export const dynamic = "force-static";

export default async function ContactUs() {
  const [markdownContent] = await getMarkdownContent("contact-us");

  const pageTitle = markdownContent?.title || "Contact Us";
  const htmlContent = markdownContent?.htmlContent || "";

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-4xl font-bold text-text-header-secondary mb-8">{pageTitle}</h1>
        <Content content={htmlContent} />

        <div className="mt-12 w-full">
          <InstagramEmbed />
        </div>
      </div>
    </Container>
  );
}
