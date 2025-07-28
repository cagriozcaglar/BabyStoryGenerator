import { GoogleGenerativeAI } from '@google/generative-ai';
import { StoryParams } from '../components/StoryForm';
import { imageService } from './imageService';
import { videoService } from './videoService';

export interface StoryContent {
  text: string;
  images: Array<{
    description: string;
    url: string | null;
    isLoading: boolean;
  }>;
  hasVideo: boolean;
  videoUrl: string | null;
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    this.initializeGemini();
  }

  private initializeGemini() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your environment variables.');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (error) {
      console.error('Failed to initialize Gemini:', error);
    }
  }

  async generateStory(params: StoryParams): Promise<StoryContent> {
    if (!this.model) {
      throw new Error('Gemini API is not properly configured. Please check your API key.');
    }

    const prompt = this.createStoryPrompt(params);

    try {
      const result = await this.generateContentWithRetry(prompt);
      const response = await result.response;
      const story = response.text();
      
      const formattedStory = this.formatStory(story);
      const storyContent = await this.processStoryWithMedia(formattedStory, params.babyName);
      
      return storyContent;
    } catch (error) {
      console.error('Error generating story with Gemini:', error);
      throw new Error('Failed to generate story. Please try again.');
    }
  }

  private async generateContentWithRetry(prompt: string, maxRetries: number = 3): Promise<any> {
    let lastError: any;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.model.generateContent(prompt);
      } catch (error: any) {
        lastError = error;
        
        // Check if it's a 503 overload error
        if (error.message && error.message.includes('503') && error.message.includes('overloaded')) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.log(`Gemini API overloaded, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
          
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        
        // If it's not a 503 error or we've exhausted retries, throw immediately
        throw error;
      }
    }
    
    throw lastError;
  }

  private async processStoryWithMedia(story: string, babyName: string): Promise<StoryContent> {
    // Remove image placeholders from story text
    const cleanStory = story.replace(/\[IMAGE:\s*(.+?)\]/g, '').replace(/\n\s*\n\s*\n/g, '\n\n');
    const images: StoryContent['images'] = [];
    let videoUrl: string | null = null;
    
    // Generate video if service is available
    if (videoService.isAvailable()) {
      this.generateVideoAsync(cleanStory, babyName).then(url => {
        if (url) {
          videoUrl = url;
        }
      });
    }

    return {
      text: cleanStory,
      images,
      hasVideo: videoService.isAvailable(),
      videoUrl
    };
  }

  private async generateVideoAsync(story: string, babyName: string): Promise<string | null> {
    try {
      // Create a video description based on the story
      const videoDescription = `A gentle animated story featuring ${babyName} with colorful characters in a magical setting. The story includes friendly animals and teaches about friendship and kindness. Show ${babyName} interacting with cute animals in a beautiful, safe environment with soft colors and gentle movements.`;
      
      return await videoService.generateVideo(videoDescription, babyName, 6);
    } catch (error) {
      console.error('Error generating video:', error);
      return null;
    }
  }

  private createStoryPrompt(params: StoryParams): string {
    const charactersText = params.characters.length > 0 
      ? `featuring ${params.characters.join(', ')} as main characters` 
      : 'with friendly animal characters';

    return `Create a gentle, age-appropriate bedtime story for a baby named ${params.babyName} (age: ${params.babyAge}). 

Story requirements:
- Theme: ${params.theme}
- Setting: ${params.setting}
- Main characters: ${charactersText}
- Emotional tone: ${params.feeling}
- Life lesson: ${params.lesson}
- Length: 6-8 short paragraphs suitable for babies/toddlers
- Language: Simple, soothing, and repetitive words
- Style: Warm, comforting, and magical

The story should:
1. Be calming and perfect for bedtime
2. Use simple vocabulary appropriate for the baby's age
3. Include the baby's name throughout the story
4. Have a positive, uplifting message about ${params.lesson}
5. Create a sense of wonder and safety
6. End with a peaceful, sleepy conclusion

IMPORTANT: Write the story as flowing paragraphs of text only. Do NOT include any image placeholders, image descriptions, or visual references. Focus purely on the narrative text that will be read aloud.
`;

  }

  private formatStory(story: string): string {
    // Clean up the story text and ensure proper paragraph formatting
    let formatted = story.trim();
    
    // Remove any image placeholders that might have been generated
    formatted = formatted.replace(/\[IMAGE:\s*[^\]]*\]/gi, '');
    formatted = formatted.replace(/\[Image:\s*[^\]]*\]/gi, '');
    formatted = formatted.replace(/Image Placeholder/gi, '');
    formatted = formatted.replace(/\(Image:\s*[^)]*\)/gi, '');
    
    // Remove any markdown formatting that might come from Gemini
    formatted = formatted.replace(/\*\*/g, '');
    formatted = formatted.replace(/\*/g, '');
    formatted = formatted.replace(/#{1,6}\s/g, '');
    
    // Ensure proper paragraph breaks
    formatted = formatted.replace(/\n\s*\n/g, '\n\n');
    
    // Clean up any extra whitespace left by removed placeholders
    formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Remove extra whitespace
    formatted = formatted.replace(/[ \t]+/g, ' ');
    
    return formatted;
  }

  isConfigured(): boolean {
    return this.model !== null;
  }
}

export const geminiService = new GeminiService();