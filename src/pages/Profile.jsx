import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function Profile() {
  const { user, signOut, updateProfilePicture } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    //auto set title
    document.title = `User Profile`;
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await updateProfilePicture(file);
    } catch (error) {
      console.error('Failed to update profile picture:', error);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/signin');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <div>
        {user.profile_picture && (
          <img 
            src={user.profile_picture} 
            alt="Profile" 
            style={{ width: 100, height: 100, borderRadius: '50%' }} 
          />
        )}
        <div>
          <label htmlFor="profile-picture">Change Profile Picture:</label>
          <input
            id="profile-picture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div>
        <h2>User Information</h2>
        <p>Name: {user.fName} {user.lName}</p>
        <p>Email: {user.email}</p>
      </div>
      <button onClick={handleSignOut}>Sign Out</button>
      <button className="signin-button-primary" onClick={() => {
        navigate('/home');
      }}>Go to Home page [STILL WORK IN PROGRESS]
      </button>
    </div>
  );
}