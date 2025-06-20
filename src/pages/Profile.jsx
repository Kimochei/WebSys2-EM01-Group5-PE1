import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { Post } from '../components/Post';
import { BounceLoader } from 'react-spinners';
import './Profile.css';

// Modal Component 
function EditProfileModal({ user, onClose }) {
  const { updateProfilePicture } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profilePic) {
      onClose();
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateProfilePicture(profilePic);
      onClose(); 
    } catch (error) {
      console.error('Failed to save profile picture. Please try again.', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="profilePic">Profile Picture</label>
            <input type="file" id="profilePic" onChange={handleFileChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="fName">First Name</label>
            <input
              type="text"
              id="fName"
              defaultValue={user.fName}
              placeholder="Future Feature"
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="lName">Last Name</label>
            <input
              type="text"
              id="lName"
              defaultValue={user.lName}
              placeholder="Future Feature"
              disabled 
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || !profilePic}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Profile Page Component 
export function Profile() {
  const { user, getPosts, getPostsLikedByUser, getUserReplies } = useAuth();
  const [activeTab, setActiveTab] = useState('threads');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [userReplies, setUserReplies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = user ? `${user.fName}'s Profile` : 'Profile';
  }, [user]);

  const fetchUserPosts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let allPosts = [];
      let page = 1;
      let hasMore = true;
      const MAX_PAGES_TO_FETCH = 5;

      while(hasMore && page <= MAX_PAGES_TO_FETCH) {
        const fetchedPosts = await getPosts(page);
        if (fetchedPosts.length === 0) {
          hasMore = false;
        } else {
          allPosts = [...allPosts, ...fetchedPosts];
          page++;
        }
      }
      const postsWithUserInfo = allPosts
        .filter(post => post.owned_by === user.id)
        .map(post => ({ ...post, users: { fName: user.fName, lName: user.lName, profile_picture: user.profile_picture } }));
      setUserPosts(postsWithUserInfo);
    } catch (err) {
      console.error("Failed to fetch user's posts:", err);
    }
    setLoading(false);
  }, [user, getPosts]);

  const fetchLikedPosts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let allPosts = [];
      let page = 1;
      let hasMore = true;
      const MAX_PAGES_TO_FETCH = 10;
      while (hasMore && page <= MAX_PAGES_TO_FETCH) {
          const posts = await getPosts(page);
          if (posts.length === 0) {
              hasMore = false;
          } else {
              allPosts = [...allPosts, ...posts];
              page++;
          }
      }
      const postsMap = new Map(allPosts.map(post => [post.id, post]));
      const likedData = await getPostsLikedByUser();
      const enrichedLikedPosts = likedData
        .map(like => {
            const fullPostData = postsMap.get(like.posts.id);
            return { ...like, posts: fullPostData || like.posts };
        })
        .filter(like => like.posts.users);
      setLikedPosts(enrichedLikedPosts);
    } catch (err) {
      console.error("Failed to fetch liked posts:", err);
    }
    setLoading(false);
  }, [user, getPosts, getPostsLikedByUser]);

  const fetchUserReplies = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let allPosts = [];
      let page = 1;
      let hasMore = true;
      const MAX_PAGES_TO_FETCH = 10;
      while (hasMore && page <= MAX_PAGES_TO_FETCH) {
          const posts = await getPosts(page);
          if (posts.length === 0) {
              hasMore = false;
          } else {
              allPosts = [...allPosts, ...posts];
              page++;
          }
      }
      const postsMap = new Map(allPosts.map(post => [post.id, post]));

      const repliesData = await getUserReplies();

      const enrichedReplies = repliesData
        .map(reply => {
          const fullPostData = postsMap.get(reply.posts.id);
          return { ...reply, posts: fullPostData || reply.posts };
        })
        .filter(reply => reply.posts.users); // Ensure we only show replies to posts we could find

      setUserReplies(enrichedReplies);
    } catch (err) {
      console.error("Failed to fetch user replies:", err);
    }
    setLoading(false);
  }, [user, getPosts, getUserReplies]);

  useEffect(() => {
    if (activeTab === 'threads') {
      fetchUserPosts();
    } else if (activeTab === 'likes') {
      fetchLikedPosts();
    } else if (activeTab === 'replies') {
      fetchUserReplies();
    }
  }, [activeTab, fetchUserPosts, fetchLikedPosts, fetchUserReplies]);

  if (!user) {
    return (
      <div className="profile-page-wrapper">
        <div className="spinner-container">
          <BounceLoader color="#008ed8" />
        </div>
      </div>
    );
  }
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="spinner-container">
          <BounceLoader color="#008ed8" />
        </div>
      );
    }

    switch (activeTab) {
      case 'threads':
        return userPosts.length > 0 ? (
          userPosts.map(post => <Post key={post.id} post={post} />)
        ) : (
          <div className="empty-tab-message">You haven't posted anything yet.</div>
        );
      case 'likes':
        return likedPosts.length > 0 ? (
          likedPosts.map(like => <Post key={`like-${like.posts.id}`} post={like.posts} />)
        ) : (
          <div className="empty-tab-message">You haven't liked any posts yet.</div>
        );
      case 'replies':
         return userReplies.length > 0 ? (
          userReplies.map(reply => (
            <div key={`reply-${reply.id}`} className="reply-in-profile">
              <p className="reply-context-text">You replied to this post:</p>
              <Post post={reply.posts} />
              <div className="reply-content-bubble">
                <p><strong>Your reply:</strong> {reply.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-tab-message">You haven't replied to any posts yet.</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        <div className="profile-details">
          <div className="profile-header">
            <h1 className="profile-name">{user.fName} {user.lName}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-bio">Bio (Future Feature)</p>
          </div>
          <div className="profile-actions">
            <button className="edit-profile-btn" onClick={() => setIsEditModalOpen(true)}>
              Edit profile
            </button>
          </div>
        </div>
        <img
          src={user.profile_picture || 'https://www.placeholderimage.online/images/generic/user-photo.jpg'}
          alt="Profile"
          className="profile-picture"
        />
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'threads' ? 'active' : ''}`}
          onClick={() => setActiveTab('threads')}
        >
          Posts
        </button>
        <button
          className={`profile-tab ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => setActiveTab('likes')}
        >
          Likes
        </button>
        <button
          className={`profile-tab ${activeTab === 'replies' ? 'active' : ''}`}
          onClick={() => setActiveTab('replies')}
        >
          Replies
        </button>
      </div>
      <div className="profile-content">
        {renderContent()}
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}