import OpenAI from 'openai';

class ImageService {
  private openai: OpenAI | null = null;

  constructor() {
    this.initializeOpenAI();
  }

  private initializeOpenAI() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your environment variables.');
      return;
    }

    try {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
      });
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
    }
  }

  async generateImage(description: string, babyName: string): Promise<string | null> {
    if (!this.openai) {
      console.warn('OpenAI not configured, returning null');
      return null;
    }

    try {
      // Enhance the prompt for child-friendly, colorful illustrations
      const enhancedPrompt = `Create a beautiful, child-friendly illustration for a baby story. ${description}. Style: soft watercolor, bright cheerful colors, gentle and safe for babies, cartoon-like, warm lighting, no scary elements. The image should be suitable for a children's book.`;

      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      });

      return response.data[0]?.url || null;
    } catch (error) {
      console.error('Error generating image with DALL-E:', error);
      return null;
    }
  }

  isConfigured(): boolean {
    return this.openai !== null;
  }
}

export const imageService = new ImageService();