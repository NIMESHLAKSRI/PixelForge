import React, { useState, useCallback, useEffect } from 'react';
import { GeneratedImage, UploadedImage } from '../types';
import { generateImages } from '../services/geminiService';
import { ControlPanel } from './ControlPanel';
import { ImageCard } from './ImageCard';
import { ASPECT_RATIOS, STYLE_PRESETS } from '../constants';
import { Spinner } from './common/Spinner';

export const Generator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState(STYLE_PRESETS[0].value);
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0]);
  const [imageCount, setImageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);

  useEffect(() => {
    if (uploadedImage) {
      setImageCount(1);
    }
  }, [uploadedImage]);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    try {
      const fullPrompt = style ? `${prompt}, ${style}` : prompt;
      const images = await generateImages({
        prompt: fullPrompt,
        negativePrompt,
        numberOfImages: imageCount,
        aspectRatio: aspectRatio as "1:1" | "16:9" | "9:16" | "4:3" | "3:4",
        image: uploadedImage,
      });
      setGeneratedImages(images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, negativePrompt, style, imageCount, aspectRatio, uploadedImage]);

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image);
  };

  const handleImageRemove = () => {
    setUploadedImage(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <ControlPanel
          prompt={prompt} setPrompt={setPrompt}
          negativePrompt={negativePrompt} setNegativePrompt={setNegativePrompt}
          style={style} setStyle={setStyle}
          aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
          imageCount={imageCount} setImageCount={setImageCount}
          isLoading={isLoading} handleGenerate={handleGenerate}
          uploadedImage={uploadedImage}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
        />
      </div>

      <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg min-h-[600px] flex flex-col justify-center items-center transition-colors">
        {isLoading && (
          <div className="text-center">
            <Spinner />
            <p className="mt-4 text-gray-500 dark:text-gray-400 animate-pulse-fast">Generating your masterpiece...</p>
          </div>
        )}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!isLoading && !error && generatedImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {generatedImages.map((img) => (
              <ImageCard
                key={img.id}
                image={img}
                promptOptions={{ prompt, negativePrompt, style, aspectRatio }}
              />
            ))}
          </div>
        )}
        {!isLoading && !error && generatedImages.length === 0 && (
            <div className="text-center text-gray-500">
                <p>Your generated images will appear here.</p>
                <p>Enter a prompt and click the send button to start.</p>
            </div>
        )}
      </div>
    </div>
  );
};
