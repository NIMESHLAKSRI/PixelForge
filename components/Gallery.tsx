import React, { useState, useMemo } from 'react';
import { UseGalleryReturn } from '../types';
import { ImageCard } from './ImageCard';
import { SearchIcon } from './common/Icon';

interface GalleryProps {
  galleryHook: UseGalleryReturn;
}

export const Gallery: React.FC<GalleryProps> = ({ galleryHook }) => {
  const { gallery, removeImage, toggleFavorite } = galleryHook;
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredGallery = useMemo(() => {
    return gallery.filter(item => {
      const matchesSearch = item.prompt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFavorite = !showFavorites || item.isFavorite;
      return matchesSearch && matchesFavorite;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [gallery, searchTerm, showFavorites]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">My Gallery</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-20 bg-white dark:bg-gray-900 py-4 z-10">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by prompt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 border rounded-md pl-10 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`px-4 py-2 rounded-md font-semibold transition-colors ${showFavorites ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
        >
          {showFavorites ? 'Show All' : 'Show Favorites'}
        </button>
      </div>

      {filteredGallery.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGallery.map(item => (
            <ImageCard
              key={item.id}
              image={{ id: item.id, base64: item.base64 }}
              promptOptions={{
                prompt: item.prompt,
                negativePrompt: item.negativePrompt,
                style: item.style,
                aspectRatio: item.aspectRatio,
              }}
              isFavorited={item.isFavorite}
              onFavorite={() => toggleFavorite(item.id)}
              onRemove={() => removeImage(item.id)}
              isInGallery={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Your gallery is empty or no results found.</p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">Start creating images to add them here!</p>
        </div>
      )}
    </div>
  );
};