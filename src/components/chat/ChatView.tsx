import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatBubble } from './ChatBubble';
import { scenarios } from '../../data/scenarios';
import { Send, ArrowLeft, GraduationCap, Globe } from 'lucide-react';

export function ChatView() {
  const {
    messages,
    isLoading,
    streamingText,
    activeScenario,
    mode,
    setMode,
    startSession,
    sendMessage,
    endSession,
  } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleSend = () => {
    const text = input.trim();

    if (!text) {
      return;
    }

    setInput('');
    sendMessage(text);
  };

  if (!activeScenario) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-2">Conversation Practice</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Choose a scenario and practice speaking French with AI.
        </p>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('teacher')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-colors min-h-[44px] ${
              mode === 'teacher'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <GraduationCap size={18} />
            Teacher
          </button>
          <button
            onClick={() => setMode('immersive')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-colors min-h-[44px] ${
              mode === 'immersive'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Globe size={18} />
            Immersive
          </button>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          {mode === 'teacher'
            ? 'Teacher mode: corrections and translations included.'
            : 'Immersive mode: French only, no English.'}
        </p>

        {/* Scenario cards */}
        <div className="space-y-3">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => startSession(scenario)}
              className="w-full text-left p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm">{scenario.titleFr}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  scenario.difficulty === 'B1'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : scenario.difficulty === 'B2'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                }`}>
                  {scenario.difficulty}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{scenario.title}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{scenario.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={endSession}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="font-semibold text-sm">{activeScenario.titleFr}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {mode === 'teacher' ? 'Teacher mode' : 'Immersive mode'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <p className="text-sm">
              {mode === 'teacher'
                ? 'Start the conversation in French or English!'
                : 'Commencez la conversation en français !'}
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {streamingText && (
          <div className="flex justify-start mb-3">
            <div className="max-w-[80%] rounded-2xl rounded-bl-md px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{streamingText}</p>
            </div>
          </div>
        )}
        {isLoading && !streamingText && (
          <div className="flex justify-start mb-3">
            <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder={mode === 'teacher' ? 'Type in French or English...' : 'Écrivez en français...'}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="p-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
