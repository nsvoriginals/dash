import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignUp from './components/AuthComponents/Signup';
import SignIn from './components/AuthComponents/Signin';
import Dashboard from './Dashboard';
import LandingPage from './LandingPage';
import Sidebar from './components/Sidebar';

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className='m-0 p-0 w-screen min-h-screen font-Tensor bg-[#1A1A1A]'>
      {isLandingPage && <Sidebar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;