import { GoogleGenAI, Modality } from "@google/genai";
import { GeneratedImage, UploadedImage } from '../types';

// Ensure process.env.API_KEY is handled by the build environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a placeholder for a real-world scenario.
  // In a real app, you would handle this more gracefully,
  // perhaps by disabling functionality or showing a persistent error.
  console.error("API_KEY is not set. Please set it in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface GenerateImagesParams {
  prompt: string;
  negativePrompt?: string;
  numberOfImages?: number;
  aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  image?: UploadedImage | null;
}

export const generateImages = async ({
  prompt,
  negativePrompt,
  numberOfImages = 1,
  aspectRatio = "1:1",
  image = null,
}: GenerateImagesParams): Promise<GeneratedImage[]> => {
  try {
    let finalPrompt = prompt;
    if (negativePrompt && negativePrompt.trim()) {
      finalPrompt = `${prompt}. Do not include: ${negativePrompt}.`;
    }

    if (image) {
      // Image-to-Image generation
      const imagePart = {
        inlineData: {
          data: image.base64,
          mimeType: image.mimeType,
        },
      };
      const textPart = { text: finalPrompt };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
          parts: [imagePart, textPart],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });
      
      if (response.promptFeedback?.blockReason) {
        throw new Error(
          `Request was blocked: ${response.promptFeedback.blockReason}. ${response.promptFeedback.blockReasonMessage || ''}`.trim()
        );
      }

      const imageParts = response.candidates?.[0]?.content?.parts.filter(part => part.inlineData);
      
      if (!imageParts || imageParts.length === 0) {
        const textResponse = response.text?.trim();
        if (textResponse) {
          throw new Error(`Image editing failed: ${textResponse}`);
        }
        throw new Error("API did not return any images for editing. The response was empty.");
      }

      return imageParts.map(part => ({
        id: crypto.randomUUID(),
        base64: part.inlineData!.data,
      }));

    } else {
      // Text-to-Image generation
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: finalPrompt,
        config: {
          numberOfImages,
          aspectRatio,
          outputMimeType: 'image/jpeg',
        },
      });

      // FIX: The GenerateImagesResponse type does not have a 'promptFeedback' property.
      // This invalid check was removed to fix the compilation error. The subsequent
      // check for an empty `generatedImages` array handles generation failures.

      if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("API did not return any images.");
      }
      
      return response.generatedImages.map((img) => ({
          id: crypto.randomUUID(),
          base64: img.image.imageBytes,
      }));
    }
  } catch (error) {
    console.error("Error generating images:", error);
    if (error instanceof Error) {
        let errorMessage = error.message;
        // Try to parse for a more specific API error
        try {
          const jsonMatch = errorMessage.match(/{.*}/);
          if (jsonMatch) {
            const errorObj = JSON.parse(jsonMatch[0]);
            if (errorObj?.error?.status === 'RESOURCE_EXHAUSTED') {
              errorMessage = 'API quota exceeded. Please check your plan and billing details.';
            } else if (errorObj?.error?.message) {
              errorMessage = errorObj.error.message;
            }
          }
        } catch (e) {
          // Parsing failed, use the original message.
        }
        throw new Error(`Failed to generate images: ${errorMessage}`);
    }
    throw new Error("An unknown error occurred while generating images.");
  }
};