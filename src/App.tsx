import React, { useState } from 'react';
import Header from './components/Header';
import StoryForm, { StoryParams } from './components/StoryForm';
import StoryDisplay from './components/StoryDisplay';
import { geminiService, StoryContent } from './services/geminiService';

function App() {
  const [currentStory, setCurrentStory] = useState<StoryContent | null>(null);
  const [currentBabyName, setCurrentBabyName] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStory = async (params: StoryParams) => {
    setIsGenerating(true);
    
    try {
      const storyContent = await geminiService.generateStory(params);
      setCurrentStory(storyContent);
      setCurrentBabyName(params.babyName);
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Sorry, there was an error generating your story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewStory = () => {
    setCurrentStory(null);
    setCurrentBabyName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {currentStory ? (
          <StoryDisplay 
            storyContent={currentStory}
            babyName={currentBabyName}
            onNewStory={handleNewStory}
          />
        ) : (
          <StoryForm 
            onGenerateStory={handleGenerateStory}
            isGenerating={isGenerating}
          />
        )}
      </main>

      {/* Features Preview */}
      <section className="bg-white/50 backdrop-blur-sm py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Perfect for Your Little One</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our stories are designed to engage, educate, and entertain babies and toddlers of all ages
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalized Stories</h3>
              <p className="text-gray-600">Every story is unique and tailored to your baby's interests and developmental stage</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Audio Narration</h3>
              <p className="text-gray-600">Listen to stories with soothing voices perfect for bedtime or playtime</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Video Coming Soon</h3>
              <p className="text-gray-600">Animated videos to bring your stories to life with colorful characters and scenes</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            Made with ❤️ for parents who want to create magical moments with their little ones
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;