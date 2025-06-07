import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // auth stuff (cdg)
import { SignIn } from './pages/SignIn'; // cdg
import { Register } from './pages/Register'; // cdg
import { Profile } from './pages/Profile'; // cdg

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
          <Route path="/" element={<Navigate to="/signin" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App
