import React, { useState, useRef } from 'react';
import { ASPECT_RATIOS, STYLE_PRESETS } from '../constants';
import { PlusIcon, GenerateIcon, SettingsIcon } from './common/Icon';
import { Spinner } from './common/Spinner';
import { UploadedImage } from '../types';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  style: string;
  setStyle: (value: string) => void;
  aspectRatio: string;
  setAspectRatio: (value: string) => void;
  imageCount: number;
  setImageCount: (value: number) => void;
  isLoading: boolean;
  handleGenerate: () => void;
  uploadedImage: UploadedImage | null;
  onImageUpload: (image: UploadedImage) => void;
  onImageRemove: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  style,
  setStyle,
  aspectRatio,
  setAspectRatio,
  imageCount,
  setImageCount,
  isLoading,
  handleGenerate,
  uploadedImage,
  onImageUpload,
  onImageRemove,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isImageEditing = !!uploadedImage;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onImageUpload({
          base64: base64String,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col transition-colors duration-300 border border-gray-200 dark:border-gray-700 focus-within:border-blue-500">
        <div className="p-4 flex-grow">
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A photorealistic image of a futuristic city at sunset..."
            className="w-full bg-transparent border-none p-0 focus:ring-0 focus:outline-none resize-none text-base placeholder-gray-500 dark:placeholder-gray-400"
            rows={3}
            aria-label="Image generation prompt"
          />
          {uploadedImage && (
            <div className="relative inline-block mt-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
              <img src={`data:${uploadedImage.mimeType};base64,${uploadedImage.base64}`} alt="Upload preview" className="rounded-md max-h-32 w-auto" />
              <button
                onClick={onImageRemove}
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 transition-colors"
                aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center p-2">
          <div className="flex items-center space-x-1">
            <button onClick={triggerFileUpload} disabled={isLoading} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors disabled:opacity-50" title="Add Image">
              <PlusIcon className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors" title="Toggle Advanced Settings">
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="p-2 rounded-full bg-white hover:bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            title="Generate"
          >
            {isLoading ? <Spinner /> : <GenerateIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-4">
          <div>
            <label htmlFor="negative-prompt" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Negative Prompt</label>
            <textarea
              id="negative-prompt"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="e.g., blurry, cartoon, low quality"
              className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="style" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Style Preset</label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {STYLE_PRESETS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="aspect-ratio" className={`block text-sm font-medium mb-1 transition-colors ${isImageEditing ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>Aspect Ratio</label>
              <select
                id="aspect-ratio"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                disabled={isImageEditing}
                className={`w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isImageEditing ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-500' : ''}`}
              >
                {ASPECT_RATIOS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {isImageEditing && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Not applicable for image editing.</p>}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors ${isImageEditing ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
              Number of Images
            </label>
            <div className={`inline-flex rounded-md shadow-sm ${isImageEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {[1, 2, 3, 4].map((count, index) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => !isImageEditing && setImageCount(count)}
                  className={`px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150
                    ${(imageCount === count && !isImageEditing) || (isImageEditing && count === 1)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }
                    ${index === 0 ? 'rounded-l-md' : '-ml-px'}
                    ${index === 3 ? 'rounded-r-md' : ''}
                    ${isImageEditing ? 'cursor-not-allowed' : ''}
                  `}
                >
                  {count}
                </button>
              ))}
            </div>
            {isImageEditing && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Image editing generates one image.</p>}
          </div>
        </div>
      )}
    </div>
  );
};