import { useGame } from '../context/GameContext';

const WaitingRoom = () => {
  const { roomCode, players, playerName } = useGame();

  const isReady = players.length === 2;

  return (
    <div className="card p-8 w-full max-w-md text-center">
      {/* Room Code Display */}
      <div className="mb-8">
        <p className="text-white/60 text-sm mb-2">Room Code</p>
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <span className="text-4xl font-bold text-white tracking-widest">
            {roomCode}
          </span>
        </div>
        <p className="text-white/40 text-sm mt-2">
          Share this code with your opponent
        </p>
      </div>

      {/* Players List */}
      <div className="mb-8">
        <p className="text-white/60 text-sm mb-4">Players ({players.length}/2)</p>
        <div className="space-y-3">
          {players.map((player, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-xl border ${
                player.name === playerName
                  ? 'bg-pink-500/20 border-pink-500/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  index === 0 ? 'bg-violet-500' : 'bg-pink-500'
                }`}>
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium">
                  {player.name}
                  {player.name === playerName && (
                    <span className="text-pink-400 text-sm ml-2">(You)</span>
                  )}
                </span>
              </div>
              <span className="text-green-400 text-sm">Ready</span>
            </div>
          ))}

          {/* Waiting for opponent */}
          {players.length < 2 && (
            <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-white/20 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white/40">?</span>
                </div>
                <span className="text-white/40">Waiting for opponent...</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      {isReady ? (
        <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
          <p className="text-green-300 font-medium">
            🎮 Game starting in 3 seconds...
          </p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/60">
            Waiting for another player to join
          </p>
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;
