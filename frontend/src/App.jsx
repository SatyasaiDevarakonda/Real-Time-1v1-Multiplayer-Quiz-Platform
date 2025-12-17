import { Routes, Route, Navigate } from 'react-router-dom';
import { useGame } from './context/GameContext';
import Home from './components/Home';
import WaitingRoom from './components/WaitingRoom';
import Quiz from './components/Quiz';
import Results from './components/Results';

function App() {
  const { gameStatus, error, connected } = useGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Connection Status */}
      <div className="fixed top-4 right-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          connected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
        }`}>
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500/90 text-white px-6 py-3 rounded-xl shadow-lg">
            {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      <Routes>
        <Route path="/" element={
          gameStatus === 'idle' ? <Home /> :
          gameStatus === 'waiting' ? <Navigate to="/waiting" /> :
          gameStatus === 'playing' ? <Navigate to="/quiz" /> :
          gameStatus === 'finished' ? <Navigate to="/results" /> :
          <Home />
        } />
        <Route path="/waiting" element={
          gameStatus === 'waiting' ? <WaitingRoom /> :
          gameStatus === 'playing' ? <Navigate to="/quiz" /> :
          <Navigate to="/" />
        } />
        <Route path="/quiz" element={
          gameStatus === 'playing' ? <Quiz /> :
          gameStatus === 'finished' ? <Navigate to="/results" /> :
          <Navigate to="/" />
        } />
        <Route path="/results" element={
          gameStatus === 'finished' ? <Results /> :
          <Navigate to="/" />
        } />
      </Routes>
    </div>
  );
}

export default App;
