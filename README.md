# Baby Story Generator MVP

A beautiful, personalized story generator for babies and toddlers powered by Google's Gemini AI.

## Features

- 🎯 **Personalized Stories**: Generate unique stories based on baby's name, age, and preferences
- 🔊 **Audio Narration**: Text-to-speech functionality with multiple voice options
- 🎬 **Video Generation**: Animated story videos powered by Google Veo2
- 🎨 **Beautiful Design**: Child-friendly interface with smooth animations
- 📱 **Responsive**: Works perfectly on all devices
- 💾 **Download Stories**: Save generated stories as text files

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Gemini API**
   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Copy `.env.example` to `.env`
   - Add your API key to the `.env` file:
     ```
     VITE_GEMINI_API_KEY=your_actual_api_key_here
     ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## GitHub Pages Deployment

When deployed to GitHub Pages, the app will prompt you for your Gemini API key on first use. The key is stored securely in your browser's session storage and is never sent to any server other than Google's Gemini API.

### Deploy to GitHub Pages:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder to GitHub Pages**

3. **Set the correct base path** in `vite.config.ts`:
   ```typescript
   base: '/your-repository-name/',
   ```

## Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Google Gemini AI** for story generation
- **Google Veo2** for video generation (via Gemini API)
- **Web Speech API** for text-to-speech
- **Lucide React** for icons
- **Vite** for development and building

## Story Customization

Users can customize stories with:
- Baby's name and age
- Favorite characters (animals)
- Story theme (adventure, friendship, learning)
- Setting (forest, ocean, garden, etc.)
- Emotional tone and life lessons

## Future Features

- 🎨 AI-generated images when needed
- 🎬 Enhanced video generation features as Veo2 API expands
- 📚 Story library and favorites
- 🎵 Background music options
- 👨‍👩‍👧‍👦 Multi-language support

## Contributing

This is an MVP project. Feel free to suggest improvements or report issues!