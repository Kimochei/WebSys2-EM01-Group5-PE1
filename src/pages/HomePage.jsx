import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Post } from '../components/Post';
import { BounceLoader } from 'react-spinners';
import './HomePage.css';

export function HomePage() {
  const { user, signOut, getPosts, uploadPost } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [postsLoaded, setPostsLoaded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.title = 'Home';
  }, []);

  useEffect(() => {
    // Only load posts once on initial mount
    const initialLoad = async () => {
      setPostsLoaded(false);
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
      setPostsLoaded(true);
    };
    initialLoad();
  }, [getPosts]);

  const loadPosts = async () => {
    setPostsLoaded(false);
    const fetchedPosts = await getPosts();
    setPosts(fetchedPosts);
    setPostsLoaded(true);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/signin');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    await uploadPost(newContent);
    setNewContent('');
    loadPosts();
  };

  return (<>
    <div className="sidebar">
      <div className="user-info">
        <h2>Group 5's Practical</h2>
        <div className="user-actions">
          <button onClick={() => navigate('/profile')} className="nav-button profpic">
            {user.profile_picture && (
              <img src={user.profile_picture} alt="Profile" />
            )} {user.fName}'s Profile
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

    <div className="home-page">
      <div className="main-content">
        <div className="post-form-container">
          <form onSubmit={handleUpload} className="post-form">
            <textarea
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="What's on your mind?"
              className="post-input"
              rows="3"
            />
            <button type="submit" className="post-button">
              Post
            </button>
          </form>
        </div>

        <div className="posts-container">
          {!postsLoaded ?
            (
              <div>
                <BounceLoader
                  size="150px"
                  color="#008ed8"
                  loading="true"
                  cssOverride={{
                    display: "block",
                    marginLeft: "15.5rem"
                  }} />

                <p>Loading posts...</p>
              </div>
            )
            :
            posts.map(post => (
              <Post className={"post"} key={post.id} post={post} onUpdate={loadPosts} />
            ))
          }
        </div>
      </div>
    </div>
  </>
  );
}