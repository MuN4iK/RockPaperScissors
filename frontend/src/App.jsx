import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import HomePage from './pages/HomePage';
import './styles/App.module.css'
import SingupPage from './pages/SingupPage';
import RockPaperScissorsPage from './pages/RockPaperScissorsPage';

function App() {


  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/singup' element={<SingupPage />} />
        <Route path='/match/:matchId' element={
          <ProtectedRoute>
            <RockPaperScissorsPage />
          </ProtectedRoute>
        } />
        <Route path='/' element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
