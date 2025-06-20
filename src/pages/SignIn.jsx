import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Signin.css';
import G5Logo from '../assets/G5Logo.png';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      document.title = 'Sign In';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
      navigate('/home');
    } catch (error) {
      setError(error?.message || 'Failed to sign in. Please check your credentials.');   
    }  
    
  };

  return (
    <div className="signin-page">
      <div className="signin-container">

        {/* Add the logo here */}
        <img src={G5Logo} alt="Group 5 Logo" className="signin-logo" />

        <h1 className="main-heading">Welcome to Group 5's Practical Exam</h1>
        
        <div className="signin-form-wrapper">
          <form className="signin-form" onSubmit={handleSubmit}>
            {error && <div className="signin-error">{error}</div>}
            
            <input
              type="email"
              placeholder="Username, phone, or email"
              className="signin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="signin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="signin-button-primary">
              Log In
            </button>
          </form>
        </div>
        
        <div className="register-section">
          <p>Don't have an account? <Link to="/register" className="register-link">Register</Link></p>
        </div>

      </div>

      <footer className="page-footer">
        <p>Mendez | de Gala | Paglinawan | Sobrepeña | Acpal | Pua</p>
      </footer>
    </div>
  );
}