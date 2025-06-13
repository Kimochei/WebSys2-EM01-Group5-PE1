import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // auth stuff (cdg)

// links to individual pages (cdg)
import { SignIn } from './pages/SignIn';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';

import './App.css'

// redirect to signin page if not signed in
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/signin" />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path={"*"} element={<Navigate to="/"/>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App
