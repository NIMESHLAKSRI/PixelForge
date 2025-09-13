
import { useState, useEffect, useCallback } from 'react';
import { GalleryItem, UseGalleryReturn } from '../types';

const GALLERY_STORAGE_KEY = 'gemini-image-gallery';

export const useGallery = (): UseGalleryReturn => {
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const storedItems = window.localStorage.getItem(GALLERY_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error('Error reading gallery from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(gallery));
    } catch (error) {
      console.error('Error saving gallery to localStorage', error);
    }
  }, [gallery]);

  const addImage = useCallback((item: Omit<GalleryItem, 'isFavorite' | 'createdAt'>) => {
    const newItem: GalleryItem = {
      ...item,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };
    setGallery((prevGallery) => [newItem, ...prevGallery]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setGallery((prevGallery) => prevGallery.filter((item) => item.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setGallery((prevGallery) =>
      prevGallery.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  }, []);

  return { gallery, addImage, removeImage, toggleFavorite };
};
