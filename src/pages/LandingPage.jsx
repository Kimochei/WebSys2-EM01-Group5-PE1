import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; 
import G5Logo from '../assets/G5Logo.png'; 
export function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.title = "Welcome to Group 5's Practical Exam";
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="signin-page"> {}
      
      {}
      <div className="landing-container">

        <img src={G5Logo} alt="Group 5 Logo" className="landing-logo" />

        <h1 className="landing-heading">Welcome to Group 5's Practical Exam</h1>

        <p className="landing-subheading">Sign in or Register to get started!</p>
        
        <div className="landing-button-group">
            <button className="landing-button" onClick={() => navigate('/signin')}>
              Sign In
            </button>
            <button className="landing-button" onClick={() => navigate('/register')}>
              Register
            </button>
        </div>

      </div>
      {}

      <footer className="page-footer">
        <p>Mendez | de Gala | Paglinawan | Sobrepeña | Acpal | Pua</p>
      </footer>
    </div>
  )
}