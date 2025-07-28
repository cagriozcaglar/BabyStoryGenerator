import React from 'react';
import { BookHeart, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <BookHeart className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Story Generator for Babies
            <Sparkles className="inline w-8 h-8 ml-2 text-yellow-300" />
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Create magical, personalized stories that will captivate your little one's imagination
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;