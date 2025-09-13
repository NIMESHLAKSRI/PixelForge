export interface GeneratedImage {
  id: string;
  base64: string;
}

export type Theme = 'light' | 'dark';

export interface UploadedImage {
  base64: string;
  mimeType: string;
}

// FIX: Define the GalleryItem type for items stored in the gallery.
export interface GalleryItem {
  id: string;
  base64: string;
  prompt: string;
  negativePrompt: string;
  style: string;
  aspectRatio: string;
  isFavorite: boolean;
  createdAt: string;
}

// FIX: Define the UseGalleryReturn type for the return signature of the useGallery hook.
export interface UseGalleryReturn {
  gallery: GalleryItem[];
  addImage: (item: Omit<GalleryItem, 'isFavorite' | 'createdAt'>) => void;
  removeImage: (id: string) => void;
  toggleFavorite: (id: string) => void;
}
