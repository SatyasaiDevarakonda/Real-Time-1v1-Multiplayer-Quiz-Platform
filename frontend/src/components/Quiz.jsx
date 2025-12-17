import { useGame } from '../context/GameContext';

const Quiz = () => {
  const {
    currentQuestion,
    questionIndex,
    totalQuestions,
    timeLeft,
    timePerQuestion,
    selectedAnswer,
    answerResult,
    players,
    playerName,
    submitAnswer
  } = useGame();

  if (!currentQuestion) {
    return (
      <div className="card p-8 text-center">
        <div className="text-white text-xl">Loading question...</div>
      </div>
    );
  }

  const getOptionClass = (option) => {
    if (!answerResult) {
      if (selectedAnswer === option) return 'selected';
      return 'default';
    }
    
    // Show results
    if (option === answerResult.correctAnswer) return 'correct';
    if (selectedAnswer === option && !answerResult.correct) return 'incorrect';
    return 'default opacity-50';
  };

  const timerPercentage = (timeLeft / timePerQuestion) * 100;
  const timerColor = timeLeft <= 5 ? 'text-red-400' : timeLeft <= 10 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="w-full max-w-2xl">
      {/* Header with Score and Progress */}
      <div className="flex justify-between items-center mb-6">
        {players.map((player, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl ${
              player.name === playerName
                ? 'bg-pink-500/20 border border-pink-500/50'
                : 'bg-white/10 border border-white/20'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              index === 0 ? 'bg-violet-500' : 'bg-pink-500'
            }`}>
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{player.name}</p>
              <p className="text-white/60 text-xs">{player.score} pts</p>
            </div>
            {player.answered && (
              <span className="text-green-400 text-xs">✓</span>
            )}
          </div>
        ))}
      </div>

      {/* Question Card */}
      <div className="card p-6">
        {/* Progress and Timer */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-white/60 text-sm">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 transform -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white/10"
              />
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="88"
                strokeDashoffset={88 - (88 * timerPercentage) / 100}
                className={`${timerColor} transition-all duration-1000 ease-linear`}
              />
            </svg>
            <span className={`text-xl font-bold ${timerColor}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-300"
            style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question */}
        <h2 className="text-xl text-white font-medium mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => submitAnswer(option)}
              disabled={!!selectedAnswer || !!answerResult}
              className={`option-btn ${getOptionClass(option)}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  getOptionClass(option) === 'correct' ? 'bg-green-500/30' :
                  getOptionClass(option) === 'incorrect' ? 'bg-red-500/30' :
                  selectedAnswer === option ? 'bg-violet-500/30' :
                  'bg-white/10'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
              {answerResult && option === answerResult.correctAnswer && (
                <span className="text-green-400 text-sm ml-auto">✓ Correct</span>
              )}
            </button>
          ))}
        </div>

        {/* Answer Feedback */}
        {answerResult && (
          <div className={`mt-6 p-4 rounded-xl ${
            answerResult.correct 
              ? 'bg-green-500/20 border border-green-500/50' 
              : 'bg-red-500/20 border border-red-500/50'
          }`}>
            <p className={answerResult.correct ? 'text-green-300' : 'text-red-300'}>
              {answerResult.timeUp 
                ? "⏰ Time's up!" 
                : answerResult.correct 
                  ? `🎉 Correct! +${answerResult.pointsEarned} points` 
                  : '❌ Incorrect!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
