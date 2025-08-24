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
</style>

