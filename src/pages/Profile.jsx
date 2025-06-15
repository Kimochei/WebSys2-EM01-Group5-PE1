import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import './Profile.css';

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('threads');

  useEffect(() => {
    document.title = 'Profile';
  }, []);

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        {}
        <div className="profile-details">
          <div className="profile-header">
            <h1 className="profile-name">{user.fName} {user.lName}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-bio">
              Bio (Future Feature)
            </p>
          </div>

          <div className="profile-actions">
            <button className="edit-profile-btn">Edit profile</button>
          </div>
        </div>
        
        {}
        <img
          src={user.profile_picture || 'https://www.placeholderimage.online/images/generic/user-photo.jpg'}
          alt="Profile"
          className="profile-picture"
        />
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('threads')}
        >
          Posts
        </button>
        <button
          className={`profile-tab ${activeTab === 'replies' ? 'active' : ''}`}
          onClick={() => setActiveTab('replies')}
        >
          Replies
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'posts' && <div>Posts by the user will show here.</div>}
        {activeTab === 'replies' && <div>Replies by the user will show here.</div>}
      </div>
    </div>
  );
}