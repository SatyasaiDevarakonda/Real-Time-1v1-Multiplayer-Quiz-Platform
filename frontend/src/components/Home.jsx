import { useState } from 'react';
import { useGame } from '../context/GameContext';

const Home = () => {
  const { createRoom, joinRoom, connected } = useGame();
  const [mode, setMode] = useState(null); // 'create' or 'join'
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (name.trim()) {
      createRoom(name);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (name.trim() && code.trim()) {
      joinRoom(code, name);
    }
  };

  return (
    <div className="card p-8 w-full max-w-md">
      {/* Logo / Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Quiz <span className="text-pink-400">1v1</span>
        </h1>
        <p className="text-white/60">Real-time multiplayer quiz battles</p>
      </div>

      {!mode ? (
        /* Initial Buttons */
        <div className="space-y-4">
          <button
            onClick={() => setMode('create')}
            className="btn-primary w-full text-lg"
            disabled={!connected}
          >
            🎮 Create Room
          </button>
          <button
            onClick={() => setMode('join')}
            className="btn-secondary w-full text-lg"
            disabled={!connected}
          >
            🚪 Join Room
          </button>
        </div>
      ) : mode === 'create' ? (
        /* Create Room Form */
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="input-field"
              maxLength={20}
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={!name.trim() || !connected}
          >
            Create Room
          </button>
          <button
            type="button"
            onClick={() => setMode(null)}
            className="btn-secondary w-full"
          >
            ← Back
          </button>
        </form>
      ) : (
        /* Join Room Form */
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="input-field"
              maxLength={20}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-2">Room Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Enter 4-digit code"
              className="input-field text-center text-2xl tracking-widest"
              maxLength={4}
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={!name.trim() || code.length !== 4 || !connected}
          >
            Join Room
          </button>
          <button
            type="button"
            onClick={() => setMode(null)}
            className="btn-secondary w-full"
          >
            ← Back
          </button>
        </form>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-white/40 text-sm">
        Phase 1 • No AI Dependencies
      </div>
    </div>
  );
};

export default Home;
