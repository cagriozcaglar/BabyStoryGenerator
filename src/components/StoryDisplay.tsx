import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Download, BookOpen, Volume2, Video } from 'lucide-react';
import { StoryContent } from '../services/geminiService';

interface StoryDisplayProps {
  storyContent: StoryContent;
  babyName: string;
  onNewStory: () => void;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ storyContent, babyName, onNewStory }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(storyContent.videoUrl);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        // Filter for English voices, prefer female voices for baby stories
        const englishVoices = availableVoices.filter(voice => 
          voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
        );
        
        if (englishVoices.length === 0) {
          // Fallback to any English voice
          setVoices(availableVoices.filter(voice => voice.lang.startsWith('en')));
        } else {
          setVoices(englishVoices);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    // Check for video updates
    if (storyContent.hasVideo && !videoUrl && !isVideoLoading) {
      setIsVideoLoading(true);
      
      // Poll for video completion
      const videoInterval = setInterval(() => {
        if (storyContent.videoUrl) {
          setVideoUrl(storyContent.videoUrl);
          setIsVideoLoading(false);
          clearInterval(videoInterval);
        }
      }, 3000);

      // Cleanup after 2 minutes
      setTimeout(() => {
        clearInterval(videoInterval);
        setIsVideoLoading(false);
      }, 120000);

      return () => clearInterval(videoInterval);
    }
  }, [storyContent.hasVideo, storyContent.videoUrl, videoUrl, isVideoLoading]);

  const handlePlayPause = () => {
    if (!speechSynthesis) return;

    if (isPlaying) {
      speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (speechSynthesis.paused && currentUtterance) {
        speechSynthesis.resume();
      } else {
        const utterance = new SpeechSynthesisUtterance(storyContent.text);
        
        if (voices.length > 0) {
          utterance.voice = voices[selectedVoiceIndex];
        }
        
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        utterance.volume = 1;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => {
          setIsPlaying(false);
          setCurrentUtterance(null);
        };
        utterance.onerror = () => {
          setIsPlaying(false);
          setCurrentUtterance(null);
        };

        setCurrentUtterance(utterance);
        speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([storyContent.text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${babyName}-story-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatStoryForDisplay = (text: string) => {
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {babyName}'s Special Story
        </h2>
        <p className="text-gray-600">A magical tale created just for you!</p>
      </div>

      {/* Audio Controls */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
            
            <button
              onClick={handleStop}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {isPlaying ? 'Playing' : 'Ready to Play'}
              </span>
            </div>
          </div>

          {voices.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Voice:</label>
              <select
                value={selectedVoiceIndex}
                onChange={(e) => setSelectedVoiceIndex(parseInt(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:outline-none"
                disabled={isPlaying}
              >
                {voices.map((voice, index) => (
                  <option key={index} value={index}>
                    {voice.name.replace('Microsoft ', '').replace('Google ', '')}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Story Content */}
      <div className="prose prose-lg max-w-none mb-8">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border-l-4 border-yellow-400">
          <div className="text-gray-800 text-lg leading-8 font-medium">
            {formatStoryForDisplay(storyContent.text)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Story
        </button>
        
        <button
          onClick={onNewStory}
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Create Another Story
        </button>
      </div>

      {/* Video Feature Status */}
      <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-3">
            <Video className="w-6 h-6 text-indigo-600" />
          </div>
          
          {videoUrl ? (
            <div>
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">Your Story Video (Veo2)</h3>
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <video 
                  controls 
                  className="w-full max-w-md mx-auto rounded-lg"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23f3f4f6'/%3E%3Ctext x='200' y='112.5' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='16'%3EStory Video%3C/text%3E%3C/svg%3E"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ) : isVideoLoading ? (
            <div>
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Generating Video...</h3>
              <div className="flex items-center justify-center mb-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
              <p className="text-indigo-600 text-sm">
                Creating a beautiful animated video for your story. This may take 1-2 minutes...
              </p>
            </div>
          ) : storyContent.hasVideo ? (
            <div>
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Veo2 Video Generation Ready!</h3>
              <p className="text-indigo-600 text-sm">
                Video generation is configured with Google Veo2 and ready to bring your stories to life!
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Veo2 Video Stories Available!</h3>
              <p className="text-indigo-600 text-sm">
                Using your Gemini API key to generate beautiful animated videos with Google Veo2!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryDisplay;