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
          const activeTheme = process.env.NEXT_PUBLIC_THEME || "blue";
          const processedCoverImage = content.coverImage ? content.coverImage.replace("[theme]", activeTheme) : "";
          const hasCoverImage = Boolean(processedCoverImage);
          const isClassBased = processedCoverImage.includes("bg-");
          const backgroundImage = !isClassBased && processedCoverImage.startsWith("/assets") ? `url(${processedCoverImage})` : undefined;

          const backgroundColor =
            !isClassBased && (processedCoverImage.startsWith("rgba") || /^#[0-9A-Fa-f]{6}$/.test(processedCoverImage)) ? processedCoverImage : undefined;

          return (
            <div key={index} className={hasCoverImage ? "pt-2 mt-8 pb-8 relative overflow-hidden" : "mt-8"}>
              {hasCoverImage && (
                <div
                  className={`absolute top-0 left-0 right-0 bottom-0 z-[-1] opacity-10 ${isClassBased ? processedCoverImage : ''}`}
                  style={{
                    backgroundImage,
                    backgroundColor,
                    backgroundSize: "contain",
                    backgroundPosition: "calc(20% - 10rem) center",
                    backgroundRepeat: "no-repeat",
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
