import { useGame } from '../context/GameContext';

const Results = () => {
  const { gameResults, playerName, resetGame } = useGame();

  if (!gameResults) {
    return (
      <div className="card p-8 text-center">
        <div className="text-white text-xl">Loading results...</div>
      </div>
    );
  }

  const { winner, isDraw, players } = gameResults;
  const isWinner = winner === playerName;

  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="card p-8 w-full max-w-md text-center">
      {/* Result Header */}
      <div className="mb-8">
        {isDraw ? (
          <>
            <div className="text-6xl mb-4">🤝</div>
            <h1 className="text-3xl font-bold text-white mb-2">It's a Draw!</h1>
            <p className="text-white/60">Both players performed equally well</p>
          </>
        ) : isWinner ? (
          <>
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold text-green-400 mb-2">You Won!</h1>
            <p className="text-white/60">Congratulations on your victory!</p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">😔</div>
            <h1 className="text-3xl font-bold text-red-400 mb-2">You Lost</h1>
            <p className="text-white/60">Better luck next time!</p>
          </>
        )}
      </div>

      {/* Scoreboard */}
      <div className="space-y-4 mb-8">
        {sortedPlayers.map((player, index) => {
          const isCurrentPlayer = player.name === playerName;
          const isFirst = index === 0;
          
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border ${
                isCurrentPlayer
                  ? isFirst && !isDraw
                    ? 'bg-green-500/20 border-green-500/50'
                    : 'bg-pink-500/20 border-pink-500/50'
                  : 'bg-white/5 border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    isFirst && !isDraw ? 'bg-yellow-500 text-yellow-900' : 'bg-white/20 text-white'
                  }`}>
                    {isFirst && !isDraw ? '👑' : '2'}
                  </div>
                  
                  {/* Player Info */}
                  <div className="text-left">
                    <p className="text-white font-medium">
                      {player.name}
                      {isCurrentPlayer && (
                        <span className="text-pink-400 text-sm ml-2">(You)</span>
                      )}
                    </p>
                    <p className="text-white/60 text-sm">
                      {player.correctAnswers}/{player.totalQuestions} correct
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{player.score}</p>
                  <p className="text-white/40 text-xs">points</p>
                </div>
              </div>

              {/* Accuracy Bar */}
              <div className="mt-3">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isFirst && !isDraw 
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' 
                        : 'bg-gradient-to-r from-pink-500 to-violet-500'
                    }`}
                    style={{ 
                      width: `${(player.correctAnswers / player.totalQuestions) * 100}%` 
                    }}
                  />
                </div>
                <p className="text-white/40 text-xs mt-1 text-right">
                  {Math.round((player.correctAnswers / player.totalQuestions) * 100)}% accuracy
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Play Again Button */}
      <button
        onClick={resetGame}
        className="btn-primary w-full text-lg"
      >
        🎮 Play Again
      </button>
    </div>
  );
};

export default Results;
