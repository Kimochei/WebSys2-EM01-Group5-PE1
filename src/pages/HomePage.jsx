import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function HomePage() {
  const { user, signOut, updateProfilePicture } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Home (Heavily WIP)`;
  }, []);

  const handleSignOut = () => {
    signOut();
    navigate('/signin');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <h2>Temporary home page</h2>
        <p>Hello {user.fName} {user.lName}!</p>
      </div>
      <button onClick={handleSignOut}>Sign Out</button>
      <button onClick={() => {
        navigate('/profile');
      }}>Profile
      </button>
    </div>
  );
}