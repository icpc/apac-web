import cn from "classnames";
import Image from "next/image";
import { getAssetUrl } from "@/lib/base-path";

type Props = {
    title: string;
    coverImage: string;
};

const CoverImage = ({ title, src, slug }: { title: string; src: string; slug?: string }) => {
    if (!src || !isValidUrl(src)) {
        console.log(`Invalid image URL for title: ${title} and image src: ${src}`);
        src = "/assets/header/mbs.png"; {/* Default image if src is invalid */ }
    }

    const image = (
        <Image
            src={getAssetUrl(src)}
            alt={`Cover Image for ${title}`}
            className={cn("w-full h-full object-cover")}
            layout="fill"
        />
    );

    return (
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
            {slug ? (
                <a aria-label={title}>
                    {image}
                </a>
            ) : (
                image
            )}
        </div>
    );
};

// Helper function to validate URL
function isValidUrl(url: string): boolean {
    try {
        if (url.startsWith('/')) {
            return true;
        }
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function PageHeader({ title, coverImage }: Props) {
    return (
        <div className="relative w-full h-[30vh] lg:h-[40vh] flex flex-col justify-center items-center text-center text-white bg-white/70 dark:bg-black/60">
            <CoverImage title={title} src={coverImage} />
            <p className="text-6xl lg:text-7xl font-bold tracking-tighter leading-tight mb-12 pt-24 text-text-header-primary dark:text-text-header-primary-dark mx-auto">
                {title}
            </p>            
        </div>
    );
}
