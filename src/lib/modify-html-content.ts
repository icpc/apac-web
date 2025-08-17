export const modifyHtmlContent = (htmlContent: string): string => {
    return htmlContent.replace(
        /<h1.* id="(.*)">(.*)<\/h1>/g,
        `<h2 id="$1">
            $2 
            <a href="#$1" class="header-link">
                🔗
                <span class="tooltip" style="top: -20px;">
                    Get url to this section
                </span>
            </a>
        </h2>`
    );
};

export default modifyHtmlContent;
