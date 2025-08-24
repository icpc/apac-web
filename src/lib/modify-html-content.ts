export const modifyHtmlContent = (htmlContent: string): string => {
    return htmlContent.replace(
        /<h(2)(.*?)id="(.*?)"(.*?)>(.*)<\/h\1>/g,
        `<h2$2id="$3"$4>
            $5
            <a href="#$3" class="header-link">
                🔗
                <span class="tooltip" style="top: -20px;">
                    Get url to this section
                </span>
            </a>
        </h2>`
    );
};

export default modifyHtmlContent;
