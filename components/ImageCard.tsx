

import React, { useState } from 'react';
import { GeneratedImage } from '../types';
// FIX: Import additional icons for gallery actions.
import { DownloadIcon, HeartIcon, SolidHeartIcon, TrashIcon } from './common/Icon';

interface ImageCardProps {
  image: GeneratedImage;
  promptOptions: {
    prompt: string;
    negativePrompt: string;
    style: string;
    aspectRatio: string;
  };
  // FIX: Add optional props for gallery functionality to resolve type errors.
  isFavorited?: boolean;
  onFavorite?: () => void;
  onRemove?: () => void;
  isInGallery?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  promptOptions,
  // FIX: Destructure new props to be used in the component.
  isFavorited,
  onFavorite,
  onRemove,
  isInGallery = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${image.base64}`;
    link.download = `${promptOptions.prompt.slice(0, 30).replace(/\s+/g, '_')}_${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const ActionButton: React.FC<{ onClick?: () => void, children: React.ReactNode, title: string }> = ({ onClick, children, title }) => (
    <button onClick={onClick} title={title} className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-all">
      {children}
    </button>
  );

  return (
    <div
      className="relative group aspect-w-1 aspect-h-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`data:image/jpeg;base64,${image.base64}`}
        alt={promptOptions.prompt}
        className="object-cover w-full h-full rounded-lg shadow-lg"
      />
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 rounded-lg ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute top-2 right-2 flex items-center space-x-2">
           {/* FIX: Conditionally render gallery action buttons. */}
           {isInGallery && onFavorite && (
            <ActionButton onClick={onFavorite} title={isFavorited ? "Unfavorite" : "Favorite"}>
              {isFavorited ? (
                <SolidHeartIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
            </ActionButton>
          )}
           <ActionButton onClick={handleDownload} title="Download Image">
              <DownloadIcon className="w-5 h-5" />
           </ActionButton>
           {isInGallery && onRemove && (
            <ActionButton onClick={onRemove} title="Remove Image">
              <TrashIcon className="w-5 h-5" />
            </ActionButton>
          )}
        </div>
        <div className="absolute bottom-0 left-0 p-3">
          <p className="text-sm text-white font-semibold line-clamp-2">{promptOptions.prompt}</p>
        </div>
      </div>
    </div>
  );
};
