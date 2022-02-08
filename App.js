import 'typeface-roboto';
// import Button from '@mui/material/Button';
import Navbar from './components/Navbar';
import SongsList from './components/SongsList';
import { Routes, Route } from 'react-router-dom';
import SongsDetailPage from './components/SongsDetailPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SongsList />} />
        <Route path="/releases/:id" element={<SongsDetailPage />} />
        
      </Routes>
      
    </>

  );
}

export default App;
