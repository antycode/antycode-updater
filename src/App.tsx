import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoadingPage from './pages/LoadingPage';
import useApplicationUpdate from './hooks/useApplicationUpdate';

function App() {
  const { progress, updateAvailable, statusMessage } = useApplicationUpdate();
  return (
      <Routes>
        <Route path="/" element={<LoadingPage progress={progress} updateAvailable={updateAvailable} statusMessage={statusMessage} />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
  );
}
export default App;
