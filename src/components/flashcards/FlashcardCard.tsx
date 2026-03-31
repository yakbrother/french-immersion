import { useState } from 'react';
import { motion } from 'framer-motion';
import type { VocabWord } from '../../types';
import { Volume2, Loader2 } from 'lucide-react';
import { speakFrench } from '../../lib/tts';

interface FlashcardCardProps {
  word: VocabWord;
}

export function FlashcardCard({ word }: FlashcardCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleSpeak = async (text: string, id: string) => {
    if (playingId) {
      return;
    }

    setPlayingId(id);

    try {
      await speakFrench(text);
    } finally {
      setPlayingId(null);
    }
  };

  return (
    <div
      className="relative w-full aspect-[3/4] max-w-[320px] mx-auto cursor-pointer perspective-[1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {/* Front - French */}
        <div
          className="absolute inset-0 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-6 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-4">
            {word.theme}
          </span>
          <p className="text-3xl font-bold text-center mb-2">{word.french}</p>
          {word.gender && (
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              ({word.gender === 'masculine' ? 'm.' : 'f.'})
            </span>
          )}
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            {word.partOfSpeech}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSpeak(word.french, 'front');
            }}
            disabled={playingId !== null}
            className="mt-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center disabled:opacity-50"
            aria-label="Pronounce word"
          >
            {playingId === 'front' ? (
              <Loader2 size={20} className="text-primary-500 animate-spin" />
            ) : (
              <Volume2 size={20} className="text-primary-500" />
            )}
          </button>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
            Tap to reveal
          </p>
        </div>

        {/* Back - English + Example */}
        <div
          className="absolute inset-0 rounded-2xl bg-primary-50 dark:bg-gray-800 shadow-lg border border-primary-200 dark:border-gray-700 flex flex-col items-center justify-center p-6"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-2xl font-bold text-center mb-4">{word.english}</p>
          <div className="bg-white/60 dark:bg-gray-700/60 rounded-xl p-4 w-full">
            <p className="text-sm italic text-gray-700 dark:text-gray-300 text-center">
              "{word.example}"
            </p>
          </div>
          {word.notes && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              {word.notes}
            </p>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSpeak(word.example, 'back');
            }}
            disabled={playingId !== null}
            className="mt-4 p-2 rounded-full hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center disabled:opacity-50"
            aria-label="Pronounce example"
          >
            {playingId === 'back' ? (
              <Loader2 size={20} className="text-primary-500 animate-spin" />
            ) : (
              <Volume2 size={20} className="text-primary-500" />
            )}
          </button>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Tap to flip back
          </p>
        </div>
      </motion.div>
    </div>
  );
}
