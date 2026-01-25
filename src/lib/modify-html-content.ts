export const modifyHtmlContent = (htmlContent: string): string => {
    let updated = htmlContent.replace(
        /<h(1)(.*?)id="(.*?)"(.*?)>(.*)<\/h\1>/g,
        `<h1$2id="$3"$4>
            $5
            <a href="#$3" class="header-link">
                🔗
                <span class="tooltip" style="top: -20px;">
                    Get url to this section
                </span>
            </a>
        </h1>`
    );

    return updated;
};

export default modifyHtmlContent;
