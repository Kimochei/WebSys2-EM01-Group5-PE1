import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // auth stuff (cdg)

import { MainLayout } from './layouts/MainLayout';
// links to individual pages (cdg)
import { SignIn } from './pages/SignIn';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';

import './App.css'

// redirect to signin page if not signed in
function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  // Show a loading message while we verify the token
  if (loading) {
    return <div>Loading Application...</div>;
  }

  // If loading is finished and there's no token, redirect to signin
  if (!token) {
    return <Navigate to="/signin" />;
  }

  // Otherwise, show the requested page
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />

          {}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<HomePage />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;