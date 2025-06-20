import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Signin.css'; // Import the same CSS file used by the sign-in page

export function Register() {
  // Your existing state and logic for registration
  const [formData, setFormData] = useState({
    email: '',
    fName: '',
    lName: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(
        formData.email,
        formData.fName,
        formData.lName,
        formData.password
      );
      navigate('/profile');
    } catch (error) {
      setError(error.message || 'An error occurred during registration.');
    }
  };

  // This hook prevents scrolling, just like on the sign-in page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      document.title = 'Register';
    };
  }, []);

  return (
    <div className="signin-page"> {/* Reusing styles from sign-in */}
      <div className="signin-container">

        <h1 className="main-heading">Create an account</h1>
        
        <div className="signin-form-wrapper">
          <form className="signin-form" onSubmit={handleSubmit}>
            {error && <div className="signin-error">{error}</div>}
            
            <input
              name="fName"
              type="text"
              placeholder="First Name"
              className="signin-input"
              value={formData.fName}
              onChange={handleChange}
              required
            />
            <input
              name="lName"
              type="text"
              placeholder="Last Name"
              className="signin-input"
              value={formData.lName}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="signin-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="signin-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="signin-button-primary">
              Register
            </button>
          </form>
        </div>
        
        <div className="register-section">
          <p>Already have an account? <Link to="/signin" className="register-link">Sign In</Link></p>
        </div>

      </div>
      <footer className="page-footer">
        <p>Mendez | de Gala | Paglinawan | Sobrepeña | Acpal | Pua</p>
      </footer>
    </div>
  );
}