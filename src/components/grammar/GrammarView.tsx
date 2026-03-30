import { useGrammar } from '../../hooks/useGrammar';
import { useProgress } from '../../hooks/useProgress';
import type { GrammarTopic } from '../../types';
import { ArrowLeft, Check, X, ChevronRight } from 'lucide-react';

const TOPIC_LABELS: Record<GrammarTopic, string> = {
  subjunctive: 'Subjonctif',
  conditional: 'Conditionnel',
  'relative-pronouns': 'Pronoms relatifs',
  'past-tenses': 'Temps du passé',
  hypothetical: 'Hypothèse',
  'passive-voice': 'Voix passive',
  'reported-speech': 'Discours rapporté',
  connectors: 'Connecteurs',
};

export function GrammarView() {
  const {
    topics,
    selectedTopic,
    selectTopic,
    currentExercise,
    currentIndex,
    totalInTopic,
    showAnswer,
    userAnswer,
    setUserAnswer,
    isCorrect,
    checkAnswer,
    nextExercise,
  } = useGrammar();
  const { recordActivity } = useProgress();

  if (!selectedTopic || !currentExercise) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-2">Grammar Practice</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Master B2-level grammar topics.
        </p>
        <div className="space-y-2">
          {topics.map(({ topic, total, completed }) => (
            <button
              key={topic}
              onClick={() => selectTopic(topic)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-semibold text-sm">{TOPIC_LABELS[topic]}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {completed} / {total} completed
                </p>
              </div>
              <div className="flex items-center gap-2">
                {completed === total && (
                  <span className="text-success-500"><Check size={16} /></span>
                )}
                <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${(completed / total) * 100}%` }}
                  />
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => selectTopic(selectedTopic)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="font-semibold text-sm">{TOPIC_LABELS[selectedTopic]}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {currentIndex + 1} / {totalInTopic}
          </p>
        </div>
      </div>

      {/* Exercise */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
          {currentExercise.type === 'fill-in-blank' ? 'Fill in the blank' : 'Multiple choice'}
        </span>

        <p className="text-lg font-medium mt-3 mb-6 leading-relaxed">
          {currentExercise.prompt}
        </p>

        {currentExercise.type === 'fill-in-blank' ? (
          <div className="space-y-3">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !showAnswer) {
                  checkAnswer(userAnswer);
                  recordActivity('grammar');
                }
              }}
              placeholder="Type your answer..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
              disabled={showAnswer}
              autoFocus
            />
            {!showAnswer && (
              <button
                onClick={() => {
                  checkAnswer(userAnswer);
                  recordActivity('grammar');
                }}
                disabled={!userAnswer.trim()}
                className="w-full py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors min-h-[44px]"
              >
                Check Answer
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {currentExercise.options?.map((option) => (
              <button
                key={option}
                onClick={() => {
                  if (!showAnswer) {
                    setUserAnswer(option);
                    checkAnswer(option);
                    recordActivity('grammar');
                  }
                }}
                disabled={showAnswer}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors min-h-[44px] ${
                  showAnswer && option === currentExercise.correctAnswer
                    ? 'border-success-500 bg-green-50 dark:bg-green-900/20 text-success-600 dark:text-success-500'
                    : showAnswer && option === userAnswer && !isCorrect
                    ? 'border-danger-500 bg-red-50 dark:bg-red-900/20 text-danger-500'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Feedback */}
        {showAnswer && (
          <div className={`mt-4 p-4 rounded-xl ${
            isCorrect
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <Check size={18} className="text-success-500" />
              ) : (
                <X size={18} className="text-danger-500" />
              )}
              <span className={`font-semibold text-sm ${
                isCorrect ? 'text-success-600 dark:text-success-500' : 'text-danger-500'
              }`}>
                {isCorrect ? 'Correct!' : `Incorrect — Answer: ${currentExercise.correctAnswer}`}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentExercise.explanation}
            </p>
          </div>
        )}

        {showAnswer && (
          <button
            onClick={nextExercise}
            className="w-full mt-4 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors min-h-[44px]"
          >
            {currentIndex + 1 < totalInTopic ? 'Next Exercise' : 'Back to Topics'}
          </button>
        )}
      </div>
    </div>
  );
}
