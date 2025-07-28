import React, { useState } from 'react';
import { Baby, Heart, Star, Users, Wand2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface StoryFormProps {
  onGenerateStory: (params: StoryParams) => void;
  isGenerating: boolean;
}

export interface StoryParams {
  babyName: string;
  babyAge: string;
  characters: string[];
  feeling: string;
  theme: string;
  setting: string;
  lesson: string;
}

const StoryForm: React.FC<StoryFormProps> = ({ onGenerateStory, isGenerating }) => {
  const [formData, setFormData] = useState<StoryParams>({
    babyName: '',
    babyAge: '6-12 months',
    characters: [],
    feeling: 'happy',
    theme: 'adventure',
    setting: 'forest',
    lesson: 'friendship'
  });

  const ageOptions = ['0-6 months', '6-12 months', '1-2 years', '2-3 years', '3-4 years', '4-5 years'];
  const characterOptions = ['Bunny', 'Bear', 'Cat', 'Dog', 'Elephant', 'Lion', 'Monkey', 'Owl', 'Fox', 'Penguin'];
  const feelingOptions = ['happy', 'excited', 'calm', 'curious', 'brave', 'kind'];
  const themeOptions = ['adventure', 'friendship', 'learning', 'magic', 'nature', 'family'];
  const settingOptions = ['forest', 'ocean', 'garden', 'castle', 'farm', 'space', 'home'];
  const lessonOptions = ['friendship', 'sharing', 'kindness', 'courage', 'honesty', 'patience'];

  const handleCharacterToggle = (character: string) => {
    setFormData(prev => ({
      ...prev,
      characters: prev.characters.includes(character)
        ? prev.characters.filter(c => c !== character)
        : [...prev.characters, character].slice(0, 3) // Max 3 characters
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!geminiService.isConfigured()) {
      alert('Gemini API is not configured. Please add your VITE_GEMINI_API_KEY to the environment variables.');
      return;
    }
    
    if (formData.babyName && formData.characters.length > 0) {
      onGenerateStory(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Baby className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Generate a Story For Your Baby</h2>
        <p className="text-gray-600">Let's make a magical story just for your little one!</p>
      </div>

      <div className="space-y-6">
        {/* Baby Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Heart className="inline w-4 h-4 mr-2 text-pink-500" />
            Baby's Name
          </label>
          <input
            type="text"
            value={formData.babyName}
            onChange={(e) => setFormData(prev => ({ ...prev, babyName: e.target.value }))}
            placeholder="Enter your baby's name"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Age Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Star className="inline w-4 h-4 mr-2 text-yellow-500" />
            Baby's Age
          </label>
          <select
            value={formData.babyAge}
            onChange={(e) => setFormData(prev => ({ ...prev, babyAge: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
          >
            {ageOptions.map(age => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
        </div>

        {/* Characters */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Users className="inline w-4 h-4 mr-2 text-green-500" />
            Story Characters (Choose up to 3)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {characterOptions.map(character => (
              <button
                key={character}
                type="button"
                onClick={() => handleCharacterToggle(character)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all hover:scale-105 ${
                  formData.characters.includes(character)
                    ? 'border-blue-400 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {character}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: {formData.characters.length}/3
          </p>
        </div>

        {/* Story Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Feeling</label>
            <select
              value={formData.feeling}
              onChange={(e) => setFormData(prev => ({ ...prev, feeling: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
            >
              {feelingOptions.map(feeling => (
                <option key={feeling} value={feeling}>
                  {feeling.charAt(0).toUpperCase() + feeling.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Theme</label>
            <select
              value={formData.theme}
              onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
            >
              {themeOptions.map(theme => (
                <option key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Setting</label>
            <select
              value={formData.setting}
              onChange={(e) => setFormData(prev => ({ ...prev, setting: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
            >
              {settingOptions.map(setting => (
                <option key={setting} value={setting}>
                  {setting.charAt(0).toUpperCase() + setting.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Lesson</label>
            <select
              value={formData.lesson}
              onChange={(e) => setFormData(prev => ({ ...prev, lesson: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
            >
              {lessonOptions.map(lesson => (
                <option key={lesson} value={lesson}>
                  {lesson.charAt(0).toUpperCase() + lesson.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating || !formData.babyName || formData.characters.length === 0}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creating Your Story...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Story
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StoryForm;