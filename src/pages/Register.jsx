import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export function Register() {
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
      navigate('/profile'); // Redirect to profile page after successful registration
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="fName">First Name:</label>
          <input
            id="fName"
            name="fName"
            type="text"
            value={formData.fName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lName">Last Name:</label>
          <input
            id="lName"
            name="lName"
            type="text"
            value={formData.lName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>

      <br/><br/>
      <p>Have an account? </p>
      <Link to="/signin">
        <button>Sign In</button>
      </Link>
    </div>
  );
} 