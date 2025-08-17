import React from 'react';

const InstagramEmbed: React.FC = () => {
  return (
    <div className="relative bg-white">
      <script async src="https://www.instagram.com/embed.js"></script>
      <blockquote
        className="instagram-media bg-white border-0 rounded-lg m-1 min-w-[326px] p-0 w-[calc(100%-2px)]"
        data-instgrm-permalink="https://www.instagram.com/icpcapac/"
        data-instgrm-version="14"
      ></blockquote>
    </div>
  );
};

export default InstagramEmbed;
