import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaHome, FaPlus } from 'react-icons/fa'; 
import './MainLayout.css';

function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/signin');
  };

  if (!user) return null;

  return (
    <div className="sidebar">
      <div className="user-info">
        <h2>Group 5's Practical</h2>
        <div className="user-actions">
          <button onClick={() => navigate('/profile')} className="nav-button profpic">
            {user.profile_picture && (
              <img src={user.profile_picture} alt="Profile" />
            )}
            {user.fName}'s Profile
          </button>
          <button onClick={() => navigate('/home')} className="nav-button">
            <FaHome size={22} />
            <span>Home</span>
          </button>
          <button onClick={handleSignOut} className="nav-button sign-out">
            Sign Out
          </button>
          <div className="sidebar-footer">
            <p>Mendez | de Gala | Paglinawan | Sobrepeña | Acpal | Pua</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export function MainLayout() {
  const navigate = useNavigate(); 

  return (
    <>
      {}
      <div className="main-layout-wrapper">
        <Sidebar />
        <main className="main-content-area">
          <Outlet />
        </main>
        {}
      </div>

      {}
      <button
        className="floating-post-button"
        onClick={() => navigate('/home')}
        aria-label="Create new post"
      >
        <FaPlus size={20} />
      </button>
    </>
  );
}