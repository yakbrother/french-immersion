import { useState } from 'react';
import type { ChatMessage } from '../../types';
import { Volume2, Loader2 } from 'lucide-react';
import { speakFrench } from '../../lib/tts';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = async () => {
    if (isPlaying) {
      return;
    }

    setIsPlaying(true);

    try {
      await speakFrench(message.content);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        {message.translation && (
          <p className="text-xs mt-2 opacity-70 italic">{message.translation}</p>
        )}
        <button
          onClick={handleSpeak}
          disabled={isPlaying}
          className={`mt-1.5 p-1 rounded-full transition-colors ${
            isUser
              ? 'hover:bg-white/20 text-white/70 hover:text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          } disabled:opacity-50`}
          aria-label="Listen to pronunciation"
        >
          {isPlaying ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Volume2 size={14} />
          )}
        </button>
      </div>
    </div>
  );
}
