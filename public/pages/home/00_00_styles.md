<!-- This section lists the custom styles for the home page. -->

<style>
    .flex-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        flex-wrap: wrap;
    }

    .image-container {
        width: 40%;
        display: flex;
        flex-direction: column;
    }

    .image-box {
        background-color: #FFFFFF;
        border: 1px solid #ddd;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        margin-bottom: 10px;
        gap: 10px;
        object-fit: contain;
    }

    .logo-box{
        @extend .image-box;
        padding: 10px;
        height: 150px;
    }

    .image-caption{
        text-align: center; 
        padding: 8px; 
        font-style: italic; 
        font-size: 10px;
    }

    .responsive-image {
        max-height: 100%; 
        max-width: 100%;
        height: auto;
        width: auto;
        object-fit: contain;
    }

    .text-container {
        width: 60%;
        padding-right: 20px;
    }

    @media (max-width: 768px) {
        .image-container, .text-container {
            width: 100%;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin-left: 0;
            margin-right: 0;
        }

        .image-box {
            margin-left: 0;
            margin-right: 0;
            width: 100%;
        }

        .flex-container#icpc-foundation {
            flex-direction: column-reverse;
        }
    }

    .markdown .qualify-steps {
        display: flex;
        flex-direction: column;
        gap: 1.85rem;
        list-style: none;
        padding: 0.35rem 0 0.6rem;
        margin: 0.35rem 0 0.25rem;
    }

    .markdown .qualify-steps li {
        display: flex;
        flex: 1 1 auto;
        margin: 0;
        padding: 0;
        list-style: none;
        background: transparent;
        border: none;
    }

    .markdown .qualify-steps a {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.15rem;
        min-height: 7.25rem;
        margin: 0;
        padding: 1.05rem 1.35rem 1.1rem 1.15rem;
        color: inherit;
        text-align: left;
        text-decoration: none;
    }

    .markdown .qualify-steps a:hover {
        color: inherit;
        text-decoration: none;
    }

    .markdown .qualify-steps a:focus-visible {
        outline-style: solid;
        outline-width: 2px;
        outline-offset: 3px;
    }

    .markdown .qualify-steps strong {
        font-size: 1.05rem;
        line-height: 1.3;
    }

    .markdown .qualify-steps a > :not(.qualify-wash):not(.qualify-join):not(.qualify-external) {
        position: relative;
        z-index: 1;
    }

    .markdown .qualify-steps a > .qualify-external {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        z-index: 1;
        display: flex;
        pointer-events: none;
        line-height: 0;
    }

    .markdown .qualify-external svg {
        width: 0.875rem;
        height: 0.875rem;
    }

    .markdown .qualify-steps a:has(.qualify-external) strong {
        padding-right: 1.15rem;
    }

    .markdown .qualify-detail {
        font-size: 0.9rem;
        line-height: 1.45;
    }

    .markdown .qualify-steps a.qualify-split {
        flex-direction: column;
        align-items: stretch;
        gap: 0;
        padding: 0.4rem 0.3rem;
    }

    .markdown .qualify-half {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.2rem;
        padding: 0.7rem 0.9rem;
    }

    .markdown .qualify-split-arrow {
        position: relative;
        display: flex;
        flex: 0 0 auto;
        align-items: center;
        justify-content: center;
        height: 1.9rem;
    }

    .markdown .qualify-split-arrow::before {
        content: "";
        position: absolute;
        left: 0.85rem;
        right: 0.85rem;
        top: 50%;
        height: 1px;
        background: currentColor;
    }

    .markdown .qualify-split-mark {
        width: 1.9rem;
        height: 1.9rem;
        font-size: 1.35rem;
        font-weight: 600;
        line-height: 1;
        padding-left: 0.08rem;
        transform: rotate(90deg);
    }

    .markdown .qualify-steps a > .qualify-join {
        position: absolute;
        z-index: 1;
        left: 50%;
        bottom: -0.95rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.9rem;
        height: 1.9rem;
        margin-left: -0.95rem;
        border-radius: 999px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
        font-size: 1.35rem;
        font-weight: 600;
        line-height: 1;
        padding-left: 0.08rem;
        transform: rotate(90deg);
        pointer-events: none;
    }

    @media (min-width: 640px) {
        .markdown .qualify-steps a.qualify-split {
            flex-direction: row;
        }

        .markdown .qualify-split-arrow {
            width: 1.9rem;
            height: auto;
            align-self: stretch;
        }

        .markdown .qualify-split-arrow::before {
            left: 50%;
            right: auto;
            top: 0.85rem;
            bottom: 0.85rem;
            width: 1px;
            height: auto;
            transform: translateX(-50%);
        }

        .markdown .qualify-split-mark {
            transform: none;
        }
    }

    @media (min-width: 960px) {
        .markdown .qualify-steps {
            flex-direction: row;
            align-items: stretch;
            gap: 1.85rem;
        }

        .markdown .qualify-steps li {
            flex: 1 1 0;
        }

        .markdown .qualify-steps li:first-child {
            flex: 2.15 1 0;
        }

        .markdown .qualify-split .qualify-half:last-of-type {
            padding-right: 1.35rem;
        }

        .markdown .qualify-steps a > .qualify-join {
            left: auto;
            bottom: auto;
            right: -0.95rem;
            top: 50%;
            margin-left: 0;
            margin-top: -0.95rem;
            transform: none;
        }
    }

    .dark .markdown .qualify-steps a,
    .dark .markdown .qualify-steps a:hover {
        color: inherit;
        text-decoration: none;
    }

</style>

