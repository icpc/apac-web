import Container from "@/components/common/container";
import { Intro } from "@/app/_components/pages/intro";
import { Content } from "@/app/_components/pages/content";
import { getMarkdownContent } from "@/lib/get-markdown-content";

export const dynamic = "force-static";

export default async function Index() {
  const markdownContents = await getMarkdownContent("home");

  return (
    <main>
      <Intro />
      <div>
        {markdownContents.map((content, index) => {
          const coverImage = content.coverImage || "";
          const hasCoverImage = Boolean(coverImage);
          const isClassBased = coverImage.includes("bg-");
          const backgroundImage = !isClassBased && coverImage.startsWith("/assets") ? `url(${coverImage})` : undefined;
          const backgroundColor =
            !isClassBased && (coverImage.startsWith("rgba") || /^#[0-9A-Fa-f]{6}$/.test(coverImage)) ? coverImage : undefined;

          return (
            <div key={index} className={hasCoverImage ? "pt-2 mt-8 pb-8 relative" : "mt-8"}>
              {hasCoverImage && (
                <div
                  className={`absolute top-0 left-0 right-0 bottom-0 z-[-1] opacity-10 ${isClassBased ? coverImage : ''}`}
                  style={{
                    backgroundImage,
                    backgroundColor,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}

              <Container>
                <Content content={content.htmlContent} />
              </Container>
            </div>
          );
        })}
      </div>
    </main>
  );
}
