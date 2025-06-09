import './SignIn.css';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      document.title = 'Welcome to Group 5\'s Practical Exam';
    };
  }, []);

  return (
    <div className="signin-page">
      <div className="signin-container">

        <h1 className="main-heading">Welcome to Group 5's Practical Exam</h1>

        <p>[Placeholder, insert welcome message here]</p>
        <button className="signin-button-primary" onClick={() => {
          navigate('/signin');
        }}>Sign In
        </button>
        <br />
        <button className="signin-button-primary" onClick={() => {
          navigate('/register');
        }}>Register
        </button>
      </div>

      <footer className="page-footer">
        <p>Mendez | de Gala | Paglinawan | Sobrepeña | Acpal | Pua</p>
      </footer>
    </div>
  )
}